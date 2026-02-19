import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  UserProfile,
  DailyLog,
  DailyTargets,
  MealEntry,
  LoggedFood,
  ExerciseEntry,
  WeightEntry,
  Achievement,
  MealType,
  NutritionInfo,
} from '@/lib/types';

import { calculateDailyTargets, generateId } from '@/lib/calculations';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEFAULT_DAILY_TARGETS: DailyTargets = {
  calories: 1700,
  protein: 100,
  carbs: 180,
  fat: 50,
  fiber: 35,
  waterMl: 3000,
};

/** Sum nutrition values from an array of LoggedFood items. */
function sumNutrition(foods: LoggedFood[]): NutritionInfo {
  return foods.reduce<NutritionInfo>(
    (totals, food) => ({
      calories: totals.calories + food.nutrition.calories,
      protein: totals.protein + food.nutrition.protein,
      carbs: totals.carbs + food.nutrition.carbs,
      fat: totals.fat + food.nutrition.fat,
      fiber: totals.fiber + food.nutrition.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );
}

/** Create a blank DailyLog for a given date. */
function createEmptyDailyLog(date: string): DailyLog {
  return {
    id: generateId(),
    date,
    meals: [],
    totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    waterMl: 0,
  };
}

/**
 * Recalculate the totalNutrition on every MealEntry and then the overall
 * DailyLog totalNutrition. Returns a new DailyLog (immutable).
 */
function recalculateDailyLog(log: DailyLog): DailyLog {
  const updatedMeals = log.meals.map((meal) => ({
    ...meal,
    totalNutrition: sumNutrition(meal.foods),
  }));

  const allFoods = updatedMeals.flatMap((m) => m.foods);

  return {
    ...log,
    meals: updatedMeals,
    totalNutrition: sumNutrition(allFoods),
  };
}

/** Get today's date as YYYY-MM-DD. */
function todayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check whether two YYYY-MM-DD date strings are consecutive calendar days
 * (i.e. dateB is exactly 1 day after dateA).
 */
function isConsecutiveDay(dateA: string, dateB: string): boolean {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  const diffMs = b.getTime() - a.getTime();
  return diffMs === 24 * 60 * 60 * 1000;
}

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface DietWiseStore {
  // User Profile
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;

  // Daily Targets (derived from profile)
  dailyTargets: DailyTargets;

  // Today's date tracking
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;

  // Daily Logs – keyed by date string
  dailyLogs: Record<string, DailyLog>;
  getDailyLog: (date: string) => DailyLog;

  // Food logging
  addFoodToMeal: (date: string, mealType: MealType, food: LoggedFood) => void;
  removeFoodFromMeal: (date: string, mealType: MealType, foodId: string) => void;

  // Water tracking
  addWater: (date: string, amountMl: number) => void;
  setWater: (date: string, amountMl: number) => void;

  // Weight tracking
  weightHistory: WeightEntry[];
  addWeight: (date: string, weightKg: number) => void;

  // Exercise tracking
  exerciseLogs: Record<string, ExerciseEntry[]>;
  addExercise: (entry: Omit<ExerciseEntry, 'id'>) => void;
  removeExercise: (date: string, exerciseId: string) => void;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string | null;
  updateStreak: (date: string) => void;

  // Favorites
  favoriteFoodIds: string[];
  toggleFavorite: (foodId: string) => void;

  // Recent foods (last 20)
  recentFoodIds: string[];
  addToRecent: (foodId: string) => void;
}

// ---------------------------------------------------------------------------
// Store creation
// ---------------------------------------------------------------------------

export const useStore = create<DietWiseStore>()(
  persist(
    (set, get) => ({
      // ----- User Profile --------------------------------------------------
      profile: null,

      setProfile: (profile: UserProfile) => {
        const dailyTargets = calculateDailyTargets(profile);
        set({ profile, dailyTargets });
      },

      // ----- Daily Targets -------------------------------------------------
      dailyTargets: { ...DEFAULT_DAILY_TARGETS },

      // ----- Selected Date -------------------------------------------------
      selectedDate: todayString(),

      setSelectedDate: (date: string) => {
        set({ selectedDate: date });
      },

      // ----- Daily Logs ----------------------------------------------------
      dailyLogs: {},

      getDailyLog: (date: string): DailyLog => {
        const existing = get().dailyLogs[date];
        if (existing) return existing;

        // Create an empty log, persist it, and return it.
        const newLog = createEmptyDailyLog(date);
        set((state) => ({
          dailyLogs: { ...state.dailyLogs, [date]: newLog },
        }));
        return newLog;
      },

      // ----- Food Logging --------------------------------------------------
      addFoodToMeal: (date: string, mealType: MealType, food: LoggedFood) => {
        set((state) => {
          // Get or create the DailyLog for the given date.
          const existingLog = state.dailyLogs[date] ?? createEmptyDailyLog(date);

          // Find the MealEntry for this mealType, or create one.
          let mealFound = false;
          const updatedMeals = existingLog.meals.map((meal) => {
            if (meal.mealType === mealType) {
              mealFound = true;
              return {
                ...meal,
                foods: [...meal.foods, food],
              };
            }
            return meal;
          });

          if (!mealFound) {
            const newMeal: MealEntry = {
              id: generateId(),
              mealType,
              time: new Date().toTimeString().slice(0, 5),
              foods: [food],
              totalNutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
            };
            updatedMeals.push(newMeal);
          }

          const updatedLog = recalculateDailyLog({ ...existingLog, meals: updatedMeals });

          return {
            dailyLogs: { ...state.dailyLogs, [date]: updatedLog },
          };
        });
      },

      removeFoodFromMeal: (date: string, mealType: MealType, foodId: string) => {
        set((state) => {
          const existingLog = state.dailyLogs[date];
          if (!existingLog) return state;

          const updatedMeals = existingLog.meals
            .map((meal) => {
              if (meal.mealType !== mealType) return meal;
              return {
                ...meal,
                foods: meal.foods.filter((f) => f.id !== foodId),
              };
            })
            // Remove meal entries that end up with zero foods.
            .filter((meal) => meal.foods.length > 0);

          const updatedLog = recalculateDailyLog({ ...existingLog, meals: updatedMeals });

          return {
            dailyLogs: { ...state.dailyLogs, [date]: updatedLog },
          };
        });
      },

      // ----- Water Tracking ------------------------------------------------
      addWater: (date: string, amountMl: number) => {
        set((state) => {
          const existingLog = state.dailyLogs[date] ?? createEmptyDailyLog(date);
          const updatedLog: DailyLog = {
            ...existingLog,
            waterMl: existingLog.waterMl + amountMl,
          };
          return {
            dailyLogs: { ...state.dailyLogs, [date]: updatedLog },
          };
        });
      },

      setWater: (date: string, amountMl: number) => {
        set((state) => {
          const existingLog = state.dailyLogs[date] ?? createEmptyDailyLog(date);
          const updatedLog: DailyLog = {
            ...existingLog,
            waterMl: amountMl,
          };
          return {
            dailyLogs: { ...state.dailyLogs, [date]: updatedLog },
          };
        });
      },

      // ----- Weight Tracking -----------------------------------------------
      weightHistory: [],

      addWeight: (date: string, weightKg: number) => {
        set((state) => {
          // Replace an existing entry for the same date, or add a new one.
          const existingIndex = state.weightHistory.findIndex((w) => w.date === date);
          let updatedHistory: WeightEntry[];

          if (existingIndex >= 0) {
            updatedHistory = state.weightHistory.map((entry, idx) =>
              idx === existingIndex ? { ...entry, weightKg } : entry,
            );
          } else {
            const newEntry: WeightEntry = { date, weightKg };
            updatedHistory = [...state.weightHistory, newEntry];
          }

          // Keep sorted by date ascending.
          updatedHistory.sort((a, b) => a.date.localeCompare(b.date));

          return { weightHistory: updatedHistory };
        });
      },

      // ----- Exercise Tracking ---------------------------------------------
      exerciseLogs: {},

      addExercise: (entry: Omit<ExerciseEntry, 'id'>) => {
        set((state) => {
          const id = generateId();
          const fullEntry: ExerciseEntry = { ...entry, id } as ExerciseEntry;
          const date = entry.date;
          const existing = state.exerciseLogs[date] ?? [];

          return {
            exerciseLogs: {
              ...state.exerciseLogs,
              [date]: [...existing, fullEntry],
            },
          };
        });
      },

      removeExercise: (date: string, exerciseId: string) => {
        set((state) => {
          const existing = state.exerciseLogs[date];
          if (!existing) return state;

          const filtered = existing.filter((e) => e.id !== exerciseId);

          return {
            exerciseLogs: {
              ...state.exerciseLogs,
              [date]: filtered,
            },
          };
        });
      },

      // ----- Streaks -------------------------------------------------------
      currentStreak: 0,
      longestStreak: 0,
      lastLoggedDate: null,

      updateStreak: (date: string) => {
        set((state) => {
          // If the same date was already logged, no change.
          if (state.lastLoggedDate === date) return state;

          let newStreak: number;

          if (state.lastLoggedDate && isConsecutiveDay(state.lastLoggedDate, date)) {
            // Consecutive day – extend the streak.
            newStreak = state.currentStreak + 1;
          } else if (state.lastLoggedDate === null) {
            // First ever log.
            newStreak = 1;
          } else {
            // Gap detected – reset streak.
            newStreak = 1;
          }

          const newLongest = Math.max(state.longestStreak, newStreak);

          return {
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastLoggedDate: date,
          };
        });
      },

      // ----- Favorites -----------------------------------------------------
      favoriteFoodIds: [],

      toggleFavorite: (foodId: string) => {
        set((state) => {
          const isFavorite = state.favoriteFoodIds.includes(foodId);
          return {
            favoriteFoodIds: isFavorite
              ? state.favoriteFoodIds.filter((id) => id !== foodId)
              : [...state.favoriteFoodIds, foodId],
          };
        });
      },

      // ----- Recent Foods --------------------------------------------------
      recentFoodIds: [],

      addToRecent: (foodId: string) => {
        set((state) => {
          // Remove the foodId if it already exists so we can push it to the front.
          const filtered = state.recentFoodIds.filter((id) => id !== foodId);
          // Newest first, cap at 20.
          const updated = [foodId, ...filtered].slice(0, 20);
          return { recentFoodIds: updated };
        });
      },
    }),
    {
      name: 'dietwise-storage',
      // Zustand v5 persist uses localStorage by default.
      // We intentionally omit `getDailyLog` (a function) — Zustand handles
      // this automatically by only persisting serialisable state.
      partialize: (state) => ({
        profile: state.profile,
        dailyTargets: state.dailyTargets,
        selectedDate: state.selectedDate,
        dailyLogs: state.dailyLogs,
        weightHistory: state.weightHistory,
        exerciseLogs: state.exerciseLogs,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastLoggedDate: state.lastLoggedDate,
        favoriteFoodIds: state.favoriteFoodIds,
        recentFoodIds: state.recentFoodIds,
      }),
    },
  ),
);
