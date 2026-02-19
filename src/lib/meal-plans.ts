// ============================================================================
// DietWise - 7-Day Indian Vegetarian Meal Plans
// Pre-built meal plans (~1,400-1,500 kcal/day) based on nutritional research
// for weight loss tailored to Indian vegetarian diet.
// ============================================================================

import type { MealType } from "./types";

export interface MealPlanFood {
  name: string;
  foodId?: string; // maps to FOOD_DATABASE id when available
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealPlanSlot {
  mealType: MealType;
  time: string;
  foods: MealPlanFood[];
  totalCalories: number;
}

export interface DayPlan {
  day: number; // 1-7
  dayName: string;
  totalCalories: number;
  meals: MealPlanSlot[];
}

export const WEEKLY_MEAL_PLAN: DayPlan[] = [
  // ─── Day 1 (Monday) ── ~1,455 kcal ────────────────────────────────────
  {
    day: 1,
    dayName: "Monday",
    totalCalories: 1455,
    meals: [
      {
        mealType: "pre_breakfast",
        time: "6:30 AM",
        foods: [
          { name: "Warm water + 1 tsp jeera", foodId: "drink_jeera_water", calories: 5, protein: 0, carbs: 1, fat: 0 },
        ],
        totalCalories: 5,
      },
      {
        mealType: "breakfast",
        time: "7:30 AM",
        foods: [
          { name: "Moong Dal Chilla (x2)", foodId: "breakfast_moong_chilla", calories: 200, protein: 14, carbs: 24, fat: 4 },
          { name: "Mint Chutney", foodId: "other_mint_chutney", calories: 15, protein: 0.5, carbs: 2, fat: 0.5 },
          { name: "Toned Milk (1 glass)", foodId: "dairy_toned_milk", calories: 95, protein: 6, carbs: 10, fat: 3 },
        ],
        totalCalories: 315,
      },
      {
        mealType: "mid_morning",
        time: "10:30 AM",
        foods: [
          { name: "Apple (1 medium)", foodId: "fruit_apple", calories: 90, protein: 0.5, carbs: 22, fat: 0.3 },
          { name: "Almonds (5 pieces)", foodId: "nuts_almonds", calories: 35, protein: 1.3, carbs: 1.3, fat: 3 },
        ],
        totalCalories: 120,
      },
      {
        mealType: "lunch",
        time: "1:00 PM",
        foods: [
          { name: "Phulka (x2)", foodId: "bread_phulka", calories: 120, protein: 4, carbs: 24, fat: 0.6 },
          { name: "Toor Dal (1 katori)", foodId: "dal_toor", calories: 130, protein: 8, carbs: 18, fat: 2 },
          { name: "Lauki Sabzi (1 katori)", foodId: "sabzi_lauki", calories: 70, protein: 2, carbs: 8, fat: 3 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
          { name: "Buttermilk", foodId: "dairy_buttermilk", calories: 38, protein: 2, carbs: 4, fat: 1 },
        ],
        totalCalories: 460,
      },
      {
        mealType: "evening_snack",
        time: "4:00 PM",
        foods: [
          { name: "Roasted Makhana (1 cup)", foodId: "snack_roasted_makhana", calories: 70, protein: 3, carbs: 13, fat: 0.5 },
          { name: "Green Tea", foodId: "drink_green_tea", calories: 3, protein: 0, carbs: 0.5, fat: 0 },
        ],
        totalCalories: 75,
      },
      {
        mealType: "dinner",
        time: "7:00 PM",
        foods: [
          { name: "Phulka (x1.5)", foodId: "bread_phulka", calories: 90, protein: 3, carbs: 18, fat: 0.5 },
          { name: "Palak Sabzi (1 katori)", foodId: "sabzi_palak", calories: 80, protein: 3, carbs: 6, fat: 4 },
          { name: "Moong Dal (1 katori)", foodId: "dal_moong", calories: 112, protein: 7, carbs: 16, fat: 1.5 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
        ],
        totalCalories: 380,
      },
      {
        mealType: "post_dinner",
        time: "9:00 PM",
        foods: [
          { name: "Warm Turmeric Milk (toned)", foodId: "drink_turmeric_milk", calories: 90, protein: 6, carbs: 10, fat: 3 },
        ],
        totalCalories: 100,
      },
    ],
  },

  // ─── Day 2 (Tuesday) ── ~1,430 kcal ───────────────────────────────────
  {
    day: 2,
    dayName: "Tuesday",
    totalCalories: 1430,
    meals: [
      {
        mealType: "pre_breakfast",
        time: "6:30 AM",
        foods: [
          { name: "Warm water + lemon + honey", foodId: "drink_warm_lemon", calories: 15, protein: 0, carbs: 4, fat: 0 },
        ],
        totalCalories: 15,
      },
      {
        mealType: "breakfast",
        time: "7:30 AM",
        foods: [
          { name: "Oats Porridge (toned milk) + flaxseeds", foodId: "breakfast_oats", calories: 200, protein: 8, carbs: 30, fat: 5 },
          { name: "Banana (1/2)", foodId: "fruit_banana", calories: 50, protein: 0.5, carbs: 12, fat: 0.2 },
        ],
        totalCalories: 280,
      },
      {
        mealType: "mid_morning",
        time: "10:30 AM",
        foods: [
          { name: "Sprout Chaat (1 cup)", foodId: "snack_sprout_chaat", calories: 110, protein: 7, carbs: 15, fat: 1 },
        ],
        totalCalories: 110,
      },
      {
        mealType: "lunch",
        time: "1:00 PM",
        foods: [
          { name: "Brown Rice (1 katori)", foodId: "rice_brown", calories: 172, protein: 4, carbs: 36, fat: 1.5 },
          { name: "Rajma (1 katori)", foodId: "dal_rajma", calories: 150, protein: 9, carbs: 22, fat: 2 },
          { name: "Mixed Veg Sabzi", foodId: "sabzi_mixed_veg", calories: 100, protein: 3, carbs: 12, fat: 4 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
        ],
        totalCalories: 490,
      },
      {
        mealType: "evening_snack",
        time: "4:00 PM",
        foods: [
          { name: "Chaas (1 glass)", foodId: "dairy_buttermilk", calories: 38, protein: 2, carbs: 4, fat: 1 },
          { name: "Khakhra (x2)", foodId: "snack_khakhra", calories: 70, protein: 2, carbs: 12, fat: 2 },
        ],
        totalCalories: 110,
      },
      {
        mealType: "dinner",
        time: "7:00 PM",
        foods: [
          { name: "Phulka (x2)", foodId: "bread_phulka", calories: 120, protein: 4, carbs: 24, fat: 0.6 },
          { name: "Baingan Bharta (1 katori)", foodId: "sabzi_baingan_bharta", calories: 100, protein: 2, carbs: 8, fat: 6 },
          { name: "Masoor Dal (1 katori)", foodId: "dal_masoor", calories: 122, protein: 8, carbs: 17, fat: 1 },
          { name: "Cucumber Raita", foodId: "snack_cucumber_raita", calories: 50, protein: 2, carbs: 5, fat: 2 },
        ],
        totalCalories: 420,
      },
      {
        mealType: "post_dinner",
        time: "9:00 PM",
        foods: [
          { name: "Chamomile Tea", calories: 5, protein: 0, carbs: 1, fat: 0 },
        ],
        totalCalories: 5,
      },
    ],
  },

  // ─── Day 3 (Wednesday) ── ~1,385 kcal ─────────────────────────────────
  {
    day: 3,
    dayName: "Wednesday",
    totalCalories: 1385,
    meals: [
      {
        mealType: "pre_breakfast",
        time: "6:30 AM",
        foods: [
          { name: "Jeera Water (soaked overnight)", foodId: "drink_jeera_water", calories: 5, protein: 0, carbs: 1, fat: 0 },
        ],
        totalCalories: 5,
      },
      {
        mealType: "breakfast",
        time: "7:30 AM",
        foods: [
          { name: "Poha (1 plate, with peanuts & veggies)", foodId: "breakfast_poha", calories: 215, protein: 4, carbs: 35, fat: 6 },
          { name: "Orange (1 medium)", foodId: "fruit_orange", calories: 65, protein: 1, carbs: 15, fat: 0.2 },
        ],
        totalCalories: 290,
      },
      {
        mealType: "mid_morning",
        time: "10:30 AM",
        foods: [
          { name: "Roasted Chana (1 cup)", foodId: "snack_roasted_chana", calories: 120, protein: 7, carbs: 18, fat: 3 },
          { name: "Green Tea", foodId: "drink_green_tea", calories: 3, protein: 0, carbs: 0.5, fat: 0 },
        ],
        totalCalories: 125,
      },
      {
        mealType: "lunch",
        time: "1:00 PM",
        foods: [
          { name: "Missi Roti (x2)", foodId: "bread_missi_roti", calories: 210, protein: 10, carbs: 32, fat: 4 },
          { name: "Chole (1 katori)", foodId: "dal_chole", calories: 170, protein: 9, carbs: 24, fat: 4 },
          { name: "Onion-tomato salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
          { name: "Buttermilk", foodId: "dairy_buttermilk", calories: 38, protein: 2, carbs: 4, fat: 1 },
        ],
        totalCalories: 480,
      },
      {
        mealType: "evening_snack",
        time: "4:00 PM",
        foods: [
          { name: "Guava (1 medium)", foodId: "fruit_guava", calories: 55, protein: 2.5, carbs: 12, fat: 0.5 },
          { name: "Walnuts (4 halves)", foodId: "nuts_walnuts", calories: 68, protein: 1.5, carbs: 1.5, fat: 6.5 },
        ],
        totalCalories: 120,
      },
      {
        mealType: "dinner",
        time: "7:00 PM",
        foods: [
          { name: "Veg Soup", foodId: "other_veg_soup", calories: 60, protein: 2, carbs: 8, fat: 2 },
          { name: "Idli (x3)", foodId: "breakfast_idli", calories: 180, protein: 6, carbs: 33, fat: 0.9 },
          { name: "Sambhar (1 katori)", foodId: "dal_sambhar", calories: 115, protein: 6, carbs: 16, fat: 3 },
        ],
        totalCalories: 360,
      },
      {
        mealType: "post_dinner",
        time: "9:00 PM",
        foods: [
          { name: "Warm water + ajwain", foodId: "drink_ajwain_water", calories: 5, protein: 0, carbs: 1, fat: 0 },
        ],
        totalCalories: 5,
      },
    ],
  },

  // ─── Day 4 (Thursday) ── ~1,380 kcal ──────────────────────────────────
  {
    day: 4,
    dayName: "Thursday",
    totalCalories: 1380,
    meals: [
      {
        mealType: "pre_breakfast",
        time: "6:30 AM",
        foods: [
          { name: "Warm water + methi seeds (soaked)", foodId: "drink_methi_water", calories: 10, protein: 0.5, carbs: 1, fat: 0 },
        ],
        totalCalories: 10,
      },
      {
        mealType: "breakfast",
        time: "7:30 AM",
        foods: [
          { name: "Daliya Porridge (with veggies)", foodId: "breakfast_daliya", calories: 180, protein: 6, carbs: 30, fat: 3 },
          { name: "Toned Milk (1 glass)", foodId: "dairy_toned_milk", calories: 95, protein: 6, carbs: 10, fat: 3 },
        ],
        totalCalories: 290,
      },
      {
        mealType: "mid_morning",
        time: "10:30 AM",
        foods: [
          { name: "Papaya (150g)", foodId: "fruit_papaya", calories: 60, protein: 0.8, carbs: 14, fat: 0.3 },
          { name: "Pumpkin Seeds (1 tbsp)", foodId: "nuts_pumpkin_seeds", calories: 58, protein: 3, carbs: 1.5, fat: 5 },
        ],
        totalCalories: 120,
      },
      {
        mealType: "lunch",
        time: "1:00 PM",
        foods: [
          { name: "Moong Dal Khichdi (1.5 katori)", foodId: "rice_khichdi", calories: 285, protein: 10.5, carbs: 48, fat: 4.5 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
          { name: "Papad (1 roasted)", foodId: "other_papad", calories: 40, protein: 2, carbs: 5, fat: 1.5 },
        ],
        totalCalories: 440,
      },
      {
        mealType: "evening_snack",
        time: "4:00 PM",
        foods: [
          { name: "Besan Chilla (1)", foodId: "breakfast_besan_chilla", calories: 115, protein: 6, carbs: 12, fat: 4 },
          { name: "Mint Chutney", foodId: "other_mint_chutney", calories: 15, protein: 0.5, carbs: 2, fat: 0.5 },
        ],
        totalCalories: 115,
      },
      {
        mealType: "dinner",
        time: "7:00 PM",
        foods: [
          { name: "Bajra Roti (x2)", foodId: "bread_bajra_roti", calories: 210, protein: 6, carbs: 40, fat: 3 },
          { name: "Methi Sabzi (1 katori)", foodId: "sabzi_methi", calories: 80, protein: 3, carbs: 5, fat: 4 },
          { name: "Moong Dal (1 katori)", foodId: "dal_moong", calories: 112, protein: 7, carbs: 16, fat: 1.5 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
        ],
        totalCalories: 400,
      },
      {
        mealType: "post_dinner",
        time: "9:00 PM",
        foods: [
          { name: "Green Tea", foodId: "drink_green_tea", calories: 3, protein: 0, carbs: 0.5, fat: 0 },
        ],
        totalCalories: 5,
      },
    ],
  },

  // ─── Day 5 (Friday) ── ~1,445 kcal ────────────────────────────────────
  {
    day: 5,
    dayName: "Friday",
    totalCalories: 1445,
    meals: [
      {
        mealType: "pre_breakfast",
        time: "6:30 AM",
        foods: [
          { name: "Warm water + lemon + ginger", foodId: "drink_warm_lemon", calories: 10, protein: 0, carbs: 2, fat: 0 },
        ],
        totalCalories: 10,
      },
      {
        mealType: "breakfast",
        time: "7:30 AM",
        foods: [
          { name: "Besan Chilla (x2) + low-fat paneer stuffing", foodId: "breakfast_besan_chilla", calories: 230, protein: 12, carbs: 24, fat: 8 },
          { name: "Green Chutney", foodId: "other_mint_chutney", calories: 15, protein: 0.5, carbs: 2, fat: 0.5 },
          { name: "Toned Milk (1 glass)", foodId: "dairy_toned_milk", calories: 95, protein: 6, carbs: 10, fat: 3 },
        ],
        totalCalories: 310,
      },
      {
        mealType: "mid_morning",
        time: "10:30 AM",
        foods: [
          { name: "Sattu Drink (no sugar)", foodId: "drink_sattu", calories: 100, protein: 6, carbs: 15, fat: 2 },
        ],
        totalCalories: 100,
      },
      {
        mealType: "lunch",
        time: "1:00 PM",
        foods: [
          { name: "Jowar Roti (x2)", foodId: "bread_jowar_roti", calories: 190, protein: 6, carbs: 38, fat: 2 },
          { name: "Palak Paneer (50g paneer)", foodId: "sabzi_palak_paneer", calories: 240, protein: 12, carbs: 8, fat: 18 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
          { name: "Buttermilk", foodId: "dairy_buttermilk", calories: 38, protein: 2, carbs: 4, fat: 1 },
        ],
        totalCalories: 470,
      },
      {
        mealType: "evening_snack",
        time: "4:00 PM",
        foods: [
          { name: "Almonds (10 pieces)", foodId: "nuts_almonds", calories: 72, protein: 2.5, carbs: 2.5, fat: 6 },
          { name: "Green Tea", foodId: "drink_green_tea", calories: 3, protein: 0, carbs: 0.5, fat: 0 },
        ],
        totalCalories: 75,
      },
      {
        mealType: "dinner",
        time: "7:00 PM",
        foods: [
          { name: "Upma (vegetable)", foodId: "breakfast_upma", calories: 230, protein: 5, carbs: 32, fat: 8 },
          { name: "Sambhar (1 katori)", foodId: "dal_sambhar", calories: 115, protein: 6, carbs: 16, fat: 3 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
        ],
        totalCalories: 380,
      },
      {
        mealType: "post_dinner",
        time: "9:00 PM",
        foods: [
          { name: "Warm Turmeric Milk", foodId: "drink_turmeric_milk", calories: 90, protein: 6, carbs: 10, fat: 3 },
        ],
        totalCalories: 100,
      },
    ],
  },

  // ─── Day 6 (Saturday) ── ~1,355 kcal ──────────────────────────────────
  {
    day: 6,
    dayName: "Saturday",
    totalCalories: 1355,
    meals: [
      {
        mealType: "pre_breakfast",
        time: "6:30 AM",
        foods: [
          { name: "Jeera Water", foodId: "drink_jeera_water", calories: 5, protein: 0, carbs: 1, fat: 0 },
        ],
        totalCalories: 5,
      },
      {
        mealType: "breakfast",
        time: "7:30 AM",
        foods: [
          { name: "Uttapam (x2, onion-tomato)", foodId: "breakfast_uttapam", calories: 200, protein: 5, carbs: 28, fat: 6 },
          { name: "Coconut Chutney", foodId: "other_coconut_chutney", calories: 40, protein: 1, carbs: 3, fat: 3 },
          { name: "Sambhar (1 katori)", foodId: "dal_sambhar", calories: 115, protein: 6, carbs: 16, fat: 3 },
        ],
        totalCalories: 350,
      },
      {
        mealType: "mid_morning",
        time: "10:30 AM",
        foods: [
          { name: "Mixed Fruit (1 cup, seasonal)", calories: 70, protein: 1, carbs: 17, fat: 0.3 },
        ],
        totalCalories: 70,
      },
      {
        mealType: "lunch",
        time: "1:00 PM",
        foods: [
          { name: "Phulka (x2)", foodId: "bread_phulka", calories: 120, protein: 4, carbs: 24, fat: 0.6 },
          { name: "Chana Dal (1 katori)", foodId: "dal_chana", calories: 140, protein: 9, carbs: 20, fat: 2 },
          { name: "Karela Sabzi (1 katori)", foodId: "sabzi_karela", calories: 75, protein: 2, carbs: 6, fat: 4 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
          { name: "Cucumber Raita", foodId: "snack_cucumber_raita", calories: 50, protein: 2, carbs: 5, fat: 2 },
        ],
        totalCalories: 460,
      },
      {
        mealType: "evening_snack",
        time: "4:00 PM",
        foods: [
          { name: "Murmura Chaat", foodId: "snack_murmura_chaat", calories: 90, protein: 2, carbs: 16, fat: 2 },
          { name: "Green Tea", foodId: "drink_green_tea", calories: 3, protein: 0, carbs: 0.5, fat: 0 },
        ],
        totalCalories: 95,
      },
      {
        mealType: "dinner",
        time: "7:00 PM",
        foods: [
          { name: "Ragi Roti (x2)", foodId: "bread_ragi_roti", calories: 180, protein: 5, carbs: 36, fat: 2 },
          { name: "Toor Dal (1 katori)", foodId: "dal_toor", calories: 130, protein: 8, carbs: 18, fat: 2 },
          { name: "Cabbage Sabzi (1 katori)", foodId: "sabzi_cabbage", calories: 70, protein: 2, carbs: 7, fat: 3 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
        ],
        totalCalories: 370,
      },
      {
        mealType: "post_dinner",
        time: "9:00 PM",
        foods: [
          { name: "Herbal Tea", calories: 5, protein: 0, carbs: 1, fat: 0 },
        ],
        totalCalories: 5,
      },
    ],
  },

  // ─── Day 7 (Sunday) ── ~1,430 kcal ────────────────────────────────────
  {
    day: 7,
    dayName: "Sunday",
    totalCalories: 1430,
    meals: [
      {
        mealType: "pre_breakfast",
        time: "6:30 AM",
        foods: [
          { name: "Warm water + lemon", foodId: "drink_warm_lemon", calories: 10, protein: 0, carbs: 2, fat: 0 },
        ],
        totalCalories: 10,
      },
      {
        mealType: "breakfast",
        time: "8:00 AM",
        foods: [
          { name: "Wheat Paratha (1, minimal oil)", foodId: "bread_paratha_plain", calories: 165, protein: 3.5, carbs: 22, fat: 7 },
          { name: "Low-fat Curd (1 katori)", foodId: "dairy_low_fat_curd", calories: 50, protein: 4, carbs: 5, fat: 1.5 },
          { name: "Guava (1 medium)", foodId: "fruit_guava", calories: 55, protein: 2.5, carbs: 12, fat: 0.5 },
        ],
        totalCalories: 280,
      },
      {
        mealType: "mid_morning",
        time: "10:30 AM",
        foods: [
          { name: "Sprout Chaat (1 cup)", foodId: "snack_sprout_chaat", calories: 110, protein: 7, carbs: 15, fat: 1 },
        ],
        totalCalories: 100,
      },
      {
        mealType: "lunch",
        time: "1:00 PM",
        foods: [
          { name: "Veg Pulao (1 katori)", foodId: "rice_pulao", calories: 240, protein: 5, carbs: 38, fat: 7 },
          { name: "Cucumber Raita", foodId: "snack_cucumber_raita", calories: 50, protein: 2, carbs: 5, fat: 2 },
          { name: "Mixed Dal (1 katori)", foodId: "dal_moong", calories: 112, protein: 7, carbs: 16, fat: 1.5 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
        ],
        totalCalories: 480,
      },
      {
        mealType: "evening_snack",
        time: "4:00 PM",
        foods: [
          { name: "Dhokla (x2)", foodId: "breakfast_dhokla", calories: 110, protein: 4, carbs: 16, fat: 3 },
          { name: "Green Chutney", foodId: "other_mint_chutney", calories: 15, protein: 0.5, carbs: 2, fat: 0.5 },
        ],
        totalCalories: 120,
      },
      {
        mealType: "dinner",
        time: "7:30 PM",
        foods: [
          { name: "Curd Rice (1 katori)", foodId: "rice_curd_rice", calories: 230, protein: 6, carbs: 38, fat: 5 },
          { name: "Rasam (1 katori)", foodId: "dal_rasam", calories: 50, protein: 2, carbs: 7, fat: 1 },
          { name: "Mixed Veg Sabzi", foodId: "sabzi_mixed_veg", calories: 100, protein: 3, carbs: 12, fat: 4 },
          { name: "Salad", foodId: "other_salad", calories: 30, protein: 1, carbs: 5, fat: 0.5 },
        ],
        totalCalories: 340,
      },
      {
        mealType: "post_dinner",
        time: "9:00 PM",
        foods: [
          { name: "Warm milk with nutmeg", foodId: "dairy_toned_milk", calories: 95, protein: 6, carbs: 10, fat: 3 },
        ],
        totalCalories: 100,
      },
    ],
  },
];

/** Get the meal plan for a specific day number (1-7). */
export function getDayPlan(dayNumber: number): DayPlan | undefined {
  return WEEKLY_MEAL_PLAN.find((d) => d.day === dayNumber);
}

/** Get the day number (1=Monday) from a Date object. */
export function getDayNumberFromDate(date: Date): number {
  const jsDay = date.getDay(); // 0=Sun
  return jsDay === 0 ? 7 : jsDay; // Convert to 1=Mon .. 7=Sun
}
