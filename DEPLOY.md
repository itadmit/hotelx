# 🚀 HotelX - Deployment Guide

## פקודה אחת לעדכון השרת

אחרי `git push` למחשב שלך, הרץ בשרת:

```bash
ssh contabo "cd /home/hotelx/app && bash deploy.sh"
```

זהו! הפקודה הזו:
- ✅ מושכת קוד חדש מ-Git
- ✅ בונה את האפליקציה
- ✅ מריצה migrations של Prisma
- ✅ מעלה את Docker containers

---

## או בקיצור (אם יש לך alias):

```bash
ssh contabo "~/hotelx/deploy.sh"
```

---

## מה קורה בפקודה?

```bash
# 1. Pull קוד חדש
git pull origin main

# 2. Build מחדש עם Docker
docker-compose down
docker-compose up -d --build

# 3. Prisma migrations + generate
docker-compose exec -T hotelx-app npx prisma migrate deploy
docker-compose exec -T hotelx-app npx prisma generate
```

---

## 📍 מיקומים חשובים

- **קוד בשרת:** `/home/hotelx/app/`
- **לוגים:** `docker-compose logs -f`
- **סטטוס:** `docker-compose ps`
- **URL:** https://hotelx.app

---

## 🔥 פקודות מהירות

```bash
# צפה בלוגים בזמן אמת
ssh contabo "cd /home/hotelx/app && docker-compose logs -f hotelx-app"

# אתחל מחדש (בלי build)
ssh contabo "cd /home/hotelx/app && docker-compose restart hotelx-app"

# סטטוס containers
ssh contabo "cd /home/hotelx/app && docker-compose ps"

# כניסה לקונטיינר
ssh contabo "cd /home/hotelx/app && docker-compose exec hotelx-app sh"
```

---

## 💾 Backup Database

```bash
ssh contabo "cd /home/hotelx/app && docker-compose exec -T hotelx-db pg_dump -U hotelx hotelx > backup-$(date +%Y%m%d).sql"
```

---

זהו! פשוט וקצר 🎯


