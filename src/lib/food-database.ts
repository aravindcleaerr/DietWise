// ============================================================================
// DietWise - Indian Vegetarian Food Database
// Comprehensive database of 100+ Indian vegetarian foods with accurate
// calorie and macro data sourced from nutritional research.
// ============================================================================

import type { FoodItem } from "./types";

export const FOOD_DATABASE: FoodItem[] = [
  // =========================================================================
  // BREADS / ROTIS
  // =========================================================================
  {
    id: "bread_roti",
    name: "Wheat Roti / Chapati (no oil)",
    nameHindi: "\u0930\u094B\u091F\u0940 / \u091A\u092A\u093E\u0924\u0940",
    category: "bread",
    servingSize: 1,
    servingUnit: "medium (30g atta)",
    nutrition: { calories: 75, protein: 2.5, carbs: 15, fat: 0.5, fiber: 1.2 },
    isVegetarian: true,
  },
  {
    id: "bread_roti_ghee",
    name: "Wheat Roti (with ghee)",
    nameHindi:
      "\u0930\u094B\u091F\u0940 (\u0918\u0940 \u0915\u0947 \u0938\u093E\u0925)",
    category: "bread",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: {
      calories: 115,
      protein: 2.5,
      carbs: 15,
      fat: 5,
      fiber: 1.2,
    },
    isVegetarian: true,
  },
  {
    id: "bread_phulka",
    name: "Phulka (puffed, no oil)",
    nameHindi: "\u092B\u0941\u0932\u094D\u0915\u093E",
    category: "bread",
    servingSize: 1,
    servingUnit: "small",
    nutrition: { calories: 60, protein: 2, carbs: 12, fat: 0.3, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "bread_paratha_plain",
    name: "Plain Paratha",
    nameHindi:
      "\u092A\u0930\u093E\u0920\u093E (\u0938\u093E\u0926\u093E)",
    category: "bread",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 165, protein: 3.5, carbs: 22, fat: 7, fiber: 1.5 },
    isVegetarian: true,
  },
  {
    id: "bread_paratha_aloo",
    name: "Stuffed Paratha (Aloo)",
    nameHindi:
      "\u0906\u0932\u0942 \u092A\u0930\u093E\u0920\u093E",
    category: "bread",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 225, protein: 4, carbs: 30, fat: 10, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "bread_missi_roti",
    name: "Missi Roti",
    nameHindi:
      "\u092E\u093F\u0938\u094D\u0938\u0940 \u0930\u094B\u091F\u0940",
    category: "bread",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 105, protein: 5, carbs: 16, fat: 2, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "bread_bajra_roti",
    name: "Bajra Roti",
    nameHindi:
      "\u092C\u093E\u091C\u0930\u0947 \u0915\u0940 \u0930\u094B\u091F\u0940",
    category: "bread",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 105, protein: 3, carbs: 20, fat: 1.5, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "bread_jowar_roti",
    name: "Jowar Roti",
    nameHindi:
      "\u091C\u094D\u0935\u093E\u0930 \u0915\u0940 \u0930\u094B\u091F\u0940",
    category: "bread",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 95, protein: 3, carbs: 19, fat: 1, fiber: 2.2 },
    isVegetarian: true,
  },
  {
    id: "bread_ragi_roti",
    name: "Ragi Roti",
    nameHindi:
      "\u0930\u093E\u0917\u0940 \u0915\u0940 \u0930\u094B\u091F\u0940",
    category: "bread",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 90, protein: 2.5, carbs: 18, fat: 1, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "bread_naan",
    name: "Naan (tandoori)",
    nameHindi: "\u0928\u093E\u0928",
    category: "bread",
    servingSize: 1,
    servingUnit: "piece",
    nutrition: { calories: 285, protein: 7, carbs: 45, fat: 5, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "bread_puri",
    name: "Puri (deep fried)",
    nameHindi: "\u092A\u0942\u0930\u0940",
    category: "bread",
    servingSize: 1,
    servingUnit: "small",
    nutrition: { calories: 135, protein: 2, carbs: 13, fat: 7, fiber: 0.8 },
    isVegetarian: true,
  },

  // =========================================================================
  // RICE PREPARATIONS
  // =========================================================================
  {
    id: "rice_white",
    name: "Plain White Rice (cooked)",
    nameHindi:
      "\u0938\u093E\u0926\u093E \u091A\u093E\u0935\u0932",
    category: "rice",
    servingSize: 150,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 190, protein: 3.5, carbs: 40, fat: 0.3, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "rice_brown",
    name: "Brown Rice (cooked)",
    nameHindi:
      "\u092C\u094D\u0930\u093E\u0909\u0928 \u0930\u093E\u0907\u0938",
    category: "rice",
    servingSize: 150,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 172, protein: 4, carbs: 36, fat: 1.5, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "rice_jeera",
    name: "Jeera Rice",
    nameHindi:
      "\u091C\u0940\u0930\u093E \u0930\u093E\u0907\u0938",
    category: "rice",
    servingSize: 150,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 210, protein: 4, carbs: 38, fat: 5, fiber: 0.8 },
    isVegetarian: true,
  },
  {
    id: "rice_pulao",
    name: "Veg Pulao",
    nameHindi:
      "\u0935\u0947\u091C \u092A\u0941\u0932\u093E\u0935",
    category: "rice",
    servingSize: 150,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 240, protein: 5, carbs: 38, fat: 7, fiber: 1.5 },
    isVegetarian: true,
  },
  {
    id: "rice_khichdi",
    name: "Khichdi (Moong Dal)",
    nameHindi: "\u0916\u093F\u091A\u0921\u093C\u0940",
    category: "rice",
    servingSize: 150,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 190, protein: 7, carbs: 32, fat: 3, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "rice_lemon",
    name: "Lemon Rice",
    nameHindi:
      "\u0928\u0940\u0902\u092C\u0942 \u0930\u093E\u0907\u0938",
    category: "rice",
    servingSize: 150,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 220, protein: 4, carbs: 40, fat: 5, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "rice_curd",
    name: "Curd Rice",
    nameHindi:
      "\u0926\u0939\u0940 \u091A\u093E\u0935\u0932",
    category: "rice",
    servingSize: 150,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 230, protein: 6, carbs: 38, fat: 5, fiber: 0.8 },
    isVegetarian: true,
  },
  {
    id: "rice_biryani",
    name: "Veg Biryani",
    nameHindi:
      "\u0935\u0947\u091C \u092C\u093F\u0930\u094D\u092F\u093E\u0928\u0940",
    category: "rice",
    servingSize: 150,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 275, protein: 5, carbs: 40, fat: 9, fiber: 1.5 },
    isVegetarian: true,
  },

  // =========================================================================
  // DALS AND LEGUMES
  // =========================================================================
  {
    id: "dal_moong",
    name: "Moong Dal (cooked)",
    nameHindi:
      "\u092E\u0942\u0902\u0917 \u0926\u093E\u0932",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 112, protein: 7, carbs: 16, fat: 1.5, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "dal_toor",
    name: "Toor / Arhar Dal",
    nameHindi:
      "\u0924\u0942\u0930 \u0926\u093E\u0932",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 130, protein: 8, carbs: 18, fat: 2, fiber: 3.5 },
    isVegetarian: true,
  },
  {
    id: "dal_masoor",
    name: "Masoor Dal",
    nameHindi:
      "\u092E\u0938\u0942\u0930 \u0926\u093E\u0932",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 122, protein: 8, carbs: 17, fat: 1, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "dal_chana",
    name: "Chana Dal",
    nameHindi:
      "\u091A\u0928\u093E \u0926\u093E\u0932",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 140, protein: 9, carbs: 20, fat: 2, fiber: 4.0 },
    isVegetarian: true,
  },
  {
    id: "dal_urad",
    name: "Urad Dal",
    nameHindi:
      "\u0909\u0921\u093C\u0926 \u0926\u093E\u0932",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 132, protein: 8, carbs: 17, fat: 2, fiber: 3.5 },
    isVegetarian: true,
  },
  {
    id: "dal_rajma",
    name: "Rajma (Kidney Beans)",
    nameHindi: "\u0930\u093E\u091C\u092E\u093E",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 150, protein: 9, carbs: 22, fat: 2, fiber: 5.0 },
    isVegetarian: true,
  },
  {
    id: "dal_chole",
    name: "Chole (Chickpeas)",
    nameHindi: "\u091B\u094B\u0932\u0947",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 170, protein: 9, carbs: 24, fat: 4, fiber: 5.5 },
    isVegetarian: true,
  },
  {
    id: "dal_sambhar",
    name: "Sambhar",
    nameHindi: "\u0938\u093E\u0902\u092D\u0930",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 115, protein: 6, carbs: 16, fat: 3, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "dal_makhani",
    name: "Dal Makhani",
    nameHindi:
      "\u0926\u093E\u0932 \u092E\u0916\u093E\u0928\u0940",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 215, protein: 9, carbs: 22, fat: 10, fiber: 4.0 },
    isVegetarian: true,
  },
  {
    id: "dal_rasam",
    name: "Rasam",
    nameHindi: "\u0930\u0938\u092E",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 50, protein: 2, carbs: 7, fat: 1, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "dal_sprouts",
    name: "Sprouts (mixed, boiled)",
    nameHindi:
      "\u0905\u0902\u0915\u0941\u0930\u093F\u0924 \u0938\u094D\u092A\u094D\u0930\u093E\u0909\u091F\u094D\u0938",
    category: "dal",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 110, protein: 8, carbs: 15, fat: 1, fiber: 4.5 },
    isVegetarian: true,
  },

  // =========================================================================
  // SABZIS (VEGETABLE DISHES)
  // =========================================================================
  {
    id: "sabzi_lauki",
    name: "Lauki / Bottle Gourd Sabzi",
    nameHindi:
      "\u0932\u094C\u0915\u0940 \u0915\u0940 \u0938\u092C\u094D\u091C\u093C\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 70, protein: 2, carbs: 8, fat: 3, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "sabzi_tinda",
    name: "Tinda Sabzi",
    nameHindi:
      "\u091F\u093F\u0902\u0921\u093E \u0938\u092C\u094D\u091C\u093C\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 65, protein: 1.5, carbs: 7, fat: 3, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "sabzi_palak",
    name: "Palak Sabzi",
    nameHindi:
      "\u092A\u093E\u0932\u0915 \u0938\u092C\u094D\u091C\u093C\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 80, protein: 3, carbs: 6, fat: 4, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "sabzi_bhindi",
    name: "Bhindi (Okra) Sabzi",
    nameHindi:
      "\u092D\u093F\u0902\u0921\u0940 \u0938\u092C\u094D\u091C\u093C\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 90, protein: 2, carbs: 8, fat: 5, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "sabzi_baingan_bharta",
    name: "Baingan Bharta",
    nameHindi:
      "\u092C\u0948\u0902\u0917\u0928 \u092D\u0930\u094D\u0924\u093E",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 100, protein: 2, carbs: 8, fat: 6, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "sabzi_aloo_gobi",
    name: "Aloo Gobi",
    nameHindi:
      "\u0906\u0932\u0942 \u0917\u094B\u092D\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 135, protein: 3, carbs: 16, fat: 6, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "sabzi_aloo_matar",
    name: "Aloo Matar",
    nameHindi:
      "\u0906\u0932\u0942 \u092E\u091F\u0930",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 145, protein: 4, carbs: 18, fat: 6, fiber: 3.5 },
    isVegetarian: true,
  },
  {
    id: "sabzi_paneer_bhurji",
    name: "Paneer Bhurji",
    nameHindi:
      "\u092A\u0928\u0940\u0930 \u092D\u0941\u0930\u094D\u091C\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 275, protein: 15, carbs: 5, fat: 20, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "sabzi_palak_paneer",
    name: "Palak Paneer",
    nameHindi:
      "\u092A\u093E\u0932\u0915 \u092A\u0928\u0940\u0930",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 240, protein: 12, carbs: 8, fat: 18, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "sabzi_mixed_veg",
    name: "Mixed Veg (dry)",
    nameHindi:
      "\u092E\u093F\u0915\u094D\u0938\u094D\u0921 \u0935\u0947\u091C",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 100, protein: 3, carbs: 12, fat: 4, fiber: 3.5 },
    isVegetarian: true,
  },
  {
    id: "sabzi_cabbage",
    name: "Cabbage Sabzi",
    nameHindi:
      "\u092A\u0924\u094D\u0924\u093E \u0917\u094B\u092D\u0940 \u0938\u092C\u094D\u091C\u093C\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 70, protein: 2, carbs: 7, fat: 3, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "sabzi_karela",
    name: "Karela (Bitter Gourd) Sabzi",
    nameHindi:
      "\u0915\u0930\u0947\u0932\u093E \u0938\u092C\u094D\u091C\u093C\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 75, protein: 2, carbs: 6, fat: 4, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "sabzi_methi",
    name: "Methi Sabzi",
    nameHindi:
      "\u092E\u0947\u0925\u0940 \u0938\u092C\u094D\u091C\u093C\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 80, protein: 3, carbs: 5, fat: 4, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "sabzi_gobi_matar",
    name: "Gobi Matar",
    nameHindi:
      "\u0917\u094B\u092D\u0940 \u092E\u091F\u0930",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 110, protein: 4, carbs: 12, fat: 5, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "sabzi_torai",
    name: "Torai / Ridge Gourd Sabzi",
    nameHindi:
      "\u0924\u094B\u0930\u0908 \u0938\u092C\u094D\u091C\u093C\u0940",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 60, protein: 1.5, carbs: 6, fat: 3, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "sabzi_bharwa_shimla",
    name: "Bharwa Shimla Mirch",
    nameHindi:
      "\u092D\u0930\u0935\u093E\u0902 \u0936\u093F\u092E\u0932\u093E \u092E\u093F\u0930\u094D\u091A",
    category: "sabzi",
    servingSize: 150,
    servingUnit: "ml (1 katori)",
    nutrition: { calories: 95, protein: 2.5, carbs: 10, fat: 5, fiber: 2.5 },
    isVegetarian: true,
  },

  // =========================================================================
  // BREAKFAST ITEMS
  // =========================================================================
  {
    id: "breakfast_poha",
    name: "Poha (Flattened Rice)",
    nameHindi: "\u092A\u094B\u0939\u093E",
    category: "breakfast",
    servingSize: 200,
    servingUnit: "g (1 plate)",
    nutrition: { calories: 215, protein: 4, carbs: 35, fat: 6, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "breakfast_upma",
    name: "Upma (Semolina)",
    nameHindi: "\u0909\u092A\u092E\u093E",
    category: "breakfast",
    servingSize: 200,
    servingUnit: "g (1 plate)",
    nutrition: { calories: 230, protein: 5, carbs: 32, fat: 8, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "breakfast_idli",
    name: "Idli (plain)",
    nameHindi: "\u0907\u0921\u0932\u0940",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "piece",
    nutrition: { calories: 60, protein: 2, carbs: 11, fat: 0.3, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "breakfast_dosa",
    name: "Dosa (plain)",
    nameHindi:
      "\u0926\u094B\u0938\u093E (\u0938\u093E\u0926\u093E)",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 120, protein: 3, carbs: 18, fat: 3, fiber: 0.8 },
    isVegetarian: true,
  },
  {
    id: "breakfast_masala_dosa",
    name: "Masala Dosa",
    nameHindi:
      "\u092E\u0938\u093E\u0932\u093E \u0926\u094B\u0938\u093E",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 275, protein: 5, carbs: 35, fat: 12, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "breakfast_uttapam",
    name: "Uttapam (Onion)",
    nameHindi: "\u0909\u0924\u094D\u0924\u092A\u092E",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 200, protein: 5, carbs: 28, fat: 6, fiber: 1.5 },
    isVegetarian: true,
  },
  {
    id: "breakfast_besan_chilla",
    name: "Besan Chilla",
    nameHindi:
      "\u092C\u0947\u0938\u0928 \u091A\u093F\u0932\u094D\u0932\u093E",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 115, protein: 6, carbs: 12, fat: 4, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "breakfast_moong_chilla",
    name: "Moong Dal Chilla",
    nameHindi:
      "\u092E\u0942\u0902\u0917 \u0926\u093E\u0932 \u091A\u093F\u0932\u094D\u0932\u093E",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "medium",
    nutrition: { calories: 100, protein: 7, carbs: 12, fat: 2, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "breakfast_oats_porridge",
    name: "Oats Porridge (with milk)",
    nameHindi:
      "\u0913\u091F\u094D\u0938 \u0926\u0932\u093F\u092F\u093E",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "bowl",
    nutrition: { calories: 200, protein: 8, carbs: 30, fat: 5, fiber: 4.0 },
    isVegetarian: true,
  },
  {
    id: "breakfast_daliya",
    name: "Daliya / Broken Wheat Porridge",
    nameHindi: "\u0926\u0932\u093F\u092F\u093E",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "bowl",
    nutrition: { calories: 180, protein: 6, carbs: 30, fat: 3, fiber: 5.0 },
    isVegetarian: true,
  },
  {
    id: "breakfast_dhokla",
    name: "Dhokla",
    nameHindi: "\u0922\u094B\u0915\u0932\u093E",
    category: "breakfast",
    servingSize: 2,
    servingUnit: "pieces",
    nutrition: { calories: 110, protein: 4, carbs: 16, fat: 3, fiber: 1.5 },
    isVegetarian: true,
  },
  {
    id: "breakfast_thepla",
    name: "Thepla",
    nameHindi: "\u0925\u0947\u092A\u0932\u093E",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "piece",
    nutrition: { calories: 120, protein: 3, carbs: 15, fat: 5, fiber: 1.5 },
    isVegetarian: true,
  },
  {
    id: "breakfast_aloo_paratha",
    name: "Aloo Paratha with Curd",
    nameHindi:
      "\u0906\u0932\u0942 \u092A\u0930\u093E\u0920\u093E \u0926\u0939\u0940 \u0915\u0947 \u0938\u093E\u0925",
    category: "breakfast",
    servingSize: 1,
    servingUnit: "paratha + 50g curd",
    nutrition: { calories: 260, protein: 5.5, carbs: 33, fat: 11.5, fiber: 2.5 },
    isVegetarian: true,
  },

  // =========================================================================
  // DAIRY
  // =========================================================================
  {
    id: "dairy_whole_milk",
    name: "Whole Milk",
    nameHindi:
      "\u092B\u0941\u0932 \u0915\u094D\u0930\u0940\u092E \u0926\u0942\u0927",
    category: "dairy",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 130, protein: 6, carbs: 10, fat: 7, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "dairy_toned_milk",
    name: "Toned Milk",
    nameHindi:
      "\u091F\u094B\u0928\u094D\u0921 \u0926\u0942\u0927",
    category: "dairy",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 95, protein: 6, carbs: 10, fat: 3, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "dairy_skimmed_milk",
    name: "Skimmed Milk",
    nameHindi:
      "\u0938\u094D\u0915\u093F\u092E\u094D\u0921 \u0926\u0942\u0927",
    category: "dairy",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 70, protein: 6.5, carbs: 10, fat: 0.3, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "dairy_curd",
    name: "Curd (plain, full fat)",
    nameHindi: "\u0926\u0939\u0940",
    category: "dairy",
    servingSize: 100,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 65, protein: 3, carbs: 5, fat: 3, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "dairy_lowfat_curd",
    name: "Low-fat Curd",
    nameHindi:
      "\u0932\u094B \u092B\u0948\u091F \u0926\u0939\u0940",
    category: "dairy",
    servingSize: 100,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 50, protein: 4, carbs: 5, fat: 1.5, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "dairy_buttermilk",
    name: "Buttermilk (Chaas)",
    nameHindi: "\u091B\u093E\u091B",
    category: "dairy",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 38, protein: 2, carbs: 4, fat: 1, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "dairy_paneer",
    name: "Paneer (full fat)",
    nameHindi: "\u092A\u0928\u0940\u0930",
    category: "dairy",
    servingSize: 50,
    servingUnit: "g",
    nutrition: { calories: 140, protein: 9, carbs: 1, fat: 10, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "dairy_lowfat_paneer",
    name: "Low-fat Paneer",
    nameHindi:
      "\u0932\u094B \u092B\u0948\u091F \u092A\u0928\u0940\u0930",
    category: "dairy",
    servingSize: 50,
    servingUnit: "g",
    nutrition: { calories: 95, protein: 10, carbs: 2, fat: 5, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "dairy_ghee",
    name: "Ghee",
    nameHindi: "\u0918\u0940",
    category: "dairy",
    servingSize: 5,
    servingUnit: "g (1 tsp)",
    nutrition: { calories: 45, protein: 0, carbs: 0, fat: 5, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "dairy_hung_curd",
    name: "Hung Curd / Greek Yogurt",
    nameHindi:
      "\u0939\u0902\u0917 \u0915\u0930\u094D\u0921",
    category: "dairy",
    servingSize: 100,
    servingUnit: "g",
    nutrition: { calories: 70, protein: 11, carbs: 5, fat: 1.5, fiber: 0 },
    isVegetarian: true,
  },

  // =========================================================================
  // FRUITS
  // =========================================================================
  {
    id: "fruit_apple",
    name: "Apple",
    nameHindi: "\u0938\u0947\u092C",
    category: "fruit",
    servingSize: 180,
    servingUnit: "g (1 medium)",
    nutrition: { calories: 90, protein: 0.5, carbs: 22, fat: 0.3, fiber: 4.0 },
    isVegetarian: true,
  },
  {
    id: "fruit_banana",
    name: "Banana",
    nameHindi: "\u0915\u0947\u0932\u093E",
    category: "fruit",
    servingSize: 120,
    servingUnit: "g (1 medium)",
    nutrition: { calories: 97, protein: 1, carbs: 23, fat: 0.3, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "fruit_papaya",
    name: "Papaya",
    nameHindi: "\u092A\u092A\u0940\u0924\u093E",
    category: "fruit",
    servingSize: 150,
    servingUnit: "g (1 cup)",
    nutrition: { calories: 60, protein: 0.8, carbs: 14, fat: 0.3, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "fruit_guava",
    name: "Guava",
    nameHindi: "\u0905\u092E\u0930\u0942\u0926",
    category: "fruit",
    servingSize: 100,
    servingUnit: "g (1 medium)",
    nutrition: { calories: 55, protein: 2.5, carbs: 12, fat: 0.5, fiber: 5.0 },
    isVegetarian: true,
  },
  {
    id: "fruit_orange",
    name: "Orange",
    nameHindi: "\u0938\u0902\u0924\u0930\u093E",
    category: "fruit",
    servingSize: 150,
    servingUnit: "g (1 medium)",
    nutrition: { calories: 65, protein: 1, carbs: 15, fat: 0.2, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "fruit_watermelon",
    name: "Watermelon",
    nameHindi: "\u0924\u0930\u092C\u0942\u091C\u093C",
    category: "fruit",
    servingSize: 150,
    servingUnit: "g (1 cup)",
    nutrition: { calories: 47, protein: 0.6, carbs: 11, fat: 0.2, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "fruit_mango",
    name: "Mango",
    nameHindi: "\u0906\u092E",
    category: "fruit",
    servingSize: 200,
    servingUnit: "g (1 medium)",
    nutrition: { calories: 140, protein: 1, carbs: 35, fat: 0.5, fiber: 3.0 },
    isVegetarian: true,
  },
  {
    id: "fruit_pomegranate",
    name: "Pomegranate",
    nameHindi: "\u0905\u0928\u093E\u0930",
    category: "fruit",
    servingSize: 80,
    servingUnit: "g (1/2 cup seeds)",
    nutrition: { calories: 70, protein: 1.5, carbs: 16, fat: 1, fiber: 3.5 },
    isVegetarian: true,
  },
  {
    id: "fruit_grapes",
    name: "Grapes",
    nameHindi: "\u0905\u0902\u0917\u0942\u0930",
    category: "fruit",
    servingSize: 100,
    servingUnit: "g (1 cup)",
    nutrition: { calories: 67, protein: 0.6, carbs: 17, fat: 0.3, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "fruit_pear",
    name: "Pear",
    nameHindi: "\u0928\u093E\u0936\u092A\u093E\u0924\u0940",
    category: "fruit",
    servingSize: 180,
    servingUnit: "g (1 medium)",
    nutrition: { calories: 95, protein: 0.6, carbs: 23, fat: 0.2, fiber: 5.0 },
    isVegetarian: true,
  },

  // =========================================================================
  // NUTS AND SEEDS
  // =========================================================================
  {
    id: "nuts_almonds",
    name: "Almonds",
    nameHindi: "\u092C\u093E\u0926\u093E\u092E",
    category: "nuts_seeds",
    servingSize: 12,
    servingUnit: "g (10 pieces)",
    nutrition: { calories: 72, protein: 2.5, carbs: 2.5, fat: 6, fiber: 1.5 },
    isVegetarian: true,
  },
  {
    id: "nuts_walnuts",
    name: "Walnuts",
    nameHindi: "\u0905\u0916\u0930\u094B\u091F",
    category: "nuts_seeds",
    servingSize: 10,
    servingUnit: "g (4 halves)",
    nutrition: { calories: 67, protein: 1.5, carbs: 1.5, fat: 6.5, fiber: 0.7 },
    isVegetarian: true,
  },
  {
    id: "nuts_flaxseeds",
    name: "Flaxseeds",
    nameHindi:
      "\u0905\u0932\u0938\u0940 \u0915\u0947 \u092C\u0940\u091C",
    category: "nuts_seeds",
    servingSize: 10,
    servingUnit: "g (1 tbsp)",
    nutrition: { calories: 52, protein: 2, carbs: 3, fat: 4, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "nuts_chia_seeds",
    name: "Chia Seeds",
    nameHindi:
      "\u091A\u093F\u092F\u093E \u0938\u0940\u0921\u094D\u0938",
    category: "nuts_seeds",
    servingSize: 12,
    servingUnit: "g (1 tbsp)",
    nutrition: { calories: 58, protein: 2, carbs: 5, fat: 3.5, fiber: 4.0 },
    isVegetarian: true,
  },
  {
    id: "nuts_pumpkin_seeds",
    name: "Pumpkin Seeds",
    nameHindi:
      "\u0915\u0926\u094D\u0926\u0942 \u0915\u0947 \u092C\u0940\u091C",
    category: "nuts_seeds",
    servingSize: 10,
    servingUnit: "g (1 tbsp)",
    nutrition: { calories: 57, protein: 3, carbs: 1.5, fat: 5, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "nuts_peanuts",
    name: "Peanuts (roasted)",
    nameHindi:
      "\u092E\u0942\u0902\u0917\u092B\u0932\u0940 (\u092D\u0941\u0928\u0940)",
    category: "nuts_seeds",
    servingSize: 15,
    servingUnit: "g (15-20 pieces)",
    nutrition: { calories: 87, protein: 4, carbs: 2, fat: 7, fiber: 1.2 },
    isVegetarian: true,
  },
  {
    id: "nuts_makhana",
    name: "Makhana (Fox Nuts)",
    nameHindi: "\u092E\u0916\u093E\u0928\u093E",
    category: "nuts_seeds",
    servingSize: 20,
    servingUnit: "g (1 cup)",
    nutrition: { calories: 70, protein: 3, carbs: 13, fat: 0.5, fiber: 1.5 },
    isVegetarian: true,
  },
  {
    id: "nuts_cashews",
    name: "Cashews",
    nameHindi: "\u0915\u093E\u091C\u0942",
    category: "nuts_seeds",
    servingSize: 15,
    servingUnit: "g (10 pieces)",
    nutrition: { calories: 85, protein: 2.5, carbs: 4.5, fat: 6.5, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "nuts_sunflower_seeds",
    name: "Sunflower Seeds",
    nameHindi:
      "\u0938\u0942\u0930\u091C\u092E\u0941\u0916\u0940 \u0915\u0947 \u092C\u0940\u091C",
    category: "nuts_seeds",
    servingSize: 10,
    servingUnit: "g (1 tbsp)",
    nutrition: { calories: 58, protein: 2, carbs: 2, fat: 5, fiber: 0.8 },
    isVegetarian: true,
  },

  // =========================================================================
  // DRINKS
  // =========================================================================
  {
    id: "drink_jeera_water",
    name: "Jeera Water",
    nameHindi:
      "\u091C\u0940\u0930\u093E \u092A\u093E\u0928\u0940",
    category: "drink",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 6, protein: 0.3, carbs: 1, fat: 0.2, fiber: 0.2 },
    isVegetarian: true,
  },
  {
    id: "drink_green_tea",
    name: "Green Tea",
    nameHindi:
      "\u0917\u094D\u0930\u0940\u0928 \u091F\u0940",
    category: "drink",
    servingSize: 200,
    servingUnit: "ml (1 cup)",
    nutrition: { calories: 3, protein: 0, carbs: 0.5, fat: 0, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "drink_warm_lemon_water",
    name: "Warm Lemon Water",
    nameHindi:
      "\u0917\u0930\u094D\u092E \u0928\u0940\u0902\u092C\u0942 \u092A\u093E\u0928\u0940",
    category: "drink",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 8, protein: 0.1, carbs: 2, fat: 0, fiber: 0.1 },
    isVegetarian: true,
  },
  {
    id: "drink_turmeric_milk",
    name: "Turmeric Milk (Haldi Doodh)",
    nameHindi:
      "\u0939\u0932\u094D\u0926\u0940 \u0926\u0942\u0927",
    category: "drink",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 100, protein: 6, carbs: 10, fat: 3.5, fiber: 0.3 },
    isVegetarian: true,
  },
  {
    id: "drink_buttermilk",
    name: "Buttermilk (Chaas - salted)",
    nameHindi:
      "\u091B\u093E\u091B (\u0928\u092E\u0915\u0940\u0928)",
    category: "drink",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 38, protein: 2, carbs: 4, fat: 1, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "drink_methi_water",
    name: "Methi Water (Fenugreek)",
    nameHindi:
      "\u092E\u0947\u0925\u0940 \u092A\u093E\u0928\u0940",
    category: "drink",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 8, protein: 0.5, carbs: 1, fat: 0.2, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "drink_cinnamon_water",
    name: "Cinnamon Water",
    nameHindi:
      "\u0926\u093E\u0932\u091A\u0940\u0928\u0940 \u092A\u093E\u0928\u0940",
    category: "drink",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 7, protein: 0.1, carbs: 1.5, fat: 0, fiber: 0.3 },
    isVegetarian: true,
  },
  {
    id: "drink_ajwain_water",
    name: "Ajwain Water",
    nameHindi:
      "\u0905\u091C\u0935\u093E\u0907\u0928 \u092A\u093E\u0928\u0940",
    category: "drink",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 5, protein: 0.1, carbs: 1, fat: 0.1, fiber: 0.2 },
    isVegetarian: true,
  },
  {
    id: "drink_sattu",
    name: "Sattu Drink (no sugar)",
    nameHindi:
      "\u0938\u0924\u094D\u0924\u0942 \u0915\u093E \u0936\u0930\u094D\u092C\u0924",
    category: "drink",
    servingSize: 30,
    servingUnit: "g sattu in water",
    nutrition: { calories: 110, protein: 7, carbs: 15, fat: 2, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "drink_coconut_water",
    name: "Coconut Water",
    nameHindi:
      "\u0928\u093E\u0930\u093F\u092F\u0932 \u092A\u093E\u0928\u0940",
    category: "drink",
    servingSize: 200,
    servingUnit: "ml (1 glass)",
    nutrition: { calories: 40, protein: 0.5, carbs: 9, fat: 0.2, fiber: 0.2 },
    isVegetarian: true,
  },

  // =========================================================================
  // SNACKS
  // =========================================================================
  {
    id: "snack_roasted_chana",
    name: "Roasted Chana",
    nameHindi:
      "\u092D\u0941\u0928\u0947 \u091A\u0928\u0947",
    category: "snack",
    servingSize: 30,
    servingUnit: "g (1 cup)",
    nutrition: { calories: 120, protein: 7, carbs: 18, fat: 2, fiber: 4.0 },
    isVegetarian: true,
  },
  {
    id: "snack_murmura_chaat",
    name: "Murmura Chaat",
    nameHindi:
      "\u092E\u0941\u0930\u092E\u0941\u0930\u0947 \u091A\u093E\u091F",
    category: "snack",
    servingSize: 1,
    servingUnit: "cup",
    nutrition: { calories: 90, protein: 2, carbs: 16, fat: 2, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "snack_sprout_chaat",
    name: "Sprout Chaat",
    nameHindi:
      "\u0938\u094D\u092A\u094D\u0930\u093E\u0909\u091F \u091A\u093E\u091F",
    category: "snack",
    servingSize: 1,
    servingUnit: "cup",
    nutrition: { calories: 105, protein: 7, carbs: 15, fat: 1, fiber: 4.0 },
    isVegetarian: true,
  },
  {
    id: "snack_khakhra",
    name: "Khakhra",
    nameHindi: "\u0916\u093E\u0916\u0930\u093E",
    category: "snack",
    servingSize: 1,
    servingUnit: "piece",
    nutrition: { calories: 55, protein: 2, carbs: 8, fat: 2, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "snack_peanut_chikki",
    name: "Peanut Chikki",
    nameHindi:
      "\u092E\u0942\u0902\u0917\u092B\u0932\u0940 \u091A\u093F\u0915\u094D\u0915\u0940",
    category: "snack",
    servingSize: 25,
    servingUnit: "g (1 piece)",
    nutrition: { calories: 110, protein: 3, carbs: 12, fat: 6, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "snack_fruit_chaat",
    name: "Fruit Chaat",
    nameHindi:
      "\u092B\u094D\u0930\u0942\u091F \u091A\u093E\u091F",
    category: "snack",
    servingSize: 150,
    servingUnit: "g (1 bowl)",
    nutrition: { calories: 80, protein: 1, carbs: 19, fat: 0.3, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "snack_cucumber_raita",
    name: "Cucumber Raita",
    nameHindi:
      "\u0916\u0940\u0930\u0947 \u0915\u093E \u0930\u093E\u092F\u0924\u093E",
    category: "snack",
    servingSize: 100,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 50, protein: 3, carbs: 5, fat: 2, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "snack_roasted_makhana",
    name: "Roasted Makhana (seasoned)",
    nameHindi:
      "\u092D\u0941\u0928\u0947 \u092E\u0916\u093E\u0928\u0947",
    category: "snack",
    servingSize: 20,
    servingUnit: "g (1 cup)",
    nutrition: { calories: 75, protein: 3, carbs: 13, fat: 1, fiber: 1.5 },
    isVegetarian: true,
  },

  // =========================================================================
  // PROTEIN-RICH VEGETARIAN FOODS (OTHER)
  // =========================================================================
  {
    id: "other_soy_chunks",
    name: "Soy Chunks (Nutrela)",
    nameHindi:
      "\u0938\u094B\u092F\u093E \u091A\u0902\u0915\u094D\u0938",
    category: "other",
    servingSize: 30,
    servingUnit: "g (dry)",
    nutrition: { calories: 100, protein: 16, carbs: 8, fat: 0.5, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "other_tofu",
    name: "Tofu",
    nameHindi: "\u091F\u094B\u092B\u0942",
    category: "other",
    servingSize: 100,
    servingUnit: "g",
    nutrition: { calories: 145, protein: 16, carbs: 3, fat: 8, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "other_quinoa",
    name: "Quinoa (cooked)",
    nameHindi: "\u0915\u094D\u0935\u093F\u0928\u094B\u0906",
    category: "other",
    servingSize: 150,
    servingUnit: "g (1 katori)",
    nutrition: { calories: 180, protein: 8, carbs: 30, fat: 3, fiber: 3.5 },
    isVegetarian: true,
  },
  {
    id: "other_sattu_flour",
    name: "Sattu (Roasted Gram Flour)",
    nameHindi: "\u0938\u0924\u094D\u0924\u0942",
    category: "other",
    servingSize: 30,
    servingUnit: "g",
    nutrition: { calories: 110, protein: 7, carbs: 15, fat: 2, fiber: 2.5 },
    isVegetarian: true,
  },
  {
    id: "other_peanut_butter",
    name: "Peanut Butter",
    nameHindi:
      "\u092A\u0940\u0928\u091F \u092C\u091F\u0930",
    category: "other",
    servingSize: 15,
    servingUnit: "g (1 tbsp)",
    nutrition: { calories: 94, protein: 4, carbs: 3, fat: 8, fiber: 1.0 },
    isVegetarian: true,
  },
  {
    id: "other_honey",
    name: "Honey",
    nameHindi: "\u0936\u0939\u0926",
    category: "other",
    servingSize: 10,
    servingUnit: "g (1 tsp)",
    nutrition: { calories: 32, protein: 0, carbs: 8, fat: 0, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "other_jaggery",
    name: "Jaggery (Gur)",
    nameHindi: "\u0917\u0941\u0921\u093C",
    category: "other",
    servingSize: 10,
    servingUnit: "g (1 small piece)",
    nutrition: { calories: 38, protein: 0.1, carbs: 9.5, fat: 0, fiber: 0 },
    isVegetarian: true,
  },
  {
    id: "other_coconut_chutney",
    name: "Coconut Chutney",
    nameHindi:
      "\u0928\u093E\u0930\u093F\u092F\u0932 \u091A\u091F\u0928\u0940",
    category: "other",
    servingSize: 30,
    servingUnit: "g (1 tbsp)",
    nutrition: { calories: 40, protein: 0.5, carbs: 3, fat: 3, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "other_mint_chutney",
    name: "Mint Chutney (Green Chutney)",
    nameHindi:
      "\u092A\u0941\u0926\u0940\u0928\u0947 \u0915\u0940 \u091A\u091F\u0928\u0940",
    category: "other",
    servingSize: 30,
    servingUnit: "g (1 tbsp)",
    nutrition: { calories: 10, protein: 0.5, carbs: 1.5, fat: 0.2, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "other_pickle",
    name: "Pickle (Achar)",
    nameHindi: "\u0906\u091A\u093E\u0930",
    category: "other",
    servingSize: 10,
    servingUnit: "g (1 tsp)",
    nutrition: { calories: 20, protein: 0.2, carbs: 1, fat: 1.5, fiber: 0.3 },
    isVegetarian: true,
  },
  {
    id: "other_papad",
    name: "Papad (roasted)",
    nameHindi:
      "\u092A\u093E\u092A\u0921\u093C (\u092D\u0941\u0928\u093E)",
    category: "other",
    servingSize: 1,
    servingUnit: "piece",
    nutrition: { calories: 40, protein: 2, carbs: 6, fat: 0.5, fiber: 0.5 },
    isVegetarian: true,
  },
  {
    id: "other_salad",
    name: "Mixed Salad (cucumber, tomato, onion)",
    nameHindi: "\u0938\u0932\u093E\u0926",
    category: "other",
    servingSize: 100,
    servingUnit: "g (1 plate)",
    nutrition: { calories: 25, protein: 1, carbs: 5, fat: 0.2, fiber: 1.5 },
    isVegetarian: true,
  },
  {
    id: "other_veg_soup",
    name: "Mixed Vegetable Soup",
    nameHindi:
      "\u0935\u0947\u091C \u0938\u0942\u092A",
    category: "other",
    servingSize: 200,
    servingUnit: "ml (1 bowl)",
    nutrition: { calories: 60, protein: 2, carbs: 10, fat: 1.5, fiber: 2.0 },
    isVegetarian: true,
  },
  {
    id: "other_wheat_toast",
    name: "Whole Wheat Toast",
    nameHindi:
      "\u0917\u0947\u0939\u0942\u0902 \u091F\u094B\u0938\u094D\u091F",
    category: "other",
    servingSize: 1,
    servingUnit: "slice",
    nutrition: { calories: 70, protein: 3, carbs: 13, fat: 1, fiber: 2.0 },
    isVegetarian: true,
  },
];

// ============================================================================
// Search function with fuzzy matching
// ============================================================================

/**
 * Searches the food database by name, Hindi name, or category.
 * Performs case-insensitive substring matching with basic fuzzy support.
 *
 * @param query - The search string
 * @returns Matching FoodItem array, sorted by relevance
 */
export function searchFoods(query: string): FoodItem[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/);

  // Score each food item for relevance
  const scoredResults: { food: FoodItem; score: number }[] = [];

  for (const food of FOOD_DATABASE) {
    const nameLower = food.name.toLowerCase();
    const hindiLower = (food.nameHindi || "").toLowerCase();
    const categoryLower = food.category.toLowerCase();

    let score = 0;

    // Exact name match (highest priority)
    if (nameLower === normalizedQuery) {
      score += 100;
    }

    // Name starts with query
    if (nameLower.startsWith(normalizedQuery)) {
      score += 50;
    }

    // Name contains the full query string
    if (nameLower.includes(normalizedQuery)) {
      score += 30;
    }

    // Hindi name contains query
    if (hindiLower.includes(normalizedQuery)) {
      score += 25;
    }

    // Category matches query
    if (categoryLower.includes(normalizedQuery)) {
      score += 10;
    }

    // Check individual words (fuzzy-ish matching)
    for (const word of queryWords) {
      if (word.length < 2) continue;

      if (nameLower.includes(word)) {
        score += 15;
      }
      if (hindiLower.includes(word)) {
        score += 10;
      }
      if (categoryLower.includes(word)) {
        score += 5;
      }

      // Levenshtein-like: check if any word in the food name is similar
      const nameWords = nameLower.split(/[\s/()]+/);
      for (const nameWord of nameWords) {
        if (nameWord.length < 2) continue;
        // Starts-with matching for partial typing
        if (nameWord.startsWith(word) || word.startsWith(nameWord)) {
          score += 8;
        }
      }
    }

    if (score > 0) {
      scoredResults.push({ food, score });
    }
  }

  // Sort by score descending, then by name alphabetically
  scoredResults.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.food.name.localeCompare(b.food.name);
  });

  return scoredResults.map((r) => r.food);
}

/**
 * Get all foods in a specific category.
 */
export function getFoodsByCategory(
  category: FoodItem["category"]
): FoodItem[] {
  return FOOD_DATABASE.filter((food) => food.category === category);
}

/**
 * Get a single food item by its ID.
 */
export function getFoodById(id: string): FoodItem | undefined {
  return FOOD_DATABASE.find((food) => food.id === id);
}
