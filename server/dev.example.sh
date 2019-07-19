#!/bin/bash

echo "Installing node modules"
npm install

echo "Exporting stuff"
export TG_BOT_TOKEN="<YOUR_TOKEN>"
export TG_CHAT_NAME="<YOUR_CHAT_NAME_WITHOUT_@>"
export MEDIA_BASE_URL="http://localhost:8080/"
export PORT=1337
export ENVIRONMENT="development"

echo "Creating media folders"
mkdir media
mkdir .tmp
mkdir media/animations
mkdir .tmp/animations
mkdir media/avatars
mkdir .tmp/avatars
mkdir media/photos
mkdir .tmp/photos
mkdir media/stickers
mkdir .tmp/stickers

echo "Running watch and local media server"
npm run watch &
P1=$!
./node_modules/.bin/http-server media &
P2=$!
wait $P1 $P2
