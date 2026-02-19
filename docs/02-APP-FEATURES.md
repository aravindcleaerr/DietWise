# DietWise - Complete Feature List

## Priority Legend
- **P0** = Must-have for launch (MVP)
- **P1** = Strongly recommended
- **P2** = Competitive differentiator
- **P3** = Future/premium features

---

## Core Features (P0-P1)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 1 | User Onboarding & Profile | Collect age, sex, height, weight, activity level, goals, dietary preferences | P0 |
| 2 | TDEE & Goal Calculator | Auto-calculate daily calorie/macro targets using Mifflin-St Jeor equation | P0 |
| 3 | Indian Food Database | Comprehensive database with 200+ Indian vegetarian foods with calorie/macro data | P0 |
| 4 | Food Logging (Diary) | Log food items to Breakfast, Lunch, Dinner, Snacks with serving size adjustment | P0 |
| 5 | Daily Calorie & Macro Summary | Real-time calories consumed/remaining with protein/carbs/fat breakdown | P0 |
| 6 | Weight Tracking | Log weight with date, display trend chart with moving average | P0 |
| 7 | Meal Planning / Scheduling | Plan meals for future days/weeks with calendar view | P0 |
| 8 | Progress Dashboard | Visual overview of daily/weekly progress with charts and metrics | P0 |
| 9 | User Authentication | Secure sign-up/login with Supabase Auth | P0 |
| 10 | Water/Hydration Tracking | Log daily water intake against personalized target | P1 |
| 11 | Quick-Add & Favorites | Mark favorite foods, access recent/frequent items for fast logging | P1 |
| 12 | Copy/Repeat Meals | Copy meals from previous days or save meal templates | P1 |
| 13 | Custom Food Creation | Add custom food items with nutritional information | P1 |
| 14 | Reminders & Notifications | Configurable reminders for meals, logging, water, weigh-ins | P1 |
| 15 | Exercise/Activity Logging | Manual exercise entry with calorie burn estimation | P1 |
| 16 | Streak Tracking | Track consecutive days of logging with visual counter | P1 |
| 17 | Dark Mode / Theme Toggle | Light mode default with dark mode option | P1 |
| 18 | Onboarding Tutorial | Interactive walkthrough of key features during first use | P1 |
| 19 | Weekly Summary Report | Aggregated view: avg calories, macro averages, adherence %, weight change | P1 |
| 20 | Grocery List Generation | Auto-generate shopping lists from meal plans | P1 |

## Advanced Features (P2)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 21 | Recipe Management | Create, save, and nutritionally analyze custom recipes | P2 |
| 22 | Achievement Badges | Unlock badges for milestones (7-day streak, goal met, etc.) | P2 |
| 23 | Calendar Heatmap | Month view color-coded by logging adherence | P2 |
| 24 | Calorie Trend Charts | Line chart of daily calorie intake over 7/30/90 days | P2 |
| 25 | Macro Trend Charts | Stacked bar/area chart of protein/carbs/fat over time | P2 |
| 26 | Goal Projection | "At this rate, you'll reach goal by [date]" | P2 |
| 27 | Meal Timing Analysis | Track when meals are eaten, enforce no-eating-after-9pm rule | P2 |
| 28 | Smart Meal Suggestions | Suggest dinner options to hit remaining macro targets | P2 |
| 29 | Food Substitution Engine | Suggest healthier alternatives to logged foods | P2 |
| 30 | Data Export (CSV/PDF) | Export tracking data for personal records | P2 |
| 31 | Intermittent Fasting Timer | Built-in fasting window tracker | P2 |
| 32 | Mood/Wellbeing Check-ins | Brief mood logging to identify emotional eating patterns | P2 |
| 33 | Body Measurements | Track waist, hips, chest, body fat % over time | P2 |
| 34 | Offline Mode (PWA) | Full logging capability without internet | P2 |
| 35 | Points/XP System | Earn points for logging meals, hitting targets | P2 |
| 36 | Monthly Summary Report | Monthly trends, total weight change, top foods | P2 |
| 37 | Comparative Analysis | Compare two time periods side-by-side | P2 |
| 38 | Customizable Dashboard | Arrange which metrics appear on home screen | P2 |
| 39 | Weekly Challenges | Themed challenges (Protein Week, Hydration Challenge) | P2 |
| 40 | Educational Tips | Daily nutritional facts and tips | P2 |

## Future Features (P3)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| 41 | AI Photo Food Recognition | Take a photo, AI identifies foods and estimates calories | P3 |
| 42 | AI Meal Plan Generator | Generate personalized meal plans based on preferences | P3 |
| 43 | Natural Language Food Logging | Type "I had poha and chai" and AI parses it | P3 |
| 44 | Barcode Scanner | Scan packaged food barcodes | P3 |
| 45 | Recipe Import from URL | Paste a recipe URL, auto-extract nutrition info | P3 |
| 46 | Wearable Integration | Sync with Google Fit, Apple Health | P3 |
| 47 | Multi-Language Support | Hindi, regional languages | P3 |
| 48 | Social/Community Features | Friends, accountability partners | P3 |
| 49 | Coach/Expert Access | Connect with dietitians | P3 |
| 50 | Before/After Photo Journal | Secure photo journal for tracking physical changes | P3 |

---

## App Pages / Screens

### Bottom Navigation (Mobile)
1. **Dashboard** - Daily overview, calorie ring, macros, quick stats
2. **Food Log** - Today's meals with add/edit capability
3. **Plan** - Weekly meal planner and scheduler
4. **Progress** - Weight charts, streaks, achievements
5. **Profile** - Settings, goals, personal info

### Key Screens
- **Onboarding Flow**: Goal -> Personal Info -> Dietary Preferences -> Calorie Target -> First Meal Guide
- **Dashboard**: Calorie progress ring, macro bars, water tracker, streak counter, weight sparkline
- **Food Search**: Full-screen search with tabs (Recent, Frequent, Favorites, All Foods)
- **Meal Log**: Timeline view of today's meals with nutritional breakdown
- **Meal Planner**: Calendar/week view with drag-drop meal planning
- **Weight Chart**: Line chart with goal line, trend line, projection
- **Exercise Log**: Today's exercises with calorie burn
- **Achievements**: Badge collection, streak history
- **Settings**: Profile, goals, reminders, theme, font size, data export

---

## Design Principles

1. **Speed of logging is king** - Under 30 seconds per meal
2. **Progressive complexity** - Start with calories, unlock macros/micros later
3. **Weekly > Daily perspective** - Show weekly averages to reduce anxiety
4. **Celebrate consistency, not perfection** - Reward logging streaks
5. **Non-judgmental tone** - Encouraging, neutral language
6. **Education embedded in action** - Teach while they log
7. **Offline-first mindset** - Works without internet
8. **Accessibility first** - Large fonts, high contrast, simple navigation
