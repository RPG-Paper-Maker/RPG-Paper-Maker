#!/bin/bash

# Configuration
SECONDS=0
DATE="$1"
SERVER="$2"
REMOTE_DIR=/var/www/html/rpg-paper-maker.com/play
DATE_FILE="date"

echo "$DATE" > $SERVER:$REMOTE_DIR/$DATE_FILE