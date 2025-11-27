/**
 * Script to initialize Demo Hotel with EXPANDED default categories and services
 * Includes subcategories, custom fields, and Entertainment category
 * Run: npx tsx scripts/initDemoHotelExpanded.ts
 */

import { PrismaClient } from '@prisma/client';
import { initializeHotelDefaultsExpanded } from '../src/lib/initializeHotelDefaultsExpanded';

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
  const services = await prisma.service.findMany({ 
    where: { hotelId: demoHotel.id },
    select: { id: true }
  });
  
  const serviceIds = services.map(s => s.id);
  
  if (serviceIds.length > 0) {
    await prisma.serviceCustomField.deleteMany({ 
      where: { 
        serviceId: { in: serviceIds }
      } 
    });
  }
  
  await prisma.request.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.service.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.translation.deleteMany({ where: { hotelId: demoHotel.id } });
  await prisma.category.deleteMany({ where: { hotelId: demoHotel.id } });

  console.log('✨ Initializing EXPANDED default categories and services...');

  // Initialize expanded defaults
  await initializeHotelDefaultsExpanded(prisma, demoHotel.id);

  console.log('\n🎉 Demo Hotel initialized successfully with EXPANDED content!');
  console.log('📊 Summary:');
  console.log('  - 6 Categories (Food & Drinks, Room Service, Spa & Wellness, Concierge, Maintenance, Entertainment)');
  console.log('  - 4 Subcategories under Food & Drinks (Breakfast, Main Dishes, Beverages, Desserts)');
  console.log('  - 20+ Services with professional images');
  console.log('  - Custom Fields for food ordering');
  console.log('  - 15 Languages supported');
  console.log('\n🌐 Test it at: http://localhost:3001/dashboard');
  console.log('   Email: demo@hotelx.app');
  console.log('   Password: demo123');
  console.log('\n🔗 Guest page: http://localhost:3001/g/demo-hotel/DEMO201');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

