#!/bin/bash

set -e

# Check for sudo
if [[ $EUID -ne 0 ]]; then
  echo "Some steps require root privileges. You may be prompted for your password."
  exec sudo "$0" "$@"
fi

# ---- Config
REPO_URL="https://github.com/Rachit333/koala-cli.git"
INSTALL_DIR="/home/$SUDO_USER/.koala-cli"
BIN_PATH="$INSTALL_DIR/bin/koala.js"
LINK_PATH="/usr/local/bin/koala"
SERVICE_NAME="koala-server"
NODE_PATH=$(which node)

echo "Installing Koala CLI..."

# Ensure the directory exists and has correct ownership
mkdir -p "$INSTALL_DIR"
chown -R "$SUDO_USER":"$SUDO_USER" "$INSTALL_DIR"

# Clone or update repo
if [ -d "$INSTALL_DIR/.git" ]; then
  echo "Updating existing Koala CLI..."
  cd "$INSTALL_DIR"
  sudo -u "$SUDO_USER" git pull
else
  echo "Cloning Koala CLI..."
  sudo -u "$SUDO_USER" git clone "$REPO_URL" "$INSTALL_DIR"
fi

# Install dependencies
echo "Installing dependencies..."
cd "$INSTALL_DIR"
sudo -u "$SUDO_USER" npm install

# Make CLI executable
chmod +x "$BIN_PATH"

# Symlink to /usr/local/bin
echo "Linking koala -> $LINK_PATH"
ln -sf "$BIN_PATH" "$LINK_PATH"

# Create systemd service for proxy server
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
echo "Setting up systemd service..."

sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Koala Proxy Server
After=network.target

[Service]
ExecStart=$NODE_PATH $INSTALL_DIR/server/index.js
WorkingDirectory=$INSTALL_DIR
Restart=always
User=$SUDO_USER
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal
SyslogIdentifier=koala

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
systemctl daemon-reexec
systemctl daemon-reload
systemctl enable $SERVICE_NAME
systemctl restart $SERVICE_NAME

echo "Koala CLI installed and proxy server is running on startup."
echo "Try: koala init"
