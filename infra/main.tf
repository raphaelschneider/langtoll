# LangPass — single-droplet test deployment (mirrors relift/infra iteration 1).
#
# What this stands up:
#   one Ubuntu droplet running MySQL 8 (localhost-only), the Next.js service (langpass-web:
#   App Attest auth + AI topic proxy + landing/legal pages) as a systemd unit on :3000,
#   Caddy serving HTTPS (auto Let's Encrypt) on the API + landing hosts, ufw, 2G swap, and
#   Cloudflare DNS records for both hostnames. Unlike relift there is no inline schema.sql:
#   langpass-web self-heals its schema on first DB use (src/lib/schema.ts), so cloud-init
#   only creates the database + MySQL user. The SSH key already exists on the DO account,
#   so it's read (data source), not created. Code ships via ../deploy.sh (rsync).
#
# Usage:
#   export DIGITALOCEAN_TOKEN=dop_v1_...
#   terraform init && terraform apply    # needs dns_zone + cloudflare vars, see variables.tf
#   ../deploy.sh

terraform {
  required_version = ">= 1.5"
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.40"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    http = {
      source  = "hashicorp/http"
      version = "~> 3.4"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

provider "digitalocean" {} # token via DIGITALOCEAN_TOKEN env var

# DNS on Cloudflare. Records stay DNS-only (grey cloud) so Caddy's auto Let's Encrypt on the
# droplet keeps working — a CF proxy would intercept the ACME challenge. Dev doesn't need
# DDoS/CDN anyway.
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Your current public IP — SSH and the HTTPS port are locked to it (test stage).
data "http" "myip" {
  url = "https://api.ipify.org" # IPv4, plain text
}

locals {
  is_prod = var.environment == "prod"

  # Compute on/off. 1 = the droplet (and the firewall + DNS that depend on it) exist; 0 = torn
  # down to stop billing. See var.droplet_enabled. Every droplet-dependent resource counts off
  # this so a single flag destroys/recreates the whole compute footprint atomically.
  droplet_count = var.droplet_enabled ? 1 : 0

  # API host. dev → api-dev.<zone> ; prod → api.<zone>.
  api_subdomain = local.is_prod ? "api" : "api-${var.environment}"
  api_domain    = "${local.api_subdomain}.${var.dns_zone}"

  # Landing host. dev → dev.<zone> ; prod → the apex (with a www→apex redirect in Caddy).
  landing_domain = local.is_prod ? var.dns_zone : "${var.environment}.${var.dns_zone}"

  # SSH/HTTPS allow-list. Pin it with -var allowed_cidr=... (reliable), else auto-detect this
  # machine's public IP. Auto-detect is only as good as what api.ipify.org reports for you —
  # if you're behind a VPN/CGNAT or your IP just changed, pin it explicitly.
  my_cidr = var.allowed_cidr != "" ? var.allowed_cidr : "${chomp(data.http.myip.response_body)}/32"

  # Full SSH/HTTPS allow-list: this machine plus any extra IPs (e.g. a phone for on-device tests).
  allow_cidrs = concat([local.my_cidr], var.extra_allowed_cidrs)
}

resource "random_password" "db" {
  length  = 24
  special = false
}

# App Attest HMAC (challenge signing). Generated once and kept in state so attestations
# survive droplet teardown/rebuild.
resource "random_password" "attest_hmac" {
  length  = 32
  special = false
}

# Already present on the account — read, don't recreate.
data "digitalocean_ssh_key" "langpass" {
  name = var.ssh_key_name
}

resource "digitalocean_droplet" "langpass" {
  count    = local.droplet_count
  name     = "langpass-web"
  region   = var.region
  size     = var.droplet_size
  image    = "ubuntu-24-04-x64"
  ssh_keys = [data.digitalocean_ssh_key.langpass.fingerprint]

  # Prod: weekly DO droplet snapshots (~20% of droplet cost). The nightly on-box mysqldump
  # (cloud-init) covers the gap between snapshots; dev data is disposable, so dev skips both.
  backups = local.is_prod

  user_data = templatefile("${path.module}/cloud-init.yaml.tftpl", {
    db_password        = random_password.db.result
    api_domain         = local.api_domain
    web_domain         = local.landing_domain
    is_prod            = local.is_prod
    apple_team_id      = var.apple_team_id
    attest_hmac_secret = random_password.attest_hmac.result
  })

  # cloud-init runs once at first boot, so editing the template should never recreate a
  # live droplet (that would wipe MySQL + change the IP). Template/config changes are
  # rolled out by deploy.sh / a direct edit on the box, not by re-imaging.
  lifecycle {
    ignore_changes = [user_data]
  }
}

# DNS records — all DNS-only (proxied=false) so Caddy's ACME on the droplet works.
# count-gated to the droplet, so a teardown (droplet_enabled=false) removes the records too.

# api[-env].<zone> → droplet IP (tracks the droplet automatically; gone when torn down).
resource "cloudflare_dns_record" "api" {
  count   = local.droplet_count
  zone_id = var.cloudflare_zone_id
  type    = "A"
  name    = local.api_domain
  content = digitalocean_droplet.langpass[0].ipv4_address
  ttl     = 60
  proxied = false
}

# DEV landing: <env>.<zone> → droplet IP.
resource "cloudflare_dns_record" "landing_dev" {
  count   = local.is_prod ? 0 : local.droplet_count
  zone_id = var.cloudflare_zone_id
  type    = "A"
  name    = local.landing_domain
  content = digitalocean_droplet.langpass[0].ipv4_address
  ttl     = 60
  proxied = false
}

# PROD landing: apex → droplet IP.
resource "cloudflare_dns_record" "web" {
  count   = local.is_prod ? local.droplet_count : 0
  zone_id = var.cloudflare_zone_id
  type    = "A"
  name    = var.dns_zone
  content = digitalocean_droplet.langpass[0].ipv4_address
  ttl     = 60
  proxied = false
}

# PROD landing: www → apex (Caddy 301-redirects it to the canonical host).
resource "cloudflare_dns_record" "web_www" {
  count   = local.is_prod ? local.droplet_count : 0
  zone_id = var.cloudflare_zone_id
  type    = "CNAME"
  name    = "www.${var.dns_zone}"
  content = var.dns_zone
  ttl     = 60
  proxied = false
}

resource "digitalocean_firewall" "langpass" {
  count       = local.droplet_count
  name        = "langpass-web"
  droplet_ids = [digitalocean_droplet.langpass[0].id]

  # SSH — only from your current IP.
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = local.allow_cidrs
  }
  # HTTP — open to all: Let's Encrypt's HTTP-01 challenge + HTTP→HTTPS redirect.
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  # HTTPS — dev: only from your current IP (pass extra_allowed_cidrs for a phone).
  # Prod is PUBLIC by definition — App Review and real users must reach it.
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = local.is_prod ? ["0.0.0.0/0", "::/0"] : local.allow_cidrs
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
