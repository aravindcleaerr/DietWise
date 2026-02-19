"use client";

import { useState } from "react";
import { format, subDays, addDays } from "date-fns";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { MEAL_TYPE_CONFIG } from "@/lib/types";
import type { MealType } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FoodLogPage() {
  const router = useRouter();
  const selectedDate = useStore((s) => s.selectedDate);
  const setSelectedDate = useStore((s) => s.setSelectedDate);
  const getDailyLog = useStore((s) => s.getDailyLog);
  const dailyTargets = useStore((s) => s.dailyTargets);
  const removeFoodFromMeal = useStore((s) => s.removeFoodFromMeal);
  const updateFoodServings = useStore((s) => s.updateFoodServings);

  const [editingFood, setEditingFood] = useState<{mealType: MealType; foodId: string; servings: number} | null>(null);

  const log = getDailyLog(selectedDate);
  const today = format(new Date(), "yyyy-MM-dd");

  const handlePrevDate = () => {
    const prev = format(subDays(new Date(selectedDate + "T00:00:00"), 1), "yyyy-MM-dd");
    setSelectedDate(prev);
  };

  const handleNextDate = () => {
    const next = format(addDays(new Date(selectedDate + "T00:00:00"), 1), "yyyy-MM-dd");
    if (next <= today) setSelectedDate(next);
  };

  const remaining = dailyTargets.calories - log.totalNutrition.calories;

  return (
    <div>
      <PageHeader
        title="Food Log"
        subtitle={`${Math.round(log.totalNutrition.calories)} of ${dailyTargets.calories} cal${remaining > 0 ? ` • ${Math.round(remaining)} remaining` : ""}`}
        showDateNav
        selectedDate={selectedDate}
        onPrevDate={handlePrevDate}
        onNextDate={handleNextDate}
      />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-3">
        {/* Daily Nutrition Summary */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Calories", value: Math.round(log.totalNutrition.calories), target: dailyTargets.calories, unit: "" },
            { label: "Protein", value: Math.round(log.totalNutrition.protein), target: dailyTargets.protein, unit: "g" },
            { label: "Carbs", value: Math.round(log.totalNutrition.carbs), target: dailyTargets.carbs, unit: "g" },
            { label: "Fat", value: Math.round(log.totalNutrition.fat), target: dailyTargets.fat, unit: "g" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-card border p-2 text-center">
              <div className="text-sm font-bold">
                {item.value}{item.unit}
              </div>
              <div className="text-xs text-muted-foreground">
                / {item.target}{item.unit}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Meals */}
        {(Object.entries(MEAL_TYPE_CONFIG) as [MealType, typeof MEAL_TYPE_CONFIG[MealType]][]).map(
          ([mealType, config]) => {
            const meal = log.meals.find((m) => m.mealType === mealType);
            const totalCal = meal?.totalNutrition.calories || 0;

            return (
              <Card key={mealType}>
                <CardHeader className="pb-2 pt-4 px-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                      {totalCal > 0 && (
                        <span className="text-sm font-normal text-muted-foreground">
                          {Math.round(totalCal)} cal
                        </span>
                      )}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-primary"
                      onClick={() =>
                        router.push(`/add?meal=${mealType}&date=${selectedDate}`)
                      }
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  {meal && meal.foods.length > 0 ? (
                    <div className="space-y-2">
                      {meal.foods.map((food) => (
                        <div key={food.id}>
                          <div
                            className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {food.foodName}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {food.servings} {food.servingUnit} &bull; P:{food.nutrition.protein}g C:{food.nutrition.carbs}g F:{food.nutrition.fat}g
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <span className="text-sm font-semibold">
                                {Math.round(food.nutrition.calories)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-primary"
                                onClick={() =>
                                  setEditingFood({
                                    mealType,
                                    foodId: food.id,
                                    servings: food.servings,
                                  })
                                }
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  removeFoodFromMeal(selectedDate, mealType, food.id)
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          {editingFood &&
                            editingFood.mealType === mealType &&
                            editingFood.foodId === food.id && (
                              <div className="flex items-center gap-2 py-2 px-2 bg-muted/50 rounded-md mt-1">
                                <span className="text-xs text-muted-foreground mr-1">Servings:</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    setEditingFood((prev) =>
                                      prev
                                        ? { ...prev, servings: Math.max(0.5, prev.servings - 0.5) }
                                        : null
                                    )
                                  }
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="text-sm font-semibold min-w-[2rem] text-center">
                                  {editingFood.servings}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    setEditingFood((prev) =>
                                      prev
                                        ? { ...prev, servings: prev.servings + 0.5 }
                                        : null
                                    )
                                  }
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="h-7 ml-auto"
                                  onClick={() => {
                                    updateFoodServings(
                                      selectedDate,
                                      editingFood.mealType,
                                      editingFood.foodId,
                                      editingFood.servings
                                    );
                                    setEditingFood(null);
                                  }}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7"
                                  onClick={() => setEditingFood(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-1">
                      Nothing logged yet
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          }
        )}
      </main>
    </div>
  );
}
