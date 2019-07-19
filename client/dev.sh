#!/bin/bash

echo "Installing node modules"
npm install

echo "Exporting stuff"
export NODE_ENV="development"
# export TG_BOT_TOKEN="799285850:AAFpoHJtR_dfMePhLydtO29Xc0CfFMisPYo"
# export TG_CHAT_NAME="vspnChatTest"
# export MEDIA_BASE_URL="http://localhost:8080/"
# export PORT=1337
# export ENVIRONMENT="development"

echo "Running watch and local media server"
npm run watch &
P1=$!
./node_modules/.bin/http-server dist -p 5000 &
P2=$!
wait $P1 $P2
