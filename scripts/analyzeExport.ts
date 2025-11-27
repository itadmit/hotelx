import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/hilton-export.json', 'utf-8'));

console.log('📊 Hilton Hotel Data Analysis:\n');

data.categories.forEach((cat: any, index: number) => {
  console.log(`${index + 1}. ${cat.name}`);
  console.log(`   Icon: ${cat.icon}`);
  console.log(`   Image: ${cat.bgImage}`);
  console.log(`   Services: ${cat.services.length}`);
  console.log(`   Subcategories: ${cat.subcategories.length}`);
  
  if (cat.services.length > 0) {
    console.log('   📌 Services:');
    cat.services.forEach((srv: any) => {
      console.log(`      - ${srv.name} ${srv.price ? `($${srv.price})` : '(Free)'}`);
      console.log(`        Image: ${srv.image || 'None'}`);
      if (srv.customFields && srv.customFields.length > 0) {
        console.log(`        Custom Fields: ${srv.customFields.length}`);
        srv.customFields.forEach((field: any) => {
          console.log(`          • ${field.label} (${field.type})`);
        });
      }
    });
  }
  
  if (cat.subcategories.length > 0) {
    console.log('   📁 Subcategories:');
    cat.subcategories.forEach((sub: any) => {
      console.log(`      - ${sub.name} (${sub.services.length} services)`);
      sub.services.forEach((srv: any) => {
        console.log(`         • ${srv.name} ${srv.price ? `($${srv.price})` : '(Free)'}`);
        if (srv.customFields && srv.customFields.length > 0) {
          console.log(`           Custom Fields: ${srv.customFields.length}`);
        }
      });
    });
  }
  
  console.log('');
});

console.log('\n📈 Total Statistics:');
console.log(`   Categories: ${data.categories.length}`);
console.log(`   Total Services: ${data.categories.reduce((sum: number, cat: any) => sum + cat.services.length, 0)}`);
console.log(`   Total Subcategories: ${data.categories.reduce((sum: number, cat: any) => sum + cat.subcategories.length, 0)}`);

