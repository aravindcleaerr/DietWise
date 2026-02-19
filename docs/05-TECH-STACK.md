# DietWise - Tech Stack Details

## Complete Stack

```
FRONTEND
  Framework:          Next.js 14/15 (React 18/19, TypeScript)
  Styling:            Tailwind CSS 3.4+
  UI Components:      shadcn/ui (Radix UI primitives)
  State Management:   Zustand
  Forms:              React Hook Form + Zod validation
  Charts (primary):   Recharts
  Charts (dashboard): Tremor
  Charts (gauges):    react-circular-progressbar
  Date handling:      date-fns
  Icons:              Lucide React
  Animations:         Framer Motion (subtle, respects reduced-motion)
  Toasts:             Sonner

BACKEND
  Database:           Supabase (PostgreSQL)
  Auth:               Supabase Auth
  API:                Next.js API Routes / Supabase Edge Functions
  File Storage:       Supabase Storage

OFFLINE / PWA
  Service Worker:     Serwist (next-pwa successor) + Workbox
  Offline DB:         Dexie.js (IndexedDB)
  Sync:               Custom background sync with Workbox BackgroundSync

NOTIFICATIONS
  Push:               Web Push API + Supabase pg_cron
  In-app:             Sonner toast library

DEPLOYMENT
  Hosting:            Vercel (free tier, optimized for Next.js)
  CDN:                Vercel Edge Network (automatic)
  Analytics:          Vercel Analytics or Plausible (privacy-friendly)

DEVELOPMENT
  Package Manager:    pnpm
  Linting:            ESLint + Prettier
  Testing:            Vitest + React Testing Library
  E2E Testing:        Playwright
```

---

## Database Schema (Supabase PostgreSQL)

```sql
-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  date_of_birth DATE,
  height_cm NUMERIC,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- USER GOALS
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_type TEXT CHECK (goal_type IN ('weight_loss', 'weight_gain', 'maintenance', 'muscle_gain')),
  target_weight_kg NUMERIC,
  target_calories_daily INTEGER,
  target_protein_g INTEGER,
  target_carbs_g INTEGER,
  target_fat_g INTEGER,
  target_water_ml INTEGER,
  start_date DATE,
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- DAILY LOGS (core table - one row per day)
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  total_calories NUMERIC DEFAULT 0,
  total_protein_g NUMERIC DEFAULT 0,
  total_carbs_g NUMERIC DEFAULT 0,
  total_fat_g NUMERIC DEFAULT 0,
  total_fiber_g NUMERIC DEFAULT 0,
  total_water_ml INTEGER DEFAULT 0,
  weight_kg NUMERIC,
  mood INTEGER CHECK (mood BETWEEN 1 AND 5),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  sleep_hours NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, log_date)
);

-- MEAL ENTRIES
CREATE TABLE meal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
  meal_type TEXT CHECK (meal_type IN ('pre_breakfast', 'breakfast', 'mid_morning', 'lunch', 'evening_snack', 'dinner', 'post_dinner')),
  meal_time TIME,
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FOOD ITEMS (per meal entry)
CREATE TABLE food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_entry_id UUID REFERENCES meal_entries(id) ON DELETE CASCADE,
  food_id UUID REFERENCES food_database(id),
  custom_name TEXT,
  serving_size NUMERIC,
  serving_unit TEXT,
  calories NUMERIC,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  fiber_g NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FOOD DATABASE (reference table)
CREATE TABLE food_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_hindi TEXT,
  category TEXT CHECK (category IN ('bread', 'rice', 'dal', 'sabzi', 'breakfast', 'dairy', 'fruit', 'nuts_seeds', 'snack', 'drink', 'sweet', 'other')),
  brand TEXT,
  serving_size_default NUMERIC,
  serving_unit_default TEXT,
  calories_per_serving NUMERIC,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  fiber_g NUMERIC,
  barcode TEXT,
  source TEXT CHECK (source IN ('curated', 'user_created', 'usda', 'open_food_facts')),
  is_vegetarian BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- EXERCISE LOGS
CREATE TABLE exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
  exercise_type TEXT CHECK (exercise_type IN ('cardio', 'strength', 'flexibility', 'balance')),
  exercise_name TEXT NOT NULL,
  duration_minutes INTEGER,
  calories_burned NUMERIC,
  intensity TEXT CHECK (intensity IN ('low', 'medium', 'high')),
  sets INTEGER,
  reps INTEGER,
  distance_km NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- WATER LOGS
CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  drink_type TEXT DEFAULT 'water',
  logged_at TIMESTAMPTZ DEFAULT now()
);

-- ACHIEVEMENTS / BADGES
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  earned_at TIMESTAMPTZ DEFAULT now()
);

-- STREAKS
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  streak_type TEXT CHECK (streak_type IN ('logging', 'exercise', 'water', 'weight')),
  current_count INTEGER DEFAULT 0,
  longest_count INTEGER DEFAULT 0,
  last_logged_date DATE,
  freeze_available BOOLEAN DEFAULT true,
  UNIQUE(user_id, streak_type)
);

-- MEAL TEMPLATES (for quick re-logging)
CREATE TABLE meal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meal_type TEXT,
  foods JSONB NOT NULL,
  total_calories NUMERIC,
  total_protein_g NUMERIC,
  total_carbs_g NUMERIC,
  total_fat_g NUMERIC,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, log_date);
CREATE INDEX idx_meal_entries_daily_log ON meal_entries(daily_log_id);
CREATE INDEX idx_food_items_meal_entry ON food_items(meal_entry_id);
CREATE INDEX idx_food_database_name ON food_database(name);
CREATE INDEX idx_food_database_category ON food_database(category);
CREATE INDEX idx_exercise_logs_daily_log ON exercise_logs(daily_log_id);
```

---

## Data Persistence Architecture

```
Layer 1: React State (Zustand)     -- UI state, form state
Layer 2: IndexedDB (Dexie.js)      -- Full offline data store
Layer 3: Supabase (PostgreSQL)     -- Cloud storage, sync, auth
```

### Sync Strategy
```
User logs meal -> Save to Zustand (instant UI update)
              -> Save to Dexie/IndexedDB (offline persistence)
              -> POST to Supabase (cloud backup)
                 |-- If offline: queue in IndexedDB sync table
                 |-- When online: background sync with conflict resolution
```

### Conflict Resolution
Last-write-wins with timestamps. For single-user app, conflicts are rare. Use `updated_at` column with optimistic concurrency for multi-device support.

---

## Chart Library Mapping

| Feature | Chart Type | Library |
|---------|-----------|---------|
| Weight over time | Line chart + goal line | Recharts `<LineChart>` |
| Daily calorie progress | Circular progress | `react-circular-progressbar` |
| Macro breakdown | Donut chart | Recharts `<PieChart>` |
| Weekly calorie trend | Bar chart | Recharts `<BarChart>` |
| Calories in vs. out | Composed chart | Recharts `<ComposedChart>` |
| Water intake | Progress bar | shadcn/ui `<Progress>` |
| Activity streak | Heatmap calendar | `react-activity-calendar` |
| Nutrient trends (30d) | Area chart | Recharts `<AreaChart>` |
| Dashboard KPI cards | Spark lines | Tremor `<Card>`, `<Metric>` |
| BMI gauge | Radial gauge | Recharts `<RadialBarChart>` |

---

## PWA Configuration

### Web App Manifest
```json
{
  "name": "DietWise - Smart Diet Tracker",
  "short_name": "DietWise",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#2D7D46",
  "background_color": "#FAFAFA",
  "start_url": "/dashboard",
  "scope": "/",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Workbox Caching Strategies
- `StaleWhileRevalidate` - Food database (show cached, update in background)
- `CacheFirst` - Static assets (icons, fonts, images)
- `NetworkFirst` - API calls (try network, fall back to cache)
- `BackgroundSync` - Queue meal logs made offline

---

## Notification System

### Types
1. **Meal Reminders**: "Time to log breakfast!" (8am, 12pm, 6pm)
2. **Water Reminders**: "Don't forget to drink water!" (every 2 hours)
3. **Weigh-in Reminder**: "Time for your weekly weigh-in!" (Sunday morning)
4. **Streak Alerts**: "You're on a 7-day streak! Don't break it!"
5. **Goal Milestones**: "Congratulations! You've lost 5kg!"
6. **Inactivity Nudges**: "You haven't logged today. Quick log?"

### Implementation
- **Push (app closed)**: Web Push API + Supabase pg_cron
- **In-app (app open)**: Sonner toast library
- **Scheduling**: User sets preferred meal times in Settings
- **Quiet hours**: No notifications 10pm-7am by default
