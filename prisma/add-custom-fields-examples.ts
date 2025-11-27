import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find services by name and add custom fields
  
  // 1. In-Room Breakfast
  const breakfast = await prisma.service.findFirst({
    where: { name: 'In-Room Breakfast' }
  });
  
  if (breakfast) {
    await prisma.serviceCustomField.createMany({
      data: [
        {
          serviceId: breakfast.id,
          label: 'Egg Style',
          fieldType: 'RADIO',
          options: JSON.stringify(['Scrambled', 'Fried', 'Boiled', 'Poached']),
          isRequired: true,
          order: 0,
        },
        {
          serviceId: breakfast.id,
          label: 'Bread Selection',
          fieldType: 'CHECKBOX',
          options: JSON.stringify(['White Toast', 'Whole Wheat', 'Croissant', 'Bagel']),
          isRequired: false,
          order: 1,
        },
        {
          serviceId: breakfast.id,
          label: 'Beverage',
          fieldType: 'SELECT',
          options: JSON.stringify(['Coffee', 'Tea', 'Orange Juice', 'Milk', 'Water']),
          isRequired: true,
          order: 2,
        },
      ],
    });
    console.log('✅ Added custom fields to In-Room Breakfast');
  }

  // 2. Extra Pillows
  const pillows = await prisma.service.findFirst({
    where: { name: 'Extra Pillows' }
  });
  
  if (pillows) {
    await prisma.serviceCustomField.createMany({
      data: [
        {
          serviceId: pillows.id,
          label: 'Pillow Type',
          fieldType: 'RADIO',
          options: JSON.stringify(['Soft', 'Medium', 'Firm']),
          isRequired: true,
          order: 0,
        },
        {
          serviceId: pillows.id,
          label: 'Pillow Size',
          fieldType: 'SELECT',
          options: JSON.stringify(['Standard', 'Queen', 'King']),
          isRequired: false,
          order: 1,
        },
      ],
    });
    console.log('✅ Added custom fields to Extra Pillows');
  }

  // 3. Club Sandwich
  const sandwich = await prisma.service.findFirst({
    where: { name: 'Club Sandwich' }
  });
  
  if (sandwich) {
    await prisma.serviceCustomField.createMany({
      data: [
        {
          serviceId: sandwich.id,
          label: 'Bread Type',
          fieldType: 'RADIO',
          options: JSON.stringify(['White', 'Whole Wheat', 'Sourdough']),
          isRequired: true,
          order: 0,
        },
        {
          serviceId: sandwich.id,
          label: 'Remove Ingredients',
          fieldType: 'CHECKBOX',
          options: JSON.stringify(['Mayo', 'Bacon', 'Tomato', 'Lettuce']),
          isRequired: false,
          order: 1,
        },
        {
          serviceId: sandwich.id,
          label: 'Add Extras',
          fieldType: 'CHECKBOX',
          options: JSON.stringify(['Avocado', 'Cheese', 'Extra Bacon', 'Pickles']),
          isRequired: false,
          order: 2,
        },
      ],
    });
    console.log('✅ Added custom fields to Club Sandwich');
  }

  // 4. Grilled Salmon
  const salmon = await prisma.service.findFirst({
    where: { name: 'Grilled Salmon' }
  });
  
  if (salmon) {
    await prisma.serviceCustomField.createMany({
      data: [
        {
          serviceId: salmon.id,
          label: 'Cooking Level',
          fieldType: 'RADIO',
          options: JSON.stringify(['Rare', 'Medium', 'Well Done']),
          isRequired: true,
          order: 0,
        },
        {
          serviceId: salmon.id,
          label: 'Side Dish',
          fieldType: 'SELECT',
          options: JSON.stringify(['Rice', 'Mashed Potatoes', 'Grilled Vegetables', 'Salad']),
          isRequired: true,
          order: 1,
        },
      ],
    });
    console.log('✅ Added custom fields to Grilled Salmon');
  }

  // 5. Coffee & Dessert
  const coffee = await prisma.service.findFirst({
    where: { name: 'Coffee & Dessert' }
  });
  
  if (coffee) {
    await prisma.serviceCustomField.createMany({
      data: [
        {
          serviceId: coffee.id,
          label: 'Coffee Type',
          fieldType: 'RADIO',
          options: JSON.stringify(['Espresso', 'Cappuccino', 'Latte', 'Americano']),
          isRequired: true,
          order: 0,
        },
        {
          serviceId: coffee.id,
          label: 'Milk Preference',
          fieldType: 'SELECT',
          options: JSON.stringify(['Regular Milk', 'Soy Milk', 'Almond Milk', 'Oat Milk', 'No Milk']),
          isRequired: false,
          order: 1,
        },
        {
          serviceId: coffee.id,
          label: 'Sugar',
          fieldType: 'SELECT',
          options: JSON.stringify(['No Sugar', '1 Sugar', '2 Sugars', '3 Sugars']),
          isRequired: false,
          order: 2,
        },
      ],
    });
    console.log('✅ Added custom fields to Coffee & Dessert');
  }

  console.log('\n✨ Custom fields added successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



