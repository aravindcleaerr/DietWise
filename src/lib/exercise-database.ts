// ============================================================================
// DietWise - Exercise Database
// Exercise library with calorie burn data for ~91 kg male, 50+ years
// ============================================================================

export interface ExerciseItem {
  id: string;
  name: string;
  category: "cardio" | "strength" | "flexibility" | "balance";
  caloriesPer30Min: number;
  intensity: "low" | "medium" | "high";
  description: string;
  defaultDuration: number; // minutes
  defaultSets?: number;
  defaultReps?: number;
}

export const EXERCISE_DATABASE: ExerciseItem[] = [
  // ── Cardio ──────────────────────────────────────────────────────────────
  {
    id: "walk_light",
    name: "Walking (Slow)",
    category: "cardio",
    caloriesPer30Min: 150,
    intensity: "low",
    description: "Light walk at ~2.0 mph pace",
    defaultDuration: 30,
  },
  {
    id: "walk_moderate",
    name: "Walking (Moderate)",
    category: "cardio",
    caloriesPer30Min: 200,
    intensity: "medium",
    description: "Moderate walk at ~3.0 mph pace",
    defaultDuration: 30,
  },
  {
    id: "walk_brisk",
    name: "Walking (Brisk)",
    category: "cardio",
    caloriesPer30Min: 230,
    intensity: "medium",
    description: "Brisk walk at ~3.5 mph pace",
    defaultDuration: 35,
  },
  {
    id: "walk_fast",
    name: "Walking (Fast)",
    category: "cardio",
    caloriesPer30Min: 280,
    intensity: "high",
    description: "Fast walk at ~4.0 mph pace",
    defaultDuration: 30,
  },
  {
    id: "walk_interval",
    name: "Interval Walking",
    category: "cardio",
    caloriesPer30Min: 250,
    intensity: "medium",
    description: "Alternate 3 min brisk (4 mph) + 2 min moderate (3 mph)",
    defaultDuration: 35,
  },
  {
    id: "cycling_light",
    name: "Cycling (Light)",
    category: "cardio",
    caloriesPer30Min: 200,
    intensity: "low",
    description: "Easy cycling at <10 mph",
    defaultDuration: 30,
  },
  {
    id: "cycling_moderate",
    name: "Cycling (Moderate)",
    category: "cardio",
    caloriesPer30Min: 280,
    intensity: "medium",
    description: "Moderate cycling at 10-12 mph",
    defaultDuration: 30,
  },
  {
    id: "cycling_vigorous",
    name: "Cycling (Vigorous)",
    category: "cardio",
    caloriesPer30Min: 350,
    intensity: "high",
    description: "Vigorous cycling at 12-14 mph",
    defaultDuration: 30,
  },

  // ── Strength ────────────────────────────────────────────────────────────
  {
    id: "chair_squats",
    name: "Chair Squats",
    category: "strength",
    caloriesPer30Min: 150,
    intensity: "medium",
    description: "Stand in front of chair, squat down, lightly touch seat, stand back up",
    defaultDuration: 10,
    defaultSets: 3,
    defaultReps: 10,
  },
  {
    id: "wall_pushups",
    name: "Wall Push-ups",
    category: "strength",
    caloriesPer30Min: 130,
    intensity: "low",
    description: "Push-ups against wall, arms shoulder-width apart",
    defaultDuration: 10,
    defaultSets: 3,
    defaultReps: 10,
  },
  {
    id: "incline_pushups",
    name: "Incline Push-ups (Counter)",
    category: "strength",
    caloriesPer30Min: 140,
    intensity: "medium",
    description: "Push-ups on counter or sturdy chair for more challenge",
    defaultDuration: 10,
    defaultSets: 3,
    defaultReps: 8,
  },
  {
    id: "glute_bridges",
    name: "Glute Bridges",
    category: "strength",
    caloriesPer30Min: 120,
    intensity: "low",
    description: "Lie on back, lift hips, hold 2-3 sec at top",
    defaultDuration: 10,
    defaultSets: 3,
    defaultReps: 12,
  },
  {
    id: "calf_raises",
    name: "Standing Calf Raises",
    category: "strength",
    caloriesPer30Min: 100,
    intensity: "low",
    description: "Rise up on toes, hold briefly, lower slowly",
    defaultDuration: 5,
    defaultSets: 3,
    defaultReps: 15,
  },
  {
    id: "step_ups",
    name: "Step-Ups",
    category: "strength",
    caloriesPer30Min: 180,
    intensity: "medium",
    description: "Step up onto sturdy step or low platform, alternate legs",
    defaultDuration: 10,
    defaultSets: 3,
    defaultReps: 10,
  },
  {
    id: "wall_sit",
    name: "Wall Sit",
    category: "strength",
    caloriesPer30Min: 130,
    intensity: "medium",
    description: "Sit against wall with knees at 90 degrees, hold",
    defaultDuration: 5,
    defaultSets: 3,
    defaultReps: 1,
  },
  {
    id: "leg_raises",
    name: "Standing Leg Raises",
    category: "strength",
    caloriesPer30Min: 100,
    intensity: "low",
    description: "Hold wall for balance, raise leg forward to 45 degrees",
    defaultDuration: 10,
    defaultSets: 2,
    defaultReps: 10,
  },
  {
    id: "knee_pushups",
    name: "Knee Push-ups",
    category: "strength",
    caloriesPer30Min: 150,
    intensity: "medium",
    description: "Push-ups from knees position for moderate challenge",
    defaultDuration: 10,
    defaultSets: 3,
    defaultReps: 8,
  },
  {
    id: "reverse_lunges",
    name: "Reverse Lunges",
    category: "strength",
    caloriesPer30Min: 160,
    intensity: "medium",
    description: "Step backward into lunge, alternate legs",
    defaultDuration: 10,
    defaultSets: 3,
    defaultReps: 8,
  },

  // ── Flexibility ─────────────────────────────────────────────────────────
  {
    id: "stretching",
    name: "Full Body Stretching",
    category: "flexibility",
    caloriesPer30Min: 60,
    intensity: "low",
    description: "Hold each stretch 20-30 sec: quads, hamstrings, calves, chest, shoulders",
    defaultDuration: 15,
  },
  {
    id: "yoga_gentle",
    name: "Gentle Yoga",
    category: "flexibility",
    caloriesPer30Min: 80,
    intensity: "low",
    description: "Cat-cow, forward folds, gentle twists for flexibility",
    defaultDuration: 20,
  },

  // ── Balance ─────────────────────────────────────────────────────────────
  {
    id: "plank_modified",
    name: "Plank (Modified / Knees)",
    category: "balance",
    caloriesPer30Min: 65,
    intensity: "low",
    description: "Forearms and knees, body straight, engage core",
    defaultDuration: 5,
    defaultSets: 3,
    defaultReps: 1,
  },
  {
    id: "plank_full",
    name: "Plank (Full)",
    category: "balance",
    caloriesPer30Min: 80,
    intensity: "medium",
    description: "Forearms and toes, body in straight line, hold",
    defaultDuration: 5,
    defaultSets: 3,
    defaultReps: 1,
  },
  {
    id: "side_plank",
    name: "Side Plank",
    category: "balance",
    caloriesPer30Min: 75,
    intensity: "medium",
    description: "Side forearm plank, hold each side",
    defaultDuration: 5,
    defaultSets: 2,
    defaultReps: 1,
  },
  {
    id: "hip_abduction",
    name: "Standing Hip Abduction",
    category: "balance",
    caloriesPer30Min: 80,
    intensity: "low",
    description: "Hold wall, lift leg sideways, balance work",
    defaultDuration: 10,
    defaultSets: 2,
    defaultReps: 12,
  },
];

export function getExercisesByCategory(category: ExerciseItem["category"]) {
  return EXERCISE_DATABASE.filter((e) => e.category === category);
}

export function getExerciseById(id: string) {
  return EXERCISE_DATABASE.find((e) => e.id === id);
}

/** Estimate calories burned for a given duration. */
export function estimateCalories(caloriesPer30Min: number, durationMin: number): number {
  return Math.round((caloriesPer30Min / 30) * durationMin);
}
