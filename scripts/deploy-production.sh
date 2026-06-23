#!/usr/bin/env bash

set -Eeuo pipefail

readonly APP_DIR="/var/www/adamant-site/adamant-next"
readonly BACKUP_DIR="/var/backups/adamant-site"
readonly NODE_BIN="/root/.nvm/versions/node/v24.15.0/bin"

export PATH="$NODE_BIN:$PATH"

exec 9>"/var/lock/adamant-site-deploy.lock"
flock -n 9 || {
  echo "Another production deployment is already running."
  exit 1
}

cd "$APP_DIR"

install -d -m 700 "$BACKUP_DIR"
if [[ -f adamant.db ]]; then
  cp --preserve=mode,timestamps adamant.db \
    "$BACKUP_DIR/adamant-$(date -u +%Y%m%d-%H%M%S).db"
fi

npm ci --no-audit --no-fund
printf 'y\n' | NODE_ENV=production npx payload migrate
npm run build

pm2 restart adamant-site --update-env
pm2 save

for _ in {1..30}; do
  if curl --fail --silent --show-error http://127.0.0.1:3000/ >/dev/null; then
    echo "Production deployment completed successfully."
    exit 0
  fi

  sleep 2
done

echo "Health check failed after deployment." >&2
pm2 logs adamant-site --lines 80 --nostream >&2
exit 1
