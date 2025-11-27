#!/bin/bash

# HotelX Deployment Script
# This script automates the deployment process to the Contabo server

set -e  # Exit on any error

echo "🚀 Starting HotelX deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
SERVER="root@84.247.143.16"
APP_DIR="/home/hotelx/app"
SSH_KEY="$HOME/.ssh/id_ed25519"

echo -e "${BLUE}📦 Step 1: Building Next.js application locally...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed! Please fix errors and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

echo -e "${BLUE}📤 Step 2: Uploading files to server...${NC}"
rsync -avz \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env.local' \
    --delete \
    -e "ssh -i $SSH_KEY" \
    . $SERVER:$APP_DIR/

echo -e "${GREEN}✅ Files uploaded!${NC}"

echo -e "${BLUE}🐳 Step 3: Rebuilding and restarting Docker containers...${NC}"
ssh -i $SSH_KEY $SERVER "cd $APP_DIR && docker-compose up -d --build hotelx-app"

echo -e "${GREEN}✅ Docker container updated and restarted!${NC}"

echo -e "${BLUE}⏳ Step 4: Waiting for application to start...${NC}"
sleep 10

echo -e "${BLUE}🔍 Step 5: Checking application status...${NC}"
ssh -i $SSH_KEY $SERVER "docker ps | grep hotelx-app"

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Useful commands:${NC}"
echo "  - Check logs:    ssh $SERVER 'cd $APP_DIR && docker-compose logs -f hotelx-app'"
echo "  - Check status:  ssh $SERVER 'docker ps | grep hotelx'"
echo "  - Restart:       ssh $SERVER 'cd $APP_DIR && docker-compose restart hotelx-app'"
echo ""
echo -e "${GREEN}✨ Your site is live at: https://hotelx.app${NC}"
