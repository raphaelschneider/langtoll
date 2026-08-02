# LangToll infra — single droplet (mirrors relift/infra iteration 1)

One Ubuntu 24.04 droplet (default `s-2vcpu-4gb`, `fra1`) running:
- **MySQL 8** (localhost-only; `langtoll` user with a Terraform-generated password). No SQL
  load step: langtoll-web **self-heals its schema** on first DB use (`src/lib/schema.ts`) —
  cloud-init only creates the database + user.
- **langtoll-web** (Next.js: App Attest auth, AI topic proxy, landing/legal pages) as a
  systemd unit on `:3000` (`langtoll-web.service`)
- **Caddy** serving HTTPS on the API + landing hosts (automatic Let's Encrypt), reverse-proxy
  to `:3000` with `flush_interval -1` for streaming
- 2G swap, ufw

## Required inputs

The LangToll domain doesn't exist yet, so `dns_zone` has **no default** — buy the domain,
put the zone on Cloudflare, then pass (e.g. via `infra/dev.auto.tfvars`, gitignore any
secrets):

| Variable | What |
|----------|------|
| `dns_zone` | the apex domain, e.g. `langtoll.app` |
| `langtoll_cloudflare_zone_id` | dashboard → zone → Overview → API → Zone ID (export as `TF_VAR_langtoll_cloudflare_zone_id`) |
| `langtoll_cloudflare_api_token` | token scoped to Zone → DNS → Edit on that zone |

Prod DNS records are **proxied** (orange cloud) by default — see the Cloudflare
proxy section at the bottom for the fresh-droplet ordering, since Caddy's ACME
challenge needs one unproxied apply first.

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

The DigitalOcean firewall restricts **22 (SSH)** to **your current public IP**
(auto-detected via `api.ipify.org` at apply time). **80/443** depend on whether the
records are proxied: proxied → **Cloudflare's ranges only** (the origin cannot be
reached directly); unproxied → the world in prod, your IP in dev.

Implications:
- Your phone reaches the API only when it shares that IP (i.e. on the same network as the
  Mac). On cellular, or for external TestFlight testers, pass extra IPs via
  `-var 'extra_allowed_cidrs=["x.x.x.x/32"]'` or open 443 to the world
  (`-var allowed_cidr=0.0.0.0/0`).
- Your home IP changes — re-run `terraform apply` to refresh the allowed IP. The detected
  value is shown as the `allowed_ip` output.

## Deploy

Credentials are **project-prefixed on purpose**: the sibling relift infra declares
a `cloudflare_api_token` variable too, so an unprefixed `TF_VAR_cloudflare_api_token`
in a shared shell would hand one project's token to the other's zone. With these
names both projects can be exported at the same time.

```bash
export TF_VAR_langtoll_cloudflare_api_token=...   # Zone -> DNS -> Edit on langtoll.app
export TF_VAR_langtoll_do_token=dop_v1_...        # or fall back to DIGITALOCEAN_TOKEN

cd infra
terraform init
terraform plan                                 # dev: api-dev.<zone> + dev.<zone> records
terraform apply                                # ~2 min; cloud-init runs another ~2-3 min
cd ..
./deploy.sh                                    # rsync → npm ci → next build → restart
./restore-db.sh                                # content DB from backups/*.sql.gz
```

After a rebuild following a compromise, also force new generated secrets — they
live in terraform state and are otherwise reused verbatim:

```bash
terraform apply -var environment=prod \
  -replace=random_password.db -replace=random_password.attest_hmac
```

`deploy.sh` is also the update path — run it again after any langtoll-web change. It reads
the hostnames from the terraform outputs, so it writes the right Caddy vhosts for dev vs
prod, and installs `OPENAI_API_KEY` (from `langtoll-web/.env.local`'s `OPENAI_API_KEY_DEV`,
falling back to the shell) and `REVENUECAT_SECRET_KEY` into `/etc/langtoll/env`.

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

Then: set `ADMIN_USER`/`ADMIN_PASSWORD` in `/etc/langtoll/env` on the box, build the app with
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
- The admin dashboard lives at `/langtoll-adm` and is HTTP Basic-auth gated, fail-closed
  when `ADMIN_USER`/`ADMIN_PASSWORD` are unset — set them in `/etc/langtoll/env` (ssh in,
  then `systemctl restart langtoll-web`) before using it.
- `ATTEST_ENFORCE=0` until the native client ships App Attest; then flip to 1 (and
  `ATTEST_ALLOW_DEV=0` for prod).
- Destroy everything with `terraform -chdir=infra destroy`.

## Cloudflare proxy (orange cloud)

Prod records are **proxied by default** (`var.cloudflare_proxied`), and the droplet
firewall then accepts 80/443 **only from Cloudflare's ranges**. This hides the
origin IP and puts the WAF in front — the previous droplet was found by scanners
and compromised 24 minutes after first boot because its IP was in public DNS with
80/443 open to the world.

Order on a **fresh** droplet (Caddy needs a direct :80 for the ACME HTTP-01 challenge):

```bash
terraform apply -var environment=prod -var cloudflare_proxied=false   # 1. cert issues
# check https://api.<zone>/api/health serves a valid certificate, then:
terraform apply -var environment=prod                                  # 2. cloud on, firewall closes
```

Before flipping, set the zone's **SSL/TLS mode to Full (Strict)** in the Cloudflare
dashboard — Flexible causes redirect loops, and anything below Strict leaves the
Cloudflare→origin hop unverified.

Also add a cache rule bypassing `/api/*` so API responses are never edge-cached.
Rate limiting already reads `cf-connecting-ip`, so per-user limits stay correct
behind the proxy. SSH is unaffected: deploy.sh and restore-db.sh connect by
droplet IP from terraform outputs, never by hostname.
