export const demoCategories = [
  { name: "Room Service", slug: "room-service", icon: "Utensils", order: 1 },
  { name: "Housekeeping", slug: "housekeeping", icon: "Sparkles", order: 2 },
  { name: "Transport", slug: "transport", icon: "Car", order: 3 },
  { name: "Maintenance", slug: "maintenance", icon: "Wrench", order: 4 },
  { name: "Info", slug: "info", icon: "Info", order: 5 },
]

export const demoRooms = [
  { number: "101", type: "Single", code: "R101" },
  { number: "102", type: "Single", code: "R102" },
  { number: "201", type: "Double", code: "R201" },
  { number: "202", type: "Double", code: "R202" },
  { number: "305", type: "Suite", code: "R305" },
]

export const demoServices = [
  {
    categorySlug: "room-service",
    name: "Club Sandwich",
    description: "Chicken breast, bacon, lettuce, tomato, and fries.",
    price: 18,
    estimatedTime: "20-30 min",
  },
  {
    categorySlug: "room-service",
    name: "Caesar Salad",
    description: "Romaine lettuce, parmesan, croutons.",
    price: 14,
    estimatedTime: "15-20 min",
  },
  {
    categorySlug: "housekeeping",
    name: "Extra Towels",
    description: "Fresh towels delivered to your room.",
    price: null,
    estimatedTime: "5-10 min",
  },
  {
    categorySlug: "transport",
    name: "Airport Transfer",
    description: "Private transfer booking with reception.",
    price: 45,
    estimatedTime: "Scheduled",
  },
  {
    categorySlug: "maintenance",
    name: "AC Check",
    description: "A technician will visit your room.",
    price: null,
    estimatedTime: "10-20 min",
  },
]
