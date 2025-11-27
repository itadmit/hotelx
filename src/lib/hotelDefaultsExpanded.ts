/**
 * EXPANDED Default categories and services for new hotels
 * Includes more food options, subcategories, spa services, and custom fields
 */

export interface DefaultCustomField {
  label: string;
  type: 'TEXT' | 'NUMBER' | 'SELECT' | 'TEXTAREA' | 'CHECKBOX';
  required: boolean;
  options?: string[];
  order: number;
}

export interface DefaultService {
  name: string;
  description: string;
  price?: number;
  currency?: string;
  estimatedTime: string;
  image: string;
  isRecommended?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  customFields?: DefaultCustomField[];
  translations: {
    [lang: string]: {
      name: string;
      description: string;
    };
  };
}

export interface DefaultSubcategory {
  name: string;
  slug: string;
  icon: string;
  order: number;
  translations: {
    [lang: string]: string;
  };
  services: DefaultService[];
}

export interface DefaultCategory {
  name: string;
  slug: string;
  icon: string;
  bgImage: string;
  order: number;
  translations: {
    [lang: string]: string;
  };
  subcategories?: DefaultSubcategory[];
  services: DefaultService[];
}

export const EXPANDED_DEFAULT_CATEGORIES: DefaultCategory[] = [
  {
    name: 'Food & Drinks',
    slug: 'food-drinks',
    icon: 'UtensilsCrossed',
    bgImage: '/images/food.webp',
    order: 1,
    translations: {
      en: 'Food & Drinks',
      he: 'אוכל ומשקאות',
      ar: 'الطعام والمشروبات',
      bg: 'Храна и напитки',
      de: 'Essen & Getränke',
      fr: 'Nourriture & Boissons',
      it: 'Cibo & Bevande',
      es: 'Comida y Bebidas',
      pt: 'Comida e Bebidas',
      ru: 'Еда и напитки',
      zh: '餐饮服务',
      ja: '飲食サービス',
      ko: '음식 및 음료',
      nl: 'Eten & Drinken',
      pl: 'Jedzenie i napoje'
    },
    subcategories: [
      {
        name: 'Breakfast',
        slug: 'breakfast',
        icon: 'Coffee',
        order: 1,
        translations: {
          en: 'Breakfast',
          he: 'ארוחת בוקר',
          ar: 'فطور',
          bg: 'Закуска',
          de: 'Frühstück',
          fr: 'Petit-déjeuner',
          it: 'Colazione',
          es: 'Desayuno',
          pt: 'Café da manhã',
          ru: 'Завтрак',
          zh: '早餐',
          ja: '朝食',
          ko: '아침',
          nl: 'Ontbijt',
          pl: 'Śniadanie'
        },
        services: [
          {
            name: 'Continental Breakfast',
            description: 'Fresh pastries, fruits, yogurt, juice and coffee',
            price: 18.00,
            currency: 'USD',
            estimatedTime: '20 minutes',
            image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop',
            translations: {
              he: { name: 'ארוחת בוקר קונטיננטלית', description: 'מאפים טריים, פירות, יוגורט, מיץ וקפה' },
              ar: { name: 'فطور قاري', description: 'معجنات طازجة وفواكه ويوגورت وعصير وقهوة' },
              bg: { name: 'Континентална закуска', description: 'Прясна пандишпреция, плодове, кисело мляко, сок и кафе' },
              de: { name: 'Kontinentales Frühstück', description: 'Frisches Gebäck, Obst, Joghurt, Saft und Kaffee' },
              fr: { name: 'Petit-déjeuner continental', description: 'Pâtisseries fraîches, fruits, yaourt, jus et café' },
              it: { name: 'Colazione continentale', description: 'Pasticceria fresca, frutta, yogurt, succo e caffè' },
              es: { name: 'Desayuno continental', description: 'Bollería fresca, frutas, yogur, zumo y café' },
              pt: { name: 'Café da manhã continental', description: 'Doces frescos, frutas, iogurte, suco e café' },
              ru: { name: 'Континентальный завтрак', description: 'Свежая выпечка, фрукты, йогурт, сок и кофе' },
              zh: { name: '欧陆式早餐', description: '新鲜糕点、水果、酸奶、果汁和咖啡' },
              ja: { name: 'コンチネンタルブレックファースト', description: '新鮮なペストリー、フルーツ、ヨーグルト、ジュース、コーヒー' },
              ko: { name: '컨티넨탈 조식', description: '신선한 페이스트리, 과일, 요거트, 주스, 커피' },
              nl: { name: 'Continentaal ontbijt', description: 'Vers gebak, fruit, yoghurt, sap en koffie' },
              pl: { name: 'Śniadanie kontynentalne', description: 'Świeże wypieki, owoce, jogurt, sok i kawa' }
            }
          },
          {
            name: 'American Breakfast',
            description: 'Eggs, bacon, sausage, toast, hash browns, juice and coffee',
            price: 22.00,
            currency: 'USD',
            estimatedTime: '25 minutes',
            image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&auto=format&fit=crop',
            customFields: [
              {
                label: 'Egg Style',
                type: 'SELECT',
                required: true,
                options: ['Scrambled', 'Fried', 'Poached', 'Omelette'],
                order: 1
              },
              {
                label: 'Toast Type',
                type: 'SELECT',
                required: false,
                options: ['White', 'Whole Wheat', 'Sourdough', 'Rye'],
                order: 2
              }
            ],
            translations: {
              he: { name: 'ארוחת בוקר אמריקאית', description: 'ביצים, בייקון, נקניק, טוסט, תפוחי אדמה, מיץ וקפה' },
              ar: { name: 'فطور أمريكي', description: 'بيض ولحم مقدد وسجق وخبز محمص وبطاطس مقلية وعصير وقهوة' },
              de: { name: 'Amerikanisches Frühstück', description: 'Eier, Speck, Wurst, Toast, Bratkartoffeln, Saft und Kaffee' },
              fr: { name: 'Petit-déjeuner américain', description: 'Œufs, bacon, saucisse, toast, pommes de terre rissolées, jus et café' },
              es: { name: 'Desayuno americano', description: 'Huevos, tocino, salchicha, tostadas, patatas fritas, zumo y café' },
              ru: { name: 'Американский завтрак', description: 'Яйца, бекон, колбаса, тост, жареный картофель, сок и кофе' },
              zh: { name: '美式早餐', description: '鸡蛋、培根、香肠、吐司、薯饼、果汁和咖啡' },
            }
          },
          {
            name: 'Healthy Breakfast Bowl',
            description: 'Acai bowl with granola, fresh berries and honey',
            price: 16.00,
            currency: 'USD',
            estimatedTime: '15 minutes',
            image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop',
            isVegetarian: true,
            isVegan: true,
            isRecommended: true,
            translations: {
              he: { name: 'קערת בוקר בריאה', description: 'קערת אסאי עם גרנולה, פירות יער טריים ודבש' },
              ar: { name: 'وعاء إفطار صحي', description: 'وعاء أساي مع جرانولا وتوت طازج وعسل' },
              de: { name: 'Gesunde Frühstücksschale', description: 'Acai-Bowl mit Granola, frischen Beeren und Honig' },
              fr: { name: 'Bol petit-déjeuner sain', description: 'Bol d\'açai avec granola, baies fraîches et miel' },
              es: { name: 'Bowl saludable de desayuno', description: 'Bowl de açai con granola, bayas frescas y miel' },
              ru: { name: 'Здоровая чаша для завтрака', description: 'Чаша асаи с гранолой, свежими ягодами и медом' },
              zh: { name: '健康早餐碗', description: '巴西莓碗配格兰诺拉麦片、新鲜浆果和蜂蜜' },
            }
          }
        ]
      },
      {
        name: 'Main Dishes',
        slug: 'main-dishes',
        icon: 'ChefHat',
        order: 2,
        translations: {
          en: 'Main Dishes',
          he: 'מנות עיקריות',
          ar: 'أطباق رئيسية',
          bg: 'Основни ястия',
          de: 'Hauptgerichte',
          fr: 'Plats principaux',
          it: 'Piatti principali',
          es: 'Platos principales',
          pt: 'Pratos principais',
          ru: 'Основные блюда',
          zh: '主菜',
          ja: 'メインディッシュ',
          ko: '메인 요리',
          nl: 'Hoofdgerechten',
          pl: 'Dania główne'
        },
        services: [
          {
            name: 'Grilled Salmon',
            description: 'Fresh Atlantic salmon with seasonal vegetables and lemon butter sauce',
            price: 32.00,
            currency: 'USD',
            estimatedTime: '35 minutes',
            image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop',
            translations: {
              he: { name: 'סלמון צלוי', description: 'סלמון אטלנטי טרי עם ירקות עונתיים ורוטב חמאה-לימון' },
              ar: { name: 'سلمون مشوي', description: 'سلمون أطلسي طازج مع خضروات موسمية وصلصة زبدة الليمون' },
              de: { name: 'Gegrillter Lachs', description: 'Frischer Atlantiklachs mit saisonalem Gemüse und Zitronenbutter' },
              fr: { name: 'Saumon grillé', description: 'Saumon atlantique frais avec légumes de saison et beurre citronné' },
              es: { name: 'Salmón a la parrilla', description: 'Salmón atlántico fresco con verduras de temporada y salsa de mantequilla de limón' },
              ru: { name: 'Лосось на гриле', description: 'Свежий атлантический лосось с сезонными овощами и лимонным маслом' },
              zh: { name: '烤三文鱼', description: '新鲜大西洋三文鱼配时令蔬菜和柠檬黄油酱' },
            }
          },
          {
            name: 'Beef Tenderloin',
            description: 'Premium beef tenderloin with mashed potatoes and mushroom sauce',
            price: 42.00,
            currency: 'USD',
            estimatedTime: '40 minutes',
            image: 'https://images.unsplash.com/photo-1558030137-a2cfa6c56fc5?w=800&auto=format&fit=crop',
            isRecommended: true,
            translations: {
              he: { name: 'פילה בקר', description: 'פילה בקר פרימיום עם פירה ורוטב פטריות' },
              ar: { name: 'فيليه لحم البقر', description: 'فيليه لحم بقري فاخر مع بطاطس مهروسة وصلصة الفطر' },
              de: { name: 'Rinderfilet', description: 'Premium Rinderfilet mit Kartoffelpüree und Pilzsauce' },
              fr: { name: 'Filet de bœuf', description: 'Filet de bœuf premium avec purée de pommes de terre et sauce aux champignons' },
              es: { name: 'Lomo de ternera', description: 'Lomo de ternera premium con puré de patatas y salsa de champiñones' },
              ru: { name: 'Говяжья вырезка', description: 'Премиум говяжья вырезка с картофельным пюре и грибным соусом' },
              zh: { name: '牛里脊', description: '优质牛里脊配土豆泥和蘑菇酱' },
            }
          },
          {
            name: 'Vegetarian Pasta',
            description: 'Penne pasta with roasted vegetables in tomato sauce',
            price: 24.00,
            currency: 'USD',
            estimatedTime: '25 minutes',
            image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop',
            isVegetarian: true,
            translations: {
              he: { name: 'פסטה צמחונית', description: 'פסטה פנה עם ירקות צלויים ברוטב עגבניות' },
              ar: { name: 'باستا نباتية', description: 'معكرونة بيني مع خضروات محمصة في صلصة الطماطم' },
              de: { name: 'Vegetarische Pasta', description: 'Penne-Nudeln mit geröstetem Gemüse in Tomatensauce' },
              fr: { name: 'Pâtes végétariennes', description: 'Penne avec légumes rôtis dans une sauce tomate' },
              es: { name: 'Pasta vegetariana', description: 'Pasta penne con verduras asadas en salsa de tomate' },
              ru: { name: 'Вегетарианская паста', description: 'Паста пенне с жареными овощами в томатном соусе' },
              zh: { name: '素食意面', description: '通心粉配烤蔬菜和番茄酱' },
            }
          }
        ]
      },
      {
        name: 'Beverages',
        slug: 'beverages',
        icon: 'Wine',
        order: 3,
        translations: {
          en: 'Beverages',
          he: 'משקאות',
          ar: 'مشروبات',
          bg: 'Напитки',
          de: 'Getränke',
          fr: 'Boissons',
          it: 'Bevande',
          es: 'Bebidas',
          pt: 'Bebidas',
          ru: 'Напитки',
          zh: '饮品',
          ja: '飲み物',
          ko: '음료',
          nl: 'Dranken',
          pl: 'Napoje'
        },
        services: [
          {
            name: 'Fresh Orange Juice',
            description: 'Freshly squeezed orange juice',
            price: 8.00,
            currency: 'USD',
            estimatedTime: '5 minutes',
            image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&auto=format&fit=crop',
            isVegan: true,
            translations: {
              he: { name: 'מיץ תפוזים טרי', description: 'מיץ תפוזים סחוט טרי' },
              ar: { name: 'عصير برتقال طازج', description: 'عصير برتقال طازج معصور' },
              de: { name: 'Frischer Orangensaft', description: 'Frisch gepresster Orangensaft' },
              fr: { name: 'Jus d\'orange frais', description: 'Jus d\'orange fraîchement pressé' },
              es: { name: 'Jugo de naranja fresco', description: 'Jugo de naranja recién exprimido' },
              ru: { name: 'Свежий апельсиновый сок', description: 'Свежевыжатый апельсиновый сок' },
              zh: { name: '鲜榨橙汁', description: '新鲜榨取的橙汁' },
            }
          },
          {
            name: 'Cappuccino',
            description: 'Italian espresso with steamed milk and foam',
            price: 6.00,
            currency: 'USD',
            estimatedTime: '5 minutes',
            image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop',
            translations: {
              he: { name: 'קפוצ\'ינו', description: 'אספרסו איטלקי עם חלב מוקצף' },
              ar: { name: 'كابتشينو', description: 'إسبريسو إيطالي مع حليب مبخر ورغوة' },
              de: { name: 'Cappuccino', description: 'Italienischer Espresso mit aufgeschäumter Milch' },
              fr: { name: 'Cappuccino', description: 'Espresso italien avec lait moussé' },
              es: { name: 'Capuchino', description: 'Espresso italiano con leche espumada' },
              ru: { name: 'Капучино', description: 'Итальянский эспрессо с паровым молоком и пеной' },
              zh: { name: '卡布奇诺', description: '意大利浓缩咖啡配蒸奶和奶泡' },
            }
          }
        ]
      },
      {
        name: 'Desserts',
        slug: 'desserts',
        icon: 'Cake',
        order: 4,
        translations: {
          en: 'Desserts',
          he: 'קינוחים',
          ar: 'حلويات',
          bg: 'Десерти',
          de: 'Desserts',
          fr: 'Desserts',
          it: 'Dolci',
          es: 'Postres',
          pt: 'Sobremesas',
          ru: 'Десерты',
          zh: '甜点',
          ja: 'デザート',
          ko: '디저트',
          nl: 'Desserts',
          pl: 'Desery'
        },
        services: [
          {
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with molten center, vanilla ice cream',
            price: 14.00,
            currency: 'USD',
            estimatedTime: '15 minutes',
            image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop',
            isRecommended: true,
            translations: {
              he: { name: 'עוגת שוקולד לבה', description: 'עוגת שוקולד חמה עם מרכז נוזלי וגלידת וניל' },
              ar: { name: 'كعكة الشوكولاتة البركانية', description: 'كعكة شوكولاتة دافئة مع مركز منصهر وآيس كريم الفانيليا' },
              de: { name: 'Schokoladen-Lava-Kuchen', description: 'Warmer Schokoladenkuchen mit flüssigem Kern und Vanilleeis' },
              fr: { name: 'Fondant au chocolat', description: 'Gâteau au chocolat chaud avec cœur coulant et glace vanille' },
              es: { name: 'Volcán de chocolate', description: 'Pastel de chocolate caliente con centro fundido y helado de vainilla' },
              ru: { name: 'Шоколадный лавовый торт', description: 'Теплый шоколадный торт с жидкой начинкой и ванильным мороженым' },
              zh: { name: '熔岩巧克力蛋糕', description: '温热巧克力蛋糕配流心和香草冰淇淋' },
            }
          },
          {
            name: 'Fresh Fruit Platter',
            description: 'Selection of seasonal fresh fruits',
            price: 12.00,
            currency: 'USD',
            estimatedTime: '10 minutes',
            image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop',
            isVegan: true,
            translations: {
              he: { name: 'מגש פירות טריים', description: 'מבחר פירות עונתיים טריים' },
              ar: { name: 'طبق فواكه طازجة', description: 'مجموعة من الفواكه الطازجة الموسمية' },
              de: { name: 'Frische Obstplatte', description: 'Auswahl an saisonalen frischen Früchten' },
              fr: { name: 'Plateau de fruits frais', description: 'Sélection de fruits frais de saison' },
              es: { name: 'Bandeja de frutas frescas', description: 'Selección de frutas frescas de temporada' },
              ru: { name: 'Тарелка свежих фруктов', description: 'Выбор сезонных свежих фруктов' },
              zh: { name: '新鲜水果拼盘', description: '精选时令新鲜水果' },
            }
          }
        ]
      }
    ],
    services: []
  },
  {
    name: 'Room Service',
    slug: 'room-service',
    icon: 'BedDouble',
    bgImage: '/images/room_service.webp',
    order: 2,
    translations: {
      en: 'Room Service',
      he: 'שירות חדרים',
      ar: 'خدمة الغرف',
      bg: 'Стайно обслужване',
      de: 'Zimmerservice',
      fr: 'Service de chambre',
      it: 'Servizio in camera',
      es: 'Servicio de habitaciones',
      pt: 'Serviço de quarto',
      ru: 'Обслуживание номеров',
      zh: '客房服务',
      ja: 'ルームサービス',
      ko: '룸 서비스',
      nl: 'Kamerservice',
      pl: 'Obsługa pokoju'
    },
    services: [
      {
        name: 'Room Cleaning',
        description: 'Complete room cleaning and bed making',
        estimatedTime: '45 minutes',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'ניקוי חדר', description: 'ניקוי חדר מלא והחלפת מצעים' },
          ar: { name: 'تنظيف الغرفة', description: 'تنظيف شامل للغرفة وترتيب السرير' },
          bg: { name: 'Почистване на стаята', description: 'Пълно почистване и смяна на спалното бельо' },
          de: { name: 'Zimmerreinigung', description: 'Komplette Zimmerreinigung und Betten machen' },
          fr: { name: 'Nettoyage de chambre', description: 'Nettoyage complet et préparation du lit' },
          it: { name: 'Pulizia camera', description: 'Pulizia completa e rifacimento del letto' },
          es: { name: 'Limpieza de habitación', description: 'Limpieza completa y arreglo de cama' },
          pt: { name: 'Limpeza do quarto', description: 'Limpeza completa e arrumação da cama' },
          ru: { name: 'Уборка номера', description: 'Полная уборка и смена постельного белья' },
          zh: { name: '客房清洁', description: '全面清洁和整理床铺' },
          ja: { name: '客室清掃', description: '完全な客室清掃とベッドメイキング' },
          ko: { name: '객실 청소', description: '완전한 객실 청소 및 침대 정리' },
          nl: { name: 'Kamerreiniging', description: 'Volledige kamerreiniging en bed opmaken' },
          pl: { name: 'Sprzątanie pokoju', description: 'Kompleksowe sprzątanie i ścielenie łóżka' }
        }
      },
      {
        name: 'Fresh Towels',
        description: 'Set of fresh bath towels and linens',
        estimatedTime: '10 minutes',
        image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'מגבות טריות', description: 'סט מגבות אמבטיה טריות' },
          ar: { name: 'مناشف نظيفة', description: 'مجموعة مناشف حمام نظيفة' },
          bg: { name: 'Свежи кърпи', description: 'Комплект свежи хавлиени кърпи' },
          de: { name: 'Frische Handtücher', description: 'Set frischer Handtücher und Bettwäsche' },
          fr: { name: 'Serviettes fraîches', description: 'Ensemble de serviettes de bain fraîches' },
          it: { name: 'Asciugamani freschi', description: 'Set di asciugamani da bagno freschi' },
          es: { name: 'Toallas frescas', description: 'Juego de toallas de baño frescas' },
          pt: { name: 'Toalhas frescas', description: 'Conjunto de toalhas de banho frescas' },
          ru: { name: 'Свежие полотенца', description: 'Набор свежих полотенец' },
          zh: { name: '新鲜毛巾', description: '一套新鲜的浴巾' },
          ja: { name: '新しいタオル', description: '新しいバスタオルセット' },
          ko: { name: '새 수건', description: '새 목욕 수건 세트' },
          nl: { name: 'Verse handdoeken', description: 'Set verse handdoeken' },
          pl: { name: 'Świeże ręczniki', description: 'Zestaw świeżych ręczników' }
        }
      },
      {
        name: 'Extra Pillows',
        description: 'Additional comfortable pillows',
        estimatedTime: '10 minutes',
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'כריות נוספות', description: 'כריות נוחות נוספות' },
          ar: { name: 'وسائد إضافية', description: 'وسائد مريحة إضافية' },
          bg: { name: 'Допълнителни възглавници', description: 'Допълнителни удобни възглавници' },
          de: { name: 'Extra Kissen', description: 'Zusätzliche bequeme Kissen' },
          fr: { name: 'Oreillers supplémentaires', description: 'Oreillers confortables supplémentaires' },
          it: { name: 'Cuscini extra', description: 'Cuscini comodi aggiuntivi' },
          es: { name: 'Almohadas extra', description: 'Almohadas cómodas adicionales' },
          pt: { name: 'Travesseiros extras', description: 'Travesseiros confortáveis adicionais' },
          ru: { name: 'Дополнительные подушки', description: 'Дополнительные удобные подушки' },
          zh: { name: '额外枕头', description: '额外的舒适枕头' },
          ja: { name: '追加の枕', description: '追加の快適な枕' },
          ko: { name: '추가 베개', description: '추가 편안한 베개' },
          nl: { name: 'Extra kussens', description: 'Extra comfortabele kussens' },
          pl: { name: 'Dodatkowe poduszki', description: 'Dodatkowe wygodne poduszki' }
        }
      },
      {
        name: 'Extra Blankets',
        description: 'Additional warm blankets',
        estimatedTime: '10 minutes',
        image: 'https://images.unsplash.com/photo-1631679706270-7e5a7f0f4733?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'שמיכות נוספות', description: 'שמיכות חמות נוספות' },
          ar: { name: 'بطانيات إضافية', description: 'بطانيات دافئة إضافية' },
          bg: { name: 'Допълнителни одеяла', description: 'Допълнителни топли одеяла' },
          de: { name: 'Extra Decken', description: 'Zusätzliche warme Decken' },
          fr: { name: 'Couvertures supplémentaires', description: 'Couvertures chaudes supplémentaires' },
          it: { name: 'Coperte extra', description: 'Coperte calde aggiuntive' },
          es: { name: 'Mantas extra', description: 'Mantas cálidas adicionales' },
          pt: { name: 'Cobertores extras', description: 'Cobertores quentes adicionais' },
          ru: { name: 'Дополнительные одеяла', description: 'Дополнительные теплые одеяла' },
          zh: { name: '额外毯子', description: '额外的温暖毯子' },
          ja: { name: '追加の毛布', description: '追加の暖かい毛布' },
          ko: { name: '추가 담요', description: '추가 따뜻한 담요' },
          nl: { name: 'Extra dekens', description: 'Extra warme dekens' },
          pl: { name: 'Dodatkowe koce', description: 'Dodatkowe ciepłe koce' }
        }
      }
    ]
  },
  {
    name: 'Spa & Wellness',
    slug: 'spa-wellness',
    icon: 'Sparkles',
    bgImage: '/images/spa.webp',
    order: 3,
    translations: {
      en: 'Spa & Wellness',
      he: 'ספא ובריאות',
      ar: 'سبا وصحة',
      bg: 'Спа и уелнес',
      de: 'Spa & Wellness',
      fr: 'Spa & Bien-être',
      it: 'Spa & Benessere',
      es: 'Spa y Bienestar',
      pt: 'Spa e Bem-estar',
      ru: 'Спа и велнес',
      zh: '水疗养生',
      ja: 'スパ＆ウェルネス',
      ko: '스파 및 웰니스',
      nl: 'Spa & Wellness',
      pl: 'Spa i wellness'
    },
    services: [
      {
        name: 'Swedish Massage',
        description: '60-minute full body Swedish massage',
        price: 110.00,
        currency: 'USD',
        estimatedTime: '60 minutes',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop',
        isRecommended: true,
        translations: {
          he: { name: 'עיסוי שוודי', description: 'עיסוי גוף מלא שוודי למשך 60 דקות' },
          ar: { name: 'تدليك سويدي', description: 'تدليك سويدي كامل للجسم لمدة 60 دقيقة' },
          bg: { name: 'Шведски масаж', description: '60-минутен шведски масаж на цялото тяло' },
          de: { name: 'Schwedische Massage', description: '60-minütige Ganzkörper-Schwedenmassage' },
          fr: { name: 'Massage suédois', description: 'Massage suédois complet du corps de 60 minutes' },
          it: { name: 'Massaggio svedese', description: 'Massaggio svedese corpo completo di 60 minuti' },
          es: { name: 'Masaje sueco', description: 'Masaje sueco de cuerpo completo de 60 minutos' },
          pt: { name: 'Massagem sueca', description: 'Massagem sueca corporal completa de 60 minutos' },
          ru: { name: 'Шведский массаж', description: '60-минутный шведский массаж всего тела' },
          zh: { name: '瑞典式按摩', description: '60分钟全身瑞典式按摩' },
          ja: { name: 'スウェーデン式マッサージ', description: '60分間の全身スウェーデン式マッサージ' },
          ko: { name: '스웨덴식 마사지', description: '60분 전신 스웨덴식 마사지' },
          nl: { name: 'Zweedse massage', description: '60 minuten volledige lichaamsmassage Zweeds' },
          pl: { name: 'Masaż szwedzki', description: '60-minutowy masaż całego ciała szwedzki' }
        }
      },
      {
        name: 'Deep Tissue Massage',
        description: '90-minute deep tissue massage for muscle tension',
        price: 150.00,
        currency: 'USD',
        estimatedTime: '90 minutes',
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'עיסוי רקמות עמוק', description: 'עיסוי רקמות עמוק למתח שרירים למשך 90 דקות' },
          ar: { name: 'تدليك الأنسجة العميقة', description: 'تدليك الأنسجة العميقة لتوتر العضلات لمدة 90 دقيقة' },
          de: { name: 'Tiefengewebe-Massage', description: '90-minütige Tiefengewebe-Massage gegen Muskelverspannungen' },
          fr: { name: 'Massage des tissus profonds', description: 'Massage des tissus profonds de 90 minutes pour les tensions musculaires' },
          es: { name: 'Masaje de tejido profundo', description: 'Masaje de tejido profundo de 90 minutos para la tensión muscular' },
          ru: { name: 'Глубокотканный массаж', description: '90-минутный глубокотканный массаж для мышечного напряжения' },
          zh: { name: '深层组织按摩', description: '90分钟深层组织按摩缓解肌肉紧张' },
        }
      },
      {
        name: 'Facial Treatment',
        description: 'Rejuvenating facial with premium skincare products',
        price: 95.00,
        currency: 'USD',
        estimatedTime: '50 minutes',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'טיפול פנים', description: 'טיפול פנים מחדש עם מוצרי טיפוח פרימיום' },
          ar: { name: 'علاج الوجه', description: 'علاج وجه منعش بمنتجات عناية بالبشرة فاخرة' },
          de: { name: 'Gesichtsbehandlung', description: 'Verjüngende Gesichtsbehandlung mit Premium-Hautpflegeprodukten' },
          fr: { name: 'Soin du visage', description: 'Soin du visage rajeunissant avec des produits haut de gamme' },
          es: { name: 'Tratamiento facial', description: 'Tratamiento facial rejuvenecedor con productos premium' },
          ru: { name: 'Процедура для лица', description: 'Омолаживающая процедура для лица с премиум-продуктами' },
          zh: { name: '面部护理', description: '使用高级护肤产品的焕肤面部护理' },
        }
      },
      {
        name: 'Aromatherapy Massage',
        description: '75-minute aromatherapy massage with essential oils',
        price: 130.00,
        currency: 'USD',
        estimatedTime: '75 minutes',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'עיסוי ארומתרפיה', description: 'עיסוי ארומתרפיה עם שמנים אתריים למשך 75 דקות' },
          ar: { name: 'تدليك العلاج بالروائح', description: 'تدليك العلاج بالروائح مع الزيوت الأساسية لمدة 75 دقيقة' },
          de: { name: 'Aromatherapie-Massage', description: '75-minütige Aromatherapie-Massage mit ätherischen Ölen' },
          fr: { name: 'Massage aromathérapie', description: 'Massage aromathérapie de 75 minutes avec huiles essentielles' },
          es: { name: 'Masaje aromaterapia', description: 'Masaje de aromaterapia de 75 minutos con aceites esenciales' },
          ru: { name: 'Ароматерапевтический массаж', description: '75-минутный ароматерапевтический массаж с эфирными маслами' },
          zh: { name: '芳香疗法按摩', description: '75分钟精油芳香疗法按摩' },
        }
      }
    ]
  },
  {
    name: 'Concierge',
    slug: 'concierge',
    icon: 'Bell',
    bgImage: '/images/Concierge.webp',
    order: 4,
    translations: {
      en: 'Concierge',
      he: 'קונסיירז׳',
      ar: 'الكونسيرج',
      bg: 'Консиерж',
      de: 'Concierge',
      fr: 'Conciergerie',
      it: 'Portineria',
      es: 'Conserjería',
      pt: 'Portaria',
      ru: 'Консьерж',
      zh: '礼宾服务',
      ja: 'コンシェルジュ',
      ko: '컨시어지',
      nl: 'Conciërge',
      pl: 'Concierge'
    },
    services: [
      {
        name: 'Taxi Service',
        description: 'Book a reliable taxi to any destination',
        estimatedTime: '15 minutes',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'שירות מונית', description: 'הזמנת מונית אמינה לכל יעד' },
          ar: { name: 'خدمة التاكسي', description: 'حجز سيارة أجرة موثوقة لأي وجهة' },
          bg: { name: 'Такси услуга', description: 'Резервация на надеждно такси до всяка дестинация' },
          de: { name: 'Taxi-Service', description: 'Zuverlässiges Taxi zu jedem Ziel buchen' },
          fr: { name: 'Service de taxi', description: 'Réserver un taxi fiable vers n\'importe quelle destination' },
          it: { name: 'Servizio taxi', description: 'Prenota un taxi affidabile per qualsiasi destinazione' },
          es: { name: 'Servicio de taxi', description: 'Reservar un taxi confiable a cualquier destino' },
          pt: { name: 'Serviço de táxi', description: 'Reserve um táxi confiável para qualquer destino' },
          ru: { name: 'Служба такси', description: 'Заказать надежное такси в любое место' },
          zh: { name: '出租车服务', description: '预订可靠的出租车到任何目的地' },
          ja: { name: 'タクシーサービス', description: 'どこへでも信頼できるタクシーを予約' },
          ko: { name: '택시 서비스', description: '모든 목적지로 믿을 수 있는 택시 예약' },
          nl: { name: 'Taxiservice', description: 'Boek een betrouwbare taxi naar elke bestemming' },
          pl: { name: 'Usługa taxi', description: 'Rezerwacja niezawodnej taksówki do dowolnego miejsca' }
        }
      },
      {
        name: 'Restaurant Reservation',
        description: 'Book a table at top local restaurants',
        estimatedTime: '20 minutes',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'הזמנת מסעדה', description: 'הזמנת שולחן במסעדות מובילות' },
          ar: { name: 'حجز مطعم', description: 'حجز طاولة في أفضل المطاعم المحلية' },
          de: { name: 'Restaurantreservierung', description: 'Tisch in Top-Restaurants vor Ort reservieren' },
          fr: { name: 'Réservation de restaurant', description: 'Réserver une table dans les meilleurs restaurants locaux' },
          es: { name: 'Reserva de restaurante', description: 'Reservar mesa en los mejores restaurantes locales' },
          ru: { name: 'Бронирование ресторана', description: 'Забронировать столик в лучших местных ресторанах' },
          zh: { name: '餐厅预订', description: '在顶级当地餐厅预订餐桌' },
        }
      }
    ]
  },
  {
    name: 'Maintenance',
    slug: 'maintenance',
    icon: 'Wrench',
    bgImage: '/images/maintance.webp',
    order: 5,
    translations: {
      en: 'Maintenance',
      he: 'תחזוקה',
      ar: 'الصيانة',
      bg: 'Поддръжка',
      de: 'Wartung',
      fr: 'Maintenance',
      it: 'Manutenzione',
      es: 'Mantenimiento',
      pt: 'Manutenção',
      ru: 'Техническое обслуживание',
      zh: '维护服务',
      ja: 'メンテナンス',
      ko: '유지보수',
      nl: 'Onderhoud',
      pl: 'Konserwacja'
    },
    services: [
      {
        name: 'AC Repair',
        description: 'Air conditioning check and repair',
        estimatedTime: '30 minutes',
        image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'תיקון מזגן', description: 'בדיקה ותיקון מערכת המיזוג' },
          ar: { name: 'إصلاح المكيف', description: 'فحص وإصلاח نظام التكييف' },
          bg: { name: 'Ремонт на климатик', description: 'Проверка и ремонт на климатичната система' },
          de: { name: 'Klimaanlagen-Reparatur', description: 'Überprüfung und Reparatur der Klimaanlage' },
          fr: { name: 'Réparation de climatisation', description: 'Vérification et réparation du système de climatisation' },
          it: { name: 'Riparazione aria condizionata', description: 'Controllo e riparazione del sistema di climatizzazione' },
          es: { name: 'Reparación de aire acondicionado', description: 'Revisión y reparación del sistema de aire' },
          pt: { name: 'Reparo de ar condicionado', description: 'Verificação e reparo do sistema de ar condicionado' },
          ru: { name: 'Ремонт кондиционера', description: 'Проверка и ремонт системы кондиционирования' },
          zh: { name: '空调维修', description: '检查和维修空调系统' },
          ja: { name: 'エアコン修理', description: 'エアコンの点検と修理' },
          ko: { name: '에어컨 수리', description: '에어컨 점검 및 수리' },
          nl: { name: 'Airco reparatie', description: 'Controle en reparatie van de airconditioning' },
          pl: { name: 'Naprawa klimatyzacji', description: 'Sprawdzenie i naprawa klimatyzacji' }
        }
      },
      {
        name: 'WiFi Support',
        description: 'Help with internet connectivity',
        estimatedTime: '15 minutes',
        image: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'תמיכה באינטרנט', description: 'עזרה עם חיבור לאינטרנט' },
          ar: { name: 'دعم الواي فاي', description: 'مساعدة في الاتصال بالإنترنت' },
          bg: { name: 'Поддръжка на WiFi', description: 'Помощ с интернет свързаността' },
          de: { name: 'WiFi-Unterstützung', description: 'Hilfe bei der Internetverbindung' },
          fr: { name: 'Support WiFi', description: 'Aide à la connectivité Internet' },
          it: { name: 'Supporto WiFi', description: 'Aiuto con la connettività Internet' },
          es: { name: 'Soporte WiFi', description: 'Ayuda con la conectividad a Internet' },
          pt: { name: 'Suporte WiFi', description: 'Ajuda com conectividade à Internet' },
          ru: { name: 'Поддержка WiFi', description: 'Помощь с подключением к Интернету' },
          zh: { name: 'WiFi支持', description: '互联网连接帮助' },
          ja: { name: 'WiFiサポート', description: 'インターネット接続のサポート' },
          ko: { name: 'WiFi 지원', description: '인터넷 연결 지원' },
          nl: { name: 'WiFi ondersteuning', description: 'Hulp bij internetverbinding' },
          pl: { name: 'Wsparcie WiFi', description: 'Pomoc z połączeniem internetowym' }
        }
      }
    ]
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    icon: 'Tv',
    bgImage: '/images/Entertainment2.webp',
    order: 6,
    translations: {
      en: 'Entertainment',
      he: 'בידור',
      ar: 'ترفيه',
      bg: 'Забавление',
      de: 'Unterhaltung',
      fr: 'Divertissement',
      it: 'Intrattenimento',
      es: 'Entretenimiento',
      pt: 'Entretenimento',
      ru: 'Развлечения',
      zh: '娱乐',
      ja: 'エンターテイメント',
      ko: '엔터테인먼트',
      nl: 'Entertainment',
      pl: 'Rozrywka'
    },
    services: [
      {
        name: 'Movie Rental',
        description: 'Latest movies on-demand in your room',
        price: 8.00,
        currency: 'USD',
        estimatedTime: 'Instant',
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'השכרת סרט', description: 'סרטים חדשים לפי דרישה בחדר' },
          ar: { name: 'تأجير فيلم', description: 'أحدث الأفلام حسب الطلب في غرفتك' },
          bg: { name: 'Наем на филм', description: 'Най-новите филми в стаята ви' },
          de: { name: 'Filmverleih', description: 'Neueste Filme auf Abruf in Ihrem Zimmer' },
          fr: { name: 'Location de film', description: 'Derniers films à la demande dans votre chambre' },
          it: { name: 'Noleggio film', description: 'Ultimi film on-demand nella tua camera' },
          es: { name: 'Alquiler de películas', description: 'Últimas películas bajo demanda en tu habitación' },
          pt: { name: 'Aluguel de filme', description: 'Últimos filmes sob demanda no seu quarto' },
          ru: { name: 'Прокат фильма', description: 'Новейшие фильмы по запросу в вашем номере' },
          zh: { name: '电影租赁', description: '房间内最新点播电影' },
          ja: { name: '映画レンタル', description: 'お部屋で最新のオンデマンド映画' },
          ko: { name: '영화 대여', description: '객실 내 최신 주문형 영화' },
          nl: { name: 'Filmverhuur', description: 'Nieuwste films op aanvraag op uw kamer' },
          pl: { name: 'Wypożyczenie filmu', description: 'Najnowsze filmy na żądanie w pokoju' }
        }
      },
      {
        name: 'Live Music Performance',
        description: 'Enjoy live music at our hotel lounge',
        price: 25.00,
        currency: 'USD',
        estimatedTime: '2 hours',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&auto=format&fit=crop',
        isRecommended: true,
        translations: {
          he: { name: 'הופעה מוזיקלית חיה', description: 'תהנו ממוזיקה חיה בלאונג׳ של המלון' },
          ar: { name: 'أداء موسيقي حي', description: 'استمتع بالموسيقى الحية في صالة الفندق' },
          bg: { name: 'Живо музикално изпълнение', description: 'Насладете се на жива музика в хотелското лоби' },
          de: { name: 'Live-Musik-Performance', description: 'Genießen Sie Live-Musik in unserer Hotel-Lounge' },
          fr: { name: 'Performance musicale en direct', description: 'Profitez de la musique live dans notre salon d\'hôtel' },
          it: { name: 'Esibizione musicale dal vivo', description: 'Goditi la musica dal vivo nella lounge dell\'hotel' },
          es: { name: 'Presentación musical en vivo', description: 'Disfruta de música en vivo en nuestro salón del hotel' },
          pt: { name: 'Apresentação musical ao vivo', description: 'Aproveite música ao vivo no lounge do hotel' },
          ru: { name: 'Живое музыкальное выступление', description: 'Наслаждайтесь живой музыкой в лаундже отеля' },
          zh: { name: '现场音乐表演', description: '在酒店休息室享受现场音乐' },
          ja: { name: 'ライブミュージックパフォーマンス', description: 'ホテルラウンジでライブ音楽をお楽しみください' },
          ko: { name: '라이브 음악 공연', description: '호텔 라운지에서 라이브 음악을 즐기세요' },
          nl: { name: 'Live muziekoptreden', description: 'Geniet van live muziek in onze hotellobby' },
          pl: { name: 'Występ muzyki na żywo', description: 'Ciesz się muzyką na żywo w hotelowym salonie' }
        }
      },
      {
        name: 'Theatre Tickets',
        description: 'Book tickets to local theatre shows and performances',
        price: 50.00,
        currency: 'USD',
        estimatedTime: '30 minutes',
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'כרטיסים לתיאטרון', description: 'הזמנת כרטיסים להצגות ומופעים מקומיים' },
          ar: { name: 'تذاكر المسرح', description: 'حجز تذاكر لعروض المسرح المحلية والعروض' },
          bg: { name: 'Театрални билети', description: 'Резервирайте билети за местни театрални спектакли и представления' },
          de: { name: 'Theaterkarten', description: 'Buchen Sie Tickets für lokale Theateraufführungen' },
          fr: { name: 'Billets de théâtre', description: 'Réserver des billets pour les spectacles de théâtre locaux' },
          it: { name: 'Biglietti per il teatro', description: 'Prenota biglietti per spettacoli teatrali locali' },
          es: { name: 'Entradas de teatro', description: 'Reserve entradas para espectáculos de teatro locales' },
          pt: { name: 'Ingressos de teatro', description: 'Reserve ingressos para apresentações teatrais locais' },
          ru: { name: 'Билеты в театр', description: 'Забронируйте билеты на местные театральные представления' },
          zh: { name: '剧院门票', description: '预订当地剧院演出门票' },
          ja: { name: '劇場チケット', description: '地元の劇場公演のチケットを予約' },
          ko: { name: '극장 티켓', description: '현지 극장 공연 티켓 예약' },
          nl: { name: 'Theaterkaartjes', description: 'Boek tickets voor lokale theatervoorstellingen' },
          pl: { name: 'Bilety do teatru', description: 'Zarezerwuj bilety na lokalne przedstawienia teatralne' }
        }
      },
      {
        name: 'Game Night',
        description: 'Board games and card games available at the lobby',
        estimatedTime: '3 hours',
        image: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?w=800&auto=format&fit=crop',
        translations: {
          he: { name: 'ערב משחקים', description: 'משחקי לוח וקלפים זמינים בלובי' },
          ar: { name: 'ليلة الألعاب', description: 'ألعاب اللوح والورق متاحة في الردهة' },
          bg: { name: 'Игрална вечер', description: 'Настолни игри и карти на разположение в лобито' },
          de: { name: 'Spieleabend', description: 'Brettspiele und Kartenspiele in der Lobby verfügbar' },
          fr: { name: 'Soirée jeux', description: 'Jeux de société et cartes disponibles dans le hall' },
          it: { name: 'Serata giochi', description: 'Giochi da tavolo e carte disponibili nella lobby' },
          es: { name: 'Noche de juegos', description: 'Juegos de mesa y cartas disponibles en el vestíbulo' },
          pt: { name: 'Noite de jogos', description: 'Jogos de tabuleiro e cartas disponíveis no lobby' },
          ru: { name: 'Игровой вечер', description: 'Настольные игры и карты доступны в лобби' },
          zh: { name: '游戏之夜', description: '大堂提供桌游和纸牌游戏' },
          ja: { name: 'ゲームナイト', description: 'ロビーでボードゲームやカードゲームが利用可能' },
          ko: { name: '게임의 밤', description: '로비에서 보드게임과 카드게임 이용 가능' },
          nl: { name: 'Spelavond', description: 'Bordspellen en kaartspellen beschikbaar in de lobby' },
          pl: { name: 'Wieczór gier', description: 'Gry planszowe i karty dostępne w lobby' }
        }
      }
    ]
  }
];

