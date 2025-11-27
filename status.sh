#!/bin/bash

# Check server status

echo "🔍 Checking HotelX status..."
echo ""

echo "📊 Docker Containers:"
ssh -i ~/.ssh/id_ed25519 root@84.247.143.16 "docker ps | grep -E 'CONTAINER|hotelx'"

echo ""
echo "🌐 Website Status:"
curl -I https://hotelx.app 2>&1 | grep "HTTP\|server"

echo ""
echo "💾 Database:"
ssh -i ~/.ssh/id_ed25519 root@84.247.143.16 "cd /home/hotelx/app && docker-compose exec -T hotelx-db psql -U hotelx -d hotelx -c 'SELECT COUNT(*) as hotels FROM \"Hotel\"; SELECT COUNT(*) as rooms FROM \"Room\";'"


