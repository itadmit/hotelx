import { PrismaClient } from '@prisma/client';
import { EXPANDED_DEFAULT_CATEGORIES } from './hotelDefaultsExpanded';
import { generateSlug } from './generateSlug';

/**
 * Initialize expanded default categories and services for a new hotel
 * Includes subcategories and custom fields support
 */
export async function initializeHotelDefaultsExpanded(
  prisma: PrismaClient,
  hotelId: string
): Promise<void> {
  console.log(`🏨 Initializing EXPANDED categories and services for hotel ${hotelId}...`);

  try {
    for (const categoryData of EXPANDED_DEFAULT_CATEGORIES) {
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

      // Note: Subcategories are not supported in the current schema
      // All services from subcategories will be created directly under the main category
      if (categoryData.subcategories && categoryData.subcategories.length > 0) {
        for (const subcatData of categoryData.subcategories) {
          console.log(`    📁 Processing subcategory services: ${subcatData.name}`);

          // Create services from this subcategory directly under the main category
          for (const serviceData of subcatData.services) {
            const service = await prisma.service.create({
              data: {
                name: serviceData.name,
                slug: generateSlug(serviceData.name),
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

            console.log(`      ✅ Created service: ${serviceData.name}`);

            // Create custom fields if they exist
            if (serviceData.customFields && serviceData.customFields.length > 0) {
              const customFieldPromises = serviceData.customFields.map(field =>
                prisma.serviceCustomField.create({
                  data: {
                    label: field.label,
                    fieldType: field.type,
                    isRequired: field.required,
                    options: field.options || [],
                    order: field.order,
                    serviceId: service.id,
                  },
                })
              );
              await Promise.all(customFieldPromises);
              console.log(`        🔧 Created ${serviceData.customFields.length} custom fields`);
            }

            // Create service translations
            const serviceTranslationPromises = [];
            for (const [lang, values] of Object.entries(serviceData.translations)) {
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
            console.log(`        📝 Created ${serviceTranslationPromises.length} translations`);
          }
        }
      }

      // Create services directly under category (not in subcategory)
      for (const serviceData of categoryData.services) {
        const service = await prisma.service.create({
          data: {
            name: serviceData.name,
            slug: generateSlug(serviceData.name),
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

    console.log(`✨ Successfully initialized ${EXPANDED_DEFAULT_CATEGORIES.length} categories with services and subcategories`);
  } catch (error) {
    console.error('❌ Error initializing hotel defaults:', error);
    throw error;
  }
}

