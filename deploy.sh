#!/usr/bin/env bash
set -e

LOCAL_ROOT="$(cd "$(dirname "$0")" && pwd)"
REMOTE_USER="u542134834"
REMOTE_HOST="82.25.73.168"
REMOTE_PORT="65002"
REMOTE_PATH="domains/vibeget.net/public_html"

# 0) Sincronizar manual do usuário para public/
echo "Syncing manual..."
cp "${LOCAL_ROOT}/Documentos/MANUAL_DO_USUARIO.md" "${LOCAL_ROOT}/public/MANUAL_DO_USUARIO.md"

# 1) Build frontend
echo "Building frontend..."
cd "${LOCAL_ROOT}"
npm run build

# 1) build/ -> domains/vibeget.net/public_html/
if [ -d "${LOCAL_ROOT}/build" ]; then
  echo "Deploying build/ to ${REMOTE_PATH}/..."
rsync -avz \
  -e "ssh -p ${REMOTE_PORT}" \
  "${LOCAL_ROOT}/build/" \
    "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
else
  echo "Warning: 'build' directory not found. Skipping frontend deploy."
fi

# 2) api/ -> domains/vibeget.net/public_html/api/
echo "Deploying api/ to ${REMOTE_PATH}/api/..."
rsync -avz \
  --exclude 'vendor/' \
  --exclude '.composer/' \
  --exclude '.config/' \
    --exclude '.env.local' \
    --exclude '.env.production' \
    --exclude '.env.producao' \
    --exclude '.env.development' \
    --exclude '.env' \
  -e "ssh -p ${REMOTE_PORT}" \
  "${LOCAL_ROOT}/api/" \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/api/"

# 3) Migrations pendentes — roda cada uma individualmente
echo ""
echo "=== Checking pending migrations ==="
PENDING=$(ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} \
  "cd ${REMOTE_PATH}/api && php artisan migrate:status --no-ansi" \
  | grep '| No ' | awk -F'|' '{gsub(/^[ \t]+|[ \t]+$/, "", $3); print $3}')

if [ -z "$PENDING" ]; then
  echo "No pending migrations."
else
  echo "$PENDING" | while IFS= read -r MIGRATION; do
    FILE="database/migrations/${MIGRATION}.php"
    echo "  -> Running: ${MIGRATION}"
    ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} \
      "cd ${REMOTE_PATH}/api && php artisan migrate --path=${FILE} --force"
  done
  echo "Migrations done."
fi

# 4) Seeders idempotentes (updateOrCreate / updateOrInsert)
# Apenas seeders seguros para re-executar em produção
SAFE_SEEDERS="TranslationSeeder TextSettingsSeeder LevelRulesSeeder"

echo ""
echo "=== Running safe seeders ==="
for SEEDER in $SAFE_SEEDERS; do
  echo "  -> ${SEEDER}..."
  ssh -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} \
    "cd ${REMOTE_PATH}/api && php artisan db:seed --class=${SEEDER} --force"
done
echo "Seeders done."

# 5) Enviar manual atualizado (pode ser atualizado sem rebuild)
echo ""
echo "=== Syncing manual ==="
scp -P ${REMOTE_PORT} "${LOCAL_ROOT}/Documentos/MANUAL_DO_USUARIO.md" \
  "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/MANUAL_DO_USUARIO.md"
echo "Manual synced."

echo ""
echo "=== Deploy complete ==="
