#!/bin/bash

echo "Installing node modules"
npm install
npm install pm2@latest -g

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

echo "Running server"
pm2 start ./dist/server
