// Filter groups shown in the craver's left rail. `field` maps onto the dish shape.
export const FILTER_GROUPS = [
  {
    id: 'category',
    label: 'Meal',
    field: 'category',
    kind: 'single-value', // dish.category is a string
    options: ['Breakfast', 'Lunch', 'Dinner', 'Dessert'],
  },
  {
    id: 'taste',
    label: 'Taste',
    field: 'taste',
    kind: 'multi-value', // dish.taste is an array
    options: ['Sweet', 'Sour', 'Spicy'],
  },
  {
    id: 'dietary',
    label: 'Dietary',
    field: 'dietary',
    kind: 'multi-value', // dish.dietary is an array
    options: ['High-calorie', 'Low-calorie', 'Vegetarian'],
  },
]

// Offered to cravers at signup as their taste profile.
export const PREFERENCE_OPTIONS = [
  'Vegetarian',
  'Spicy',
  'Low-calorie',
  'High-protein',
  'Sweet tooth',
  'Home-style',
  'Grills',
  'Baked & pastry',
]

export const CUISINE_TAG_OPTIONS = [
  'Egyptian Home Cooking',
  'Baladi Pastry',
  'Desserts',
  'Grills',
  'Seafood',
  'Street Food',
  'Vegetarian',
  'Rice & Grains',
  'Soups & Stews',
]

export const MEAL_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert']
export const TASTE_OPTIONS = ['Sweet', 'Sour', 'Spicy', 'Savoury']
export const DIETARY_OPTIONS = ['High-calorie', 'Low-calorie', 'Vegetarian']

// Delivery day for a weekly recurring order. Saturday-first, as the week runs
// in Egypt. Stored on the order as this canonical English name and only
// translated for display (see WEEKDAY_LABELS in i18n/translations.js).
export const WEEK_DAYS = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
]

/** Today's weekday name — the sensible default when the craver flips "weekly" on. */
export function todayWeekDay() {
  const JS_DAY_ORDER = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  return JS_DAY_ORDER[new Date().getDay()]
}
