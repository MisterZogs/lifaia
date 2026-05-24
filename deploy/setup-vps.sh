#!/bin/bash
# setup-vps.sh — Configuration initiale du VPS Hetzner (Ubuntu 22/24)
# Exécuter UNE SEULE FOIS en tant que root ou avec sudo

set -e

echo "=== 1. Mise à jour système ==="
apt update && apt upgrade -y

echo "=== 2. Installation Nginx ==="
apt install -y nginx certbot python3-certbot-nginx

echo "=== 3. Nginx : copie de la config lifaia.com ==="
cp nginx/conf.d/lifaia.com.conf /etc/nginx/conf.d/lifaia.com.conf
nginx -t && systemctl reload nginx

echo "=== 4. Dossier frontend ==="
mkdir -p /var/www/lifaia
chown -R www-data:www-data /var/www/lifaia

echo "=== 5. Certificats SSL (Let's Encrypt) ==="
echo "Lance manuellement après avoir pointé les DNS vers ce serveur :"
echo "  certbot --nginx -d lifaia.com -d www.lifaia.com"
echo "  certbot --nginx -d api.lifaia.com"

echo "=== 6. Docker Compose ==="
# Docker est déjà installé — on vérifie juste la version de compose
docker compose version || (apt install -y docker-compose-plugin && docker compose version)

echo ""
echo "=== Setup terminé ==="
echo "Prochaines étapes :"
echo "  1. Pointer les DNS lifaia.com et api.lifaia.com vers $(curl -s ifconfig.me)"
echo "  2. Lancer les certbots SSL ci-dessus"
echo "  3. Copier .env.production dans ce dossier et remplir les valeurs"
echo "  4. Lancer ./deploy.sh depuis ta machine locale"
