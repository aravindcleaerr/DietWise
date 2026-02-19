// ============================================================================
// DietWise - Data Export Utilities
// Export food logs, weight history, and exercise data as CSV
// ============================================================================

import type { DailyLog, WeightEntry, ExerciseEntry } from "./types";

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Export daily food logs as CSV. */
export function exportFoodLogs(dailyLogs: Record<string, DailyLog>) {
  const rows: string[] = [
    "Date,Meal Type,Food Name,Servings,Calories,Protein (g),Carbs (g),Fat (g),Fiber (g)",
  ];

  const sortedDates = Object.keys(dailyLogs).sort();

  for (const date of sortedDates) {
    const log = dailyLogs[date];
    for (const meal of log.meals) {
      for (const food of meal.foods) {
        rows.push(
          [
            date,
            meal.mealType,
            `"${food.foodName.replace(/"/g, '""')}"`,
            food.servings,
            food.nutrition.calories,
            food.nutrition.protein,
            food.nutrition.carbs,
            food.nutrition.fat,
            food.nutrition.fiber,
          ].join(",")
        );
      }
    }
  }

  downloadCSV(rows.join("\n"), `dietwise-food-logs-${new Date().toISOString().slice(0, 10)}.csv`);
}

/** Export daily nutrition summaries as CSV. */
export function exportDailySummaries(dailyLogs: Record<string, DailyLog>) {
  const rows: string[] = [
    "Date,Total Calories,Protein (g),Carbs (g),Fat (g),Fiber (g),Water (ml),Meals Logged",
  ];

  const sortedDates = Object.keys(dailyLogs).sort();

  for (const date of sortedDates) {
    const log = dailyLogs[date];
    rows.push(
      [
        date,
        log.totalNutrition.calories,
        log.totalNutrition.protein,
        log.totalNutrition.carbs,
        log.totalNutrition.fat,
        log.totalNutrition.fiber,
        log.waterMl,
        log.meals.length,
      ].join(",")
    );
  }

  downloadCSV(rows.join("\n"), `dietwise-daily-summary-${new Date().toISOString().slice(0, 10)}.csv`);
}

/** Export weight history as CSV. */
export function exportWeightHistory(weightHistory: WeightEntry[]) {
  const rows: string[] = ["Date,Weight (kg)"];

  for (const entry of weightHistory) {
    rows.push(`${entry.date},${entry.weightKg}`);
  }

  downloadCSV(rows.join("\n"), `dietwise-weight-${new Date().toISOString().slice(0, 10)}.csv`);
}

/** Export exercise logs as CSV. */
export function exportExerciseLogs(exerciseLogs: Record<string, ExerciseEntry[]>) {
  const rows: string[] = [
    "Date,Exercise,Type,Duration (min),Calories Burned,Intensity,Sets,Reps",
  ];

  const sortedDates = Object.keys(exerciseLogs).sort();

  for (const date of sortedDates) {
    for (const entry of exerciseLogs[date]) {
      rows.push(
        [
          date,
          `"${entry.name.replace(/"/g, '""')}"`,
          entry.exerciseType,
          entry.durationMinutes,
          entry.caloriesBurned,
          entry.intensity,
          entry.sets ?? "",
          entry.reps ?? "",
        ].join(",")
      );
    }
  }

  downloadCSV(rows.join("\n"), `dietwise-exercise-${new Date().toISOString().slice(0, 10)}.csv`);
}
