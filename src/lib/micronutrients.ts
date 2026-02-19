// ============================================================================
// DietWise - Micronutrient Tracking for Indian Vegetarians
// Tracks B12, Iron, Calcium, Vitamin D, and Omega-3
// ============================================================================

import type { MicronutrientInfo, DailyLog } from "./types";

/** Daily recommended intake for Indian vegetarian adults */
export const DAILY_RECOMMENDED: Required<MicronutrientInfo> = {
  vitaminB12Mcg: 2.4,   // mcg - Critical for vegetarians
  ironMg: 17,           // mg - Higher for vegetarian absorption
  calciumMg: 1000,      // mg
  vitaminDIU: 600,      // IU
  omega3g: 1.6,         // g (ALA)
};

/** Micronutrient display config */
export const MICRONUTRIENT_CONFIG = {
  vitaminB12Mcg: { label: "Vitamin B12", unit: "mcg", color: "#E91E63", risk: "Vegetarian diets often lack B12. Consider fortified foods or supplements." },
  ironMg: { label: "Iron", unit: "mg", color: "#FF5722", risk: "Plant iron is less absorbed. Pair with Vitamin C foods for better absorption." },
  calciumMg: { label: "Calcium", unit: "mg", color: "#2196F3", risk: "Essential for bones. Include dairy, ragi, sesame seeds, and leafy greens." },
  vitaminDIU: { label: "Vitamin D", unit: "IU", color: "#FF9800", risk: "Get 15-20 min sunlight daily. Few vegetarian foods contain Vitamin D." },
  omega3g: { label: "Omega-3 (ALA)", unit: "g", color: "#009688", risk: "Include flaxseeds, walnuts, and chia seeds daily for omega-3." },
} as const;

/** Known micronutrient content for foods where data is significant.
 *  Key = food ID, values are per 1 serving. */
export const FOOD_MICRONUTRIENTS: Record<string, MicronutrientInfo> = {
  // Dairy - B12 & Calcium rich
  dairy_whole_milk:    { vitaminB12Mcg: 0.9, calciumMg: 240, vitaminDIU: 0 },
  dairy_toned_milk:    { vitaminB12Mcg: 0.8, calciumMg: 240 },
  dairy_skimmed_milk:  { vitaminB12Mcg: 0.8, calciumMg: 250 },
  dairy_curd:          { vitaminB12Mcg: 0.4, calciumMg: 120, ironMg: 0.2 },
  dairy_lowfat_curd:   { vitaminB12Mcg: 0.4, calciumMg: 130 },
  dairy_paneer:        { vitaminB12Mcg: 0.5, calciumMg: 200, ironMg: 0.3 },
  dairy_lowfat_paneer: { vitaminB12Mcg: 0.5, calciumMg: 200 },
  dairy_ghee:          { vitaminB12Mcg: 0, calciumMg: 0 },
  dairy_buttermilk:    { vitaminB12Mcg: 0.2, calciumMg: 60 },
  dairy_hung_curd:     { vitaminB12Mcg: 0.6, calciumMg: 150 },
  sweet_kheer:         { vitaminB12Mcg: 0.3, calciumMg: 120 },

  // Leafy greens - Iron & Calcium
  sabzi_palak:         { ironMg: 4.0, calciumMg: 120, omega3g: 0.1 },
  sabzi_methi:         { ironMg: 5.0, calciumMg: 130 },

  // Legumes - Iron
  dal_moong:           { ironMg: 2.0, calciumMg: 30 },
  dal_toor:            { ironMg: 2.5, calciumMg: 40 },
  dal_masoor:          { ironMg: 3.0, calciumMg: 25 },
  dal_chana:           { ironMg: 3.5, calciumMg: 55 },
  dal_urad:            { ironMg: 2.5, calciumMg: 45 },
  dal_rajma:           { ironMg: 3.0, calciumMg: 50 },
  dal_chole:           { ironMg: 3.5, calciumMg: 55 },
  dal_sprouts:         { ironMg: 2.5, calciumMg: 30 },
  dal_sambhar:         { ironMg: 2.0, calciumMg: 35 },

  // Nuts & Seeds - Omega-3 & Iron
  nuts_almonds:        { ironMg: 0.5, calciumMg: 30, omega3g: 0 },
  nuts_walnuts:        { ironMg: 0.3, omega3g: 0.9 },
  nuts_flaxseeds:      { ironMg: 0.6, omega3g: 2.3, calciumMg: 25 },
  nuts_chia_seeds:     { ironMg: 0.9, omega3g: 2.1, calciumMg: 75 },
  nuts_pumpkin_seeds:  { ironMg: 0.9, omega3g: 0.05 },
  nuts_peanuts:        { ironMg: 0.5 },
  nuts_sunflower_seeds:{ ironMg: 0.5, omega3g: 0 },

  // Millets - Iron & Calcium
  bread_ragi_roti:     { ironMg: 3.5, calciumMg: 340 },
  bread_bajra_roti:    { ironMg: 2.5, calciumMg: 40 },
  si_ragi_mudde:       { ironMg: 4.0, calciumMg: 350 },

  // Fruits
  fruit_orange:        { calciumMg: 40, ironMg: 0.2 },
  fruit_guava:         { ironMg: 0.3 },
  fruit_pomegranate:   { ironMg: 0.5 },
  fruit_amla:          { ironMg: 0.5, calciumMg: 25 },

  // Soy & Tofu - Iron, Calcium, Omega-3
  other_soy_chunks:    { ironMg: 5.0, calciumMg: 80 },
  other_tofu:          { ironMg: 2.5, calciumMg: 250, omega3g: 0.2 },

  // Drinks
  drink_turmeric_milk: { vitaminB12Mcg: 0.8, calciumMg: 240 },

  // Fortified foods
  breakfast_oats_porridge: { ironMg: 2.5, calciumMg: 200, vitaminB12Mcg: 0.5 },
  breakfast_cornflakes: { ironMg: 3.0, vitaminB12Mcg: 0.8, calciumMg: 200 },
  breakfast_muesli:    { ironMg: 2.5, vitaminB12Mcg: 0.5, calciumMg: 200 },
};

/** Calculate total micronutrients for a day from daily log */
export function calculateDailyMicronutrients(log: DailyLog): Required<MicronutrientInfo> {
  const totals: Required<MicronutrientInfo> = {
    vitaminB12Mcg: 0,
    ironMg: 0,
    calciumMg: 0,
    vitaminDIU: 0,
    omega3g: 0,
  };

  for (const meal of log.meals) {
    for (const food of meal.foods) {
      // Check if food has inline micronutrients
      const inline = food.nutrition.micronutrients;
      // Check food database for known micronutrients
      const known = FOOD_MICRONUTRIENTS[food.foodId];
      const micro = inline || known;

      if (micro) {
        const s = food.servings;
        totals.vitaminB12Mcg += (micro.vitaminB12Mcg || 0) * s;
        totals.ironMg += (micro.ironMg || 0) * s;
        totals.calciumMg += (micro.calciumMg || 0) * s;
        totals.vitaminDIU += (micro.vitaminDIU || 0) * s;
        totals.omega3g += (micro.omega3g || 0) * s;
      }
    }
  }

  return {
    vitaminB12Mcg: Math.round(totals.vitaminB12Mcg * 10) / 10,
    ironMg: Math.round(totals.ironMg * 10) / 10,
    calciumMg: Math.round(totals.calciumMg),
    vitaminDIU: Math.round(totals.vitaminDIU),
    omega3g: Math.round(totals.omega3g * 10) / 10,
  };
}

/** Get alerts for micronutrient deficiencies */
export function getMicronutrientAlerts(
  totals: Required<MicronutrientInfo>
): { nutrient: keyof typeof MICRONUTRIENT_CONFIG; pct: number; tip: string }[] {
  const alerts: { nutrient: keyof typeof MICRONUTRIENT_CONFIG; pct: number; tip: string }[] = [];

  const keys = Object.keys(DAILY_RECOMMENDED) as (keyof Required<MicronutrientInfo>)[];
  for (const key of keys) {
    const consumed = totals[key];
    const recommended = DAILY_RECOMMENDED[key];
    const pct = Math.round((consumed / recommended) * 100);
    if (pct < 50) {
      alerts.push({
        nutrient: key as keyof typeof MICRONUTRIENT_CONFIG,
        pct,
        tip: MICRONUTRIENT_CONFIG[key as keyof typeof MICRONUTRIENT_CONFIG].risk,
      });
    }
  }

  return alerts;
}
