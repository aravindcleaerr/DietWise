# DietWise - UI/UX Design Guide

## Design Philosophy
Simple, intuitive, accessible interface optimized for a 50-year-old male user. Mobile-first with generous touch targets, large fonts, and high contrast.

---

## Color System

```css
/* Primary Palette - Nature-Inspired Green */
--primary-50:  #E8F5E9;   /* Lightest - backgrounds */
--primary-100: #C8E6C9;   /* Light - hover states */
--primary-200: #A5D6A7;   /* Borders, dividers */
--primary-400: #66BB6A;   /* Secondary buttons */
--primary-600: #43A047;   /* Primary buttons, headers */
--primary-700: #2E7D32;   /* Text on light backgrounds */
--primary-900: #1B5E20;   /* Emphasis */

/* Neutral Palette (warm grays) */
--neutral-50:  #FAFAF8;   /* Page background */
--neutral-100: #F5F5F0;   /* Card backgrounds */
--neutral-200: #E8E8E0;   /* Borders */
--neutral-500: #8A8A80;   /* Secondary text */
--neutral-700: #4A4A44;   /* Primary text */
--neutral-900: #1A1A18;   /* Headings */

/* Semantic Colors */
--success:   #4CAF50;     /* On track, goal met */
--warning:   #FF9800;     /* Approaching limit */
--danger:    #F44336;     /* Over limit (use sparingly) */
--info:      #2196F3;     /* Water, information */

/* Macro Colors (consistent across all charts) */
--protein:   #5C6BC0;     /* Indigo */
--carbs:     #FFA726;     /* Orange */
--fat:       #EF5350;     /* Red */
--fiber:     #66BB6A;     /* Green */
--water:     #42A5F5;     /* Blue */

/* Gamification */
--gold:      #FFD700;     /* Achievement badges */
--streak:    #FF6D00;     /* Streak fire icon */
```

---

## Typography

```css
/* Font Family */
font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;

/* Base size: 18px (larger than standard 16px for readability) */
html { font-size: 18px; }
body { line-height: 1.6; }

/* Scale */
h1:   2rem     (36px)
h2:   1.667rem (30px)
h3:   1.333rem (24px)
body: 1rem     (18px)
small: 0.889rem (16px -- nothing smaller)
```

**Why Inter**: Designed for screen readability, clear distinction between I/l/1, variable font for performance.

---

## Layout Patterns

### Mobile Navigation (Bottom Tab Bar)
```
┌──────────────────────────────────┐
│                                  │
│         [Screen Content]         │
│                                  │
├──────────────────────────────────┤
│ 🏠      📝      ➕      📊   👤 │
│ Home   Log     Add    Progress  Me │
└──────────────────────────────────┘
```

5 tabs max: Dashboard, Food Log, Add (floating), Progress, Profile

### Dashboard Layout
```
Mobile (single column):
┌──────────────────────┐
│   Calorie Ring        │
│   1,250 / 1,700      │
├──────────────────────┤
│ Protein ████░░ 65/100g│
│ Carbs   █████░ 120/170│
│ Fat     ███░░░ 30/50g │
├──────────────────────┤
│ 💧 Water: 6/8 glasses │
├──────────────────────┤
│ 🔥 Streak: 12 days   │
├──────────────────────┤
│ ⚖️ Weight Sparkline   │
├──────────────────────┤
│ Today's Meals         │
│ ☀️ Breakfast  320 cal │
│ 🌤️ Lunch      460 cal │
│ 🌑 Dinner     --- cal │
│ 🍎 Snacks     195 cal │
└──────────────────────┘

Tablet (2 columns):
┌────────────┬─────────────┐
│ Calorie    │ Macros      │
│ Ring       │ Protein     │
│            │ Carbs       │
│            │ Fat         │
├────────────┼─────────────┤
│ Water      │ Streak      │
├────────────┴─────────────┤
│ Today's Meals            │
├──────────────────────────┤
│ Weight Chart             │
└──────────────────────────┘

Desktop (3 columns + sidebar):
┌──────┬──────────────┬──────────┐
│ Nav  │ Calorie Ring │ Macros   │
│      │ + Meals      │ Water    │
│ Home │              │ Streak   │
│ Log  │              │ Weight   │
│ Plan │              │ Exercise │
│ Prog │              │ Tips     │
│ Me   │              │          │
└──────┴──────────────┴──────────┘
```

### Responsive Breakpoints
```
sm:  640px  (large phones landscape)
md:  768px  (tablets)
lg:  1024px (small laptops)
xl:  1280px (desktop)
2xl: 1536px (large desktop)
```

---

## Accessibility Requirements (WCAG 2.1 AA+)

### Touch/Click Targets
- **Minimum 48px x 48px** for all buttons and interactive elements
- 44px minimum for secondary actions
- 8px minimum spacing between touch targets

### Color & Contrast
- **4.5:1 minimum** contrast for normal text (WCAG AA)
- **7:1 for health data** like calorie numbers (WCAG AAA)
- Never use color alone to convey information (always pair with icons/text)
- Charts: distinct patterns/shapes, not just colors (colorblind support)

### Navigation
- Maximum **3 clicks** to reach any feature
- Persistent bottom navigation (always visible)
- Text labels on ALL icons (no icon-only buttons)
- Large, clearly labeled buttons ("Log Meal" not just "+")

### Forms
- Large input fields (minimum height 48px)
- Clear labels ABOVE inputs (not placeholder-only)
- Inline validation with clear error messages
- Number inputs with stepper buttons (+/-)
- Large calendar cells in date pickers

### Keyboard
- Full keyboard navigation (Tab, Enter, Escape)
- Visible 2px solid focus indicators
- Skip-to-content link

### Screen Reader
- Proper heading hierarchy (h1 -> h2 -> h3)
- ARIA labels on all charts
- Live regions for dynamic updates
- Alt text on all images

### Cognitive Accessibility (crucial for 50+ users)
- Consistent layout on every page
- Clear language ("Calories" not "kcal")
- Progressive disclosure (essentials first)
- Confirmation dialogs for destructive actions
- Undo capability (5-second toast)
- Remember user preferences

### Personalization Settings
- Font size slider (small / medium / large / extra large)
- High contrast mode toggle
- Reduced motion toggle (respects `prefers-reduced-motion`)
- Simple mode (hides advanced nutritional details)

---

## Gamification Design

### Streak System
- Fire/flame icon with day count
- "Freeze" option: 1 free skip per week
- Milestones at 7, 14, 30, 60, 90, 180, 365 days
- Gentle messaging: "Welcome back! Let's start fresh" (not "Streak broken!")

### Achievement Badges
| Badge | Criteria |
|-------|----------|
| Getting Started | Log first meal |
| Week Warrior | 7-day logging streak |
| Balanced Plate | Hit all macro targets in one day |
| Hydration Hero | Hit water goal 7 days in a row |
| First Milestone | Lose first 1 kg |
| Halfway There | Reach 50% of weight goal |
| Consistency King | 30-day logging streak |
| Century Club | Log 100 meals |
| Early Bird | Log breakfast before 9am for 7 days |
| Night Owl No More | No food after 9pm for 7 days |

### Points System (simple)
| Action | Points |
|--------|--------|
| Log a meal | +10 |
| Log exercise | +15 |
| Hit calorie goal | +20 |
| Hit water goal | +10 |
| Complete daily log | +25 |

### What to AVOID
- No social leaderboards (creates pressure)
- No punishing language for missed days
- No complex systems requiring explanation
- No childish animations that undermine serious health purpose

---

## Key Screen Wireframes

### Onboarding Flow
```
Screen 1: "What's your goal?"
  [ ] Lose Weight
  [ ] Gain Weight
  [ ] Maintain Weight
  [Next ->]

Screen 2: "Tell us about yourself"
  Age: [50]  Gender: [Male]
  Height: [5'7"]  Weight: [94 kg]
  [Next ->]

Screen 3: "Dietary preferences"
  [x] Vegetarian
  [ ] Vegan
  [ ] No restrictions
  [Next ->]

Screen 4: "Your personalized plan"
  Daily Target: 1,700 calories
  Protein: 100g | Carbs: 180g | Fat: 50g
  Goal: Reach 82 kg by August 2026
  [Start Tracking ->]
```

### Food Search Screen
```
┌──────────────────────────┐
│ 🔍 Search foods...       │
├──────────────────────────┤
│ [Recent] [Frequent] [Fav]│
├──────────────────────────┤
│ 🕐 Recent                │
│  Moong Dal Chilla  110cal│
│  Toned Milk        95cal │
│  Phulka (2)       130cal │
│  Toor Dal          130cal│
│  Lauki Sabzi        70cal│
├──────────────────────────┤
│ ⭐ Favorites             │
│  Oats Porridge     200cal│
│  Buttermilk         40cal│
│  Sprout Chaat      100cal│
└──────────────────────────┘
```

### Meal Log Screen
```
┌──────────────────────────┐
│ ◀ Today, Feb 19  ▶       │
├──────────────────────────┤
│ ☀️ Pre-Breakfast          │
│   Jeera water      5 cal │
│                    [+ Add]│
├──────────────────────────┤
│ 🌅 Breakfast    315 cal  │
│   2x Moong Dal Chilla    │
│   Mint Chutney           │
│   1 glass Toned Milk     │
│                    [+ Add]│
├──────────────────────────┤
│ 🌤️ Mid-Morning  120 cal  │
│   1 Apple                │
│   5 Almonds              │
│                    [+ Add]│
├──────────────────────────┤
│ ☀️ Lunch         --- cal │
│   Not logged yet         │
│                    [+ Add]│
├──────────────────────────┤
│ 🌆 Evening Snack --- cal │
│                    [+ Add]│
├──────────────────────────┤
│ 🌙 Dinner        --- cal │
│                    [+ Add]│
└──────────────────────────┘
```

---

## Design Do's and Don'ts

### DO
- Use warm neutral backgrounds (#FAFAF8 not pure white)
- Generous whitespace (16px card padding, 24px between sections)
- Celebrate hitting targets with subtle green checks
- Show weekly averages (reduces daily anxiety)
- Default to light mode (older eyes prefer it)
- Use encouraging language ("Great progress!" not "You failed")

### DON'T
- Use red aggressively for going over calories
- Use small fonts or icon-only buttons
- Create complex multi-step workflows
- Hide important features behind menus
- Require precise data entry (allow estimates)
- Send judgmental notifications
