#!/bin/bash

set -e

# Check for sudo
if [[ $EUID -ne 0 ]]; then
  echo "Some steps require root privileges. You may be prompted for your password."
  exec sudo "$0" "$@"
fi

# ---- Config
REPO_URL="https://github.com/Rachit333/koala-cli.git"
INSTALL_DIR="/opt/koala-cli"
DEPLOY_DIR="/opt/koala-apps"
BIN_PATH="$INSTALL_DIR/bin/koala.js"
LINK_PATH="/usr/local/bin/koala"
SERVICE_NAME="koala-server"
NODE_PATH=$(which node)
USER_NAME=${SUDO_USER:-$(whoami)}

echo "[+] Installing Koala CLI globally..."

# Ensure CLI directory exists and is owned
mkdir -p "$INSTALL_DIR"
chown -R "$USER_NAME":"$USER_NAME" "$INSTALL_DIR"

# Clone or update repo
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "[+] Updating existing Koala CLI..."
  cd "$INSTALL_DIR"
  sudo -u "$USER_NAME" git pull
else
  echo "[+] Cloning Koala CLI..."
  sudo -u "$USER_NAME" git clone "$REPO_URL" "$INSTALL_DIR"
fi

# Install dependencies
echo "[+] Installing dependencies..."
cd "$INSTALL_DIR"
sudo -u "$USER_NAME" npm install

# Make CLI executable
chmod +x "$BIN_PATH"

# Symlink to /usr/local/bin
echo "[+] Linking koala -> $LINK_PATH"
ln -sf "$BIN_PATH" "$LINK_PATH"

# Create and chown deploy directory
echo "[+] Creating deploy directory at: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
chown -R "$USER_NAME":"$USER_NAME" "$DEPLOY_DIR"

# Create systemd service for Koala server
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
echo "[+] Setting up Koala server systemd service..."

tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Koala Proxy Server
After=network.target

[Service]
ExecStart=$NODE_PATH $INSTALL_DIR/server/index.js
WorkingDirectory=$INSTALL_DIR
Restart=always
User=$USER_NAME
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal
SyslogIdentifier=koala

[Install]
WantedBy=multi-user.target
EOF

# Set permissions for the service file
chmod 644 "$SERVICE_FILE"
systemctl daemon-reexec
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

echo ""
echo "[✓] Koala CLI installed globally at: $INSTALL_DIR"
echo "[✓] Executable linked as: koala"
echo "[✓] Proxy server is running and will start on boot."
echo "[✓] Deployed apps will live in: $DEPLOY_DIR"
echo ""
echo "[!] Run: koala config set $DEPLOY_DIR"
echo "[!] Then: koala init" 