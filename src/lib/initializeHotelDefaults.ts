import { PrismaClient } from '@prisma/client';
import { DEFAULT_CATEGORIES } from './hotelDefaults';

/**
 * Initialize default categories and services for a new hotel
 * This function is called when a new hotel is created
 */
export async function initializeHotelDefaults(
  prisma: PrismaClient,
  hotelId: string
): Promise<void> {
  console.log(`🏨 Initializing default categories and services for hotel ${hotelId}...`);

  try {
    for (const categoryData of DEFAULT_CATEGORIES) {
      // Create category
      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          icon: categoryData.icon,
          bgImage: categoryData.bgImage,
          order: categoryData.order,
          hotelId: hotelId,
        },
      });

      console.log(`  ✅ Created category: ${categoryData.name}`);

      // Create category translations
      const categoryTranslationPromises = Object.entries(categoryData.translations).map(
        ([lang, value]) =>
          prisma.translation.create({
            data: {
              entityType: 'Category',
              entityId: category.id,
              language: lang,
              field: 'name',
              value: value,
              hotelId: hotelId,
            },
          })
      );

      await Promise.all(categoryTranslationPromises);
      console.log(`    📝 Created ${categoryTranslationPromises.length} translations`);

      // Create services for this category
      for (const serviceData of categoryData.services) {
        const service = await prisma.service.create({
          data: {
            name: serviceData.name,
            description: serviceData.description,
            price: serviceData.price,
            currency: serviceData.currency,
            estimatedTime: serviceData.estimatedTime,
            image: serviceData.image,
            isRecommended: serviceData.isRecommended,
            isVegetarian: serviceData.isVegetarian,
            isVegan: serviceData.isVegan,
            categoryId: category.id,
            hotelId: hotelId,
          },
        });

        console.log(`    ✅ Created service: ${serviceData.name}`);

        // Create service translations
        const serviceTranslationPromises = [];
        for (const [lang, values] of Object.entries(serviceData.translations)) {
          // Name translation
          serviceTranslationPromises.push(
            prisma.translation.create({
              data: {
                entityType: 'Service',
                entityId: service.id,
                language: lang,
                field: 'name',
                value: values.name,
                hotelId: hotelId,
              },
            })
          );
          // Description translation
          serviceTranslationPromises.push(
            prisma.translation.create({
              data: {
                entityType: 'Service',
                entityId: service.id,
                language: lang,
                field: 'description',
                value: values.description,
                hotelId: hotelId,
              },
            })
          );
        }

        await Promise.all(serviceTranslationPromises);
        console.log(`      📝 Created ${serviceTranslationPromises.length} translations`);
      }
    }

    console.log(`✨ Successfully initialized ${DEFAULT_CATEGORIES.length} categories with services`);
  } catch (error) {
    console.error('❌ Error initializing hotel defaults:', error);
    throw error;
  }
}

