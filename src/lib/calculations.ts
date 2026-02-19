// ============================================================================
// DietWise - Calculation Utilities
// BMR, TDEE, BMI, daily targets, and other health/nutrition calculations
// ============================================================================

import type { UserProfile, DailyTargets } from "./types";

// ============================================================================
// Activity level multipliers for TDEE calculation
// ============================================================================
const ACTIVITY_MULTIPLIERS: Record<UserProfile["activityLevel"], number> = {
  sedentary: 1.2, // Little to no exercise, desk job
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Hard exercise 6-7 days/week
  very_active: 1.9, // Very hard exercise, physical job
};

// ============================================================================
// BMR Calculation (Mifflin-St Jeor Equation)
// ============================================================================

/**
 * Calculates Basal Metabolic Rate using the Mifflin-St Jeor equation.
 * This is the most accurate formula for estimating BMR.
 *
 * Male:   BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age) - 5
 * Female: BMR = (10 x weight in kg) + (6.25 x height in cm) - (5 x age) - 161
 *
 * @param profile - User profile containing weight, height, age, and gender
 * @returns BMR in kcal/day (rounded to nearest integer)
 */
export function calculateBMR(profile: UserProfile): number {
  const { weightKg, heightCm, age, gender } = profile;

  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * age;

  switch (gender) {
    case "male":
      return Math.round(baseBMR - 5);
    case "female":
      return Math.round(baseBMR - 161);
    case "other":
      // Use average of male and female adjustments
      return Math.round(baseBMR - 83);
    default:
      return Math.round(baseBMR - 5);
  }
}

// ============================================================================
// TDEE Calculation (Total Daily Energy Expenditure)
// ============================================================================

/**
 * Calculates Total Daily Energy Expenditure by multiplying BMR
 * with the activity level multiplier.
 *
 * @param profile - User profile containing all info needed for BMR + activity level
 * @returns TDEE in kcal/day (rounded to nearest integer)
 */
export function calculateTDEE(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const multiplier = ACTIVITY_MULTIPLIERS[profile.activityLevel];
  return Math.round(bmr * multiplier);
}

// ============================================================================
// Daily Nutritional Targets
// ============================================================================

/**
 * Calculates recommended daily nutritional targets based on the user profile,
 * goal type, and activity level.
 *
 * Macro split:
 * - Weight loss: Protein 25-30%, Carbs 40-45%, Fat 25-30%
 * - Maintenance: Protein 20-25%, Carbs 45-50%, Fat 25-30%
 * - Weight gain: Protein 20-25%, Carbs 50-55%, Fat 20-25%
 *
 * @param profile - User profile
 * @returns DailyTargets with calories, protein, carbs, fat, fiber, and water
 */
export function calculateDailyTargets(profile: UserProfile): DailyTargets {
  const tdee = calculateTDEE(profile);

  let targetCalories: number;
  let proteinPct: number;
  let carbsPct: number;
  let fatPct: number;

  switch (profile.goalType) {
    case "weight_loss": {
      // Create a calorie deficit of 500-750 kcal/day for safe weight loss
      // (approximately 0.5-0.75 kg per week)
      const deficit = Math.min(750, Math.round(tdee * 0.25));
      targetCalories = Math.max(1200, tdee - deficit); // Never go below 1200
      proteinPct = 0.275; // 27.5% (middle of 25-30%)
      carbsPct = 0.425; // 42.5% (middle of 40-45%)
      fatPct = 0.275; // 27.5% (middle of 25-30%)
      break;
    }
    case "weight_gain": {
      // Create a calorie surplus of 300-500 kcal/day for lean gain
      const surplus = Math.round(tdee * 0.15);
      targetCalories = tdee + surplus;
      proteinPct = 0.225; // 22.5%
      carbsPct = 0.525; // 52.5%
      fatPct = 0.225; // 22.5%
      break;
    }
    case "maintenance":
    default: {
      targetCalories = tdee;
      proteinPct = 0.225; // 22.5%
      carbsPct = 0.475; // 47.5%
      fatPct = 0.275; // 27.5%
      break;
    }
  }

  // Round target calories to nearest 50
  targetCalories = Math.round(targetCalories / 50) * 50;

  // Calculate macros in grams
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
  const protein = Math.round((targetCalories * proteinPct) / 4);
  const carbs = Math.round((targetCalories * carbsPct) / 4);
  const fat = Math.round((targetCalories * fatPct) / 9);

  // Fiber recommendation: 14g per 1000 kcal, minimum 25g
  const fiber = Math.max(25, Math.round((targetCalories / 1000) * 14));

  // Water recommendation based on weight and activity level
  // Base: 30-35ml per kg of body weight
  const baseWaterMl = profile.weightKg * 33;
  const activityWaterBonus =
    profile.activityLevel === "active" || profile.activityLevel === "very_active"
      ? 500
      : profile.activityLevel === "moderate"
        ? 250
        : 0;
  const waterMl = Math.round((baseWaterMl + activityWaterBonus) / 100) * 100;

  return {
    calories: targetCalories,
    protein,
    carbs,
    fat,
    fiber,
    waterMl,
  };
}

// ============================================================================
// BMI Calculation
// ============================================================================

/**
 * Calculates Body Mass Index.
 * BMI = weight (kg) / height (m)^2
 *
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimeters
 * @returns BMI value rounded to 1 decimal place
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Returns the BMI category string for a given BMI value.
 * Uses WHO classification with Asian BMI cutoffs (which are more
 * appropriate for the Indian population).
 *
 * Asian BMI Categories:
 * - Underweight: < 18.5
 * - Normal: 18.5 - 22.9
 * - Overweight: 23.0 - 24.9
 * - Obese Class I: 25.0 - 29.9
 * - Obese Class II: >= 30.0
 *
 * @param bmi - BMI value
 * @returns Category string
 */
export function getBMICategory(bmi: number): string {
  if (bmi <= 0) return "Invalid";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 23) return "Normal";
  if (bmi < 25) return "Overweight";
  if (bmi < 30) return "Obese Class I";
  return "Obese Class II";
}

/**
 * Returns a color class name for the BMI category (for UI display).
 *
 * @param bmi - BMI value
 * @returns Tailwind CSS color class
 */
export function getBMICategoryColor(bmi: number): string {
  if (bmi <= 0) return "text-muted-foreground";
  if (bmi < 18.5) return "text-blue-500";
  if (bmi < 23) return "text-green-500";
  if (bmi < 25) return "text-yellow-500";
  if (bmi < 30) return "text-orange-500";
  return "text-red-500";
}

// ============================================================================
// Weight Goal Estimation
// ============================================================================

/**
 * Estimates the date when the target weight will be reached,
 * given a weekly weight change rate.
 *
 * @param currentWeight - Current weight in kg
 * @param targetWeight - Target weight in kg
 * @param weeklyChange - Rate of weight change per week in kg (positive value)
 * @returns Estimated date when target weight will be reached
 */
export function calculateWeightGoalDate(
  currentWeight: number,
  targetWeight: number,
  weeklyChange: number = 0.5
): Date {
  if (weeklyChange <= 0) {
    // If no rate is specified, default to 0.5 kg/week
    weeklyChange = 0.5;
  }

  const weightDifference = Math.abs(currentWeight - targetWeight);
  const weeksNeeded = Math.ceil(weightDifference / weeklyChange);
  const daysNeeded = weeksNeeded * 7;

  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + daysNeeded);

  return goalDate;
}

/**
 * Calculates how many weeks it will take to reach the target weight.
 *
 * @param currentWeight - Current weight in kg
 * @param targetWeight - Target weight in kg
 * @param weeklyChange - Rate of weight change per week in kg
 * @returns Number of weeks
 */
export function calculateWeeksToGoal(
  currentWeight: number,
  targetWeight: number,
  weeklyChange: number = 0.5
): number {
  if (weeklyChange <= 0) return 0;
  const weightDifference = Math.abs(currentWeight - targetWeight);
  return Math.ceil(weightDifference / weeklyChange);
}

// ============================================================================
// ID Generation
// ============================================================================

/**
 * Generates a unique ID string.
 * Uses crypto.randomUUID() when available, with a fallback
 * implementation for environments where it's not supported.
 *
 * @returns A unique string identifier
 */
export function generateId(): string {
  // Try native crypto.randomUUID first (available in modern browsers and Node 19+)
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  // Fallback: generate a UUID v4-like string manually
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r =
      typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function"
        ? crypto.getRandomValues(new Uint8Array(1))[0] & 15
        : (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================================================
// Nutrition Aggregation Helpers
// ============================================================================

/**
 * Sums up multiple NutritionInfo objects into a single total.
 *
 * @param items - Array of NutritionInfo objects
 * @returns Combined NutritionInfo
 */
export function sumNutrition(
  items: { calories: number; protein: number; carbs: number; fat: number; fiber: number }[]
): { calories: number; protein: number; carbs: number; fat: number; fiber: number } {
  return items.reduce(
    (total, item) => ({
      calories: Math.round((total.calories + item.calories) * 10) / 10,
      protein: Math.round((total.protein + item.protein) * 10) / 10,
      carbs: Math.round((total.carbs + item.carbs) * 10) / 10,
      fat: Math.round((total.fat + item.fat) * 10) / 10,
      fiber: Math.round((total.fiber + item.fiber) * 10) / 10,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}

/**
 * Scales nutrition values by a multiplier (e.g., number of servings).
 *
 * @param nutrition - Base nutrition info
 * @param multiplier - How many servings
 * @returns Scaled NutritionInfo
 */
export function scaleNutrition(
  nutrition: { calories: number; protein: number; carbs: number; fat: number; fiber: number },
  multiplier: number
): { calories: number; protein: number; carbs: number; fat: number; fiber: number } {
  return {
    calories: Math.round(nutrition.calories * multiplier * 10) / 10,
    protein: Math.round(nutrition.protein * multiplier * 10) / 10,
    carbs: Math.round(nutrition.carbs * multiplier * 10) / 10,
    fat: Math.round(nutrition.fat * multiplier * 10) / 10,
    fiber: Math.round(nutrition.fiber * multiplier * 10) / 10,
  };
}

// ============================================================================
// Formatting Helpers
// ============================================================================

/**
 * Formats a date string in YYYY-MM-DD format.
 *
 * @param date - Date object
 * @returns String in YYYY-MM-DD format
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's date in YYYY-MM-DD format.
 */
export function getTodayKey(): string {
  return formatDateKey(new Date());
}

/**
 * Calculates the percentage of a nutrient consumed relative to target.
 * Clamped to 0-100 range for progress bar display, but the raw value
 * can exceed 100%.
 *
 * @param consumed - Amount consumed
 * @param target - Daily target amount
 * @param clamp - Whether to clamp to 0-100 (default: true)
 * @returns Percentage value
 */
export function calculateProgress(
  consumed: number,
  target: number,
  clamp: boolean = true
): number {
  if (target <= 0) return 0;
  const percentage = Math.round((consumed / target) * 100);
  if (clamp) {
    return Math.min(100, Math.max(0, percentage));
  }
  return Math.max(0, percentage);
}

/**
 * Calculates recommended daily calorie deficit/surplus for the user's goal.
 *
 * @param profile - User profile
 * @returns Object with deficit amount and recommended weekly weight change
 */
export function calculateDeficitInfo(profile: UserProfile): {
  dailyDeficit: number;
  weeklyWeightChange: number;
  targetCalories: number;
} {
  const tdee = calculateTDEE(profile);
  const targets = calculateDailyTargets(profile);
  const dailyDeficit = tdee - targets.calories;

  // 7700 kcal deficit = approximately 1 kg of fat loss
  const weeklyWeightChange = Math.round(((dailyDeficit * 7) / 7700) * 100) / 100;

  return {
    dailyDeficit,
    weeklyWeightChange,
    targetCalories: targets.calories,
  };
}
