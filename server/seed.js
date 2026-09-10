import { db, initSchema } from './db.js';

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  const pad = (x) => String(x).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function seedDatabase() {
  initSchema();

  const reset = db.transaction(() => {
    db.prepare('DELETE FROM messages').run();
    db.prepare('DELETE FROM threads').run();
    db.prepare('DELETE FROM reviews').run();
    db.prepare('DELETE FROM orders').run();
    db.prepare('DELETE FROM requests').run();
    db.prepare('DELETE FROM dishes').run();
    db.prepare('DELETE FROM demo_users').run();
    db.prepare('DELETE FROM cooks').run();
    db.prepare('DELETE FROM cravers').run();

    // 1. COOKS
    const insertCook = db.prepare(`
      INSERT INTO cooks (id, name_en, name_ar, location, bio_en, bio_ar, cuisine_tags, rating, rating_count, avatar_seed, joined, latitude, longitude)
      VALUES (@id, @name_en, @name_ar, @location, @bio_en, @bio_ar, @cuisine_tags, @rating, @rating_count, @avatar_seed, @joined, @latitude, @longitude)
    `);

    insertCook.run({
      id: 'cook-1',
      name_en: 'Umm Nadia Hassan',
      name_ar: 'أم نادية حسن',
      location: 'Sayeda Zeinab, Cairo',
      bio_en: 'Thirty years of cooking for a house full of people. Everything comes out of the same pots my mother used — molokhia with rabbit, mahshi rolled by hand, and koshari that never has leftovers.',
      bio_ar: 'ثلاثون عاماً من الطهي لبيت مليء بالناس. كل شيء يخرج من نفس القدور التي استخدمتها أمي — ملوخية بالأرانب، ومحشي ملفوف باليد، وكشري لا تتبقى منه بقايا أبداً.',
      cuisine_tags: JSON.stringify(['Egyptian Home Cooking', 'Rice & Grains', 'Vegetarian']),
      rating: 4.8,
      rating_count: 214,
      avatar_seed: 'Umm Nadia',
      joined: 'Since 2023',
      latitude: null,
      longitude: null,
    });

    insertCook.run({
      id: 'cook-2',
      name_en: 'Hala El-Sherbini',
      name_ar: 'هالة الشربيني',
      location: 'Zamalek, Cairo',
      bio_en: 'I bake. Feteer meshaltet pulled thin enough to read through, om ali the way my grandmother made it in a clay dish, and a macarona béchamel that comes out of the oven in one piece.',
      bio_ar: 'أنا أخبز. فطير مشلتت رقيق يمكن أن ترى من خلاله، وأم علي بالطريقة التي كانت تحضرها بها جدتي في طبق فخاري، ومكرونة بشاميل تخرج من الفرن قطعة واحدة.',
      cuisine_tags: JSON.stringify(['Baladi Pastry', 'Desserts']),
      rating: 4.9,
      rating_count: 168,
      avatar_seed: 'Hala',
      joined: 'Since 2024',
      latitude: null,
      longitude: null,
    });

    insertCook.run({
      id: 'cook-3',
      name_en: 'Ashraf Mansour',
      name_ar: 'أشرف منصور',
      location: 'Heliopolis, Cairo',
      bio_en: 'Charcoal grill on the balcony every evening. Kofta, hawawshi and a boftek I learned working my uncle’s stall in Bur Said — everything cooked to order, never sitting.',
      bio_ar: 'شواية فحم على البلكونة كل مساء. كفتة وحواوشي وبوفتيك تعلمته وأنا أعمل في محل عمي ببورسعيد — كل شيء يُطهى عند الطلب، ولا يبقى منتظراً أبداً.',
      cuisine_tags: JSON.stringify(['Grills', 'Street Food']),
      rating: 4.6,
      rating_count: 97,
      avatar_seed: 'Ashraf',
      joined: 'Since 2024',
      latitude: null,
      longitude: null,
    });

    // 2. CRAVERS
    const insertCraver = db.prepare(`
      INSERT INTO cravers (id, name, location, preferences, favorite_foods, allergies, avatar_seed)
      VALUES (@id, @name, @location, @preferences, @favorite_foods, @allergies, @avatar_seed)
    `);

    const craverList = [
      {
        id: 'craver-demo',
        name: 'Nour Ezzat',
        location: 'Maadi, Cairo',
        preferences: JSON.stringify(['Home-style', 'Spicy', 'Vegetarian']),
        favorite_foods: 'Koshari, molokhia, anything with tahina',
        allergies: 'Walnuts',
        avatar_seed: 'Nour',
      },
      { id: 'craver-2', name: 'Mariam Adel', location: 'Zamalek, Cairo', preferences: '[]', favorite_foods: '', allergies: '', avatar_seed: 'Mariam' },
      { id: 'craver-3', name: 'Youssef Kamal', location: 'Heliopolis, Cairo', preferences: '[]', favorite_foods: '', allergies: '', avatar_seed: 'Youssef' },
      { id: 'craver-4', name: 'Salma Refaat', location: 'Dokki, Cairo', preferences: '[]', favorite_foods: '', allergies: '', avatar_seed: 'Salma' },
      { id: 'craver-5', name: 'Omar Shafik', location: 'New Cairo', preferences: '[]', favorite_foods: '', allergies: '', avatar_seed: 'Omar' },
      { id: 'craver-9', name: 'Tarek Hassanein', location: 'Nasr City', preferences: '[]', favorite_foods: '', allergies: '', avatar_seed: 'Tarek' },
      { id: 'craver-dina', name: 'Dina Mostafa', location: 'Maadi, Cairo', preferences: '[]', favorite_foods: '', allergies: '', avatar_seed: 'Dina' },
    ];
    craverList.forEach((c) => insertCraver.run(c));

    // 3. DEMO USERS
    const insertDemoUser = db.prepare(`
      INSERT INTO demo_users (id, role, name, avatar_seed, account_id)
      VALUES (@id, @role, @name, @avatar_seed, @account_id)
    `);

    [
      { id: 'demo-cook-1', role: 'cook', name: 'Umm Nadia Hassan (Cook)', avatar_seed: 'Umm Nadia', account_id: 'cook-1' },
      { id: 'demo-cook-2', role: 'cook', name: 'Hala El-Sherbini (Cook)', avatar_seed: 'Hala', account_id: 'cook-2' },
      { id: 'demo-cook-3', role: 'cook', name: 'Ashraf Mansour (Cook)', avatar_seed: 'Ashraf', account_id: 'cook-3' },
      { id: 'demo-craver-1', role: 'craver', name: 'Nour Ezzat (Craver)', avatar_seed: 'Nour', account_id: 'craver-demo' },
    ].forEach((u) => insertDemoUser.run(u));

    // 4. DISHES & REVIEWS
    const insertDish = db.prepare(`
      INSERT INTO dishes (id, cook_id, name_en, name_ar, photo, price, calories, category, taste_tags, dietary_tags, description_en, description_ar, ingredients_en, ingredients_ar, rating)
      VALUES (@id, @cook_id, @name_en, @name_ar, @photo, @price, @calories, @category, @taste_tags, @dietary_tags, @description_en, @description_ar, @ingredients_en, @ingredients_ar, @rating)
    `);

    const insertReview = db.prepare(`
      INSERT INTO reviews (id, dish_id, cook_id, craver_id, craver_name, taste_rating, on_time_rating, review_text, created_at)
      VALUES (@id, @dish_id, @cook_id, @craver_id, @craver_name, @taste_rating, @on_time_rating, @review_text, @created_at)
    `);

    const dishesData = [
      // Umm Nadia Hassan
      {
        id: 'dish-1',
        cook_id: 'cook-1',
        name_en: 'Koshari',
        name_ar: 'كشري',
        photo: 'koshari',
        price: 65,
        calories: 720,
        category: 'Lunch',
        taste_tags: JSON.stringify(['Spicy', 'Sour']),
        dietary_tags: JSON.stringify(['High-calorie', 'Vegetarian']),
        description_en: 'Rice, lentils and macaroni layered under tomato sauce, crisp fried onions and a fiery shatta on the side.',
        description_ar: 'أرز وعدس ومكرونة في طبقات تحت صلصة الطماطم، مع بصل مقلي مقرمش وشطة حارة بجانبه.',
        ingredients_en: JSON.stringify(['Rice', 'Brown lentils', 'Macaroni', 'Chickpeas', 'Fried onions', 'Tomato sauce', 'Garlic vinegar']),
        ingredients_ar: JSON.stringify(['أرز', 'عدس بني', 'مكرونة', 'حمص', 'بصل مقلي', 'صلصة طماطم', 'خل بالثوم']),
        rating: 4.9,
        reviews: [
          { by: 'Mariam A.', taste: 5, onTime: 5, text: 'The crispy onions alone are worth it. Portion fed two of us easily.', at: '2 weeks ago' },
          { by: 'Youssef K.', taste: 5, onTime: 4, text: 'Shatta comes on the side, which I appreciated. Genuinely better than the shops on my street.', at: '3 weeks ago' },
        ],
      },
      {
        id: 'dish-2',
        cook_id: 'cook-1',
        name_en: 'Mahshi Warak Enab',
        name_ar: 'محشي ورق عنب',
        photo: 'mahshi-warak-enab',
        price: 130,
        calories: 380,
        category: 'Lunch',
        taste_tags: JSON.stringify(['Sour']),
        dietary_tags: JSON.stringify(['Low-calorie', 'Vegetarian']),
        description_en: 'Vine leaves rolled thin around herbed rice, cooked slowly with lemon until they hold together on the fork.',
        description_ar: 'ورق عنب ملفوف رفيعاً حول أرز بالأعشاب، يُطهى ببطء مع الليمون حتى يتماسك على الشوكة.',
        ingredients_en: JSON.stringify(['Vine leaves', 'Short-grain rice', 'Parsley', 'Dill', 'Onion', 'Lemon', 'Olive oil']),
        ingredients_ar: JSON.stringify(['ورق عنب', 'أرز مصري', 'بقدونس', 'شبت', 'بصل', 'ليمون', 'زيت زيتون']),
        rating: 4.8,
        reviews: [
          { by: 'Salma R.', taste: 5, onTime: 5, text: 'Rolled so evenly I assumed they were machine made. Not oily at all.', at: '1 week ago' },
          { by: 'Dina M.', taste: 4, onTime: 4, text: 'Lovely and lemony. I would order a bigger tray next time.', at: '2 weeks ago' },
        ],
      },
      {
        id: 'dish-3',
        cook_id: 'cook-1',
        name_en: 'Molokhia with Rabbit',
        name_ar: 'ملوخية بالأرانب',
        photo: 'molokhia-with-rabbit',
        price: 175,
        calories: 540,
        category: 'Dinner',
        taste_tags: JSON.stringify(['Spicy']),
        dietary_tags: JSON.stringify(['High-calorie']),
        description_en: 'Molokhia finished with a loud garlic and coriander tasha, served with a rabbit leg and vermicelli rice.',
        description_ar: 'ملوخية منكهة بتقلية ثوم وكزبرة قوية، تُقدم مع فخذ أرنب وأرز بالشعرية.',
        ingredients_en: JSON.stringify(['Molokhia leaves', 'Rabbit', 'Garlic', 'Ground coriander', 'Ghee', 'Chicken stock']),
        ingredients_ar: JSON.stringify(['ملوخية', 'أرنب', 'ثوم', 'كزبرة مطحونة', 'سمن', 'مرقة دجاج']),
        rating: 4.9,
        reviews: [
          { by: 'Omar S.', taste: 5, onTime: 5, text: 'You can hear the tasha in the texture. Tastes like a Friday at my grandmother’s.', at: '3 days ago' },
          { by: 'Tarek H.', taste: 5, onTime: 4, text: 'Arrived hot, rice packed separately so nothing went soggy.', at: '5 days ago' },
        ],
      },
      {
        id: 'dish-4',
        cook_id: 'cook-1',
        name_en: "Ta'meya & Foul Platter",
        name_ar: 'طبق طعمية وفول',
        photo: 'falafel',
        price: 45,
        calories: 410,
        category: 'Breakfast',
        taste_tags: JSON.stringify(['Spicy']),
        dietary_tags: JSON.stringify(['Low-calorie', 'Vegetarian']),
        description_en: 'Fried-to-order ta’meya, slow-cooked foul with cumin and oil, plus baladi bread, tahina and pickles.',
        description_ar: 'طعمية مقلية عند الطلب، وفول مطهو ببطء مع الكمون والزيت، مع عيش بلدي وطحينة ومخلل.',
        ingredients_en: JSON.stringify(['Split fava beans', 'Fresh coriander', 'Leek', 'Cumin', 'Tahina', 'Baladi bread', 'Pickles']),
        ingredients_ar: JSON.stringify(['فول مدشوش', 'كزبرة خضراء', 'كرات', 'كمون', 'طحينة', 'عيش بلدي', 'مخلل']),
        rating: 4.7,
        reviews: [
          { by: 'Nour E.', taste: 5, onTime: 4, text: 'Ta’meya still crunchy when it reached me. That never happens.', at: '2 weeks ago' },
          { by: 'Mariam A.', taste: 4, onTime: 5, text: 'Great value breakfast. Would love more tahina next time.', at: '1 month ago' },
        ],
      },
      {
        id: 'dish-13',
        cook_id: 'cook-1',
        name_en: 'Mahshi Mashkal',
        name_ar: 'محشي مشكل',
        photo: 'mahshi',
        price: 145,
        calories: 460,
        category: 'Lunch',
        taste_tags: JSON.stringify(['Sour']),
        dietary_tags: JSON.stringify(['Low-calorie', 'Vegetarian']),
        description_en: 'Courgette, aubergine and peppers stuffed with herbed rice and baked in tomato until the skins collapse.',
        description_ar: 'كوسة وباذنجان وفلفل محشوة بأرز متبل بالأعشاب، ومطهية في الطماطم حتى تلين القشرة.',
        ingredients_en: JSON.stringify(['Courgette', 'Aubergine', 'Bell peppers', 'Rice', 'Dill', 'Parsley', 'Tomato', 'Onion']),
        ingredients_ar: JSON.stringify(['كوسة', 'باذنجان', 'فلفل ألوان', 'أرز', 'شبت', 'بقدونس', 'طماطم', 'بصل']),
        rating: 4.8,
        reviews: [
          { by: 'Dina M.', taste: 5, onTime: 5, text: 'A proper mixed tray — she even balanced the colours. Ate it cold the next day and it was still good.', at: '4 days ago' },
          { by: 'Omar S.', taste: 5, onTime: 4, text: 'Tastes like someone’s mother made it, because someone’s mother did.', at: '1 week ago' },
        ],
      },
      {
        id: 'dish-14',
        cook_id: 'cook-1',
        name_en: 'Roz Bel Bram',
        name_ar: 'رز بالبرام',
        photo: 'roz-bram',
        price: 95,
        calories: 610,
        category: 'Dinner',
        taste_tags: JSON.stringify(['Savoury']),
        dietary_tags: JSON.stringify(['High-calorie', 'Vegetarian']),
        description_en: 'Rice baked in a clay bram with milk, cream and butter until the top sets into a golden crust.',
        description_ar: 'أرز مطهو في برام فخاري مع اللبن والقشطة والزبدة حتى يتكون قشرة ذهبية على السطح.',
        ingredients_en: JSON.stringify(['Short-grain rice', 'Milk', 'Eshta cream', 'Butter', 'Salt']),
        ingredients_ar: JSON.stringify(['أرز مصري', 'لبن', 'قشطة', 'زبدة', 'ملح']),
        rating: 4.7,
        reviews: [
          { by: 'Tarek H.', taste: 5, onTime: 5, text: 'Arrived in the clay pot, crust intact. I did not share it.', at: '2 weeks ago' },
        ],
      },
      {
        id: 'dish-15',
        cook_id: 'cook-1',
        name_en: 'Bamya bel Lahma',
        name_ar: 'بامية باللحمة',
        photo: 'bamya',
        price: 165,
        calories: 520,
        category: 'Dinner',
        taste_tags: JSON.stringify(['Sour']),
        dietary_tags: JSON.stringify(['High-calorie']),
        description_en: 'Baby okra stewed low with beef shank, garlic and coriander until the sauce turns almost sweet.',
        description_ar: 'بامية صغيرة مطهية على نار هادئة مع موزة اللحم والثوم والكزبرة حتى تصبح الصلصة شبه حلوة المذاق.',
        ingredients_en: JSON.stringify(['Baby okra', 'Beef shank', 'Tomato', 'Garlic', 'Coriander', 'Onion']),
        ingredients_ar: JSON.stringify(['بامية صغيرة', 'موزة لحمة', 'طماطم', 'ثوم', 'كزبرة', 'بصل']),
        rating: 4.6,
        reviews: [
          { by: 'Youssef K.', taste: 5, onTime: 4, text: 'Not slimy in the slightest — she clearly knows what she is doing with okra.', at: '6 days ago' },
        ],
      },

      // Hala El-Sherbini
      {
        id: 'dish-5',
        cook_id: 'cook-2',
        name_en: 'Feteer Meshaltet',
        name_ar: 'فطير مشلتت',
        photo: 'feteer-meshaltet',
        price: 90,
        calories: 660,
        category: 'Breakfast',
        taste_tags: JSON.stringify(['Sweet']),
        dietary_tags: JSON.stringify(['High-calorie', 'Vegetarian']),
        description_en: 'Layer on layer of ghee-brushed pastry, pulled by hand and baked until the top blisters. Served with honey and cream.',
        description_ar: 'طبقات فوق طبقات من العجين المدهون بالسمن، يُشد باليد ويُخبز حتى يتقرمش السطح. يُقدم مع العسل والقشطة.',
        ingredients_en: JSON.stringify(['Flour', 'Ghee', 'Salt', 'Honey', 'Eshta cream']),
        ingredients_ar: JSON.stringify(['دقيق', 'سمن', 'ملح', 'عسل', 'قشطة']),
        rating: 5.0,
        reviews: [
          { by: 'Dina M.', taste: 5, onTime: 5, text: 'Countless layers. We ate it standing in the kitchen before it cooled.', at: '3 days ago' },
          { by: 'Youssef K.', taste: 5, onTime: 5, text: 'Ordered it for a family breakfast and got asked for her number.', at: '1 week ago' },
        ],
      },
      {
        id: 'dish-6',
        cook_id: 'cook-2',
        name_en: 'Om Ali',
        name_ar: 'أم علي',
        photo: 'om-ali',
        price: 70,
        calories: 590,
        category: 'Dessert',
        taste_tags: JSON.stringify(['Sweet']),
        dietary_tags: JSON.stringify(['High-calorie', 'Vegetarian']),
        description_en: 'Torn feteer soaked in sweetened milk with pistachio, coconut and raisins, baked under a browned cream crust.',
        description_ar: 'فطير مقطع منقوع في لبن محلى مع الفستق وجوز الهند والزبيب، مخبوز تحت طبقة قشطة محمرة.',
        ingredients_en: JSON.stringify(['Feteer', 'Full-fat milk', 'Eshta cream', 'Pistachio', 'Coconut', 'Raisins', 'Sugar']),
        ingredients_ar: JSON.stringify(['فطير', 'لبن كامل الدسم', 'قشطة', 'فستق', 'جوز هند', 'زبيب', 'سكر']),
        rating: 4.9,
        reviews: [
          { by: 'Salma R.', taste: 5, onTime: 5, text: 'The top layer goes properly golden. Reheated well the next day too.', at: '4 days ago' },
          { by: 'Omar S.', taste: 5, onTime: 5, text: 'Not too sweet, which is rare. Sent a tray to my in-laws.', at: '2 weeks ago' },
        ],
      },
      {
        id: 'dish-8',
        cook_id: 'cook-2',
        name_en: 'Roz bel Laban',
        name_ar: 'رز باللبن',
        photo: 'roz-bel-laban',
        price: 40,
        calories: 320,
        category: 'Dessert',
        taste_tags: JSON.stringify(['Sweet']),
        dietary_tags: JSON.stringify(['Low-calorie', 'Vegetarian']),
        description_en: 'Rice pudding cooked down slowly, chilled in individual clay pots and dusted with cinnamon.',
        description_ar: 'أرز باللبن مطهو ببطء، يُبرّد في أوعية فخارية فردية ويُرش بالقرفة.',
        ingredients_en: JSON.stringify(['Short-grain rice', 'Milk', 'Sugar', 'Vanilla', 'Cinnamon']),
        ingredients_ar: JSON.stringify(['أرز مصري', 'لبن', 'سكر', 'فانيليا', 'قرفة']),
        rating: 4.6,
        reviews: [
          { by: 'Nour E.', taste: 5, onTime: 5, text: 'Comes in little clay pots. Small thing, but it made my week.', at: '1 month ago' },
        ],
      },
      {
        id: 'dish-16',
        cook_id: 'cook-2',
        name_en: 'Macarona Béchamel',
        name_ar: 'مكرونة بشاميل',
        photo: 'macarona-bashamel',
        price: 110,
        calories: 680,
        category: 'Lunch',
        taste_tags: JSON.stringify(['Savoury']),
        dietary_tags: JSON.stringify(['High-calorie']),
        description_en: 'Penne and spiced mince under a thick béchamel, baked until the top is blistered and the edges crisp.',
        description_ar: 'مكرونة بيني ولحم مفروم متبل تحت طبقة سميكة من البشاميل، تُخبز حتى يتقرمش السطح والحواف.',
        ingredients_en: JSON.stringify(['Penne', 'Minced beef', 'Milk', 'Butter', 'Flour', 'Nutmeg', 'Onion']),
        ingredients_ar: JSON.stringify(['مكرونة بنّي', 'لحمة مفرومة', 'لبن', 'زبدة', 'دقيق', 'جوزة الطيب', 'بصل']),
        rating: 4.8,
        reviews: [
          { by: 'Mariam A.', taste: 5, onTime: 5, text: 'Came out of her oven in one piece and stayed in one piece. Corner slice is the best slice.', at: '1 week ago' },
        ],
      },

      // Ashraf Mansour
      {
        id: 'dish-9',
        cook_id: 'cook-3',
        name_en: 'Kofta Mashweya',
        name_ar: 'كفتة مشوية',
        photo: 'kofta-mashweya',
        price: 195,
        calories: 700,
        category: 'Dinner',
        taste_tags: JSON.stringify(['Spicy']),
        dietary_tags: JSON.stringify(['High-calorie']),
        description_en: 'Hand-minced beef and lamb kofta over charcoal, with grilled tomato, tahina and warm baladi bread.',
        description_ar: 'كفتة من لحم بقري وضأني مفروم يدوياً على الفحم، مع طماطم مشوية وطحينة وعيش بلدي دافئ.',
        ingredients_en: JSON.stringify(['Minced beef', 'Minced lamb', 'Onion', 'Parsley', 'Baharat', 'Tahina']),
        ingredients_ar: JSON.stringify(['لحمة مفرومة', 'لحمة ضاني مفرومة', 'بصل', 'بقدونس', 'بهارات', 'طحينة']),
        rating: 4.8,
        reviews: [
          { by: 'Tarek H.', taste: 5, onTime: 4, text: 'Actual charcoal, you can taste it. Ten skewers vanished in minutes.', at: '5 days ago' },
          { by: 'Dina M.', taste: 4, onTime: 4, text: 'Excellent kofta. Ask for extra tahina.', at: '2 weeks ago' },
        ],
      },
      {
        id: 'dish-10',
        cook_id: 'cook-3',
        name_en: 'Hawawshi',
        name_ar: 'حواوشي',
        photo: 'hawawshi',
        price: 85,
        calories: 640,
        category: 'Lunch',
        taste_tags: JSON.stringify(['Spicy']),
        dietary_tags: JSON.stringify(['High-calorie']),
        description_en: 'Baladi bread stuffed with spiced mince, onion and green chilli, pressed and baked until the crust shatters.',
        description_ar: 'عيش بلدي محشو بلحم مفروم متبل وبصل وفلفل أخضر حار، مضغوط ومخبوز حتى يتقرمش.',
        ingredients_en: JSON.stringify(['Baladi bread', 'Minced beef', 'Onion', 'Green chilli', 'Bell pepper', 'Mixed spices']),
        ingredients_ar: JSON.stringify(['عيش بلدي', 'لحمة مفرومة', 'بصل', 'فلفل أخضر حار', 'فلفل ألوان', 'بهارات مشكلة']),
        rating: 4.7,
        reviews: [
          { by: 'Youssef K.', taste: 5, onTime: 5, text: 'Crust cracks when you bite it. Properly spicy, be warned.', at: '1 week ago' },
        ],
      },
      {
        id: 'dish-12',
        cook_id: 'cook-3',
        name_en: 'Shakshouka',
        name_ar: 'شكشوكة',
        photo: 'shakshouka',
        price: 50,
        calories: 340,
        category: 'Breakfast',
        taste_tags: JSON.stringify(['Spicy']),
        dietary_tags: JSON.stringify(['Low-calorie', 'Vegetarian']),
        description_en: 'Eggs baked into a chilli-and-tomato base in a cast iron dish, with baladi bread for scooping.',
        description_ar: 'بيض مطهو في قاعدة من الطماطم والفلفل الحار في طبق حديدي، مع عيش بلدي للتغميس.',
        ingredients_en: JSON.stringify(['Eggs', 'Tomato', 'Green pepper', 'Chilli', 'Onion', 'Cumin', 'Baladi bread']),
        ingredients_ar: JSON.stringify(['بيض', 'طماطم', 'فلفل أخضر', 'شطة', 'بصل', 'كمون', 'عيش بلدي']),
        rating: 4.5,
        reviews: [
          { by: 'Dina M.', taste: 5, onTime: 4, text: 'Yolks still runny on arrival, which I did not expect from delivery.', at: '2 weeks ago' },
        ],
      },
      {
        id: 'dish-17',
        cook_id: 'cook-3',
        name_en: 'Boftek',
        name_ar: 'بوفتيك',
        photo: 'boftek',
        price: 185,
        calories: 610,
        category: 'Dinner',
        taste_tags: JSON.stringify(['Savoury']),
        dietary_tags: JSON.stringify(['High-calorie']),
        description_en: 'Thin beef escalope beaten flat, breaded and pan-fried to order, with lemon and a mound of fried potatoes.',
        description_ar: 'إسكالوب لحم بقري رفيع مدقوق، مغطى بالبقسماط ومقلي عند الطلب، مع الليمون وكومة من البطاطس المقلية.',
        ingredients_en: JSON.stringify(['Beef escalope', 'Breadcrumbs', 'Egg', 'Garlic', 'Lemon', 'Potatoes']),
        ingredients_ar: JSON.stringify(['إسكالوب لحمة', 'بقسماط', 'بيضة', 'ثوم', 'ليمون', 'بطاطس']),
        rating: 4.6,
        reviews: [
          { by: 'Omar S.', taste: 5, onTime: 5, text: 'Crisp outside, still juicy. Chips arrived hot which is the real test.', at: '3 weeks ago' },
        ],
      },
    ];

    let revCounter = 1;
    for (const d of dishesData) {
      const { reviews = [], ...dishFields } = d;
      insertDish.run(dishFields);
      for (const r of reviews) {
        insertReview.run({
          id: `rev-${revCounter++}`,
          dish_id: d.id,
          cook_id: d.cook_id,
          craver_id: r.by === 'Nour E.' ? 'craver-demo' : null,
          craver_name: r.by,
          taste_rating: r.taste,
          on_time_rating: r.onTime,
          review_text: r.text,
          created_at: r.at,
        });
      }
    }

    // 5. THREADS & MESSAGES
    const insertThread = db.prepare(`
      INSERT INTO threads (id, order_id, request_id, cook_id, craver_id, craver_name, subject, created_at)
      VALUES (@id, @order_id, @request_id, @cook_id, @craver_id, @craver_name, @subject, @created_at)
    `);

    const insertMessage = db.prepare(`
      INSERT INTO messages (id, thread_id, sender_role, sender_name, type, body, proposed_price, proposed_date, proposal_note, proposal_status, created_at)
      VALUES (@id, @thread_id, @sender_role, @sender_name, @type, @body, @proposed_price, @proposed_date, @proposal_note, @proposal_status, @created_at)
    `);

    // Thread for order-3
    insertThread.run({
      id: 'thread-order-3',
      order_id: 'order-3',
      request_id: null,
      cook_id: 'cook-1',
      craver_id: 'craver-demo',
      craver_name: 'Nour Ezzat',
      subject: 'Molokhia with Rabbit × 1',
      created_at: 'Today, 11:20',
    });

    insertMessage.run({
      id: 'm1',
      thread_id: 'thread-order-3',
      sender_role: 'cook',
      sender_name: 'Umm Nadia Hassan',
      type: 'text',
      body: 'Got your order, I’m starting the molokhia now. Delivery around 7pm work for you?',
      proposed_price: null,
      proposed_date: null,
      proposal_note: null,
      proposal_status: null,
      created_at: '11:24',
    });

    insertMessage.run({
      id: 'm2',
      thread_id: 'thread-order-3',
      sender_role: 'craver',
      sender_name: 'Nour Ezzat',
      type: 'text',
      body: '7pm is perfect. Could you go light on the garlic tasha?',
      proposed_price: null,
      proposed_date: null,
      proposal_note: null,
      proposal_status: null,
      created_at: '11:31',
    });

    insertMessage.run({
      id: 'm3',
      thread_id: 'thread-order-3',
      sender_role: 'cook',
      sender_name: 'Umm Nadia Hassan',
      type: 'proposal',
      body: 'Price proposal',
      proposed_price: 175,
      proposed_date: 'Today, 19:00',
      proposal_note: 'Light tasha, rice packed separately.',
      proposal_status: 'pending',
      created_at: '11:33',
    });

    // Thread for order-c1 (cook-side order)
    insertThread.run({
      id: 'thread-corder-1',
      order_id: 'corder-1',
      request_id: null,
      cook_id: 'cook-1',
      craver_id: 'craver-9',
      craver_name: 'Tarek Hassanein',
      subject: 'Koshari × 3',
      created_at: 'Today, 10:02',
    });

    insertMessage.run({
      id: 'mc1',
      thread_id: 'thread-corder-1',
      sender_role: 'craver',
      sender_name: 'Tarek Hassanein',
      type: 'text',
      body: 'Hi! Any chance you can add extra shatta on the side?',
      proposed_price: null,
      proposed_date: null,
      proposal_note: null,
      proposal_status: null,
      created_at: '10:06',
    });

    insertMessage.run({
      id: 'mc2',
      thread_id: 'thread-corder-1',
      sender_role: 'cook',
      sender_name: 'Umm Nadia Hassan',
      type: 'text',
      body: 'Already packed two extra cups for you.',
      proposed_price: null,
      proposed_date: null,
      proposal_note: null,
      proposal_status: null,
      created_at: '10:11',
    });

    // Thread for req-5 (special request accepted by cook-1)
    insertThread.run({
      id: 'thread-req-5',
      order_id: null,
      request_id: 'req-5',
      cook_id: 'cook-1',
      craver_id: 'craver-5',
      craver_name: 'Omar Shafik',
      subject: 'Special request — dinner party for 6',
      created_at: '2 days ago',
    });

    insertMessage.run({
      id: 'mr1',
      thread_id: 'thread-req-5',
      sender_role: 'craver',
      sender_name: 'Omar Shafik',
      type: 'text',
      body: 'Thanks for accepting! Six people, one of them doesn’t eat rabbit.',
      proposed_price: null,
      proposed_date: null,
      proposal_note: null,
      proposal_status: null,
      created_at: 'Mon 18:02',
    });

    insertMessage.run({
      id: 'mr2',
      thread_id: 'thread-req-5',
      sender_role: 'cook',
      sender_name: 'Umm Nadia Hassan',
      type: 'text',
      body: 'No problem, I’ll do half chicken half rabbit and keep them in separate dishes.',
      proposed_price: null,
      proposed_date: null,
      proposal_note: null,
      proposal_status: null,
      created_at: 'Mon 18:15',
    });

    // Dummy empty threads for orders 1, 2, 4
    for (const tid of ['thread-order-1', 'thread-order-2', 'thread-order-4', 'thread-req-1', 'thread-req-2', 'thread-req-3', 'thread-req-4']) {
      insertThread.run({
        id: tid,
        order_id: null,
        request_id: null,
        cook_id: 'cook-1',
        craver_id: 'craver-demo',
        craver_name: 'Nour Ezzat',
        subject: 'Thread',
        created_at: 'Just now',
      });
    }

    // 6. ORDERS
    const insertOrder = db.prepare(`
      INSERT INTO orders (id, dish_id, cook_id, craver_id, craver_name, quantity, total, status, is_recurring, recurring_day, taste_rating, on_time_rating, thread_id, created_at)
      VALUES (@id, @dish_id, @cook_id, @craver_id, @craver_name, @quantity, @total, @status, @is_recurring, @recurring_day, @taste_rating, @on_time_rating, @thread_id, @created_at)
    `);

    const ordersData = [
      {
        id: 'order-1',
        dish_id: 'dish-1',
        cook_id: 'cook-1',
        craver_id: 'craver-demo',
        craver_name: 'Nour Ezzat',
        quantity: 2,
        total: 130,
        status: 'Delivered',
        is_recurring: 0,
        recurring_day: null,
        taste_rating: 5,
        on_time_rating: 4,
        thread_id: 'thread-order-1',
        created_at: '2 weeks ago',
      },
      {
        id: 'order-2',
        dish_id: 'dish-6',
        cook_id: 'cook-2',
        craver_id: 'craver-demo',
        craver_name: 'Nour Ezzat',
        quantity: 1,
        total: 70,
        status: 'Delivered',
        is_recurring: 0,
        recurring_day: null,
        taste_rating: null,
        on_time_rating: null,
        thread_id: 'thread-order-2',
        created_at: '4 days ago',
      },
      {
        id: 'order-3',
        dish_id: 'dish-3',
        cook_id: 'cook-1',
        craver_id: 'craver-demo',
        craver_name: 'Nour Ezzat',
        quantity: 1,
        total: 175,
        status: 'Accepted',
        is_recurring: 0,
        recurring_day: null,
        taste_rating: null,
        on_time_rating: null,
        thread_id: 'thread-order-3',
        created_at: 'Today, 11:20',
      },
      {
        id: 'order-4',
        dish_id: 'dish-10',
        cook_id: 'cook-3',
        craver_id: 'craver-demo',
        craver_name: 'Nour Ezzat',
        quantity: 3,
        total: 255,
        status: 'Pending',
        is_recurring: 1,
        recurring_day: 'Friday',
        taste_rating: null,
        on_time_rating: null,
        thread_id: 'thread-order-4',
        created_at: 'Today, 13:05',
      },
      // Cook-side orders from other cravers
      {
        id: 'corder-1',
        dish_id: 'dish-1',
        cook_id: 'cook-1',
        craver_id: 'craver-9',
        craver_name: 'Tarek Hassanein',
        quantity: 3,
        total: 195,
        status: 'Accepted',
        is_recurring: 0,
        recurring_day: null,
        taste_rating: null,
        on_time_rating: null,
        thread_id: 'thread-corder-1',
        created_at: 'Today, 10:02',
      },
      {
        id: 'corder-2',
        dish_id: 'dish-2',
        cook_id: 'cook-1',
        craver_id: 'craver-dina',
        craver_name: 'Dina Mostafa',
        quantity: 1,
        total: 130,
        status: 'Pending',
        is_recurring: 1,
        recurring_day: 'Tuesday',
        taste_rating: null,
        on_time_rating: null,
        thread_id: 'thread-corder-2',
        created_at: 'Today, 12:40',
      },
      {
        id: 'corder-3',
        dish_id: 'dish-3',
        cook_id: 'cook-1',
        craver_id: 'craver-2',
        craver_name: 'Mariam Adel',
        quantity: 2,
        total: 350,
        status: 'Delivered',
        is_recurring: 0,
        recurring_day: null,
        taste_rating: 5,
        on_time_rating: 5,
        thread_id: 'thread-corder-3',
        created_at: 'Yesterday',
      },
      {
        id: 'corder-4',
        dish_id: 'dish-13',
        cook_id: 'cook-1',
        craver_id: 'craver-3',
        craver_name: 'Youssef Kamal',
        quantity: 1,
        total: 145,
        status: 'Delivered',
        is_recurring: 0,
        recurring_day: null,
        taste_rating: 4,
        on_time_rating: 5,
        thread_id: 'thread-corder-4',
        created_at: '3 days ago',
      },
      {
        id: 'corder-5',
        dish_id: 'dish-14',
        cook_id: 'cook-1',
        craver_id: 'craver-4',
        craver_name: 'Salma Refaat',
        quantity: 2,
        total: 190,
        status: 'Delivered',
        is_recurring: 0,
        recurring_day: null,
        taste_rating: 5,
        on_time_rating: 4,
        thread_id: 'thread-corder-5',
        created_at: '4 days ago',
      },
    ];
    ordersData.forEach((o) => insertOrder.run(o));

    // 7. REQUESTS
    const insertRequest = db.prepare(`
      INSERT INTO requests (id, craver_id, craver_name, description, desired_date, budget, tags, status, accepted_by, distance_km, thread_id, created_at)
      VALUES (@id, @craver_id, @craver_name, @description, @desired_date, @budget, @tags, @status, @accepted_by, @distance_km, @thread_id, @created_at)
    `);

    const requestsData = [
      {
        id: 'req-1',
        craver_id: 'craver-demo',
        craver_name: 'Nour Ezzat',
        description: 'Iftar platter for 8 people — something home-style with rice, a stew and a vegetarian side. Nothing with walnuts please.',
        desired_date: daysFromNow(4),
        budget: '800 – 1,200 EGP',
        tags: JSON.stringify(['Egyptian Home Cooking', 'Vegetarian']),
        status: 'pending',
        accepted_by: null,
        distance_km: 3.1,
        thread_id: 'thread-req-1',
        created_at: 'Yesterday',
      },
      {
        id: 'req-2',
        craver_id: 'craver-2',
        craver_name: 'Mariam Adel',
        description: 'Birthday feteer meshaltet, large, plus a tray of om ali for about 12 guests.',
        desired_date: daysFromNow(5),
        budget: '600 – 900 EGP',
        tags: JSON.stringify(['Baladi Pastry', 'Desserts']),
        status: 'pending',
        accepted_by: null,
        distance_km: 1.4,
        thread_id: 'thread-req-2',
        created_at: '3 hours ago',
      },
      {
        id: 'req-3',
        craver_id: 'craver-3',
        craver_name: 'Youssef Kamal',
        description: 'Charcoal kofta and hawawshi for 10 guests, delivered hot at 8pm. Mild spice for the kids.',
        desired_date: daysFromNow(3),
        budget: '1,500 – 2,000 EGP',
        tags: JSON.stringify(['Grills', 'Street Food']),
        status: 'pending',
        accepted_by: null,
        distance_km: 5.8,
        thread_id: 'thread-req-3',
        created_at: '5 hours ago',
      },
      {
        id: 'req-4',
        craver_id: 'craver-4',
        craver_name: 'Salma Refaat',
        description: 'Weekly low-calorie vegetarian meal prep — mahshi, salads, lentil dishes. Four containers, no dairy.',
        desired_date: 'Every Sunday',
        budget: '450 – 600 EGP / week',
        tags: JSON.stringify(['Vegetarian', 'Egyptian Home Cooking']),
        status: 'pending',
        accepted_by: null,
        distance_km: 2.3,
        thread_id: 'thread-req-4',
        created_at: '1 day ago',
      },
      {
        id: 'req-5',
        craver_id: 'craver-5',
        craver_name: 'Omar Shafik',
        description: 'Molokhia with rabbit and vermicelli rice for a dinner party of 6. Extra tasha on the side.',
        desired_date: daysFromNow(6),
        budget: '900 – 1,100 EGP',
        tags: JSON.stringify(['Egyptian Home Cooking', 'Soups & Stews']),
        status: 'accepted',
        accepted_by: 'cook-1',
        distance_km: 4.2,
        thread_id: 'thread-req-5',
        created_at: '2 days ago',
      },
    ];
    requestsData.forEach((r) => insertRequest.run(r));
  });

  reset();
  console.log('✅ Database successfully seeded with demo cooks, dishes, cravers, reviews, threads, orders, and requests.');
}

// When run directly: `node server/seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase();
}

