"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateHotelSettings(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    throw new Error("Unauthorized");
  }

  const hotelId = session.user.hotelId as string;
  
  if (!hotelId || typeof hotelId !== 'string') {
    throw new Error("Invalid hotel ID");
  }

  const name = formData.get("name") as string;
  const logo = formData.get("logo") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const wifiName = formData.get("wifiName") as string;
  const language = formData.get("language") as string;
  const currency = formData.get("currency") as string;

  await prisma.hotel.update({
    where: { id: hotelId },
    data: {
      name: name || undefined,
      logo: logo && logo.trim() !== "" ? logo : undefined,
      primaryColor: primaryColor && primaryColor.trim() !== "" ? primaryColor : undefined,
      wifiName: wifiName && wifiName.trim() !== "" ? wifiName : undefined,
      language: language && language.trim() !== "" ? language : undefined,
      currency: currency && currency.trim() !== "" ? currency : undefined,
    },
  });

  revalidatePath("/dashboard/hotel-settings");
  revalidatePath("/dashboard/qr");
  
  return { success: true };
}

export async function createHotel(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id as string;
  const name = formData.get("name") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const wifiName = formData.get("wifiName") as string;
  const selectedServicesJson = formData.get("selectedServices") as string;

  if (!name || name.trim() === "") {
    throw new Error("Hotel name is required");
  }

  // Parse selected services
  let selectedServices: string[] = [];
  try {
    if (selectedServicesJson) {
      selectedServices = JSON.parse(selectedServicesJson);
    }
  } catch (e) {
    console.error("Failed to parse selected services:", e);
  }

  // Create slug from hotel name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") + "-" + Math.floor(Math.random() * 1000);

  // Service definitions
  const serviceDefinitions: Record<string, { name: string; icon: string; category: string; categoryIcon: string }> = {
    "room-service": { 
      name: "Room Service", 
      icon: "Utensils", 
      category: "Food & Beverage",
      categoryIcon: "Utensils"
    },
    "housekeeping": { 
      name: "Housekeeping", 
      icon: "Sparkles", 
      category: "Room Service",
      categoryIcon: "ConciergeBell"
    },
    "concierge": { 
      name: "Concierge", 
      icon: "Info", 
      category: "Assistance",
      categoryIcon: "HelpCircle"
    },
    "laundry": { 
      name: "Laundry Service", 
      icon: "Sparkles", 
      category: "Room Service",
      categoryIcon: "ConciergeBell"
    },
    "spa": { 
      name: "Spa & Wellness", 
      icon: "Heart", 
      category: "Wellness",
      categoryIcon: "Heart"
    },
    "transport": { 
      name: "Transportation", 
      icon: "Car", 
      category: "Transport",
      categoryIcon: "Car"
    },
  };

  // Create hotel and update user in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const hotel = await tx.hotel.create({
      data: {
        name: name.trim(),
        slug: slug,
        primaryColor: primaryColor && primaryColor.trim() !== "" ? primaryColor : undefined,
        wifiName: wifiName && wifiName.trim() !== "" ? wifiName : undefined,
      },
    });

    // Create categories and services based on selected services
    const categoryMap = new Map<string, string>(); // category name -> category id
    
    for (const serviceId of selectedServices) {
      const serviceDef = serviceDefinitions[serviceId];
      if (!serviceDef) continue;

      // Create or get category
      let categoryId = categoryMap.get(serviceDef.category);
      if (!categoryId) {
        const categorySlug = serviceDef.category
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const category = await tx.category.create({
          data: {
            name: serviceDef.category,
            slug: categorySlug,
            icon: serviceDef.categoryIcon,
            order: categoryMap.size,
            hotelId: hotel.id,
          },
        });
        categoryId = category.id;
        categoryMap.set(serviceDef.category, categoryId);
      }

      // Create service
      await tx.service.create({
        data: {
          name: serviceDef.name,
          icon: serviceDef.icon,
          isActive: true,
          hotelId: hotel.id,
          categoryId: categoryId,
        },
      });
    }

    // Update user with hotelId
    await tx.user.update({
      where: { id: userId },
      data: { hotelId: hotel.id },
    });

    return hotel;
  });

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  revalidatePath("/g");
  
  return { success: true, hotelId: result.id };
}

export async function createRoom(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    throw new Error("Unauthorized");
  }

  const hotelId = session.user.hotelId as string;
  const number = formData.get("number") as string;
  const type = formData.get("type") as string;

  if (!number || number.trim() === "") {
    throw new Error("Room number is required");
  }

  // Generate unique code for room
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const room = await prisma.room.create({
    data: {
      number: number.trim(),
      type: type || "Standard",
      code: code,
      status: "ACTIVE",
      hotelId: hotelId,
    },
  });

  revalidatePath("/dashboard/rooms");
  
  return { success: true, roomId: room.id };
}

export async function updateGuestTemplate(data: {
  hotelId: string;
  coverImage?: string;
  primaryColor?: string;
  categories: Array<{
    id: string;
    customName?: string;
    emoji?: string;
    bgImage?: string;
    isActive?: boolean;
  }>;
}) {
  const session = await auth();
  
  if (!session?.user?.hotelId || session.user.hotelId !== data.hotelId) {
    throw new Error("Unauthorized");
  }

  console.log("Updating guest template:", { hotelId: data.hotelId, coverImage: data.coverImage, primaryColor: data.primaryColor, categoriesCount: data.categories.length });

  const hotel = await prisma.$transaction(async (tx) => {
    // Update hotel - always update these fields
    const hotelUpdateData: any = {
      coverImage: data.coverImage && data.coverImage.trim() !== "" ? data.coverImage.trim() : null,
      primaryColor: data.primaryColor && data.primaryColor.trim() !== "" ? data.primaryColor.trim() : null,
    };
    
    const updatedHotel = await tx.hotel.update({
      where: { id: data.hotelId },
      data: hotelUpdateData,
    });

    // Update categories - always update all fields
    for (const category of data.categories) {
      await tx.category.update({
        where: { id: category.id },
        data: {
          customName: category.customName && category.customName.trim() !== "" ? category.customName.trim() : null,
          emoji: category.emoji && category.emoji.trim() !== "" ? category.emoji.trim() : null,
          bgImage: category.bgImage && category.bgImage.trim() !== "" ? category.bgImage.trim() : null,
          isActive: category.isActive !== undefined ? category.isActive : true,
        },
      });
    }

    return updatedHotel;
  });

  // Revalidate all guest pages for this hotel
  revalidatePath("/dashboard/guest-template");
  // Revalidate the entire guest layout to ensure all dynamic routes are updated
  revalidatePath("/g", "layout");
  // Also revalidate specific hotel paths
  revalidatePath(`/g/${hotel.slug}`);
  
  return { success: true };
}

export async function createService(data: {
  name: string;
  description?: string;
  categoryId: string;
  price?: number;
  estimatedTime?: string;
  translations: Record<string, { name: string; description?: string }>;
}) {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    throw new Error("Unauthorized");
  }

  const hotelId = session.user.hotelId as string;

  const result = await prisma.$transaction(async (tx) => {
    // Create service
    const service = await tx.service.create({
      data: {
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        price: data.price ? data.price : undefined,
        estimatedTime: data.estimatedTime,
        hotelId: hotelId,
        isActive: true,
      },
    });

    // Create translations
    const translationPromises: Promise<any>[] = [];
    for (const [lang, trans] of Object.entries(data.translations)) {
      translationPromises.push(
        tx.translation.create({
          data: {
            entityType: 'Service',
            entityId: service.id,
            language: lang,
            field: 'name',
            value: trans.name,
            hotelId: hotelId,
          },
        })
      );
      if (trans.description) {
        translationPromises.push(
          tx.translation.create({
            data: {
              entityType: 'Service',
              entityId: service.id,
              language: lang,
              field: 'description',
              value: trans.description,
              hotelId: hotelId,
            },
          })
        );
      }
    }

    await Promise.all(translationPromises);

    return service;
  });

  revalidatePath("/dashboard/services");
  
  return { success: true, serviceId: result.id };
}

export async function deleteAccount() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id as string;
  const hotelId = session.user.hotelId;

  // Delete all data in a transaction
  await prisma.$transaction(async (tx) => {
    // If user has a hotel, delete all hotel data
    if (hotelId) {
      // Delete requests
      await tx.request.deleteMany({
        where: { hotelId }
      });

      // Delete services
      await tx.service.deleteMany({
        where: { hotelId }
      });

      // Delete categories
      await tx.category.deleteMany({
        where: { hotelId }
      });

      // Delete rooms
      await tx.room.deleteMany({
        where: { hotelId }
      });

      // Delete all users from this hotel
      await tx.user.deleteMany({
        where: { hotelId }
      });

      // Delete the hotel
      await tx.hotel.delete({
        where: { id: hotelId }
      });
    } else {
      // Just delete the user
      await tx.user.delete({
        where: { id: userId }
      });
    }
  });

  return { success: true };
}

export async function resetHotelData() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    throw new Error("Unauthorized");
  }

  const hotelId = session.user.hotelId as string;

  // Delete all data but keep the hotel
  await prisma.$transaction(async (tx) => {
    // Delete requests
    await tx.request.deleteMany({
      where: { hotelId }
    });

    // Delete services
    await tx.service.deleteMany({
      where: { hotelId }
    });

    // Delete categories
    await tx.category.deleteMany({
      where: { hotelId }
    });

    // Delete rooms
    await tx.room.deleteMany({
      where: { hotelId }
    });

    // Reset hotel settings to defaults (keep name)
    await tx.hotel.update({
      where: { id: hotelId },
      data: {
        coverImage: null,
        primaryColor: null,
        logo: null,
        wifiName: null,
      },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/hotel-settings");
  revalidatePath("/dashboard/rooms");
  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard/requests");
  revalidatePath("/dashboard/guest-template");
  revalidatePath("/g", "layout");
  
  return { success: true };
}

export async function importDemoData() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    throw new Error("Unauthorized");
  }

  const hotelId = session.user.hotelId as string;

  // נתוני דמו ל-guest template
  const demoData = {
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    primaryColor: "#4f46e5",
    categoryCustomizations: [
      { name: "Food & Drinks", emoji: "🍽️", bgImage: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=400&q=80" },
      { name: "Room Service", emoji: "🛏️", bgImage: "https://images.unsplash.com/photo-1520508866568-263224c31599?auto=format&fit=crop&w=400&q=80" },
      { name: "Spa & Wellness", emoji: "💆", bgImage: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80" },
      { name: "Concierge", emoji: "🔔", bgImage: "https://images.unsplash.com/photo-1468070454955-c5b6932bd08d?auto=format&fit=crop&w=400&q=80" },
      { name: "Maintenance", emoji: "🔧", bgImage: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=400&q=80" },
      { name: "Entertainment", emoji: "🎮", bgImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80" },
    ],
  };

  const result = await prisma.$transaction(async (tx) => {
    // עדכון המלון
    await tx.hotel.update({
      where: { id: hotelId },
      data: {
        coverImage: demoData.coverImage,
        primaryColor: demoData.primaryColor,
      },
    });

    // עדכון קטגוריות
    const categories = await tx.category.findMany({
      where: { hotelId },
      orderBy: { order: 'asc' },
    });

    for (const category of categories) {
      const customization = demoData.categoryCustomizations.find(
        (c) => c.name === category.name
      );
      
      if (customization) {
        await tx.category.update({
          where: { id: category.id },
          data: {
            emoji: customization.emoji,
            bgImage: customization.bgImage,
            isActive: true,
          },
        });
      }
    }

    return { success: true };
  });

  revalidatePath("/dashboard/guest-template");
  revalidatePath("/g", "layout");
  
  return result;
}

export async function importFullDemoData() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    throw new Error("Unauthorized");
  }

  const hotelId = session.user.hotelId as string;

  const result = await prisma.$transaction(async (tx) => {
    // ניקוי נתונים קודמים
    await tx.request.deleteMany({ where: { hotelId } });
    await tx.service.deleteMany({ where: { hotelId } });
    await tx.category.deleteMany({ where: { hotelId } });
    await tx.room.deleteMany({ where: { hotelId } });

    // עדכון המלון עם נתוני דמו
    await tx.hotel.update({
      where: { id: hotelId },
      data: {
        coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        primaryColor: "#4f46e5",
      },
    });

    // יצירת חדרים
    const rooms = await Promise.all([
      tx.room.create({
        data: {
          number: '101',
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          type: 'Standard',
          hotelId: hotelId,
        },
      }),
      tx.room.create({
        data: {
          number: '102',
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          type: 'Standard',
          hotelId: hotelId,
        },
      }),
      tx.room.create({
        data: {
          number: '201',
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          type: 'Suite',
          hotelId: hotelId,
        },
      }),
      tx.room.create({
        data: {
          number: '305',
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          type: 'Deluxe',
          hotelId: hotelId,
        },
      }),
      tx.room.create({
        data: {
          number: '501',
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          type: 'Presidential Suite',
          hotelId: hotelId,
        },
      }),
    ]);

    // יצירת קטגוריות עם תמונות ברירת מחדל
    const categories = await Promise.all([
      tx.category.create({
        data: {
          name: 'Food & Drinks',
          slug: 'food-drinks',
          icon: 'UtensilsCrossed',
          emoji: '🍽️',
          bgImage: '/images/food.webp',
          order: 1,
          hotelId: hotelId,
        },
      }),
      tx.category.create({
        data: {
          name: 'Room Service',
          slug: 'room-service',
          icon: 'BedDouble',
          emoji: '🛏️',
          bgImage: '/images/room_service.webp',
          order: 2,
          hotelId: hotelId,
        },
      }),
      tx.category.create({
        data: {
          name: 'Spa & Wellness',
          slug: 'spa-wellness',
          icon: 'Sparkles',
          emoji: '💆',
          bgImage: '/images/spa.webp',
          order: 3,
          hotelId: hotelId,
        },
      }),
      tx.category.create({
        data: {
          name: 'Concierge',
          slug: 'concierge',
          icon: 'Bell',
          emoji: '🔔',
          bgImage: '/images/Concierge.webp',
          order: 4,
          hotelId: hotelId,
        },
      }),
      tx.category.create({
        data: {
          name: 'Maintenance',
          slug: 'maintenance',
          icon: 'Wrench',
          emoji: '🔧',
          bgImage: '/images/maintance.webp',
          order: 5,
          hotelId: hotelId,
        },
      }),
      tx.category.create({
        data: {
          name: 'Entertainment',
          slug: 'entertainment',
          icon: 'Tv',
          emoji: '🎮',
          bgImage: '/images/Entertainment2.webp',
          order: 6,
          hotelId: hotelId,
        },
      }),
    ]);

    // יצירת תת-קטגוריות ל-Food & Drinks
    const subCategories = await Promise.all([
      tx.category.create({
        data: {
          name: 'Breakfast',
          slug: 'breakfast',
          icon: 'Coffee',
          bgImage: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=400&q=80',
          order: 1,
          hotelId: hotelId,
          parentId: categories[0].id, // Food & Drinks
        },
      }),
      tx.category.create({
        data: {
          name: 'Lunch',
          slug: 'lunch',
          icon: 'UtensilsCrossed',
          bgImage: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=400&q=80',
          order: 2,
          hotelId: hotelId,
          parentId: categories[0].id,
        },
      }),
      tx.category.create({
        data: {
          name: 'Dinner',
          slug: 'dinner',
          icon: 'ChefHat',
          bgImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
          order: 3,
          hotelId: hotelId,
          parentId: categories[0].id,
        },
      }),
      tx.category.create({
        data: {
          name: 'Beverages',
          slug: 'beverages',
          icon: 'Wine',
          bgImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=400&q=80',
          order: 4,
          hotelId: hotelId,
          parentId: categories[0].id,
        },
      }),
    ]);

    // יצירת שירותים עם תגיות
    const services = await Promise.all([
      // Breakfast
      tx.service.create({
        data: {
          name: 'In-Room Breakfast',
          description: 'Fresh breakfast delivered to your room. Choose from Continental, American, or Healthy options.',
          price: 25.00,
          currency: 'USD',
          estimatedTime: '30 minutes',
          categoryId: subCategories[0].id, // Breakfast
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=800&q=80',
          isRecommended: true,
          isHot: true,
        },
      }),
      tx.service.create({
        data: {
          name: 'Coffee & Dessert',
          description: 'Fresh espresso or cappuccino with chef\'s dessert of the day.',
          price: 12.00,
          currency: 'USD',
          estimatedTime: '15 minutes',
          categoryId: subCategories[0].id, // Breakfast
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80',
          isVegetarian: true,
        },
      }),
      
      // Lunch
      tx.service.create({
        data: {
          name: 'Club Sandwich',
          description: 'Classic triple-decker with chicken, bacon, lettuce, tomato, and mayo.',
          price: 18.00,
          currency: 'USD',
          estimatedTime: '20 minutes',
          categoryId: subCategories[1].id, // Lunch
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80'
        },
      }),
      tx.service.create({
        data: {
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with parmesan, croutons, and caesar dressing.',
          price: 14.00,
          currency: 'USD',
          estimatedTime: '15 minutes',
          categoryId: subCategories[1].id, // Lunch
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80',
          isNew: true,
          isVegetarian: true,
        },
      }),
      
      // Dinner
      tx.service.create({
        data: {
          name: 'Pasta Carbonara',
          description: 'Creamy Italian pasta with bacon, egg, and parmesan cheese.',
          price: 22.00,
          currency: 'USD',
          estimatedTime: '25 minutes',
          categoryId: subCategories[2].id, // Dinner
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
          isVegetarian: true,
        },
      }),
      tx.service.create({
        data: {
          name: 'Grilled Salmon',
          description: 'Fresh Atlantic salmon with seasonal vegetables and lemon butter sauce.',
          price: 32.00,
          currency: 'USD',
          estimatedTime: '35 minutes',
          categoryId: subCategories[2].id, // Dinner
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80',
          isRecommended: true,
        },
      }),
      
      // Beverages
      tx.service.create({
        data: {
          name: 'Red Wine Bottle',
          description: 'Premium selection of red wines from our cellar.',
          price: 45.00,
          currency: 'USD',
          estimatedTime: '10 minutes',
          categoryId: subCategories[3].id, // Beverages
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
          isVegan: true,
        },
      }),
      // Room Service
      tx.service.create({
        data: {
          name: 'Room Cleaning',
          description: 'Full cleaning service including bed making, bathroom cleaning, and floor vacuuming.',
          estimatedTime: '45 minutes',
          categoryId: categories[1].id,
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
        },
      }),
      tx.service.create({
        data: {
          name: 'Extra Towels',
          description: 'Fresh set of bath towels, hand towels, and washcloths.',
          estimatedTime: '10 minutes',
          categoryId: categories[1].id,
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1520508866568-263224c31599?auto=format&fit=crop&w=800&q=80'
        },
      }),
      // Spa & Wellness
      tx.service.create({
        data: {
          name: 'Full Body Massage',
          description: '60-minute relaxing Swedish or deep tissue massage by certified therapist.',
          price: 120.00,
          currency: 'USD',
          estimatedTime: '60 minutes',
          categoryId: categories[2].id,
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'
        },
      }),
      // Concierge
      tx.service.create({
        data: {
          name: 'Taxi Booking',
          description: 'Book a reliable taxi to any destination in the city.',
          estimatedTime: '15 minutes',
          categoryId: categories[3].id,
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1468070454955-c5b6932bd08d?auto=format&fit=crop&w=800&q=80'
        },
      }),
      // Maintenance
      tx.service.create({
        data: {
          name: 'AC Repair',
          description: 'Air conditioning system check and repair service.',
          estimatedTime: '30 minutes',
          categoryId: categories[4].id,
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=800&q=80'
        },
      }),
      // Entertainment
      tx.service.create({
        data: {
          name: 'Movie Rental',
          description: 'Latest movies on-demand in your room.',
          price: 8.00,
          currency: 'USD',
          estimatedTime: 'Instant',
          categoryId: categories[5].id,
          hotelId: hotelId,
          image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80'
        },
      }),
    ]);

    // יצירת פניות פתוחות (NEW status)
    const now = new Date();
    const requests = await Promise.all([
      tx.request.create({
        data: {
          hotelId: hotelId,
          roomId: rooms[0].id,
          serviceId: services[0].id,
          status: 'NEW',
          notes: 'Please deliver to room 101',
          createdAt: new Date(now.getTime() - 10 * 60000), // 10 minutes ago
        },
      }),
      tx.request.create({
        data: {
          hotelId: hotelId,
          roomId: rooms[1].id,
          serviceId: services[1].id,
          status: 'NEW',
          notes: 'Extra mayo please',
          createdAt: new Date(now.getTime() - 5 * 60000), // 5 minutes ago
        },
      }),
      tx.request.create({
        data: {
          hotelId: hotelId,
          roomId: rooms[2].id,
          serviceId: services[3].id,
          status: 'NEW',
          notes: 'Room cleaning requested',
          createdAt: new Date(now.getTime() - 15 * 60000), // 15 minutes ago
        },
      }),
      tx.request.create({
        data: {
          hotelId: hotelId,
          roomId: rooms[0].id,
          serviceId: services[5].id,
          status: 'NEW',
          notes: 'Massage appointment',
          createdAt: new Date(now.getTime() - 20 * 60000), // 20 minutes ago
        },
      }),
      tx.request.create({
        data: {
          hotelId: hotelId,
          roomId: rooms[3].id,
          serviceId: services[7].id,
          status: 'NEW',
          notes: 'AC not working properly',
          createdAt: new Date(now.getTime() - 30 * 60000), // 30 minutes ago
        },
      }),
    ]);

    return { success: true, rooms: rooms.length, categories: categories.length, services: services.length, requests: requests.length };
  });

  // Revalidate all relevant paths
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/rooms");
  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard/requests");
  revalidatePath("/dashboard/guest-template");
  revalidatePath("/g", "layout");
  
  return result;
}

