#!/bin/bash

set -e

# ----------------------------
# CONFIG
# ----------------------------
REPO_URL="https://github.com/Rachit333/koala-cli.git"
INSTALL_DIR="/opt/koala-cli"
DEPLOY_DIR="/opt/koala-apps"
BIN_PATH="$INSTALL_DIR/bin/koala.js"
LINK_PATH="/usr/local/bin/koala"
SERVICE_NAME="koala-server"
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
NODE_PATH=$(command -v node || true)
REAL_USER=$(logname 2>/dev/null || echo "$SUDO_USER")
if [[ -z "$REAL_USER" ]]; then
  echo "[x] Could not determine real username (SUDO_USER or logname failed)"
  exit 1
fi

# ----------------------------
# PRECHECKS
# ----------------------------
if [[ $EUID -ne 0 ]]; then
  echo "[!] This script must be run as root."
  exec sudo "$0" "$@"
fi

if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
  echo "[x] Node.js and npm are required. Please install them first."
  exit 1
fi

# ----------------------------
# CLEAN REINSTALL STEPS (ALWAYS)
# ----------------------------
echo "[!] Performing clean reinstall..."
systemctl stop "$SERVICE_NAME" 2>/dev/null || true
systemctl disable "$SERVICE_NAME" 2>/dev/null || true
rm -f "$LINK_PATH"
rm -rf "$INSTALL_DIR"
rm -rf "$DEPLOY_DIR"
rm -f "$SERVICE_FILE"

# ----------------------------
# INSTALL SYSTEM USER (for daemon)
# ----------------------------
if ! id -u koala &>/dev/null; then
  echo "[+] Creating 'koala' system user..."
  useradd -r -s /usr/sbin/nologin koala
fi

# ----------------------------
# INSTALL KOALA CLI
# ----------------------------
echo "[+] Installing Koala CLI to: $INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
chown -R koala:koala "$INSTALL_DIR"

if [ -d "$INSTALL_DIR/.git" ]; then
  echo "[+] Updating existing Koala CLI..."
  sudo -u koala git -C "$INSTALL_DIR" pull
else
  echo "[+] Cloning Koala CLI..."
  sudo -u koala git clone "$REPO_URL" "$INSTALL_DIR"
fi

cd "$INSTALL_DIR"
echo "[+] Installing dependencies..."
sudo -u koala npm install

chmod +x "$BIN_PATH"
ln -sf "$BIN_PATH" "$LINK_PATH"

# ----------------------------
# CREATE DEPLOY DIRECTORY
# ----------------------------
echo "[+] Creating deploy directory: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
chown -R koala:koala "$DEPLOY_DIR"

# ----------------------------
# SET GLOBAL CONFIG FOR USER
# ----------------------------
USER_CONFIG="/home/$REAL_USER/.koala-config.json"
echo "[+] Setting deploy path for user $REAL_USER in: $USER_CONFIG"
sudo -u "$REAL_USER" tee "$USER_CONFIG" > /dev/null <<EOF
{
  "appsDir": "$DEPLOY_DIR"
}
EOF

# ----------------------------
# CREATE SYSTEMD SERVICE
# ----------------------------
echo "[+] Creating systemd service..."
tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Koala Proxy Server
After=network.target

[Service]
ExecStart=$NODE_PATH $INSTALL_DIR/server/index.js
WorkingDirectory=$INSTALL_DIR
Restart=always
User=koala
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal
SyslogIdentifier=koala
ProtectSystem=full
ProtectHome=yes
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

chmod 644 "$SERVICE_FILE"
systemctl daemon-reexec
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

# ----------------------------
# DONE
# ----------------------------
echo ""
echo -e "\033[1;32m[✓] Koala CLI installed globally!\033[0m"
echo -e "\033[1;34m[→] Deployed apps will live in:\033[0m $DEPLOY_DIR"
echo -e "\033[1;34m[→] Config saved to:\033[0m $USER_CONFIG"
echo -e "\033[1;33m[!] Try:\033[0m koala init"
echo ""
echo "(To uninstall, run: sudo bash uninstall-koala.sh)"