CREATE TABLE IF NOT EXISTS cooks (
  id TEXT PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  location TEXT NOT NULL,
  bio_en TEXT NOT NULL,
  bio_ar TEXT NOT NULL,
  cuisine_tags TEXT NOT NULL,
  rating REAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  avatar_seed TEXT,
  joined TEXT,
  latitude REAL,
  longitude REAL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cravers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  preferences TEXT DEFAULT '[]',
  favorite_foods TEXT,
  allergies TEXT,
  avatar_seed TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS dishes (
  id TEXT PRIMARY KEY,
  cook_id TEXT NOT NULL REFERENCES cooks(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  photo TEXT,
  price REAL NOT NULL,
  calories INTEGER,
  category TEXT NOT NULL,
  taste_tags TEXT NOT NULL DEFAULT '[]',
  dietary_tags TEXT NOT NULL DEFAULT '[]',
  description_en TEXT,
  description_ar TEXT,
  ingredients_en TEXT NOT NULL DEFAULT '[]',
  ingredients_ar TEXT NOT NULL DEFAULT '[]',
  rating REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  dish_id TEXT NOT NULL REFERENCES dishes(id) ON DELETE CASCADE,
  cook_id TEXT NOT NULL REFERENCES cooks(id) ON DELETE CASCADE,
  craver_id TEXT REFERENCES cravers(id),
  craver_name TEXT NOT NULL,
  taste_rating INTEGER NOT NULL,
  on_time_rating INTEGER NOT NULL,
  review_text TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS threads (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  request_id TEXT,
  cook_id TEXT REFERENCES cooks(id),
  craver_id TEXT,
  craver_name TEXT,
  subject TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  type TEXT NOT NULL,
  body TEXT,
  proposed_price REAL,
  proposed_date TEXT,
  proposal_note TEXT,
  proposal_status TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  dish_id TEXT NOT NULL REFERENCES dishes(id),
  cook_id TEXT NOT NULL REFERENCES cooks(id),
  craver_id TEXT NOT NULL,
  craver_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  is_recurring INTEGER DEFAULT 0,
  recurring_day TEXT,
  taste_rating INTEGER,
  on_time_rating INTEGER,
  thread_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS requests (
  id TEXT PRIMARY KEY,
  craver_id TEXT NOT NULL,
  craver_name TEXT NOT NULL,
  description TEXT NOT NULL,
  desired_date TEXT NOT NULL,
  budget TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'pending',
  accepted_by TEXT REFERENCES cooks(id),
  distance_km REAL DEFAULT 2.5,
  latitude REAL,
  longitude REAL,
  thread_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS demo_users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_seed TEXT,
  account_id TEXT NOT NULL
);

