#!/bin/bash

# View live logs from the server

ssh -i ~/.ssh/id_ed25519 root@84.247.143.16 "cd /home/hotelx/app && docker-compose logs -f hotelx-app"


