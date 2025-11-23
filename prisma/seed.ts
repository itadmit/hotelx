import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
        type: 'Suite',
        hotelId: hotel.id,
      },
    }),
    prisma.room.create({
      data: {
        number: '305',
        code: 'HIL305',
        type: 'Deluxe',
        hotelId: hotel.id,
      },
    }),
    prisma.room.create({
      data: {
        number: '501',
        code: 'HIL501',
        type: 'Presidential Suite',
        hotelId: hotel.id,
      },
    }),
  ]);

  console.log('✅ Created', rooms.length, 'rooms');

  // יצירת קטגוריות מקיפות עם תמונות ברירת מחדל
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Food & Drinks',
        slug: 'food-drinks',
        icon: 'UtensilsCrossed',
        bgImage: '/images/food.webp',
        order: 1,
        hotelId: hotel.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Room Service',
        slug: 'room-service',
        icon: 'BedDouble',
        bgImage: '/images/room_service.webp',
        order: 2,
        hotelId: hotel.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Spa & Wellness',
        slug: 'spa-wellness',
        icon: 'Sparkles',
        bgImage: '/images/spa.webp',
        order: 3,
        hotelId: hotel.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Concierge',
        slug: 'concierge',
        icon: 'Bell',
        bgImage: '/images/Concierge.webp',
        order: 4,
        hotelId: hotel.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Maintenance',
        slug: 'maintenance',
        icon: 'Wrench',
        bgImage: '/images/maintance.webp',
        order: 5,
        hotelId: hotel.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Entertainment',
        slug: 'entertainment',
        icon: 'Tv',
        bgImage: '/images/Entertainment2.webp',
        order: 6,
        hotelId: hotel.id,
      },
    }),
  ]);

  console.log('✅ Created', categories.length, 'categories');

  // יצירת תרגומים לקטגוריות
  const categoryTranslations = [
    { slug: 'food-drinks', translations: { en: 'Food & Drinks', bg: 'Храна и напитки', de: 'Essen & Getränke', fr: 'Nourriture et boissons', it: 'Cibo e bevande' } },
    { slug: 'room-service', translations: { en: 'Room Service', bg: 'Обслужване в стаята', de: 'Zimmerservice', fr: 'Service en chambre', it: 'Servizio in camera' } },
    { slug: 'spa-wellness', translations: { en: 'Spa & Wellness', bg: 'Спа и здраве', de: 'Spa & Wellness', fr: 'Spa et bien-être', it: 'Spa e benessere' } },
    { slug: 'concierge', translations: { en: 'Concierge', bg: 'Портье', de: 'Concierge', fr: 'Conciergerie', it: 'Concierge' } },
    { slug: 'maintenance', translations: { en: 'Maintenance', bg: 'Поддръжка', de: 'Wartung', fr: 'Maintenance', it: 'Manutenzione' } },
    { slug: 'entertainment', translations: { en: 'Entertainment', bg: 'Развлечения', de: 'Unterhaltung', fr: 'Divertissement', it: 'Intrattenimento' } },
  ];

  const translations = [];
  for (const catTrans of categoryTranslations) {
    const category = categories.find(c => c.slug === catTrans.slug);
    if (category) {
      for (const [lang, value] of Object.entries(catTrans.translations)) {
        translations.push(
          prisma.translation.create({
            data: {
              entityType: 'Category',
              entityId: category.id,
              language: lang,
              field: 'name',
              value: value,
              hotelId: hotel.id,
            },
          })
        );
      }
    }
  }

  await Promise.all(translations);
  console.log('✅ Created', translations.length, 'category translations');

  // יצירת תת-קטגוריות לדוגמה עבור Food & Drinks
  const foodDrinksCategory = categories[0]; // Food & Drinks
  const subCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Breakfast',
        slug: 'breakfast',
        icon: 'Coffee',
        bgImage: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80',
        order: 1,
        hotelId: hotel.id,
        parentId: foodDrinksCategory.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Lunch',
        slug: 'lunch',
        icon: 'UtensilsCrossed',
        bgImage: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=400&q=80',
        order: 2,
        hotelId: hotel.id,
        parentId: foodDrinksCategory.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dinner',
        slug: 'dinner',
        icon: 'ChefHat',
        bgImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        order: 3,
        hotelId: hotel.id,
        parentId: foodDrinksCategory.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Beverages',
        slug: 'beverages',
        icon: 'Wine',
        bgImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
        order: 4,
        hotelId: hotel.id,
        parentId: foodDrinksCategory.id,
      },
    }),
  ]);

  console.log('✅ Created', subCategories.length, 'sub-categories');

  // יצירת שירותים מקיפים
  const services = await Promise.all([
    // Breakfast (sub-category 0)
    prisma.service.create({
      data: {
        name: 'In-Room Breakfast',
        description: 'Fresh breakfast delivered to your room. Choose from Continental, American, or Healthy options.',
        price: 25.00,
        currency: 'USD',
        estimatedTime: '30 minutes',
        categoryId: subCategories[0].id, // Breakfast
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=800&q=80',
        isRecommended: true,
        isHot: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Coffee & Dessert',
        description: 'Fresh espresso or cappuccino with chef\'s dessert of the day.',
        price: 12.00,
        currency: 'USD',
        estimatedTime: '15 minutes',
        categoryId: subCategories[0].id, // Breakfast
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80',
        isVegetarian: true,
      },
    }),
    
    // Lunch (sub-category 1)
    prisma.service.create({
      data: {
        name: 'Club Sandwich',
        description: 'Classic triple-decker with chicken, bacon, lettuce, tomato, and mayo.',
        price: 18.00,
        currency: 'USD',
        estimatedTime: '20 minutes',
        categoryId: subCategories[1].id, // Lunch
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan, croutons, and caesar dressing.',
        price: 14.00,
        currency: 'USD',
        estimatedTime: '15 minutes',
        categoryId: subCategories[1].id, // Lunch
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
        isNew: true,
        isVegetarian: true,
      },
    }),
    
    // Dinner (sub-category 2)
    prisma.service.create({
      data: {
        name: 'Pasta Carbonara',
        description: 'Creamy Italian pasta with bacon, egg, and parmesan cheese.',
        price: 22.00,
        currency: 'USD',
        estimatedTime: '25 minutes',
        categoryId: subCategories[2].id, // Dinner
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
        isVegetarian: true,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Grilled Salmon',
        description: 'Fresh Atlantic salmon with seasonal vegetables and lemon butter sauce.',
        price: 32.00,
        currency: 'USD',
        estimatedTime: '35 minutes',
        categoryId: subCategories[2].id, // Dinner
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80',
        isRecommended: true,
      },
    }),
    
    // Beverages (sub-category 3)
    prisma.service.create({
      data: {
        name: 'Red Wine Bottle',
        description: 'Premium selection of red wines from our cellar.',
        price: 45.00,
        currency: 'USD',
        estimatedTime: '10 minutes',
        categoryId: subCategories[3].id, // Beverages
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
        isVegan: true,
      },
    }),

    // Room Service (category 1)
    prisma.service.create({
      data: {
        name: 'Room Cleaning',
        description: 'Full cleaning service including bed making, bathroom cleaning, and floor vacuuming.',
        estimatedTime: '45 minutes',
        categoryId: categories[1].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Extra Towels',
        description: 'Fresh set of bath towels, hand towels, and washcloths.',
        estimatedTime: '10 minutes',
        categoryId: categories[1].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1520508866568-263224c31599?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Extra Pillows',
        description: 'Additional pillows and blankets for your comfort.',
        estimatedTime: '10 minutes',
        categoryId: categories[1].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Laundry Service',
        description: 'Professional laundry and dry cleaning service. Next-day delivery.',
        price: 20.00,
        currency: 'USD',
        estimatedTime: '24 hours',
        categoryId: categories[1].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1517677208171-0bc12ddad6bf?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Iron & Ironing Board',
        description: 'Delivered to your room for your convenience.',
        estimatedTime: '15 minutes',
        categoryId: categories[1].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1489274495757-95c7c83700c0?auto=format&fit=crop&w=800&q=80'
      },
    }),

    // Spa & Wellness (category 2)
    prisma.service.create({
      data: {
        name: 'Full Body Massage',
        description: '60-minute relaxing Swedish or deep tissue massage by certified therapist.',
        price: 120.00,
        currency: 'USD',
        estimatedTime: '60 minutes',
        categoryId: categories[2].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Facial Treatment',
        description: 'Rejuvenating facial with premium products tailored to your skin type.',
        price: 90.00,
        currency: 'USD',
        estimatedTime: '50 minutes',
        categoryId: categories[2].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Couples Massage',
        description: 'Romantic side-by-side massage experience in our couples suite.',
        price: 220.00,
        currency: 'USD',
        estimatedTime: '90 minutes',
        categoryId: categories[2].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Pool & Jacuzzi Access',
        description: 'Access to our rooftop pool and hot tub facilities.',
        estimatedTime: 'Flexible',
        categoryId: categories[2].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Yoga Session',
        description: 'Private or group yoga session with certified instructor.',
        price: 45.00,
        currency: 'USD',
        estimatedTime: '60 minutes',
        categoryId: categories[2].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1545205539-3c509dc39a4e?auto=format&fit=crop&w=800&q=80'
      },
    }),

    // Concierge (category 3)
    prisma.service.create({
      data: {
        name: 'Taxi Booking',
        description: 'Book a reliable taxi to any destination in the city.',
        estimatedTime: '15 minutes',
        categoryId: categories[3].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1468070454955-c5b6932bd08d?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Airport Transfer',
        description: 'Private car service to/from the airport with professional driver.',
        price: 65.00,
        currency: 'USD',
        estimatedTime: '30 minutes',
        categoryId: categories[3].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Restaurant Reservation',
        description: 'Let us book a table at the best restaurants in town.',
        estimatedTime: '20 minutes',
        categoryId: categories[3].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Theater Tickets',
        description: 'Book tickets for shows, concerts, and local attractions.',
        price: 15.00,
        currency: 'USD',
        estimatedTime: '1 hour',
        categoryId: categories[3].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1503095392213-2e2d0396d393?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'City Tour Guide',
        description: 'Personal tour guide for exploring the city\'s highlights.',
        price: 150.00,
        currency: 'USD',
        estimatedTime: '4 hours',
        categoryId: categories[3].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Wake-up Call',
        description: 'Courtesy wake-up call at your requested time.',
        estimatedTime: 'Scheduled',
        categoryId: categories[3].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1562613527-96864053d2eb?auto=format&fit=crop&w=800&q=80'
      },
    }),

    // Maintenance (category 4)
    prisma.service.create({
      data: {
        name: 'AC Repair',
        description: 'Air conditioning system check and repair service.',
        estimatedTime: '30 minutes',
        categoryId: categories[4].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'TV Support',
        description: 'Technical support for TV, remote, or entertainment system issues.',
        estimatedTime: '20 minutes',
        categoryId: categories[4].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'WiFi Troubleshooting',
        description: 'Help with internet connectivity and WiFi setup.',
        estimatedTime: '15 minutes',
        categoryId: categories[4].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1563770095-39d468f95742?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Light Bulb Replacement',
        description: 'Quick replacement of non-working light bulbs.',
        estimatedTime: '10 minutes',
        categoryId: categories[4].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'General Maintenance',
        description: 'Report any issue in your room that needs fixing.',
        estimatedTime: '20-40 minutes',
        categoryId: categories[4].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80'
      },
    }),

    // Entertainment (category 5)
    prisma.service.create({
      data: {
        name: 'Movie Rental',
        description: 'Latest movies on-demand in your room.',
        price: 8.00,
        currency: 'USD',
        estimatedTime: 'Instant',
        categoryId: categories[5].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Video Game Console',
        description: 'PlayStation or Xbox delivered to your room with game selection.',
        price: 25.00,
        currency: 'USD',
        estimatedTime: '30 minutes',
        categoryId: categories[5].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Board Games',
        description: 'Selection of classic board games for family fun.',
        estimatedTime: '15 minutes',
        categoryId: categories[5].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=800&q=80'
      },
    }),
    prisma.service.create({
      data: {
        name: 'Newspaper Delivery',
        description: 'Daily newspaper delivered to your door every morning.',
        estimatedTime: 'Daily at 7 AM',
        categoryId: categories[5].id,
        hotelId: hotel.id,
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'
      },
    }),
  ]);

  console.log('✅ Created', services.length, 'services');
  
  console.log('\n🎉 Comprehensive seed completed!');
  console.log('\n📊 Summary:');
  console.log('  - Hotel: Hilton');
  console.log('  - Rooms:', rooms.length);
  console.log('  - Categories:', categories.length);
  console.log('  - Services:', services.length);
  console.log('\n🔐 Login credentials:');
  console.log('  📧 Email: itadmit@gmail.com');
  console.log('  🔑 Password: 115599');
  console.log('\n🌐 Test URLs:');
  console.log('  - Guest App: http://localhost:3001/g/hilton/HIL101');
  console.log('  - Dashboard: http://localhost:3001/login');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
