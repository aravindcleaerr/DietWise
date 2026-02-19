# DietWise - Project Overview

## Purpose
A personalized diet plan organizer, scheduler, and tracker web application built specifically for a 50-year-old vegetarian Indian male (5'7", 94 kg) aiming to lose 10-15 kg.

## User Profile
| Parameter | Value |
|-----------|-------|
| Age | 50 years |
| Gender | Male |
| Height | 5'7" (170 cm) |
| Current Weight | 94 kg |
| Target Weight | 79-84 kg (lose 10-15 kg) |
| BMI (Current) | 32.5 (Obese Class I) |
| BMR (Mifflin-St Jeor) | ~1,748 kcal/day |
| TDEE (Lightly Active) | ~2,400 kcal/day |
| Diet | Strictly Vegetarian (Indian) |
| Gym Access | None |
| Target Duration | 5-7 months |

## Key Constraints
- **Vegetarian only** - No non-veg foods
- **No gym** - Home exercises, walking, and cycling only
- **Must avoid**: Sweets, fried snacks, salty snacks, sugary tea (3-4x daily habit), eating after 9 PM
- **Accessible UI** - Simple, intuitive interface for a 50-year-old user

## Daily Targets
| Nutrient | Target |
|----------|--------|
| Calories | 1,500-1,800 kcal/day |
| Protein | 80-100 g/day (25-30%) |
| Carbohydrates | 170-190 g/day (40-45%) |
| Fat | 47-57 g/day (25-30%) |
| Fiber | 30-38 g/day |
| Water | 2.5-3 liters/day |
| Weekly Weight Loss | 0.5-0.75 kg |

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14/15 (React 18/19, TypeScript) |
| Styling | Tailwind CSS 3.4+ |
| UI Components | shadcn/ui (Radix UI primitives) |
| State Management | Zustand |
| Forms | React Hook Form + Zod |
| Charts | Recharts + Tremor + react-circular-progressbar |
| Database | Supabase (PostgreSQL) |
| Offline DB | Dexie.js (IndexedDB) |
| PWA | Serwist + Workbox |
| Auth | Supabase Auth |
| Notifications | Web Push API + Sonner |
| Deployment | Vercel |
| Icons | Lucide React |
| Animations | Framer Motion |
| Date Handling | date-fns |
| Package Manager | pnpm |

## Document Index
1. [Project Overview](01-PROJECT-OVERVIEW.md) (this file)
2. [App Features](02-APP-FEATURES.md) - Complete feature list with priorities
3. [Indian Diet Data](03-INDIAN-DIET-DATA.md) - Calorie counts, meal plans, nutrition info
4. [Exercise Plans](04-EXERCISE-PLANS.md) - 12-week progressive exercise program
5. [Tech Stack Details](05-TECH-STACK.md) - Detailed tech decisions, DB schema, UI/UX
6. [UI/UX Design Guide](06-UI-UX-DESIGN.md) - Colors, typography, accessibility, patterns
