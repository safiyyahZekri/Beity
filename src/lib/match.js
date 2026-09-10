// Preference -> dish/cook attribute mapping used to rank recommendations.
const PREFERENCE_RULES = {
  Vegetarian: (d) => d.dietary.includes('Vegetarian'),
  Spicy: (d) => d.taste.includes('Spicy'),
  'Low-calorie': (d) => d.dietary.includes('Low-calorie'),
  'Sweet tooth': (d) => d.taste.includes('Sweet'),
  'High-protein': (d, cook) => cook?.cuisineTags?.includes('Grills') || d.dietary.includes('High-calorie'),
  'Home-style': (d, cook) => cook?.cuisineTags?.includes('Egyptian Home Cooking'),
  Grills: (d, cook) => cook?.cuisineTags?.includes('Grills'),
  'Baked & pastry': (d, cook) =>
    cook?.cuisineTags?.includes('Baladi Pastry') || cook?.cuisineTags?.includes('Desserts'),
}

export function preferenceScore(dish, cook, preferences = []) {
  return preferences.reduce((score, pref) => {
    const rule = PREFERENCE_RULES[pref]
    return score + (rule && rule(dish, cook) ? 1 : 0)
  }, 0)
}

// Dish/cook name, description and ingredients are bilingual `{ en, ar }`
// objects — search across both languages so switching the toggle never
// hides a dish that would otherwise match.
const bilingualText = (field) => (typeof field === 'string' ? field : `${field?.en || ''} ${field?.ar || ''}`)

export function matchesSearch(dish, cook, query) {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  return (
    bilingualText(dish.name).toLowerCase().includes(q) ||
    dish.ingredients.some((i) => bilingualText(i).toLowerCase().includes(q)) ||
    bilingualText(cook?.name).toLowerCase().includes(q)
  )
}

/** OR within a filter group, AND across groups. */
export function matchesFilters(dish, selected) {
  const { category = [], taste = [], dietary = [] } = selected
  if (category.length && !category.includes(dish.category)) return false
  if (taste.length && !taste.some((t) => dish.taste.includes(t))) return false
  if (dietary.length && !dietary.some((t) => dish.dietary.includes(t))) return false
  return true
}

/**
 * Special requests a cook should see: tag overlap first, and if nothing
 * overlaps we fall back to everything pending so the column is never bare.
 */
export function requestsForCook(requests, cook) {
  if (!cook) return []
  const mine = requests.filter((r) => r.status === 'accepted' && r.acceptedBy === cook.id)
  const tags = cook.cuisineTags || []
  const pending = requests.filter((r) => r.status === 'pending')
  const matched = pending.filter((r) => (r.tags || []).some((t) => tags.includes(t)))
  return [...mine, ...(matched.length ? matched : pending)]
}
