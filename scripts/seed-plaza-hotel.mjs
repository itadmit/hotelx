/**
 * Seeds a richly-detailed demo hotel — "Plaza Hotel" — into the live database.
 * Run from the project root with:
 *
 *   node scripts/seed-plaza-hotel.mjs
 *
 * Idempotent: re-running upserts the hotel and overwrites Wi-Fi/About/Helpful
 * info. Amenities and rooms are wiped+reseeded so the list always matches the
 * fictional Milan property described below.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const HOTEL = {
  slug: "plaza-hotel-milano",
  name: "Plaza Hotel",
  primaryColor: "#0e5240",
  defaultCurrency: "EUR",
};

const ROOMS = [
  { number: "201", code: "PLZ-201", type: "Deluxe Duomo View" },
  { number: "305", code: "PLZ-305", type: "Junior Suite" },
  { number: "412", code: "PLZ-412", type: "Galleria Suite" },
  { number: "PH1", code: "PLZ-PH1", type: "Penthouse" },
];

const INFO = {
  wifiName: "PlazaGuest",
  wifiPassword: "DuomoMilano1386",
  wifiNotes:
    "Open the network and accept the captive page on first connect. The same credentials work in your room, the orchard lobby and on the rooftop terrace.",
  about: `Plaza Hotel sits on Via dell'Arcivescovado, just 90 seconds on foot from the Piazza del Duomo and the marble facade of Milan's cathedral. The building, a restored 19th-century palazzo, opens onto a quiet courtyard you can hear the bell tower from but never the traffic.

Forty-two rooms and suites blend Lombard craftsmanship with a calm modern hand — terracotta floors, ivory linen, brass fixtures cast in Brescia. Every key includes a personal concierge on the in-room screen, and your room is yours from the moment you arrive: priority check-in opens at 11:00 whenever the room is ready.

Our restaurant, Il Cortile, is led by chef Matteo Ricci (one Michelin star, formerly of Cracco) and serves a seasonal Lombard tasting menu nightly. The rooftop bar — Sopra il Duomo — opens at 17:00 with a direct line of sight to the cathedral's spires.`,
  helpfulInfo: `Check-in 15:00 (priority from 11:00 when ready). Check-out 11:00.
Breakfast 7:00 – 10:30 in Il Cortile, the orchard hall on the ground floor.
Rooftop bar Sopra il Duomo opens daily 17:00 – 01:00.
Valet parking at the Via Larga garage — call reception 30 minutes before arrival or departure.
Smoking only on the rooftop terrace; rooms and suites are strictly non-smoking.
The Duomo is a 90-second walk; Galleria Vittorio Emanuele 4 minutes; La Scala 7 minutes.
Closest metro: Duomo (M1 / M3), exit Via Mengoni — 2 minutes on foot.
Concierge desk is staffed 24/7. Tap "Concierge" on your in-room screen for immediate help.
Pets up to 10kg are welcome — please notify us in advance.
Children of any age are welcome. Cribs and high chairs are complimentary.`,
};

const AMENITIES = [
  {
    name: "Sopra il Duomo · Rooftop bar",
    description:
      "Sky-bar with a direct view of the cathedral's spires. Aperitivo from 17:00.",
    icon: "bar",
    hours: "17:00 – 01:00",
    location: "Floor 7",
  },
  {
    name: "Il Cortile · Restaurant",
    description:
      "Chef Matteo Ricci's seasonal Lombard tasting menu. Reservation recommended.",
    icon: "restaurant",
    hours: "19:00 – 23:00",
    location: "Ground floor",
  },
  {
    name: "Orchard breakfast hall",
    description:
      "Italian breakfast with house pastries, cured meats and a Caffè Vergnano espresso bar.",
    icon: "breakfast",
    hours: "07:00 – 10:30",
    location: "Ground floor",
  },
  {
    name: "Marble indoor pool",
    description:
      "Heated 18m pool carved from Carrara marble, steam room and rain showers adjacent.",
    icon: "pool",
    hours: "06:30 – 22:00",
    location: "Floor -1",
  },
  {
    name: "La Brera spa",
    description:
      "Six treatment cabins, hammam and a vitality pool. Massages bookable via the concierge.",
    icon: "spa",
    hours: "10:00 – 21:00",
    location: "Floor -1",
  },
  {
    name: "24/7 fitness studio",
    description:
      "Technogym cardio, free weights, Peloton bikes and a private yoga corner.",
    icon: "gym",
    hours: "Always open",
    location: "Floor -1",
  },
  {
    name: "Valet parking",
    description:
      "Off-site garage on Via Larga. Call reception 30 minutes ahead to bring your car.",
    icon: "parking",
    hours: "On request",
    location: "Via Larga",
  },
  {
    name: "Concierge desk",
    description:
      "Tickets to La Scala, Duomo terraces & Last Supper viewings — booked while you settle in.",
    icon: "concierge",
    hours: "Always open",
    location: "Lobby",
  },
];

const CATEGORIES = [
  // Roots
  { name: "Room Service", slug: "room-service", icon: "Utensils", order: 1 },
  { name: "Housekeeping", slug: "housekeeping", icon: "Sparkles", order: 10 },
  { name: "Transport", slug: "transport", icon: "Car", order: 11 },
  {
    name: "Guest services",
    slug: "guest-services",
    icon: "ConciergeBell",
    order: 13,
  },
  { name: "Info", slug: "info", icon: "Info", order: 14 },
  // Children — under "room-service"
  {
    name: "Breakfast",
    slug: "room-breakfast",
    icon: "Coffee",
    order: 1,
    parentSlug: "room-service",
  },
  {
    name: "Mains",
    slug: "room-main",
    icon: "UtensilsCrossed",
    order: 2,
    parentSlug: "room-service",
  },
  {
    name: "Desserts",
    slug: "room-desserts",
    icon: "IceCream",
    order: 3,
    parentSlug: "room-service",
  },
  {
    name: "Drinks",
    slug: "room-beverages",
    icon: "Wine",
    order: 4,
    parentSlug: "room-service",
  },
];

const SERVICES = [
  // Featured upsells (these are the green daily recommendation rotation)
  {
    name: "Champagne & strawberries",
    description:
      "A chilled bottle of Ruinart Blanc de Blancs with marinated Lombard strawberries and dark-chocolate truffles.",
    price: 95,
    estimatedTime: "20 min",
    categorySlug: "room-beverages",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "Late-night truffle pasta",
    description:
      "Hand-rolled tagliolini, butter from Mantua, shaved Alba white truffle. Served until 01:00.",
    price: 64,
    estimatedTime: "25 min",
    categorySlug: "room-main",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "Sunrise breakfast in bed",
    description:
      "Italian breakfast tray with cornetti, cured meats, fresh fruit and a Caffè Vergnano cappuccino.",
    price: 38,
    estimatedTime: "20 min",
    categorySlug: "room-breakfast",
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=82",
  },
  // Regulars
  {
    name: "Espresso & cornetto",
    description:
      "Single Caffè Vergnano espresso with a warm chocolate cornetto.",
    price: 8,
    estimatedTime: "10 min",
    categorySlug: "room-breakfast",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "Margherita D.O.P.",
    description:
      "Wood-fired Neapolitan pizza, San Marzano tomato, buffalo mozzarella, basil.",
    price: 22,
    estimatedTime: "20 min",
    categorySlug: "room-main",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "Tiramisù della casa",
    description:
      "House tiramisù with mascarpone, savoiardi soaked in Vergnano espresso.",
    price: 14,
    estimatedTime: "10 min",
    categorySlug: "room-desserts",
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=82",
  },
  {
    name: "Negroni Sopra il Duomo",
    description:
      "Our rooftop classic — Campari, vermouth, Bombay Sapphire, served with a candied orange peel.",
    price: 18,
    estimatedTime: "15 min",
    categorySlug: "room-beverages",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=82",
  },
  // Operational
  {
    name: "Turn-down service",
    description:
      "Fresh towels, bed turn-down and a small dessert from the kitchen.",
    price: 0,
    estimatedTime: "20 min",
    categorySlug: "housekeeping",
  },
  {
    name: "Airport transfer · Linate",
    description:
      "Black Mercedes E-Class with a hotel chauffeur — door-to-door, fixed fare.",
    price: 70,
    estimatedTime: "30 min pickup",
    categorySlug: "transport",
  },
  {
    name: "La Scala ticket booking",
    description:
      "Concierge will check availability and arrange best-available seats for tonight's performance.",
    price: 0,
    estimatedTime: "1 h",
    categorySlug: "guest-services",
  },
];

async function run() {
  // 1. Hotel — upsert by slug.
  const hotel = await prisma.hotel.upsert({
    where: { slug: HOTEL.slug },
    update: {
      name: HOTEL.name,
      primaryColor: HOTEL.primaryColor,
      defaultCurrency: HOTEL.defaultCurrency,
    },
    create: HOTEL,
  });
  console.log(`Hotel ready: ${hotel.name} (${hotel.id})`);

  // 2. Hotel info — upsert.
  await prisma.hotelInfo.upsert({
    where: { hotelId: hotel.id },
    update: {
      wifiName: INFO.wifiName,
      wifiPassword: INFO.wifiPassword,
      wifiNotes: INFO.wifiNotes,
      about: INFO.about,
      helpfulInfo: INFO.helpfulInfo,
    },
    create: { hotelId: hotel.id, ...INFO },
  });
  console.log("Hotel info: Wi-Fi, About, Helpful info written.");

  // 3. Amenities — wipe + reseed (so re-runs match the latest list exactly).
  await prisma.hotelAmenity.deleteMany({ where: { hotelId: hotel.id } });
  await prisma.hotelAmenity.createMany({
    data: AMENITIES.map((a, i) => ({
      hotelId: hotel.id,
      name: a.name,
      description: a.description,
      icon: a.icon,
      hours: a.hours,
      location: a.location,
      order: i,
    })),
  });
  console.log(`Amenities reseeded: ${AMENITIES.length}.`);

  // 4. Categories — upsert root first, then children.
  const categoryBySlug = new Map();
  for (const c of CATEGORIES.filter((c) => !c.parentSlug)) {
    const cat = await prisma.category.upsert({
      where: { hotelId_slug: { hotelId: hotel.id, slug: c.slug } },
      update: { name: c.name, icon: c.icon, order: c.order, parentId: null },
      create: {
        hotelId: hotel.id,
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        order: c.order,
      },
    });
    categoryBySlug.set(c.slug, cat);
  }
  for (const c of CATEGORIES.filter((c) => c.parentSlug)) {
    const parent = categoryBySlug.get(c.parentSlug);
    if (!parent) continue;
    const cat = await prisma.category.upsert({
      where: { hotelId_slug: { hotelId: hotel.id, slug: c.slug } },
      update: {
        name: c.name,
        icon: c.icon,
        order: c.order,
        parentId: parent.id,
      },
      create: {
        hotelId: hotel.id,
        slug: c.slug,
        name: c.name,
        icon: c.icon,
        order: c.order,
        parentId: parent.id,
      },
    });
    categoryBySlug.set(c.slug, cat);
  }
  console.log(`Categories upserted: ${categoryBySlug.size}.`);

  // 5. Rooms — upsert by (hotelId, number).
  for (const r of ROOMS) {
    await prisma.room.upsert({
      where: { hotelId_number: { hotelId: hotel.id, number: r.number } },
      update: { code: r.code, type: r.type },
      create: { hotelId: hotel.id, ...r },
    });
  }
  console.log(`Rooms upserted: ${ROOMS.length}.`);

  // 6. Services — upsert by name within the hotel.
  for (const s of SERVICES) {
    const category = categoryBySlug.get(s.categorySlug);
    if (!category) {
      console.warn(`Skipping service "${s.name}": missing category ${s.categorySlug}`);
      continue;
    }
    const existing = await prisma.service.findFirst({
      where: { hotelId: hotel.id, name: s.name },
      select: { id: true },
    });
    const data = {
      name: s.name,
      description: s.description,
      price: s.price,
      currency: HOTEL.defaultCurrency,
      estimatedTime: s.estimatedTime ?? null,
      image: s.image ?? null,
      isActive: true,
      isFeatured: Boolean(s.isFeatured),
      categoryId: category.id,
      hotelId: hotel.id,
    };
    if (existing) {
      await prisma.service.update({ where: { id: existing.id }, data });
    } else {
      await prisma.service.create({ data });
    }
  }
  console.log(`Services upserted: ${SERVICES.length}.`);

  console.log("\nAll set. Visit:");
  console.log(`  Marketing demo: http://localhost:3000/g/${HOTEL.slug}`);
  console.log(`  First room:     http://localhost:3000/g/${HOTEL.slug}/${ROOMS[0].code}`);
  console.log(`  Hotel info hub: http://localhost:3000/g/${HOTEL.slug}/${ROOMS[0].code}/info`);
}

run()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
