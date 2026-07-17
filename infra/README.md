# LangPass infra — single droplet (mirrors relift/infra iteration 1)

One Ubuntu 24.04 droplet (default `s-2vcpu-4gb`, `fra1`) running:
- **MySQL 8** (localhost-only; `langpass` user with a Terraform-generated password). No SQL
  load step: langpass-web **self-heals its schema** on first DB use (`src/lib/schema.ts`) —
  cloud-init only creates the database + user.
- **langpass-web** (Next.js: App Attest auth, AI topic proxy, landing/legal pages) as a
  systemd unit on `:3000` (`langpass-web.service`)
- **Caddy** serving HTTPS on the API + landing hosts (automatic Let's Encrypt), reverse-proxy
  to `:3000` with `flush_interval -1` for streaming
- 2G swap, ufw

## Required inputs

The LangPass domain doesn't exist yet, so `dns_zone` has **no default** — buy the domain,
put the zone on Cloudflare, then pass (e.g. via `infra/dev.auto.tfvars`, gitignore any
secrets):

| Variable | What |
|----------|------|
| `dns_zone` | the apex domain, e.g. `langpass.app` |
| `cloudflare_zone_id` | dashboard → zone → Overview → API → Zone ID |
| `cloudflare_api_token` | token scoped to Zone → DNS → Edit on that zone |

All DNS records are created DNS-only (grey cloud) so Caddy's ACME challenge isn't
intercepted by the Cloudflare proxy.

## Environments (`var.environment`, default `dev`)

| `environment` | API host | Landing host |
|---------------|----------|--------------|
| `dev` (default) | `api-dev.<zone>` | `dev.<zone>` |
| `prod` | `api.<zone>` | `<zone>` apex + `www` redirect |

Prod is a separate `terraform apply -var environment=prod` — run it in its **own workspace**
(`terraform workspace new prod`) so it gets its own droplet + state, once dev testing is done.

The **SSH key** (`local`) already lives in the DO account, so Terraform *reads* it (data
source) rather than creating it.

## Firewall — locked down for the test stage

The DigitalOcean firewall restricts **22 (SSH)** and **443 (HTTPS)** to **your current
public IP** (auto-detected via `api.ipify.org` at apply time). Port **80** stays open to
all so Let's Encrypt's HTTP-01 challenge and the HTTP→HTTPS redirect work.

Implications:
- Your phone reaches the API only when it shares that IP (i.e. on the same network as the
  Mac). On cellular, or for external TestFlight testers, pass extra IPs via
  `-var 'extra_allowed_cidrs=["x.x.x.x/32"]'` or open 443 to the world
  (`-var allowed_cidr=0.0.0.0/0`).
- Your home IP changes — re-run `terraform apply` to refresh the allowed IP. The detected
  value is shown as the `allowed_ip` output.

## Deploy

```bash
export DIGITALOCEAN_TOKEN=dop_v1_...          # API token with write scope

cd infra
terraform init
terraform plan                                 # dev: api-dev.<zone> + dev.<zone> records
terraform apply                                # ~2 min; cloud-init runs another ~2-3 min
cd ..
./deploy.sh                                    # rsync → npm ci → next build → restart
```

`deploy.sh` is also the update path — run it again after any langpass-web change. It reads
the hostnames from the terraform outputs, so it writes the right Caddy vhosts for dev vs
prod, and installs `OPENAI_API_KEY` (from `langpass-web/.env.local`'s `OPENAI_API_KEY_DEV`,
falling back to the shell) and `REVENUECAT_SECRET_KEY` into `/etc/langpass/env`.

Verify:
```bash
curl https://api-dev.<zone>/api/health
```

## Go live (prod runbook)

Prod runs from this same config in its **own workspace** (own droplet + state):

```bash
cd infra
terraform workspace new prod                   # once; later: terraform workspace select prod
terraform apply -var environment=prod          # api.<zone> + apex/www, 443 open to the world,
                                               # weekly droplet snapshots + nightly mysqldump
cd ..
./deploy.sh                                    # deploy.sh reads the SELECTED workspace's outputs
```

Then: set `ADMIN_USER`/`ADMIN_PASSWORD` in `/etc/langpass/env` on the box, build the app with
`EXPO_PUBLIC_API_URL=https://api.<zone>`, and submit. Switch back to dev work with
`terraform workspace select default` (deploy.sh follows the selected workspace).

Prod differences (automatic via `environment=prod`): 443 open to all (dev keeps it
IP-locked), `backups = true` (weekly DO snapshots), nightly on-box `mysqldump`
(7-day retention, `/var/backups/mysql`), `ATTEST_ALLOW_DEV=0`.

## Teardown when idle

DigitalOcean bills powered-off droplets, so:
```bash
terraform apply -var droplet_enabled=false     # destroys droplet + firewall + DNS records
terraform apply                                # brings it all back (new IP, DNS follows)
./deploy.sh
```
MySQL data is wiped on teardown — fine for dev, the app self-heals its schema. The DB
password and App Attest HMAC live in Terraform state, so they survive rebuilds.

## Notes / known trade-offs (test stage)

- The DB password appears in droplet user-data (DO metadata). Acceptable now.
- The admin dashboard lives at `/langpass-adm` and is HTTP Basic-auth gated, fail-closed
  when `ADMIN_USER`/`ADMIN_PASSWORD` are unset — set them in `/etc/langpass/env` (ssh in,
  then `systemctl restart langpass-web`) before using it.
- `ATTEST_ENFORCE=0` until the native client ships App Attest; then flip to 1 (and
  `ATTEST_ALLOW_DEV=0` for prod).
- Destroy everything with `terraform -chdir=infra destroy`.
