// Everything language-related lives here: the UI label dictionary, label maps
// for the canonical (English) enum values stored in data (categories, tastes,
// dietary flags, cuisine tags, preferences, statuses), and small helpers.
//
// Design rule: filtering/matching always runs against the canonical English
// values in the data (see data/filters.js and lib/match.js) — only *display*
// text is swapped per language. That way switching language never changes
// what a filter matches.

export const LANGS = ['en', 'ar']

// ---- UI label dictionary --------------------------------------------------
// key -> { en, ar }. Covers buttons, headers, nav items, section labels and
// the other static chrome around the app. Mock content (reviews, chat
// messages, craver names, timestamps, user-typed text) is intentionally left
// out — it stays in whatever language it was written in.
export const UI_TEXT = {
  // Language toggle
  language: { en: 'Language', ar: 'اللغة' },

  // Roles / greetings
  hello: { en: 'Hello', ar: 'أهلاً' },
  roleCook: { en: 'Cook', ar: 'طاهي' },
  roleCraver: { en: 'Craver', ar: 'زبون' },
  profile: { en: 'Profile', ar: 'الملف الشخصي' },

  // Landing page
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  signUp: { en: 'Sign Up', ar: 'إنشاء حساب' },
  demoTagline: { en: "Cairo's home kitchens · demo build", ar: 'مطابخ بيوت القاهرة · نسخة تجريبية' },

  // Role picker modal
  welcomeBack: { en: 'Welcome back', ar: 'أهلاً بعودتك' },
  continueDemoAccount: { en: 'Continue into a demo account.', ar: 'تابع إلى حساب تجريبي.' },
  joinBeity: { en: 'Join Beity', ar: 'انضم إلى بيتي' },
  whichAreYou: { en: 'First — which one are you?', ar: 'أولاً — أنت مين فيهم؟' },
  cookBlurb: { en: 'I cook at home and want to sell my food.', ar: 'أطبخ في بيتي وأريد بيع أكلي.' },
  craverBlurb: {
    en: 'I want homemade food from someone nearby.',
    ar: 'أريد أكلاً بيتياً من شخص قريب مني.',
  },
  continueArrow: { en: 'Continue →', ar: 'متابعة ←' },
  signUpArrow: { en: 'Sign up →', ar: 'إنشاء حساب ←' },
  demoNoPassword: {
    en: "Demo build — no password needed. You'll land in a ready-made profile.",
    ar: 'نسخة تجريبية — لا حاجة لكلمة مرور. ستدخل إلى ملف شخصي جاهز مسبقاً.',
  },

  // Signup forms (shared)
  back: { en: 'Back', ar: 'رجوع' },
  yourName: { en: 'Your name', ar: 'اسمك' },
  location: { en: 'Location', ar: 'الموقع' },
  optionalHint: { en: 'optional', ar: 'اختياري' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },

  // Craver signup
  signupCraverTitle: { en: 'Sign up as a Craver', ar: 'إنشاء حساب كزبون' },
  signupCraverSubtitle: {
    en: "Tell us what you like — we'll put the right kitchens in front of you.",
    ar: 'أخبرنا بما تحب — وسنعرض عليك المطابخ المناسبة.',
  },
  startCraving: { en: 'Start craving', ar: 'ابدأ الآن' },
  foodPreferences: { en: 'Food preferences', ar: 'التفضيلات الغذائية' },
  pickAsManyHint: { en: 'pick as many as you like', ar: 'اختر ما يناسبك' },
  favouriteFoods: { en: 'Favourite foods', ar: 'الأطعمة المفضلة' },
  allergies: { en: 'Allergies', ar: 'الحساسية الغذائية' },

  // Cook signup
  signupCookTitle: { en: 'Sign up as a Cook', ar: 'إنشاء حساب كطاهي' },
  signupCookSubtitle: {
    en: 'Set up your kitchen and add a few starter dishes to your menu.',
    ar: 'جهّز مطبخك وأضف بعض الأطباق الأولى إلى قائمتك.',
  },
  openMyKitchen: { en: 'Open my kitchen', ar: 'افتح مطبخي' },
  shortBio: { en: 'Short bio', ar: 'نبذة قصيرة' },
  cuisineTagsLabel: { en: 'Cuisine specialty tags', ar: 'تصنيفات التخصص' },
  starterMenuItems: { en: 'Starter menu items', ar: 'أطباق البداية' },
  starterMenuHint: {
    en: 'These show up under "My Menu" straight away.',
    ar: 'ستظهر مباشرة ضمن "قائمة طعامي".',
  },
  addAnother: { en: 'Add another', ar: 'إضافة طبق آخر' },
  dishNumber: { en: 'Dish', ar: 'طبق' },

  // Craver home page
  specialRequest: { en: 'Special Request', ar: 'طلب خاص' },
  specialRequestHint: {
    en: "Can't find it? Describe the meal and let cooks come to you.",
    ar: 'لم تجد طلبك؟ صف الوجبة ودع الطهاة يتواصلون معك.',
  },
  recommendedForYou: { en: 'Recommended for you', ar: 'موصى به لك' },
  becauseYouLike: { en: 'Because you like', ar: 'لأنك تحب' },
  highestRatedArea: { en: 'Highest rated in your area', ar: 'الأعلى تقييماً في منطقتك' },
  allMealsNearby: { en: 'All meals nearby', ar: 'كل الوجبات القريبة' },
  searchResults: { en: 'Search results', ar: 'نتائج البحث' },
  dishSingular: { en: 'dish', ar: 'طبق' },
  dishesPlural: { en: 'dishes', ar: 'أطباق' },
  fromHomeKitchens: { en: 'from home kitchens in Cairo', ar: 'من مطابخ منزلية في القاهرة' },
  nothingMatches: { en: 'Nothing matches that yet', ar: 'لا يوجد ما يطابق ذلك بعد' },
  tryClearingFilter: {
    en: 'Try clearing a filter or two — or post a special request and let a cook offer to make it.',
    ar: 'جرّب إزالة فلتر أو اثنين — أو انشر طلباً خاصاً ودع أحد الطهاة يعرض تحضيره.',
  },
  postSpecialRequest: { en: 'Post a special request', ar: 'نشر طلب خاص' },

  // Filter panel
  mealTypes: { en: 'Meal Types', ar: 'أنواع الوجبات' },
  clear: { en: 'Clear', ar: 'مسح' },
  mealLabel: { en: 'Meal', ar: 'الوجبة' },
  tasteLabel: { en: 'Taste', ar: 'المذاق' },
  dietaryLabel: { en: 'Dietary', ar: 'النظام الغذائي' },

  // Search bar
  searchPlaceholder: {
    en: 'Search a dish or a cook — koshari, molokhia, feteer…',
    ar: 'ابحث عن طبق أو طاهي — كشري، ملوخية، فطير…',
  },
  result: { en: 'result', ar: 'نتيجة' },
  results: { en: 'results', ar: 'نتائج' },

  // Meal card
  yourTasteBadge: { en: 'Your taste', ar: 'يناسب ذوقك' },
  ingredients: { en: 'Ingredients', ar: 'المكونات' },
  whatCraversSaid: { en: 'What cravers said', ar: 'ماذا قال الزبائن' },
  noReviewsBeFirst: { en: 'No reviews yet — be the first.', ar: 'لا توجد تقييمات بعد — كن أول من يقيّم.' },
  clickToOrder: { en: 'Click to order →', ar: 'اضغط للطلب ←' },
  orderNow: { en: 'Order Now', ar: 'اطلب الآن' },
  hoverForDetails: { en: 'Hover for details', ar: 'مرر الفأرة لعرض التفاصيل' },
  reviews: { en: 'reviews', ar: 'تقييمات' },

  // Order modal
  orderPlaced: { en: 'Order placed', ar: 'تم تقديم الطلب' },
  order: { en: 'Order', ar: 'اطلب' },
  from: { en: 'From', ar: 'من' },
  keepBrowsing: { en: 'Keep browsing', ar: 'تابع التصفح' },
  viewMyOrders: { en: 'View My Orders', ar: 'عرض طلباتي' },
  confirmOrder: { en: 'Confirm order', ar: 'تأكيد الطلب' },
  sittingWithCook: { en: 'Sitting with', ar: 'قيد المراجعة لدى' },
  sittingWithCookTail: {
    en: "now as Pending. Once it's accepted you can chat about the details from your profile.",
    ar: 'الآن بحالة قيد الانتظار. بمجرد قبوله يمكنك الدردشة حول التفاصيل من ملفك الشخصي.',
  },
  quantity: { en: 'Quantity', ar: 'الكمية' },
  each: { en: 'each', ar: 'للواحد' },
  total: { en: 'Total', ar: 'الإجمالي' },
  makeWeekly: { en: 'Make this a weekly order', ar: 'اجعل هذا طلباً أسبوعياً' },
  pickDeliveryDay: { en: 'Which day should it arrive?', ar: 'في أي يوم تريد وصوله؟' },
  weeklyBadge: { en: 'Weekly', ar: 'أسبوعي' },
  repeatsWeekly: { en: 'Repeats weekly', ar: 'يتكرر أسبوعياً' },
  repeatsWeeklyOn: { en: 'Repeats every', ar: 'يتكرر كل يوم' },
  everyLabel: { en: 'Every', ar: 'كل يوم' },

  // Special request modal
  requestPosted: { en: 'Request posted', ar: 'تم نشر الطلب' },
  postSpecialRequestTitle: { en: 'Post a special request', ar: 'نشر طلب خاص' },
  describeWhatYoureAfter: {
    en: "Describe what you're after — nearby cooks will see it and can offer.",
    ar: 'صف ما تريده — سيراه الطهاة القريبون ويمكنهم تقديم عروض.',
  },
  postToNearbyCooks: { en: 'Post to nearby cooks', ar: 'نشر للطهاة القريبين' },
  infrontOfCooks: { en: "It's in front of the cooks", ar: 'أصبح الطلب أمام الطهاة' },
  requestPostedDetail: {
    en: 'Cooks whose specialties match will see it in their Special Requests column. You will find it under My Requests on your profile.',
    ar: 'سيراه الطهاة الذين تناسب تخصصاتهم في عمود الطلبات الخاصة لديهم. ستجده تحت طلباتي في ملفك الشخصي.',
  },
  done: { en: 'Done', ar: 'تم' },
  whatDoYouWantCooked: { en: 'What do you want cooked?', ar: 'ماذا تريد أن يُطهى؟' },
  requestPlaceholder: {
    en: 'Iftar platter for 8 — something home-style with rice, a stew and a vegetarian side…',
    ar: 'طبق إفطار لثمانية أشخاص — أكل بيتي مع أرز ويخنة وطبق نباتي جانبي…',
  },
  desiredDate: { en: 'Desired date', ar: 'التاريخ المطلوب' },
  budgetRange: { en: 'Budget range', ar: 'نطاق الميزانية' },
  kindOfCooking: { en: 'Kind of cooking', ar: 'نوع الطهي' },
  helpsMatchCook: { en: 'helps us match a cook', ar: 'يساعدنا على اختيار الطاهي المناسب' },

  // Craver profile
  backToMeals: { en: 'Back to meals', ar: 'العودة إلى الوجبات' },
  statOrders: { en: 'Orders', ar: 'الطلبات' },
  statReviews: { en: 'Reviews', ar: 'التقييمات' },
  statLiked: { en: 'Liked', ar: 'المفضلة' },
  myDetails: { en: 'My details', ar: 'بياناتي' },
  myDetailsHint: {
    en: 'Keep your taste profile up to date so recommendations stay useful.',
    ar: 'حافظ على تحديث ملف تفضيلاتك حتى تبقى التوصيات مفيدة.',
  },
  nameLabel: { en: 'Name', ar: 'الاسم' },
  saveChanges: { en: 'Save changes', ar: 'حفظ التغييرات' },
  savedToSession: { en: 'Saved to this session.', ar: 'تم الحفظ لهذه الجلسة.' },
  myOrders: { en: 'My Orders', ar: 'طلباتي' },
  inTotal: { en: 'in total', ar: 'بالإجمالي' },
  noOrdersYet: { en: 'No orders yet', ar: 'لا توجد طلبات بعد' },
  noOrdersMsg: {
    en: 'When you order a dish it lands here, and you can chat with the cook once it is accepted.',
    ar: 'عند طلب طبق سيظهر هنا، ويمكنك الدردشة مع الطاهي بمجرد قبول الطلب.',
  },
  browseMeals: { en: 'Browse meals', ar: 'تصفح الوجبات' },
  myRequests: { en: 'My Requests', ar: 'طلباتي الخاصة' },
  myRequestsSubtitle: {
    en: 'Custom meals you have asked cooks for',
    ar: 'الوجبات المخصصة التي طلبتها من الطهاة',
  },
  noRequestsYet: { en: 'No special requests yet', ar: 'لا توجد طلبات خاصة بعد' },
  noRequestsMsg: {
    en: 'Describe a meal nobody is cooking yet and nearby cooks can offer to make it.',
    ar: 'صف وجبة لا يطهوها أحد بعد، ويمكن للطهاة القريبين عرض تحضيرها.',
  },
  tookItOn: { en: 'took it on', ar: 'تولى هذا الطلب' },
  cooksLiked: { en: "Cooks I've Liked", ar: 'الطهاة الذين أعجبوني' },
  cooksLikedSubtitle: { en: 'Kitchens you rated highly', ar: 'المطابخ التي قيّمتها عالياً' },
  nobodyYet: { en: 'Nobody yet', ar: 'لا أحد بعد' },
  nobodyYetMsg: {
    en: 'Rate a delivered order 4 stars or more and that cook shows up here.',
    ar: 'قيّم طلباً تم توصيله بـ 4 نجوم أو أكثر وسيظهر هذا الطاهي هنا.',
  },
  myReviewsTitle: { en: 'My Reviews', ar: 'تقييماتي' },
  leftSoFar: { en: 'left so far', ar: 'تم إرسالها حتى الآن' },
  noReviewsYetTitle: { en: 'No reviews yet', ar: 'لا توجد تقييمات بعد' },
  noReviewsMsg: {
    en: 'Your ratings collect here once you have reviewed a delivered order.',
    ar: 'ستظهر تقييماتك هنا بمجرد تقييم طلب تم توصيله.',
  },
  onTimeLabel: { en: 'On time', ar: 'في الموعد' },

  // Rating prompt
  howWasIt: { en: 'How was it?', ar: 'كيف كانت التجربة؟' },
  onTimeDelivery: { en: 'On-time delivery', ar: 'التوصيل في الموعد' },
  leaveShortReview: { en: 'Leave a short review (optional)', ar: 'اترك تقييماً قصيراً (اختياري)' },
  submitRating: { en: 'Submit rating', ar: 'إرسال التقييم' },
  rated: { en: 'Rated', ar: 'تم التقييم' },

  // Status labels
  statusPending: { en: 'Pending', ar: 'قيد الانتظار' },
  statusAccepted: { en: 'Accepted', ar: 'مقبول' },
  statusDelivered: { en: 'Delivered', ar: 'تم التوصيل' },
  statusDeclined: { en: 'Declined', ar: 'مرفوض' },

  // Requests / chat
  kmAway: { en: 'km away', ar: 'كم' },
  accept: { en: 'Accept', ar: 'قبول' },
  decline: { en: 'Decline', ar: 'رفض' },
  passedOnThisOne: { en: 'You passed on this one.', ar: 'لقد تجاوزت هذا الطلب.' },
  chat: { en: 'Chat', ar: 'دردشة' },
  chatWithCraver: { en: 'Chat with craver', ar: 'دردشة مع الزبون' },
  noMessagesYet: { en: 'No messages yet', ar: 'لا توجد رسائل بعد' },
  noMessagesCraverMsg: {
    en: 'Say hello, ask for a change to the recipe, or wait for a price proposal.',
    ar: 'قل مرحباً، اطلب تعديلاً على الوصفة، أو انتظر عرض سعر.',
  },
  noMessagesCookMsg: {
    en: 'Introduce yourself, or propose a price and date to get things moving.',
    ar: 'عرّف عن نفسك، أو اقترح سعراً وموعداً لبدء الطلب.',
  },
  proposePriceDate: { en: 'Propose price & date', ar: 'اقترح سعراً وموعداً' },
  chatPlaceholderCraver: { en: 'Can you make it less spicy?', ar: 'هل يمكن أن يكون أقل حرارة؟' },
  chatPlaceholderCook: { en: 'Type a message', ar: 'اكتب رسالة' },
  priceEgp: { en: 'Price (EGP)', ar: 'السعر (ج.م)' },
  dateTime: { en: 'Date & time', ar: 'التاريخ والوقت' },
  optionalNote: { en: 'Optional note', ar: 'ملاحظة اختيارية' },
  sendProposal: { en: 'Send proposal', ar: 'إرسال العرض' },
  priceDateProposalHeader: { en: 'Price & date proposal', ar: 'عرض السعر والموعد' },
  priceLabel: { en: 'Price', ar: 'السعر' },
  whenLabel: { en: 'When', ar: 'الموعد' },
  waitingForReply: { en: 'Waiting for a reply…', ar: 'في انتظار الرد…' },

  // Cook profile page
  kitchenNotFound: { en: 'Kitchen not found', ar: 'المطبخ غير موجود' },
  kitchenNotFoundMsg: { en: 'That cook is not on Beity yet.', ar: 'هذا الطاهي غير مسجل في بيتي بعد.' },
  ratingFromN: { en: 'from', ar: 'من' },
  ratings: { en: 'ratings', ar: 'تقييمات' },
  noRatingsYet: { en: 'No ratings yet', ar: 'لا توجد تقييمات بعد' },
  myMenu: { en: 'My Menu', ar: 'قائمة طعامي' },
  onOffer: { en: 'on offer', ar: 'متاحة' },
  from2: { en: 'from', ar: 'من' },
  addDish: { en: 'Add Dish', ar: 'إضافة طبق' },
  menuEmptyTitle: { en: 'Your menu is empty', ar: 'قائمتك فارغة' },
  menuEmptyOwnerMsg: {
    en: 'Add your first dish and it appears in the cravers feed straight away.',
    ar: 'أضف طبقك الأول وسيظهر مباشرة في صفحة الزبائن.',
  },
  menuEmptyPublicTitle: { en: 'No dishes listed yet', ar: 'لا توجد أطباق مدرجة بعد' },
  menuEmptyPublicMsg: {
    en: 'This cook has not published any dishes yet. Try again soon.',
    ar: 'لم ينشر هذا الطاهي أي أطباق بعد. حاول مجدداً قريباً.',
  },
  specialRequestsHeader: { en: 'Special Requests', ar: 'الطلبات الخاصة' },
  matchedTo: { en: 'Matched to', ar: 'مطابق لـ' },
  noRequestsRightNow: { en: 'No requests right now', ar: 'لا توجد طلبات حالياً' },
  noRequestsRightNowMsg: {
    en: 'When a craver nearby posts something in your specialty, it shows up here.',
    ar: 'عندما ينشر زبون قريب طلباً ضمن تخصصك، سيظهر هنا.',
  },

  // Cook sidebar
  myKitchen: { en: 'My kitchen', ar: 'مطبخي' },
  currentOrders: { en: 'Current Orders', ar: 'الطلبات الحالية' },
  cookingNowHint: { en: 'Cooking now', ar: 'قيد الطهي الآن' },
  pastOrders: { en: 'Past Orders', ar: 'الطلبات السابقة' },
  deliveredHint: { en: 'Delivered', ar: 'تم التوصيل' },
  transactionTracker: { en: 'Transaction Tracker', ar: 'متتبع المعاملات' },
  earningsHint: { en: 'Earnings', ar: 'الأرباح' },
  signOut: { en: 'Sign out', ar: 'تسجيل الخروج' },

  // Cook details panel
  cookDetailsLabel: { en: 'Cook Details', ar: 'بيانات الطاهي' },
  dishesOnMenu: { en: 'dishes on menu', ar: 'أطباق في القائمة' },

  // Menu item row
  toldOnRequest: { en: 'Told on request.', ar: 'تُذكر عند الطلب.' },
  reviewsFromCravers: { en: 'Reviews from cravers', ar: 'تقييمات الزبائن' },
  noReviewsFreshMenu: {
    en: 'No reviews yet — this dish is fresh on the menu.',
    ar: 'لا توجد تقييمات بعد — هذا الطبق جديد في القائمة.',
  },

  // Add dish modal
  addDishTitle: { en: 'Add a dish', ar: 'إضافة طبق' },
  addDishSubtitle: {
    en: 'It goes straight onto your menu and into the cravers feed.',
    ar: 'سيُضاف مباشرة إلى قائمتك وإلى صفحة الزبائن.',
  },
  addToMyMenu: { en: 'Add to My Menu', ar: 'إضافة إلى قائمتي' },
  dishNameLabel: { en: 'Dish name', ar: 'اسم الطبق' },
  caloriesLabel: { en: 'Calories', ar: 'السعرات الحرارية' },
  descriptionLabel: { en: 'Description', ar: 'الوصف' },
  commaSeparatedHint: { en: 'comma separated', ar: 'مفصولة بفواصل' },

  // Orders modal
  currentOrdersSubtitle: {
    en: 'Everything you owe a kitchen shift today.',
    ar: 'كل ما عليك تحضيره في مناوبة اليوم.',
  },
  pastOrdersSubtitle: { en: 'Delivered and closed out.', ar: 'تم توصيلها وإغلاقها.' },
  nothingCookingNow: { en: 'Nothing cooking right now', ar: 'لا يوجد شيء قيد الطهي الآن' },
  nothingCookingMsg: {
    en: 'New orders land here the moment a craver confirms one.',
    ar: 'تظهر الطلبات الجديدة هنا فور تأكيد الزبون لها.',
  },
  noPastOrdersYet: { en: 'No past orders yet', ar: 'لا توجد طلبات سابقة بعد' },
  noPastOrdersMsg: { en: 'Delivered orders are archived here.', ar: 'تُؤرشف الطلبات المُوصّلة هنا.' },

  // Transaction tracker
  transactionSubtitle: {
    en: 'What you have earned, and what is still on its way.',
    ar: 'ما ربحته، وما لا يزال في طريقه إليك.',
  },
  thisWeek: { en: 'This week', ar: 'هذا الأسبوع' },
  onLastWeek: { en: 'on last week', ar: 'مقارنة بالأسبوع الماضي' },
  pendingPayout: { en: 'Pending payout', ar: 'مستحقات قيد التحويل' },
  clearsSunday: { en: 'Clears Sunday', ar: 'يُصرف يوم الأحد' },
  paidOut: { en: 'Paid out', ar: 'تم صرفه' },
  last6Weeks: { en: 'Last 6 weeks', ar: 'آخر 6 أسابيع' },
  avgOrder: { en: 'Avg order', ar: 'متوسط الطلب' },
  ordersDone: { en: 'orders done', ar: 'طلبات مكتملة' },
  earningsByWeek: { en: 'Earnings by week', ar: 'الأرباح الأسبوعية' },
  egyptianPoundsCommission: {
    en: 'Egyptian pounds, after Beity commission',
    ar: 'بالجنيه المصري، بعد خصم عمولة بيتي',
  },
  hoverABar: { en: 'Hover a bar', ar: 'مرر الفأرة فوق أي عمود' },
  demoFiguresNote: {
    en: 'Demo figures — no payment processor is wired up yet.',
    ar: 'أرقام تجريبية — لم يتم ربط نظام دفع فعلي بعد.',
  },

  // Misc units
  egp: { en: 'EGP', ar: 'ج.م' },
  kcal: { en: 'kcal', ar: 'سعرة حرارية' },
}

/** Look up a UI dictionary entry for the given language, falling back to English then the key. */
export function t(key, lang = 'en') {
  const entry = UI_TEXT[key]
  if (!entry) return key
  return entry[lang] || entry.en || key
}

/**
 * Read a bilingual data field ({ en, ar }) in the given language. Falls back
 * to English, and passes plain strings through untouched (covers any legacy
 * or user-typed value that was never wrapped bilingually).
 */
export function tr(field, lang = 'en') {
  if (field == null) return field
  if (typeof field === 'string') return field
  return field[lang] || field.en || ''
}

/** Map an array of bilingual fields (e.g. dish.ingredients) to plain strings. */
export function trList(list, lang = 'en') {
  return (list || []).map((item) => tr(item, lang))
}

/** Wrap a plain string typed by a user (form input) as a bilingual field — same text either way, since we don't machine-translate user content. */
export function asBilingual(text) {
  return { en: text, ar: text }
}

/** Swap the "EGP" unit in an already-composed string for the current language's currency label. */
export function withCurrency(str, lang = 'en') {
  if (lang === 'en') return str
  return String(str).replace(/EGP/g, UI_TEXT.egp.ar)
}

// ---- Canonical enum label maps -------------------------------------------
// The values below (e.g. 'Breakfast', 'Spicy', 'Egyptian Home Cooking') stay
// as the canonical English strings in data/filters.js and seed data, so
// filtering/matching logic never has to care about language. These maps only
// translate them for display.

export const CATEGORY_LABELS = {
  Breakfast: { en: 'Breakfast', ar: 'فطور' },
  Lunch: { en: 'Lunch', ar: 'غداء' },
  Dinner: { en: 'Dinner', ar: 'عشاء' },
  Dessert: { en: 'Dessert', ar: 'حلويات' },
}

export const TASTE_LABELS = {
  Sweet: { en: 'Sweet', ar: 'حلو' },
  Sour: { en: 'Sour', ar: 'حامض' },
  Spicy: { en: 'Spicy', ar: 'حار' },
  Savoury: { en: 'Savoury', ar: 'مالح' },
}

export const DIETARY_LABELS = {
  'High-calorie': { en: 'High-calorie', ar: 'عالي السعرات' },
  'Low-calorie': { en: 'Low-calorie', ar: 'منخفض السعرات' },
  Vegetarian: { en: 'Vegetarian', ar: 'نباتي' },
}

export const CUISINE_TAG_LABELS = {
  'Egyptian Home Cooking': { en: 'Egyptian Home Cooking', ar: 'أكل بيتي مصري' },
  'Baladi Pastry': { en: 'Baladi Pastry', ar: 'معجنات بلدي' },
  Desserts: { en: 'Desserts', ar: 'حلويات' },
  Grills: { en: 'Grills', ar: 'مشويات' },
  Seafood: { en: 'Seafood', ar: 'مأكولات بحرية' },
  'Street Food': { en: 'Street Food', ar: 'أكل الشارع' },
  Vegetarian: { en: 'Vegetarian', ar: 'نباتي' },
  'Rice & Grains': { en: 'Rice & Grains', ar: 'أرز وحبوب' },
  'Soups & Stews': { en: 'Soups & Stews', ar: 'شوربات ويخنات' },
}

export const PREFERENCE_LABELS = {
  Vegetarian: { en: 'Vegetarian', ar: 'نباتي' },
  Spicy: { en: 'Spicy', ar: 'حار' },
  'Low-calorie': { en: 'Low-calorie', ar: 'منخفض السعرات' },
  'High-protein': { en: 'High-protein', ar: 'عالي البروتين' },
  'Sweet tooth': { en: 'Sweet tooth', ar: 'يحب الحلويات' },
  'Home-style': { en: 'Home-style', ar: 'أكل بيتي' },
  Grills: { en: 'Grills', ar: 'مشويات' },
  'Baked & pastry': { en: 'Baked & pastry', ar: 'مخبوزات ومعجنات' },
}

export const WEEKDAY_LABELS = {
  Saturday: { en: 'Saturday', ar: 'السبت' },
  Sunday: { en: 'Sunday', ar: 'الأحد' },
  Monday: { en: 'Monday', ar: 'الإثنين' },
  Tuesday: { en: 'Tuesday', ar: 'الثلاثاء' },
  Wednesday: { en: 'Wednesday', ar: 'الأربعاء' },
  Thursday: { en: 'Thursday', ar: 'الخميس' },
  Friday: { en: 'Friday', ar: 'الجمعة' },
}

// Abbreviated for tight spots (the "Weekly · Sun" badge). Arabic weekday names
// are already short, so they carry over unchanged.
export const WEEKDAY_SHORT_LABELS = {
  Saturday: { en: 'Sat', ar: 'السبت' },
  Sunday: { en: 'Sun', ar: 'الأحد' },
  Monday: { en: 'Mon', ar: 'الإثنين' },
  Tuesday: { en: 'Tue', ar: 'الثلاثاء' },
  Wednesday: { en: 'Wed', ar: 'الأربعاء' },
  Thursday: { en: 'Thu', ar: 'الخميس' },
  Friday: { en: 'Fri', ar: 'الجمعة' },
}

export const STATUS_LABELS = {
  Pending: { en: 'Pending', ar: 'قيد الانتظار' },
  Accepted: { en: 'Accepted', ar: 'مقبول' },
  Delivered: { en: 'Delivered', ar: 'تم التوصيل' },
  Declined: { en: 'Declined', ar: 'مرفوض' },
  pending: { en: 'Pending', ar: 'قيد الانتظار' },
  accepted: { en: 'Accepted', ar: 'مقبول' },
  declined: { en: 'Declined', ar: 'مرفوض' },
}

const BUDGET_LABELS = {
  'Under 300 EGP': { en: 'Under 300 EGP', ar: 'أقل من 300 ج.م' },
  '300 – 600 EGP': { en: '300 – 600 EGP', ar: '300 – 600 ج.م' },
  '600 – 1,000 EGP': { en: '600 – 1,000 EGP', ar: '600 – 1,000 ج.م' },
  '1,000 EGP +': { en: '1,000 EGP +', ar: '+1,000 ج.م' },
}

/** Generic lookup against one of the enum maps above, with graceful fallback. */
export function label(map, key, lang = 'en') {
  const entry = map[key]
  if (!entry) return key
  return entry[lang] || entry.en || key
}

export function budgetLabel(key, lang = 'en') {
  return label(BUDGET_LABELS, key, lang)
}

// ---- Dates ----------------------------------------------------------------
// Dates entered through the calendar picker are stored as ISO `YYYY-MM-DD`.
// Seeded/legacy values are free text ("Every Sunday", "Today, 19:00"), so the
// formatter passes anything non-ISO straight through untouched.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

/** Free-text date values that still deserve a translation. */
const DATE_TOKENS = {
  Flexible: { en: 'Flexible', ar: 'مرن' },
  'Every Sunday': { en: 'Every Sunday', ar: 'كل يوم أحد' },
  'To be confirmed': { en: 'To be confirmed', ar: 'يتم تأكيده لاحقاً' },
}

/** `2026-09-19` -> "Fri 19 Sep" / "الجمعة ١٩ سبتمبر" (Latin digits kept for consistency). */
export function formatDate(value, lang = 'en') {
  if (!value) return ''
  if (!ISO_DATE.test(value)) return label(DATE_TOKENS, value, lang)

  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  if (Number.isNaN(date.getTime())) return value

  const locale = lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB'
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(date)
  } catch {
    return value
  }
}
