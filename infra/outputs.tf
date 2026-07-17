output "droplet_ip" {
  description = "Public IP of the droplet (null when torn down via droplet_enabled=false)"
  value       = one(digitalocean_droplet.langpass[*].ipv4_address)
}

output "db_password" {
  description = "MySQL password for the langpass user (already configured on the droplet)"
  value       = random_password.db.result
  sensitive   = true
}

output "environment" {
  description = "dev or prod"
  value       = var.environment
}

output "is_prod" {
  description = "true when this is the production environment (consumed by deploy.sh)"
  value       = local.is_prod
}

output "api_host" {
  description = "API hostname (no scheme), e.g. api-dev.<zone>"
  value       = local.api_domain
}

output "landing_host" {
  description = "Landing-page hostname (no scheme), e.g. dev.<zone>"
  value       = local.landing_domain
}

output "api_url" {
  description = "HTTPS base URL — set EXPO_PUBLIC_API_URL to this"
  value       = "https://${local.api_domain}"
}

output "landing_url" {
  description = "HTTPS landing-page URL"
  value       = "https://${local.landing_domain}"
}

output "allowed_ip" {
  description = "The IP that SSH (22) and HTTPS (443) are currently locked to"
  value       = chomp(data.http.myip.response_body)
}
