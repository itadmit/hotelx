import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { initializeHotelDefaults } from '../src/lib/initializeHotelDefaults';

const prisma = new PrismaClient();

async function main() {
  // יצירת מלון הילטון
  const hotel = await prisma.hotel.upsert({
    where: { slug: 'hilton' },
    update: {},
    create: {
      name: 'Hilton',
      slug: 'hilton',
      primaryColor: '#0057A0',
      wifiName: 'Hilton_Guest',
    },
  });

  console.log('✅ Hotel created:', hotel.name);

  // ניקוי נתונים קודמים
  console.log('🧹 Cleaning up old data...');
  await prisma.request.deleteMany({ where: { hotelId: hotel.id } });
  await prisma.service.deleteMany({ where: { hotelId: hotel.id } });
  await prisma.category.deleteMany({ where: { hotelId: hotel.id } });
  await prisma.room.deleteMany({ where: { hotelId: hotel.id } });

  // יצירת משתמש מנהלת - Sara
  const hashedPassword = await bcrypt.hash('115599', 10);
  
  const manager = await prisma.user.upsert({
    where: { email: 'itadmit@gmail.com' },
    update: {
      // עדכון hotelId גם אם המשתמש כבר קיים
      hotelId: hotel.id,
      role: 'MANAGER',
    },
    create: {
      name: 'Sara Cohen',
      email: 'itadmit@gmail.com',
      password: hashedPassword,
      role: 'MANAGER',
      hotelId: hotel.id,
    },
  });

  console.log('✅ Manager created:', manager.name, '(' + manager.email + ')');

  // יצירת קטגוריות ושירותים ברירת מחדל למלון Hilton
  await initializeHotelDefaults(prisma, hotel.id);
  
  // יצירת חדרים
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        number: '101',
        code: 'HIL101',
        type: 'Standard',
        hotelId: hotel.id,
      },
    }),
    prisma.room.create({
      data: {
        number: '102',
        code: 'HIL102',
        type: 'Standard',
        hotelId: hotel.id,
      },
    }),
    prisma.room.create({
      data: {
        number: '201',
        code: 'HIL201',
        type: 'Deluxe',
        hotelId: hotel.id,
      },
    }),
    prisma.room.create({
      data: {
        number: '202',
        code: 'HIL202',
        type: 'Deluxe',
        hotelId: hotel.id,
      },
    }),
    prisma.room.create({
      data: {
        number: '301',
        code: 'HIL301',
        type: 'Suite',
        hotelId: hotel.id,
      },
    }),
  ]);

  console.log('✅ Created', rooms.length, 'rooms for Hilton');

  // יצירת מלון דמו
  const demoHotel = await prisma.hotel.upsert({
    where: { slug: 'demo-hotel' },
    update: {},
    create: {
      name: 'Demo Hotel',
      slug: 'demo-hotel',
      primaryColor: '#4f39f6',
      wifiName: 'Demo_Guest_WiFi',
    },
  });

  console.log('✅ Demo Hotel created:', demoHotel.name);

  // ניקוי נתונים קודמים של Demo Hotel
  console.log('🧹 Cleaning up old Demo Hotel data...');
  await prisma.request.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.service.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.translation.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.category.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.room.deleteMany({ where: { hotelId: demoHotel.id } });

  // יצירת משתמש דמו
  const demoPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@hotelx.app' },
    update: {
      hotelId: demoHotel.id,
      role: 'MANAGER',
      password: demoPassword,
    },
    create: {
      name: 'Demo User',
      email: 'demo@hotelx.app',
      password: demoPassword,
      role: 'MANAGER',
      hotelId: demoHotel.id,
    },
  });

  console.log('✅ Demo user created:', demoUser.name, '(' + demoUser.email + ')');

  // יצירת קטגוריות ושירותים ברירת מחדל למלון דמו
  await initializeHotelDefaults(prisma, demoHotel.id);

  // יצירת חדרים למלון דמו
  const demoRooms = await Promise.all([
    prisma.room.create({
      data: {
        number: '201',
        code: 'DEMO201',
        type: 'Standard',
        hotelId: demoHotel.id,
      },
    }),
    prisma.room.create({
      data: {
        number: '202',
        code: 'DEMO202',
        type: 'Deluxe',
        hotelId: demoHotel.id,
      },
    }),
    prisma.room.create({
      data: {
        number: '301',
        code: 'DEMO301',
        type: 'Suite',
        hotelId: demoHotel.id,
      },
    }),
  ]);

  console.log('✅ Created', demoRooms.length, 'rooms for Demo Hotel');

  console.log('\n🎉 Comprehensive seed completed!');
  console.log('\n📊 Summary:');
  console.log('  🏨 Hilton Hotel:');
  console.log('    - Rooms:', rooms.length);
  console.log('  🏨 Demo Hotel:');
  console.log('    - Rooms:', demoRooms.length);
  console.log('\n🔐 Main Login credentials:');
  console.log('  📧 Email: itadmit@gmail.com');
  console.log('  🔑 Password: 115599');
  console.log('  🌐 Guest App: http://localhost:3001/g/hilton/HIL101');
  console.log('\n🎮 Demo credentials:');
  console.log('  📧 Email: demo@hotelx.app');
  console.log('  🔑 Password: demo123');
  console.log('  🌐 Guest App: http://localhost:3001/g/demo-hotel/DEMO201');
  console.log('\n📌 Dashboard: http://localhost:3001/login');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
