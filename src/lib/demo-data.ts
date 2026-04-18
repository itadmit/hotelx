/** Unsplash — food & hotel imagery, cropped width for fast loads */
const U = (photoPath: string) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=900&q=82`;

/**
 * Root categories first, then children (must reference existing `parentSlug`).
 * Room service sub-menus live under `room-service` only.
 */
export const demoCategories: Array<{
  name: string;
  slug: string;
  icon: string;
  order: number;
  parentSlug?: string | null;
}> = [
  { name: "שירות חדרים", slug: "room-service", icon: "Utensils", order: 1 },
  { name: "Housekeeping", slug: "housekeeping", icon: "Sparkles", order: 10 },
  { name: "Transport", slug: "transport", icon: "Car", order: 11 },
  { name: "Maintenance", slug: "maintenance", icon: "Wrench", order: 12 },
  {
    name: "Guest services",
    slug: "guest-services",
    icon: "ConciergeBell",
    order: 13,
  },
  { name: "Info", slug: "info", icon: "Info", order: 14 },
  // תתי-קטגוריות תחת שירות חדרים
  {
    name: "ארוחות בוקר",
    slug: "room-breakfast",
    icon: "Coffee",
    order: 1,
    parentSlug: "room-service",
  },
  {
    name: "מנה ראשונה",
    slug: "room-starter",
    icon: "Salad",
    order: 2,
    parentSlug: "room-service",
  },
  {
    name: "מנה עיקרית",
    slug: "room-main",
    icon: "UtensilsCrossed",
    order: 3,
    parentSlug: "room-service",
  },
  {
    name: "קינוחים",
    slug: "room-desserts",
    icon: "IceCream",
    order: 4,
    parentSlug: "room-service",
  },
  {
    name: "שתייה",
    slug: "room-beverages",
    icon: "Wine",
    order: 5,
    parentSlug: "room-service",
  },
];

export const demoRooms = [
  { number: "101", type: "Single", code: "R101" },
  { number: "102", type: "Single", code: "R102" },
  { number: "201", type: "Double", code: "R201" },
  { number: "202", type: "Double", code: "R202" },
  { number: "305", type: "Suite", code: "R305" },
];

export const demoServices: Array<{
  categorySlug: string;
  name: string;
  description: string;
  price: number | null;
  estimatedTime: string;
  requirePayment: boolean;
  image?: string | null;
}> = [
  // ארוחות בוקר
  {
    categorySlug: "room-breakfast",
    name: "Continental breakfast",
    description: "Pastries, seasonal fruit, yogurt, juice, and coffee.",
    price: 24,
    estimatedTime: "25–35 min",
    requirePayment: false,
    image: U("photo-1533089860891-a7c6f0a88666"),
  },
  {
    categorySlug: "room-breakfast",
    name: "Avocado toast & eggs",
    description: "Sourdough, smashed avocado, poached eggs, chili flakes.",
    price: 16,
    estimatedTime: "20–30 min",
    requirePayment: false,
    image: U("photo-1525351484163-7529414344d8"),
  },
  {
    categorySlug: "room-breakfast",
    name: "Barista coffee service",
    description: "Two cappuccinos or lattes with oat or whole milk.",
    price: 12,
    estimatedTime: "15–20 min",
    requirePayment: false,
    image: U("photo-1495474472287-4d71bcdd2085"),
  },
  {
    categorySlug: "room-breakfast",
    name: "Fresh juice flight",
    description: "Orange, green apple–mint, and watermelon.",
    price: 14,
    estimatedTime: "10–15 min",
    requirePayment: false,
    image: U("photo-1622597467836-f3285f2131b8"),
  },
  // מנה ראשונה
  {
    categorySlug: "room-starter",
    name: "Caesar salad",
    description: "Romaine, parmesan, anchovy dressing, garlic croutons.",
    price: 14,
    estimatedTime: "15–20 min",
    requirePayment: false,
    image: U("photo-1546793665-c74683f339c1"),
  },
  {
    categorySlug: "room-starter",
    name: "Seasonal hummus trio",
    description: "Beet, classic chickpea, roasted red pepper, warm pita.",
    price: 15,
    estimatedTime: "12–18 min",
    requirePayment: false,
    image: U("photo-1577801252693-51faefbceb65"),
  },
  {
    categorySlug: "room-starter",
    name: "Artisan cheese board",
    description: "Three cheeses, honeycomb, grapes, crackers, cornichons.",
    price: 34,
    estimatedTime: "15–25 min",
    requirePayment: false,
    image: U("photo-1486297678162-eb2a19b0a32d"),
  },
  // מנה עיקרית
  {
    categorySlug: "room-main",
    name: "Club sandwich",
    description: "Chicken breast, bacon, lettuce, tomato, and fries.",
    price: 18,
    estimatedTime: "20–30 min",
    requirePayment: false,
    image: U("photo-1528735602780-2552fd46c7af"),
  },
  {
    categorySlug: "room-main",
    name: "Grilled Atlantic salmon",
    description: "Herb butter, lemon, seasonal vegetables, baby potatoes.",
    price: 32,
    estimatedTime: "30–40 min",
    requirePayment: false,
    image: U("photo-1467003909585-2f8a72700288"),
  },
  {
    categorySlug: "room-main",
    name: "Steak frites",
    description: "Prime strip, maître d’ butter, hand-cut fries, bordelaise.",
    price: 42,
    estimatedTime: "35–45 min",
    requirePayment: true,
    image: U("photo-1546833999-b9f581a1996d"),
  },
  {
    categorySlug: "room-main",
    name: "Truffle risotto",
    description: "Carnaroli rice, black truffle, parmesan, chives.",
    price: 28,
    estimatedTime: "25–35 min",
    requirePayment: false,
    image: U("photo-1476124369491-e7add44a9f24"),
  },
  {
    categorySlug: "room-main",
    name: "Truffle fries & aioli",
    description: "Crispy fries, black truffle salt, garlic aioli.",
    price: 12,
    estimatedTime: "15–20 min",
    requirePayment: false,
    image: U("photo-1573080496989-a02c924033d6"),
  },
  // קינוחים
  {
    categorySlug: "room-desserts",
    name: "Valrhona chocolate soufflé",
    description: "Baked to order, vanilla anglaise, cocoa nib crunch.",
    price: 16,
    estimatedTime: "25–30 min",
    requirePayment: false,
    image: U("photo-1551024506-0bccd828d307"),
  },
  {
    categorySlug: "room-desserts",
    name: "Seasonal fruit & sorbet",
    description: "Chef’s cut fruit, house sorbet, mint.",
    price: 12,
    estimatedTime: "10–15 min",
    requirePayment: false,
    image: U("photo-1619566636858-adf3ef46400b"),
  },
  {
    categorySlug: "room-desserts",
    name: "Macaron selection",
    description: "Six flavors — pistachio, rose, chocolate, lemon, vanilla, raspberry.",
    price: 18,
    estimatedTime: "10–15 min",
    requirePayment: false,
    image: U("photo-1558326567-98ae24055966"),
  },
  // שתייה
  {
    categorySlug: "room-beverages",
    name: "Champagne & strawberries",
    description: "Chilled Veuve Clicquot, fresh strawberries, two flutes.",
    price: 48,
    estimatedTime: "15–20 min",
    requirePayment: true,
    image: U("photo-1513558161293-cdaf765ed2fd"),
  },
  {
    categorySlug: "room-beverages",
    name: "Classic cocktail duo",
    description: "Negroni & old fashioned, hand-cut ice, orange oils.",
    price: 26,
    estimatedTime: "15–20 min",
    requirePayment: false,
    image: U("photo-1514362545857-f93ecc935e35"),
  },
  {
    categorySlug: "room-beverages",
    name: "Zero-proof spritz set",
    description: "Two seasonal spritzes — botanical, citrus, soda.",
    price: 16,
    estimatedTime: "10–15 min",
    requirePayment: false,
    image: U("photo-1558642452-9a2b7cd541d5"),
  },
  {
    categorySlug: "room-beverages",
    name: "Still & sparkling water",
    description: "Two glass bottles, chilled with lime wheels.",
    price: 8,
    estimatedTime: "5–10 min",
    requirePayment: false,
    image: U("photo-1548839140-29a749e1cf4d"),
  },
  // Other departments
  {
    categorySlug: "housekeeping",
    name: "Extra towels & robes",
    description: "Plush bath sheets and two waffle robes.",
    price: null,
    estimatedTime: "10–15 min",
    requirePayment: false,
    image: U("photo-1582719478250-c89cae4dc85b"),
  },
  {
    categorySlug: "housekeeping",
    name: "Turndown & pillow menu",
    description: "Evening refresh, lavender mist, your choice of pillows.",
    price: null,
    estimatedTime: "20–30 min",
    requirePayment: false,
    image: U("photo-1631049307264-da0ec9d49404"),
  },
  {
    categorySlug: "transport",
    name: "Airport transfer",
    description: "Private sedan — book departure with reception.",
    price: 65,
    estimatedTime: "Scheduled",
    requirePayment: true,
    image: U("photo-1449965408869-eaa3f722e40d"),
  },
  {
    categorySlug: "maintenance",
    name: "AC & climate check",
    description: "Engineering visit to optimize temperature and airflow.",
    price: null,
    estimatedTime: "15–25 min",
    requirePayment: false,
    image: U("photo-1581094794329-c8112a89af12"),
  },
  {
    categorySlug: "guest-services",
    name: "Pressing & steaming",
    description: "Same-day garment care, hung in wardrobe.",
    price: 22,
    estimatedTime: "4–6 hrs",
    requirePayment: false,
    image: U("photo-1582735689369-4fe89db7114c"),
  },
  {
    categorySlug: "info",
    name: "Local dining guide",
    description: "Curated map and reservations help from concierge.",
    price: null,
    estimatedTime: "Instant",
    requirePayment: false,
    image: U("photo-1414235077428-338989a2e8c0"),
  },
];
