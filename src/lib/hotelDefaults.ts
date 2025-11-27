/**
 * Default categories and services for new hotels
 * All new hotels get these categories and services automatically with full translations
 */

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
  translations: {
    [lang: string]: {
      name: string;
      description: string;
    };
  };
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
  services: DefaultService[];
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
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
    services: [
      {
        name: 'Breakfast in Bed',
        description: 'Delicious breakfast served directly to your room',
        price: 25.00,
        currency: 'USD',
        estimatedTime: '30 minutes',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop',
        isRecommended: true,
        translations: {
          he: { name: 'ארוחת בוקר במיטה', description: 'ארוחת בוקר טעימה מוגשת ישירות לחדר' },
          ar: { name: 'الإفطار في السرير', description: 'وجبة إفطار لذيذة تقدم مباشرة إلى غرفتك' },
          bg: { name: 'Закуска на легло', description: 'Вкусна закуска, сервирана директно в стаята' },
          de: { name: 'Frühstück im Bett', description: 'Leckeres Frühstück direkt auf Ihr Zimmer serviert' },
          fr: { name: 'Petit-déjeuner au lit', description: 'Délicieux petit-déjeuner servi directement dans votre chambre' },
          it: { name: 'Colazione a letto', description: 'Deliziosa colazione servita direttamente in camera' },
          es: { name: 'Desayuno en la cama', description: 'Delicioso desayuno servido directamente en tu habitación' },
          pt: { name: 'Café da manhã na cama', description: 'Delicioso café da manhã servido diretamente no seu quarto' },
          ru: { name: 'Завтрак в постель', description: 'Вкусный завтрак подается прямо в номер' },
          zh: { name: '床上早餐', description: '直接送到您房间的美味早餐' },
          ja: { name: 'ベッドでの朝食', description: 'お部屋に直接お届けする美味しい朝食' },
          ko: { name: '침대에서 아침식사', description: '객실로 직접 배달되는 맛있는 아침식사' },
          nl: { name: 'Ontbijt op bed', description: 'Heerlijk ontbijt direct op uw kamer geserveerd' },
          pl: { name: 'Śniadanie do łóżka', description: 'Pyszne śniadanie podane bezpośrednio do pokoju' }
        }
      }
    ]
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
        name: 'Relaxing Massage',
        description: '60-minute full body massage',
        price: 120.00,
        currency: 'USD',
        estimatedTime: '60 minutes',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop',
        isRecommended: true,
        translations: {
          he: { name: 'עיסוי מרגיע', description: 'עיסוי גוף מלא למשך 60 דקות' },
          ar: { name: 'تدليك مريح', description: 'تدليك كامل للجسم لمدة 60 دقيقة' },
          bg: { name: 'Релаксиращ масаж', description: 'Масаж на цялото тяло за 60 минути' },
          de: { name: 'Entspannungsmassage', description: '60-minütige Ganzkörpermassage' },
          fr: { name: 'Massage relaxant', description: 'Massage complet du corps de 60 minutes' },
          it: { name: 'Massaggio rilassante', description: 'Massaggio corpo completo di 60 minuti' },
          es: { name: 'Masaje relajante', description: 'Masaje de cuerpo completo de 60 minutos' },
          pt: { name: 'Massagem relaxante', description: 'Massagem corporal completa de 60 minutos' },
          ru: { name: 'Расслабляющий массаж', description: '60-минутный массаж всего тела' },
          zh: { name: '放松按摩', description: '60分钟全身按摩' },
          ja: { name: 'リラックスマッサージ', description: '60分間の全身マッサージ' },
          ko: { name: '릴렉싱 마사지', description: '60분 전신 마사지' },
          nl: { name: 'Ontspannende massage', description: '60 minuten volledige lichaamsmassage' },
          pl: { name: 'Masaż relaksacyjny', description: '60-minutowy masaż całego ciała' }
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
          ar: { name: 'إصلاح المكيف', description: 'فحص وإصلاح نظام التكييف' },
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
  }
];

