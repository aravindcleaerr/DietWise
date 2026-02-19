// ============================================================================
// DietWise - TypeScript Type Definitions
// All shared types and interfaces for the DietWise application
// ============================================================================

export interface UserProfile {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goalType: "weight_loss" | "weight_gain" | "maintenance";
  targetWeightKg: number;
  dietaryPreference: "vegetarian" | "vegan" | "non_veg";
  isOnboarded: boolean;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodItem {
  id: string;
  name: string;
  nameHindi?: string;
  category:
    | "bread"
    | "rice"
    | "dal"
    | "sabzi"
    | "breakfast"
    | "dairy"
    | "fruit"
    | "nuts_seeds"
    | "snack"
    | "drink"
    | "other";
  servingSize: number;
  servingUnit: string;
  nutrition: NutritionInfo;
  isVegetarian: boolean;
}

export interface LoggedFood {
  id: string;
  foodId: string;
  foodName: string;
  servings: number;
  servingUnit: string;
  nutrition: NutritionInfo;
}

export type MealType =
  | "pre_breakfast"
  | "breakfast"
  | "mid_morning"
  | "lunch"
  | "evening_snack"
  | "dinner"
  | "post_dinner";

export interface MealEntry {
  id: string;
  mealType: MealType;
  time: string;
  foods: LoggedFood[];
  totalNutrition: NutritionInfo;
}

export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD
  meals: MealEntry[];
  totalNutrition: NutritionInfo;
  waterMl: number;
  weightKg?: number;
  mood?: number; // 1-5
  exerciseMinutes?: number;
  exerciseCalories?: number;
  notes?: string;
}

export interface ExerciseEntry {
  id: string;
  date: string;
  exerciseType: "cardio" | "strength" | "flexibility" | "balance";
  name: string;
  durationMinutes: number;
  caloriesBurned: number;
  intensity: "low" | "medium" | "high";
  sets?: number;
  reps?: number;
  notes?: string;
}

export interface WeightEntry {
  date: string;
  weightKg: number;
}

export interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  isEarned: boolean;
}

export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterMl: number;
}

export const MEAL_TYPE_CONFIG: Record<
  MealType,
  { label: string; icon: string; timeDefault: string }
> = {
  pre_breakfast: {
    label: "Pre-Breakfast",
    icon: "\u{1F305}",
    timeDefault: "06:30",
  },
  breakfast: { label: "Breakfast", icon: "\u2600\uFE0F", timeDefault: "07:30" },
  mid_morning: {
    label: "Mid-Morning",
    icon: "\u{1F324}\uFE0F",
    timeDefault: "10:30",
  },
  lunch: { label: "Lunch", icon: "\u{1F31E}", timeDefault: "13:00" },
  evening_snack: {
    label: "Evening Snack",
    icon: "\u{1F306}",
    timeDefault: "16:00",
  },
  dinner: { label: "Dinner", icon: "\u{1F319}", timeDefault: "19:00" },
  post_dinner: {
    label: "Post-Dinner",
    icon: "\u2728",
    timeDefault: "21:00",
  },
};
