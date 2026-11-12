#!/bin/bash

# Configuration (server address and folder: in .env, see .env.example)
source "$(dirname "$0")/../.env" || exit 1
DATE="$1"
SERVER="${DEPLOY_WEB_SERVER%$'\r'}"
REMOTE_DIR="${DEPLOY_WEB_DIR%$'\r'}"
DATE_FILE="date"

ssh "$SERVER" "echo -n '$DATE' > '$REMOTE_DIR/$DATE_FILE'"
echo "✅ Deploy countdown completed!"
