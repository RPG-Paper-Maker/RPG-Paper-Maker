#!/bin/bash

# Configuration (server address and folder: in .env, see .env.example)
source "$(dirname "$0")/../.env" || exit 1
SECONDS=0
SERVER="${DEPLOY_WEB_SERVER%$'\r'}"
BUILD_DIR=dist
REMOTE_DIR="${DEPLOY_WEB_DIR%$'\r'}"
DATE_FILE="date"

# Step 1: Upload maintenance index.html
echo "Uploading maintenance page..."
scp maintenance/index.html $SERVER:$REMOTE_DIR/index.html

ssh "$SERVER" "echo '' > '$REMOTE_DIR/$DATE_FILE'"

# Step 2: Clean remote dir (except index.html)
echo "Cleaning old files..."
ssh $SERVER "find $REMOTE_DIR -mindepth 1 ! -name 'index.html' -exec rm -rf {} +"

# Step 3: Wait
echo "Waiting 30 seconds..."
sleep 30

# Step 4: Upload everything except real index.html
echo "Uploading build (excluding index.html)..."
mv $BUILD_DIR/index.html $BUILD_DIR/index_backup.html
scp -r $BUILD_DIR/* $SERVER:$REMOTE_DIR/

# Step 5: Upload final index.html
echo "Uploading final index.html..."
mv $BUILD_DIR/index_backup.html $BUILD_DIR/index.html
scp $BUILD_DIR/index.html $SERVER:$REMOTE_DIR/index.html

duration=$SECONDS
echo ""
echo "✅ Deploy completed in $((duration / 60)) min $((duration % 60)) sec"
