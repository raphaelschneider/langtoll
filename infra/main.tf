# LangToll — single-droplet test deployment (mirrors relift/infra iteration 1).
#
# What this stands up:
#   one Ubuntu droplet running MySQL 8 (localhost-only), the Next.js service (langtoll-web:
#   App Attest auth + AI topic proxy + landing/legal pages) as a systemd unit on :3000,
#   Caddy serving HTTPS (auto Let's Encrypt) on the API + landing hosts, ufw, 2G swap, and
#   Cloudflare DNS records for both hostnames. Unlike relift there is no inline schema.sql:
#   langtoll-web self-heals its schema on first DB use (src/lib/schema.ts), so cloud-init
#   only creates the database + MySQL user. The SSH key already exists on the DO account,
#   so it's read (data source), not created. Code ships via ../deploy.sh (rsync).
#
# Usage:
#   export TF_VAR_langtoll_do_token=dop_v1_...              # or DIGITALOCEAN_TOKEN
#   export TF_VAR_langtoll_cloudflare_api_token=...         # NOT TF_VAR_cloudflare_api_token (relift uses that)
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

provider "digitalocean" {
  # Project-scoped token when set; null falls through to the provider's own
  # DIGITALOCEAN_TOKEN lookup so an existing shared setup keeps working.
  token = var.langtoll_do_token != "" ? var.langtoll_do_token : null
}

# DNS on Cloudflare. Records stay DNS-only (grey cloud) so Caddy's auto Let's Encrypt on the
# droplet keeps working — a CF proxy would intercept the ACME challenge. Dev doesn't need
# DDoS/CDN anyway.
provider "cloudflare" {
  api_token = var.langtoll_cloudflare_api_token
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

  # Orange cloud. Prod defaults to proxied; dev stays direct so a laptop can hit
  # the box without Cloudflare in the way. Override per-apply with
  # -var cloudflare_proxied=false when a fresh droplet still needs its ACME cert.
  proxied = var.cloudflare_proxied

  # Cloudflare's published edge ranges (https://www.cloudflare.com/ips/). When the
  # records are proxied, real traffic can only arrive from these — so the origin
  # stops being reachable directly, which is the actual fix for how the previous
  # droplet was found and owned. Refresh from that URL if Cloudflare adds ranges.
  cloudflare_ipv4 = [
    "173.245.48.0/20", "103.21.244.0/22", "103.22.200.0/22", "103.31.4.0/22",
    "141.101.64.0/18", "108.162.192.0/18", "190.93.240.0/20", "188.114.96.0/20",
    "197.234.240.0/22", "198.41.128.0/17", "162.158.0.0/15", "104.16.0.0/13",
    "104.24.0.0/14", "172.64.0.0/13", "131.0.72.0/22",
  ]
  cloudflare_ipv6 = [
    "2400:cb00::/32", "2606:4700::/32", "2803:f800::/32", "2405:b500::/32",
    "2405:8100::/32", "2a06:98c0::/29", "2c0f:f248::/32",
  ]

  # Who may reach 80/443. Proxied → Cloudflare only. Direct → the world in prod
  # (App Review and real users must get in), your own IPs in dev.
  web_sources = local.proxied ? concat(local.cloudflare_ipv4, local.cloudflare_ipv6) : (
    local.is_prod ? ["0.0.0.0/0", "::/0"] : local.allow_cidrs
  )

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
data "digitalocean_ssh_key" "langtoll" {
  name = var.ssh_key_name
}

resource "digitalocean_droplet" "langtoll" {
  count    = local.droplet_count
  name     = "langtoll-web"
  region   = var.region
  size     = var.droplet_size
  image    = "ubuntu-24-04-x64"
  ssh_keys = [data.digitalocean_ssh_key.langtoll.fingerprint]

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

# DNS records. count-gated to the droplet, so a teardown (droplet_enabled=false)
# removes the records too.
#
# PROXYING (var.cloudflare_proxied, default true in prod): the orange cloud hides
# the origin IP and puts Cloudflare's WAF/DDoS in front. This is not cosmetic —
# the previous droplet was found by scanners and compromised 24 minutes after
# first boot precisely because its IP was published in DNS and 80/443 were open
# to the world. Proxied records + the Cloudflare-only firewall rules below close
# that path. The app is already written for it: lib/ratelimit reads
# cf-connecting-ip, and deploy/restore connect by droplet IP, never by hostname.
#
# ORDER MATTERS ON A FRESH BOX. Caddy gets its certificate over the ACME HTTP-01
# challenge, which needs a direct :80. So bring a NEW droplet up with
# `-var cloudflare_proxied=false`, let Caddy issue, then apply again with the
# default to flip the cloud on. Set the zone's SSL/TLS mode to Full (Strict)
# before flipping, or you get redirect loops.

# api[-env].<zone> → droplet IP (tracks the droplet automatically; gone when torn down).
resource "cloudflare_dns_record" "api" {
  count   = local.droplet_count
  zone_id = var.langtoll_cloudflare_zone_id
  type    = "A"
  name    = local.api_domain
  content = digitalocean_droplet.langtoll[0].ipv4_address
  ttl     = local.proxied ? 1 : 60 # proxied records must use TTL 1 (automatic)
  proxied = local.proxied
}

# DEV landing: <env>.<zone> → droplet IP.
resource "cloudflare_dns_record" "landing_dev" {
  count   = local.is_prod ? 0 : local.droplet_count
  zone_id = var.langtoll_cloudflare_zone_id
  type    = "A"
  name    = local.landing_domain
  content = digitalocean_droplet.langtoll[0].ipv4_address
  ttl     = local.proxied ? 1 : 60 # proxied records must use TTL 1 (automatic)
  proxied = local.proxied
}

# PROD landing: apex → droplet IP.
resource "cloudflare_dns_record" "web" {
  count   = local.is_prod ? local.droplet_count : 0
  zone_id = var.langtoll_cloudflare_zone_id
  type    = "A"
  name    = var.dns_zone
  content = digitalocean_droplet.langtoll[0].ipv4_address
  ttl     = local.proxied ? 1 : 60 # proxied records must use TTL 1 (automatic)
  proxied = local.proxied
}

# PROD landing: www → apex (Caddy 301-redirects it to the canonical host).
resource "cloudflare_dns_record" "web_www" {
  count   = local.is_prod ? local.droplet_count : 0
  zone_id = var.langtoll_cloudflare_zone_id
  type    = "CNAME"
  name    = "www.${var.dns_zone}"
  content = var.dns_zone
  ttl     = local.proxied ? 1 : 60 # proxied records must use TTL 1 (automatic)
  proxied = local.proxied
}

resource "digitalocean_firewall" "langtoll" {
  count       = local.droplet_count
  name        = "langtoll-web"
  droplet_ids = [digitalocean_droplet.langtoll[0].id]

  # SSH — only from your current IP.
  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = local.allow_cidrs
  }
  # HTTP — Let's Encrypt's HTTP-01 challenge + the HTTP->HTTPS redirect. Narrowed
  # to Cloudflare's ranges once proxied; a fresh box needs it open (see the DNS
  # comment on issuing the cert before flipping the cloud on).
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = local.web_sources
  }
  # HTTPS — proxied: Cloudflare only, so the origin cannot be hit directly even
  # if someone learns the IP. Unproxied prod is PUBLIC by definition (App Review
  # and real users); unproxied dev is your IPs only.
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = local.web_sources
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
