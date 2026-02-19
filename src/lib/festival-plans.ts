// ============================================================================
// DietWise - Festival & Fasting Day Meal Plans
// Specialized meal plans for Indian festivals and religious fasting days
// ============================================================================

export interface FestivalPlan {
  id: string;
  name: string;
  nameHindi: string;
  description: string;
  type: "fasting" | "festival";
  meals: {
    mealType: string;
    time: string;
    items: { name: string; calories: number; portion: string }[];
  }[];
  totalCalories: number;
  tips: string[];
}

export const FESTIVAL_PLANS: FestivalPlan[] = [
  {
    id: "navratri",
    name: "Navratri Fast",
    nameHindi: "नवरात्रि व्रत",
    description: "9-day fasting plan. Avoid grains, onion, garlic. Allowed: fruits, dairy, sabudana, kuttu, singhara, makhana.",
    type: "fasting",
    totalCalories: 1200,
    meals: [
      {
        mealType: "Pre-Breakfast",
        time: "7:00 AM",
        items: [
          { name: "Warm water with lemon", calories: 8, portion: "1 glass" },
        ],
      },
      {
        mealType: "Breakfast",
        time: "8:30 AM",
        items: [
          { name: "Sabudana Khichdi", calories: 280, portion: "1 plate" },
          { name: "Curd", calories: 65, portion: "1 katori" },
        ],
      },
      {
        mealType: "Mid-Morning",
        time: "11:00 AM",
        items: [
          { name: "Makhana (roasted)", calories: 75, portion: "1 cup" },
          { name: "Green Tea", calories: 3, portion: "1 cup" },
        ],
      },
      {
        mealType: "Lunch",
        time: "1:00 PM",
        items: [
          { name: "Kuttu ki Puri (2 small)", calories: 200, portion: "2 pieces" },
          { name: "Aloo ki Sabzi (no onion/garlic)", calories: 130, portion: "1 katori" },
          { name: "Cucumber Raita", calories: 50, portion: "1 katori" },
        ],
      },
      {
        mealType: "Evening Snack",
        time: "5:00 PM",
        items: [
          { name: "Fruit Chaat", calories: 80, portion: "1 bowl" },
          { name: "Coconut Water", calories: 40, portion: "1 glass" },
        ],
      },
      {
        mealType: "Dinner",
        time: "7:30 PM",
        items: [
          { name: "Singhara Atta Roti (2)", calories: 160, portion: "2 pieces" },
          { name: "Paneer Curry (no onion/garlic)", calories: 200, portion: "1 katori" },
        ],
      },
    ],
    tips: [
      "Eat small, frequent meals to maintain energy",
      "Stay well hydrated — at least 8 glasses of water",
      "Makhana and nuts are excellent fasting snacks",
      "Avoid fried foods like puri/pakora — choose baked or roasted alternatives",
      "Rock salt (sendha namak) is allowed; regular salt is not in some traditions",
    ],
  },
  {
    id: "ekadashi",
    name: "Ekadashi Fast",
    nameHindi: "एकादशी व्रत",
    description: "Twice-monthly fast on the 11th day of each lunar cycle. Avoid grains and beans. Focus on fruits, dairy, and root vegetables.",
    type: "fasting",
    totalCalories: 1000,
    meals: [
      {
        mealType: "Morning",
        time: "8:00 AM",
        items: [
          { name: "Warm Milk with Turmeric", calories: 100, portion: "1 glass" },
          { name: "Dry Fruits Mix", calories: 120, portion: "handful" },
        ],
      },
      {
        mealType: "Mid-Day",
        time: "12:00 PM",
        items: [
          { name: "Fruit Plate (banana, apple, papaya)", calories: 200, portion: "1 plate" },
          { name: "Curd", calories: 65, portion: "1 katori" },
        ],
      },
      {
        mealType: "Evening",
        time: "5:00 PM",
        items: [
          { name: "Sabudana Kheer", calories: 200, portion: "1 bowl" },
          { name: "Potato Sabzi", calories: 150, portion: "1 katori" },
          { name: "Kuttu Roti (1)", calories: 80, portion: "1 piece" },
        ],
      },
      {
        mealType: "Night",
        time: "8:00 PM",
        items: [
          { name: "Warm Milk", calories: 95, portion: "1 glass" },
        ],
      },
    ],
    tips: [
      "Break the fast next morning after sunrise",
      "Avoid sleeping during the day on Ekadashi",
      "Keep meals light and easy to digest",
      "Some people do a complete water fast — listen to your body",
    ],
  },
  {
    id: "karva_chauth",
    name: "Karwa Chauth",
    nameHindi: "करवा चौथ",
    description: "One-day fast from sunrise to moonrise. Pre-dawn meal (Sargi) is crucial for sustained energy throughout the day.",
    type: "fasting",
    totalCalories: 800,
    meals: [
      {
        mealType: "Sargi (Pre-dawn)",
        time: "4:00 AM",
        items: [
          { name: "Dry Fruits & Nuts Mix", calories: 200, portion: "generous handful" },
          { name: "Paratha with Ghee", calories: 230, portion: "1 piece" },
          { name: "Milk with Dry Fruits", calories: 180, portion: "1 glass" },
          { name: "Fresh Fruits", calories: 80, portion: "1 bowl" },
          { name: "Coconut Water", calories: 40, portion: "1 glass" },
        ],
      },
      {
        mealType: "After Moonrise",
        time: "After moonrise",
        items: [
          { name: "Water / Sweet drink first", calories: 30, portion: "1 glass" },
          { name: "Light meal (khichdi or dal rice)", calories: 250, portion: "1 plate" },
        ],
      },
    ],
    tips: [
      "Eat a nutritious Sargi meal before dawn",
      "Include slow-digesting foods: nuts, whole grains, ghee",
      "Avoid salty and spicy foods in Sargi — they increase thirst",
      "Break fast gently — don't eat heavy food immediately",
      "Avoid direct sunlight to conserve energy during the fast",
    ],
  },
  {
    id: "janmashtami",
    name: "Janmashtami Fast",
    nameHindi: "जन्माष्टमी व्रत",
    description: "Fast until midnight (when Lord Krishna was born). Dairy products, fruits, and nuts are allowed throughout the day.",
    type: "festival",
    totalCalories: 1100,
    meals: [
      {
        mealType: "Morning",
        time: "8:00 AM",
        items: [
          { name: "Fresh Fruits", calories: 100, portion: "1 bowl" },
          { name: "Curd", calories: 65, portion: "1 katori" },
        ],
      },
      {
        mealType: "Mid-Day",
        time: "12:00 PM",
        items: [
          { name: "Makhana", calories: 75, portion: "1 cup" },
          { name: "Banana Milkshake", calories: 180, portion: "1 glass" },
        ],
      },
      {
        mealType: "Afternoon",
        time: "4:00 PM",
        items: [
          { name: "Dry Fruit Mix", calories: 150, portion: "1 cup" },
          { name: "Coconut Water", calories: 40, portion: "1 glass" },
        ],
      },
      {
        mealType: "After Midnight",
        time: "12:30 AM",
        items: [
          { name: "Panchamrit (sacred drink)", calories: 80, portion: "1 glass" },
          { name: "Kheer", calories: 210, portion: "1 bowl" },
          { name: "Light Prasad Meal", calories: 200, portion: "1 plate" },
        ],
      },
    ],
    tips: [
      "Dairy is especially important on this day — milk, curd, butter, ghee",
      "Makhan (white butter) is a traditional offering and good energy source",
      "Stay hydrated with water and coconut water",
      "Break the fast gently after midnight puja",
    ],
  },
  {
    id: "diwali_detox",
    name: "Post-Diwali Detox",
    nameHindi: "दिवाली के बाद डिटॉक्स",
    description: "A 3-day light eating plan to recover from festival indulgences. Focus on fiber, hydration, and gentle foods.",
    type: "festival",
    totalCalories: 1300,
    meals: [
      {
        mealType: "Morning Detox",
        time: "7:00 AM",
        items: [
          { name: "Warm Lemon Water with Honey", calories: 30, portion: "1 glass" },
          { name: "Soaked Almonds (5)", calories: 35, portion: "5 pieces" },
        ],
      },
      {
        mealType: "Breakfast",
        time: "9:00 AM",
        items: [
          { name: "Oats Porridge with Fruits", calories: 220, portion: "1 bowl" },
          { name: "Green Tea", calories: 3, portion: "1 cup" },
        ],
      },
      {
        mealType: "Lunch",
        time: "1:00 PM",
        items: [
          { name: "Moong Dal Khichdi", calories: 190, portion: "1 katori" },
          { name: "Mixed Salad", calories: 25, portion: "1 plate" },
          { name: "Buttermilk", calories: 38, portion: "1 glass" },
        ],
      },
      {
        mealType: "Evening",
        time: "5:00 PM",
        items: [
          { name: "Papaya", calories: 60, portion: "1 cup" },
          { name: "Jeera Water", calories: 6, portion: "1 glass" },
        ],
      },
      {
        mealType: "Dinner",
        time: "7:30 PM",
        items: [
          { name: "Vegetable Soup", calories: 60, portion: "1 bowl" },
          { name: "Phulka (2)", calories: 120, portion: "2 pieces" },
          { name: "Lauki Sabzi", calories: 70, portion: "1 katori" },
        ],
      },
      {
        mealType: "Before Bed",
        time: "9:00 PM",
        items: [
          { name: "Turmeric Milk", calories: 100, portion: "1 glass" },
        ],
      },
    ],
    tips: [
      "Drink at least 10 glasses of water daily",
      "Avoid sweets, fried food, and heavy meals for 3 days",
      "Include fiber-rich foods: oats, salads, fruits, khichdi",
      "Ajwain water and jeera water aid digestion",
      "Light walking for 20-30 min helps recovery",
    ],
  },
  {
    id: "shravan_monday",
    name: "Shravan Somvar Fast",
    nameHindi: "श्रावण सोमवार व्रत",
    description: "Monday fasts during Shravan month. One meal a day with fruits, dairy, and light foods.",
    type: "fasting",
    totalCalories: 900,
    meals: [
      {
        mealType: "Morning",
        time: "8:00 AM",
        items: [
          { name: "Warm Water", calories: 0, portion: "1 glass" },
          { name: "Fresh Fruits", calories: 100, portion: "1 bowl" },
        ],
      },
      {
        mealType: "Main Meal (before sunset)",
        time: "4:00 PM",
        items: [
          { name: "Sabudana Khichdi", calories: 280, portion: "1 plate" },
          { name: "Potato Curry (vrat style)", calories: 150, portion: "1 katori" },
          { name: "Curd", calories: 65, portion: "1 katori" },
          { name: "Makhana", calories: 75, portion: "1 cup" },
        ],
      },
      {
        mealType: "Evening",
        time: "7:00 PM",
        items: [
          { name: "Warm Milk", calories: 95, portion: "1 glass" },
          { name: "Banana", calories: 97, portion: "1 medium" },
        ],
      },
    ],
    tips: [
      "Many people eat only one full meal during the fast",
      "Thandai is a traditional Shravan drink",
      "Include dairy — milk, curd, paneer are encouraged",
      "Avoid non-vegetarian food, alcohol, and heavy spices during Shravan",
    ],
  },
];

export function getFestivalPlan(id: string): FestivalPlan | undefined {
  return FESTIVAL_PLANS.find((p) => p.id === id);
}
