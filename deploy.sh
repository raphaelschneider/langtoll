#!/usr/bin/env bash
# Ships langtoll-web to the droplet created by infra/: rsync → npm ci → next build →
# restart. Run from the repo root after `terraform apply`. Requires OPENAI_API_KEY in
# langtoll-web/.env.local (OPENAI_API_KEY_DEV=...) or the shell on the first deploy.
set -euo pipefail
cd "$(dirname "$0")"

IP=$(terraform -chdir=infra output -raw droplet_ip)
HOST="root@$IP"
ENVIRONMENT=$(terraform -chdir=infra output -raw environment)
API_HOST=$(terraform -chdir=infra output -raw api_host)
LANDING_HOST=$(terraform -chdir=infra output -raw landing_host)
IS_PROD=$(terraform -chdir=infra output -raw is_prod)
echo "→ deploying [$ENVIRONMENT] to $IP  (api: $API_HOST · landing: $LANDING_HOST)"

# 1) sync the web app (sources only; node_modules/.next built remotely)
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude media-cache --exclude .env.local \
  langtoll-web/ "$HOST:/opt/langtoll/web/"

# 2) secrets: install API keys into the droplet env (kept out of terraform/DO metadata).
#    Source of truth is langtoll-web/.env.local — the file is gitignored + rsync-excluded above,
#    so only its VALUES ship, never the file. .env.local WINS over any shell var: your
#    interactive profile's key is for local dev and must not leak to the droplet. A shell var
#    is used only when .env.local has no key (e.g. CI doing an explicit rotation).
env_local_value() { # $1 = KEY name in .env.local; empty output when absent (never fails under set -e)
  # Strip a matching pair of surrounding double OR single quotes (dotenv convention) so quoting
  # in .env.local is syntax, not part of the value — otherwise e.g. ADMIN_PASSWORD='p@ss' would
  # ship the literal quotes as part of the password and break login.
  [ -f langtoll-web/.env.local ] || return 0
  { grep -E "^$1=" langtoll-web/.env.local || true; } | head -1 | cut -d= -f2- | tr -d '\r' \
    | sed -E "s/^\"(.*)\"$/\1/; s/^'(.*)'$/\1/"
}
install_secret() { # $1 = env name on droplet, $2 = value
  # /etc/langtoll/env is parsed by systemd (EnvironmentFile), which strips backslash escapes and
  # quotes — so the line must be written systemd-QUOTED: KEY="value" with \ and " escaped. Build
  # that exact line locally, then ship it base64 so no shell layer can reinterpret the bytes.
  local esc line
  esc=${2//\\/\\\\}
  esc=${esc//\"/\\\"}
  line=$(printf '%s="%s"' "$1" "$esc" | base64 | tr -d '\n')
  ssh "$HOST" "touch /etc/langtoll/env && sed -i '/^$1=/d' /etc/langtoll/env && printf %s $line | base64 -d >> /etc/langtoll/env && echo >> /etc/langtoll/env"
}

# OpenAI key, per environment: OPENAI_API_KEY_PROD / OPENAI_API_KEY_DEV in .env.local,
# then a generic OPENAI_API_KEY there, then the shell (last resort — that's usually a
# personal/dev key, so prod should always find its own in .env.local).
DEPLOY_OPENAI_KEY="$(env_local_value "OPENAI_API_KEY_$(echo "$ENVIRONMENT" | tr '[:lower:]' '[:upper:]')")"
[ -z "$DEPLOY_OPENAI_KEY" ] && DEPLOY_OPENAI_KEY="$(env_local_value OPENAI_API_KEY)"
[ -z "$DEPLOY_OPENAI_KEY" ] && DEPLOY_OPENAI_KEY="${OPENAI_API_KEY:-}"
if [ -n "$DEPLOY_OPENAI_KEY" ]; then
  echo "→ updating OPENAI_API_KEY on droplet (…${DEPLOY_OPENAI_KEY: -6})"
  install_secret OPENAI_API_KEY "$DEPLOY_OPENAI_KEY"
else
  echo "⚠ no OPENAI_API_KEY in langtoll-web/.env.local or env — droplet key left unchanged"
fi

DEPLOY_RC_KEY="$(env_local_value REVENUECAT_SECRET_KEY)"
[ -z "$DEPLOY_RC_KEY" ] && DEPLOY_RC_KEY="${REVENUECAT_SECRET_KEY:-}"
if [ -n "$DEPLOY_RC_KEY" ]; then
  echo "→ updating REVENUECAT_SECRET_KEY on droplet (…${DEPLOY_RC_KEY: -6})"
  install_secret REVENUECAT_SECRET_KEY "$DEPLOY_RC_KEY"
fi

# Admin dashboard (/langtoll-adm) Basic-auth credentials. Fail-closed while unset, so
# shipping without them is safe — the dashboard is just unreachable until both are present.
DEPLOY_ADMIN_USER="$(env_local_value ADMIN_USER)"
DEPLOY_ADMIN_PASSWORD="$(env_local_value ADMIN_PASSWORD)"
if [ -n "$DEPLOY_ADMIN_USER" ] && [ -n "$DEPLOY_ADMIN_PASSWORD" ]; then
  echo "→ updating ADMIN_USER/ADMIN_PASSWORD on droplet (user: $DEPLOY_ADMIN_USER)"
  install_secret ADMIN_USER "$DEPLOY_ADMIN_USER"
  install_secret ADMIN_PASSWORD "$DEPLOY_ADMIN_PASSWORD"
fi

# 3) Caddy vhosts (API + landing site), built from the terraform outputs so dev and prod
#    each get the right hostnames. cloud-init writes a Caddyfile once at first boot and never
#    again, so we keep it in sync here. Graceful reload — no dropped conns. Each host's TLS
#    cert is issued via the ACME HTTP-01 challenge on :80 (open to all), so it works even
#    while :443 stays IP-locked. The www→apex redirect is prod-only (dev uses a subdomain).
{
  cat <<EOF
$API_HOST {
  reverse_proxy 127.0.0.1:3000 {
    flush_interval -1
  }
  request_body {
    max_size 10MB
  }
  log {
    output file /var/log/caddy/api-access.log {
      roll_size 50MiB
      roll_keep 10
      roll_keep_for 720h
    }
    format json
  }
}

$LANDING_HOST {
  reverse_proxy 127.0.0.1:3000 {
    flush_interval -1
  }
  log {
    output file /var/log/caddy/web-access.log {
      roll_size 50MiB
      roll_keep 10
      roll_keep_for 720h
    }
    format json
  }
}
EOF
  if [ "$IS_PROD" = "true" ]; then
    cat <<EOF

www.$LANDING_HOST {
  redir https://$LANDING_HOST{uri} permanent
}
EOF
  fi
} | ssh "$HOST" "cat > /etc/caddy/Caddyfile"
ssh "$HOST" "caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile && systemctl reload caddy"

# 4) build + restart
ssh "$HOST" bash -s <<'REMOTE'
set -euo pipefail
cd /opt/langtoll/web
# Build with the same env the service runs with (DB creds, OPENAI_API_KEY) so any
# build-time access uses the real credentials, not the local-dev defaults.
set -a; [ -f /etc/langtoll/env ] && . /etc/langtoll/env; set +a
npm ci --no-audit --no-fund
npm run build
chown -R langtoll:langtoll /opt/langtoll/web
systemctl restart langtoll-web
sleep 3
systemctl is-active langtoll-web
REMOTE

# 5) verify TLS + health over HTTPS. Caddy issues the Let's Encrypt cert proactively when it
#    loads the new vhost (HTTP-01 on :80), but on a brand-new hostname that can lag DNS
#    propagation by up to a minute — so poll. `curl` validates the cert by default, so a 200
#    here proves a publicly-trusted certificate is in place, not just that the app is up.
#    Reachable because deploy runs from the same IP the :443 firewall rule allows.
echo "→ verifying TLS + health at https://$API_HOST ..."
tls_ok=""
for _ in $(seq 1 12); do
  if curl -fsS --max-time 8 "https://$API_HOST/api/health" >/dev/null 2>&1; then tls_ok=1; break; fi
  sleep 5
done
if [ -n "$tls_ok" ]; then
  echo "✓ TLS OK — valid cert + healthy app at https://$API_HOST"
else
  echo "⚠ HTTPS not verified yet for $API_HOST. Common causes on a new hostname:"
  echo "    • DNS not propagated     → dig +short $API_HOST   (expect $IP)"
  echo "    • cert still issuing     → ssh $HOST 'journalctl -u caddy -n 50 --no-pager'"
  echo "    • :443 locked to another IP (HTTP-01 issues over :80, but you browse over :443)"
fi

echo "deployed [$ENVIRONMENT]. health: https://$API_HOST/api/health · landing: https://$LANDING_HOST"
echo "phone build against $ENVIRONMENT:  EXPO_PUBLIC_API_URL=https://$API_HOST"
