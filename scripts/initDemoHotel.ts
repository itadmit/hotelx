/**
 * Script to initialize Demo Hotel with default categories and services
 * Run: npx tsx scripts/initDemoHotel.ts
 */

import { PrismaClient } from '@prisma/client';
import { initializeHotelDefaults } from '../src/lib/initializeHotelDefaults';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Looking for Demo Hotel...');

  const demoHotel = await prisma.hotel.findUnique({
    where: { slug: 'demo-hotel' },
  });

  if (!demoHotel) {
    console.log('❌ Demo Hotel not found!');
    return;
  }

  console.log('✅ Found Demo Hotel:', demoHotel.name);
  console.log('🧹 Cleaning existing data...');

  // Clean existing data
  await prisma.request.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.service.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.translation.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.category.deleteMany({ where: { hotelId: demoHotel.id } });

  console.log('✨ Initializing default categories and services...');

  // Initialize defaults
  await initializeHotelDefaults(prisma, demoHotel.id);

  console.log('\n🎉 Demo Hotel initialized successfully!');
  console.log('📊 Summary:');
  console.log('  - 5 Categories with translations');
  console.log('  - 9 Services with translations');
  console.log('  - 15 Languages supported');
  console.log('\n🌐 Test it at: http://localhost:3001/dashboard');
  console.log('   Email: demo@hotelx.app');
  console.log('   Password: demo123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

