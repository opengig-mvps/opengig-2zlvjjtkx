#!/bin/bash
DOTENV_ME=$1
REPO=$(hostname)
cd "$HOME/$REPO"
git pull

# Install and authenticate with dotenv-vault
npm install -g dotenv-vault@latest
dotenv-vault login "${DOTENV_ME}"

dotenv-vault pull ci

cp .env.ci .env

# Append dynamic variables
echo "" >> .env
echo "# Dynamic Variables" >> .env
echo "DATABASE_URL=postgresql://opengig:Database2024!@opengigmvp.postgres.database.azure.com:5432/${REPO}?schema=public" >> .env
echo "POSTGRES_DB=${REPO}" >> .env
echo "NEXTAUTH_URL=https://${REPO}.opengig.work" >> .env
echo "APP_URL=https://${REPO}.opengig.work" >> .env

# Continue with regular deployment
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
