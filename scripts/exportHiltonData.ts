/**
 * Export Hilton hotel data to create new defaults
 * Run: npx tsx scripts/exportHiltonData.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Looking for Hilton hotel...');

  const hilton = await prisma.hotel.findUnique({
    where: { slug: 'hilton' },
    include: {
      categories: {
        include: {
          services: {
            include: {
              customFields: true,
            },
          },
          subCategories: {
            include: {
              services: {
                include: {
                  customFields: true,
                },
              },
            },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!hilton) {
    console.log('❌ Hilton hotel not found!');
    return;
  }

  console.log('✅ Found Hilton:', hilton.name);
  console.log('📊 Categories:', hilton.categories.length);

  // Get translations
  const translations = await prisma.translation.findMany({
    where: { hotelId: hilton.id },
  });

  console.log('📝 Translations:', translations.length);

  // Organize data
  const exportData = {
    categories: hilton.categories.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      bgImage: cat.bgImage,
      order: cat.order,
      translations: translations.filter(
        t => t.entityType === 'Category' && t.entityId === cat.id
      ),
      subcategories: cat.subCategories.map(sub => ({
        name: sub.name,
        slug: sub.slug,
        icon: sub.icon,
        order: sub.order,
        translations: translations.filter(
          t => t.entityType === 'Subcategory' && t.entityId === sub.id
        ),
        services: sub.services.map(srv => ({
          name: srv.name,
          description: srv.description,
          price: srv.price,
          currency: srv.currency,
          estimatedTime: srv.estimatedTime,
          image: srv.image,
          isRecommended: srv.isRecommended,
          isVegetarian: srv.isVegetarian,
          isVegan: srv.isVegan,
          customFields: srv.customFields,
          translations: translations.filter(
            t => t.entityType === 'Service' && t.entityId === srv.id
          ),
        })),
      })),
      services: cat.services.map(srv => ({
        name: srv.name,
        description: srv.description,
        price: srv.price,
        currency: srv.currency,
        estimatedTime: srv.estimatedTime,
        image: srv.image,
        isRecommended: srv.isRecommended,
        isVegetarian: srv.isVegetarian,
        isVegan: srv.isVegan,
        customFields: srv.customFields,
        translations: translations.filter(
          t => t.entityType === 'Service' && t.entityId === srv.id
        ),
      })),
    })),
  };

  // Save to file
  fs.writeFileSync(
    'scripts/hilton-export.json',
    JSON.stringify(exportData, null, 2)
  );

  console.log('\n✅ Data exported to scripts/hilton-export.json');
  console.log('\n📋 Summary:');
  
  exportData.categories.forEach(cat => {
    console.log(`\n📁 ${cat.name}`);
    console.log(`   Services: ${cat.services.length}`);
    if (cat.subcategories.length > 0) {
      console.log(`   Subcategories: ${cat.subcategories.length}`);
      cat.subcategories.forEach(sub => {
        console.log(`     - ${sub.name}: ${sub.services.length} services`);
      });
    }
  });
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

