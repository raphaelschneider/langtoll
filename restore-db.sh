#!/usr/bin/env bash
# Restore the content database onto a freshly provisioned droplet.
#
# Run AFTER `terraform apply` and `./deploy.sh` have brought the box up: cloud-init
# creates an empty `langtoll` database, deploy.sh ships the code, this puts the
# 3,839 generated topic packs back.
#
# The dump is DATA ONLY (mysqldump of a single database contains no CREATE
# DATABASE / USE), so it restores into `langtoll` even though it was taken from a
# database called `langpass`. Nothing from the compromised host's SYSTEM state is
# reintroduced — this is app tables, not machine state, which is exactly why we
# rebuild the host and restore only this.
#
#   ./restore-db.sh                                  # newest dump in backups/
#   ./restore-db.sh backups/langpass-full-2026...gz  # a specific one
set -euo pipefail

ENVIRONMENT="${ENVIRONMENT:-prod}"
DUMP="${1:-$(ls -t backups/*.sql.gz 2>/dev/null | head -1)}"
DB="${DB_NAME:-langtoll}"

[ -n "$DUMP" ] && [ -f "$DUMP" ] || { echo "no dump found (backups/*.sql.gz)" >&2; exit 1; }

IP=$(terraform -chdir=infra output -raw droplet_ip)
HOST="root@$IP"
echo "→ restoring $(basename "$DUMP") into $DB on $IP"

# Refuse to overwrite a database that already holds content — a second run after
# real users exist would silently roll them back.
EXISTING=$(ssh "$HOST" "mysql -N -B -e \"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='$DB'\"" 2>/dev/null || echo 0)
if [ "${EXISTING:-0}" -gt 0 ] && [ "${FORCE:-0}" != "1" ]; then
  echo "  $DB already has $EXISTING tables — refusing. Re-run with FORCE=1 to overwrite." >&2
  exit 1
fi

gunzip -c "$DUMP" | ssh "$HOST" "mysql $DB"

echo "→ verifying"
ssh "$HOST" "mysql -N -B $DB -e '
  SELECT CONCAT(\"topic_packs: \", COUNT(*)) FROM topic_packs;
  SELECT CONCAT(\"app_settings: \", COUNT(*)) FROM app_settings;'"

echo "✓ restored. Sanity-check the API next:  curl -s https://$(terraform -chdir=infra output -raw api_host)/api/health"
