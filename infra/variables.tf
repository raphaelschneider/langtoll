variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "fra1"
}

variable "droplet_size" {
  description = "Droplet size — 4GB RAM keeps `next build` comfortable next to MySQL"
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "droplet_enabled" {
  description = <<-EOT
    Whether the droplet (and the firewall + DNS records that depend on it) exist. Set to false
    to TEAR DOWN the compute when you don't need it running — DigitalOcean bills powered-off
    droplets, so destroying is the only way to stop paying. MySQL lives on the droplet, so its
    data is wiped (fine for dev — the app self-heals its schema on first DB use, and ./deploy.sh
    re-ships the code). The random DB password + attest HMAC persist in state, so they're stable
    across teardown/rebuild. Bring it back with: terraform apply -var droplet_enabled=true
    then ./deploy.sh. DNS records are recreated automatically, pointing at the new droplet IP.
  EOT
  type        = bool
  default     = true
}

variable "ssh_key_name" {
  description = "Name of the SSH key already in your DigitalOcean account (Settings → Security → SSH keys)."
  type        = string
  default     = "local"
}

variable "dns_zone" {
  # No default: the LangToll domain hasn't been picked/bought yet. Pass it once it exists,
  # e.g. -var dns_zone=langtoll.app (or set it in a *.auto.tfvars).
  description = "Apex domain serving the app infra (the zone must exist on Cloudflare)."
  type        = string
}

# NOTE ON NAMING: these carry a langtoll_ prefix on purpose. Terraform reads
# TF_VAR_<name> from the environment, and the sibling relift infra declares a
# variable called `cloudflare_api_token` too — a shared shell would silently feed
# one project's token to the other's zone. Prefixed names keep both exported at
# once, and keep the blast radius of a leaked token to a single project.
variable "langtoll_cloudflare_api_token" {
  description = "Cloudflare API token scoped to Zone -> DNS -> Edit on dns_zone. Export as TF_VAR_langtoll_cloudflare_api_token."
  type        = string
  sensitive   = true
}

variable "langtoll_do_token" {
  description = "DigitalOcean API token (TF_VAR_langtoll_do_token). Leave empty to fall back to the shared DIGITALOCEAN_TOKEN env var."
  type        = string
  sensitive   = true
  default     = ""
}

variable "langtoll_cloudflare_zone_id" {
  description = "Cloudflare Zone ID for dns_zone (dashboard → the zone → Overview → API → Zone ID)."
  type        = string
}

variable "allowed_cidr" {
  description = "CIDR allowed to reach SSH (22) + HTTPS (443). Empty = auto-detect this machine's public IP via api.ipify.org. Set e.g. \"1.2.3.4/32\" to pin it, or \"0.0.0.0/0\" to open to all (before external testers)."
  type        = string
  default     = ""
}

variable "extra_allowed_cidrs" {
  description = "Additional CIDRs allowed to reach SSH (22) + HTTPS (443), on top of allowed_cidr — e.g. a phone's IP for on-device testing against the dev API. Mobile IPs change often, so pass these per-apply rather than committing them."
  type        = list(string)
  default     = []
}

variable "environment" {
  description = "Deployment environment. dev → api-dev.<zone> + <env>.<zone> landing (this droplet). prod → api.<zone> + the <zone> apex + www redirect."
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "environment must be \"dev\" or \"prod\"."
  }
}

variable "apple_team_id" {
  description = "Apple Team ID (App Attest verification — must match langtoll-mobile's appleTeamId)"
  type        = string
  default     = "QSAPKESRUG"
}

variable "cloudflare_proxied" {
  description = "Put the DNS records behind Cloudflare's proxy (orange cloud) and restrict the droplet's 80/443 to Cloudflare's ranges. Set false for a fresh droplet until Caddy has issued its ACME certificate."
  type        = bool
  default     = true
}
