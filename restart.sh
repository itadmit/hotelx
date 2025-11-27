#!/bin/bash

# Quick restart of the application

echo "🔄 Restarting HotelX..."

ssh -i ~/.ssh/id_ed25519 root@84.247.143.16 "cd /home/hotelx/app && docker-compose restart hotelx-app"

echo "⏳ Waiting for restart..."
sleep 10

echo "✅ Restarted! Checking status..."
ssh -i ~/.ssh/id_ed25519 root@84.247.143.16 "docker ps | grep hotelx-app"

echo ""
echo "🌐 App is running at: https://hotelx.app"


