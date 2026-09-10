// Serializers ensure the database rows match the exact shape expected by
// frontend components (bilingual { en, ar } objects, camelCase, JSON arrays).

export function serializeCook(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: { en: row.name_en, ar: row.name_ar },
    location: row.location,
    bio: { en: row.bio_en, ar: row.bio_ar },
    cuisineTags: safeJsonParse(row.cuisine_tags, []),
    rating: Number(row.rating) || 0,
    ratingCount: Number(row.rating_count) || 0,
    avatarSeed: row.avatar_seed || null,
    joined: row.joined || 'Joined recently',
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
  };
}

export function serializeDish(row, reviews = []) {
  if (!row) return null;
  const ingredientsEn = safeJsonParse(row.ingredients_en, []);
  const ingredientsAr = safeJsonParse(row.ingredients_ar, []);
  const ingredients = ingredientsEn.map((en, idx) => ({
    en,
    ar: ingredientsAr[idx] || en,
  }));

  return {
    id: row.id,
    cookId: row.cook_id,
    name: { en: row.name_en, ar: row.name_ar },
    photo: row.photo || null,
    price: Number(row.price) || 0,
    calories: row.calories ? Number(row.calories) : null,
    category: row.category,
    taste: safeJsonParse(row.taste_tags, []),
    dietary: safeJsonParse(row.dietary_tags, []),
    description: {
      en: row.description_en || '',
      ar: row.description_ar || '',
    },
    ingredients,
    rating: Number(row.rating) || 0,
    reviews: reviews.map((r) => ({
      by: r.craver_name,
      rating: Number(r.taste_rating) || 5,
      text: r.review_text || '',
      at: r.created_at || 'Recently',
    })),
  };
}

export function serializeCraver(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    location: row.location || 'Cairo',
    preferences: safeJsonParse(row.preferences, []),
    favoriteFoods: row.favorite_foods || '',
    allergies: row.allergies || '',
    avatarSeed: row.avatar_seed || null,
  };
}

export function serializeOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    dishId: row.dish_id,
    cookId: row.cook_id,
    craverId: row.craver_id,
    craverName: row.craver_name,
    qty: Number(row.quantity) || 1,
    total: Number(row.total) || 0,
    status: row.status,
    placedAt: row.created_at,
    rating: row.taste_rating
      ? { taste: Number(row.taste_rating), onTime: Number(row.on_time_rating) }
      : null,
    threadId: row.thread_id,
    recurring: Boolean(row.is_recurring),
    recurringDay: row.recurring_day || null,
  };
}

export function serializeRequest(row) {
  if (!row) return null;
  return {
    id: row.id,
    craverId: row.craver_id,
    craverName: row.craver_name,
    description: row.description,
    date: row.desired_date,
    budget: row.budget,
    status: row.status,
    distanceKm: row.distance_km != null ? Number(row.distance_km) : 2.5,
    postedAt: row.created_at,
    threadId: row.thread_id,
    tags: safeJsonParse(row.tags, []),
    acceptedBy: row.accepted_by || null,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
  };
}

export function serializeMessage(row) {
  if (!row) return null;
  return {
    id: row.id,
    threadId: row.thread_id,
    from: row.sender_role,
    senderName: row.sender_name,
    type: row.type,
    body: row.body || '',
    price: row.proposed_price != null ? Number(row.proposed_price) : null,
    date: row.proposed_date || null,
    note: row.proposal_note || null,
    status: row.proposal_status || null,
    at: row.created_at,
  };
}

export function serializeThread(row, messages = []) {
  if (!row) return null;
  return {
    id: row.id,
    cookId: row.cook_id || null,
    craverId: row.craver_id || null,
    craverName: row.craver_name || null,
    subject: row.subject || '',
    messages: messages.map(serializeMessage),
  };
}

export function serializeReview(row) {
  if (!row) return null;
  return {
    id: row.id,
    dishId: row.dish_id,
    cookId: row.cook_id,
    craverId: row.craver_id,
    craverName: row.craver_name,
    taste: Number(row.taste_rating),
    onTime: Number(row.on_time_rating),
    text: row.review_text || '',
    at: row.created_at,
  };
}

export function serializeDemoUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    role: row.role,
    name: row.name,
    avatarSeed: row.avatar_seed,
    accountId: row.account_id,
  };
}

function safeJsonParse(val, fallback) {
  if (val == null) return fallback;
  if (typeof val !== 'string') return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

