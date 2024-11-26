#!/bin/bash

REPO=$(hostname)
cd "$HOME/$REPO"
git pull
npm install
npm run build

pm2 describe website > /dev/null 2>&1
STATUS=$?

if [ $STATUS -eq 0 ]; then
    echo "PM2 process 'website' is running. Restarting it..."
    pm2 restart website
else
    echo "PM2 process 'website' is not running. Starting a new process..."
    pm2 start npm --name website -- start
fi

pm2 save
