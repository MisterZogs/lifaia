#!/bin/bash
# deploy.sh — Build local + déploiement sur le VPS Hetzner
# Usage : VPS_HOST=user@ip ./deploy.sh
# Exemple : VPS_HOST=root@12.34.56.78 ./deploy.sh

set -e

VPS_HOST="${VPS_HOST:?'Variable VPS_HOST non définie. Ex: VPS_HOST=root@12.34.56.78 ./deploy.sh'}"
DEPLOY_DIR="/opt/lifaia"
APP_DIR="$(dirname "$0")/../app"

echo "=== 1. Build Wasp (production) ==="
cd "$APP_DIR"
wasp build

echo "=== 2. Build frontend (fichiers statiques) ==="
REACT_APP_API_URL=https://api.lifaia.com npx vite build

echo "=== 3. Build image Docker du serveur (linux/amd64) ==="
docker buildx build --platform linux/amd64 -t mydoctoria-server:latest .wasp/out/

echo "=== 4. Export image Docker ==="
docker save mydoctoria-server:latest | gzip > /tmp/mydoctoria-server.tar.gz

echo "=== 5. Envoi sur le VPS ==="
ssh "$VPS_HOST" "mkdir -p $DEPLOY_DIR"
scp /tmp/mydoctoria-server.tar.gz "$VPS_HOST:$DEPLOY_DIR/"
scp docker-compose.yml "$VPS_HOST:$DEPLOY_DIR/"
# Envoie .env.production seulement s'il existe localement
[ -f .env.production ] && scp .env.production "$VPS_HOST:$DEPLOY_DIR/"

echo "=== 6. Déploiement des fichiers statiques ==="
rsync -avz --delete "$APP_DIR/.wasp/out/web-app/build/" "$VPS_HOST:/var/www/lifaia/"

echo "=== 7. Démarrage des containers sur le VPS ==="
ssh "$VPS_HOST" "
  cd $DEPLOY_DIR
  docker load < mydoctoria-server.tar.gz
  docker compose pull db 2>/dev/null || true
  docker compose up -d --remove-orphans
  docker compose ps
"

echo ""
echo "=== Déploiement terminé ==="
echo "  Frontend : https://lifaia.com"
echo "  API      : https://api.lifaia.com"
