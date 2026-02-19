"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, UtensilsCrossed } from "lucide-react";
import type { MealEntry, MealType } from "@/lib/types";
import { MEAL_TYPE_CONFIG } from "@/lib/types";

interface MealSummaryCardProps {
  meals: MealEntry[];
  onAddMeal: (mealType: MealType) => void;
}

const ALL_MEAL_TYPES: MealType[] = [
  "pre_breakfast",
  "breakfast",
  "mid_morning",
  "lunch",
  "evening_snack",
  "dinner",
  "post_dinner",
];

export function MealSummaryCard({ meals, onAddMeal }: MealSummaryCardProps) {
  // Build a map of mealType -> MealEntry for quick lookup
  const mealMap = useMemo(() => {
    const map = new Map<MealType, MealEntry>();
    for (const meal of meals) {
      map.set(meal.mealType, meal);
    }
    return map;
  }, [meals]);

  const totalCalories = useMemo(() => {
    return meals.reduce((sum, m) => sum + m.totalNutrition.calories, 0);
  }, [meals]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <UtensilsCrossed className="size-5 text-primary" />
            Today&apos;s Meals
          </span>
          <span className="text-base font-medium text-muted-foreground tabular-nums">
            {Math.round(totalCalories)} kcal
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ALL_MEAL_TYPES.map((mealType) => {
          const config = MEAL_TYPE_CONFIG[mealType];
          const entry = mealMap.get(mealType);
          const isLogged = entry && entry.foods.length > 0;

          return (
            <div
              key={mealType}
              className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-b-0"
            >
              {/* Meal icon */}
              <span className="text-xl shrink-0 w-8 text-center" role="img" aria-label={config.label}>
                {config.icon}
              </span>

              {/* Meal name and status */}
              <div className="flex-1 min-w-0">
                <span className="text-base font-medium">{config.label}</span>
                {isLogged ? (
                  <p className="text-sm text-muted-foreground truncate">
                    {entry.foods.map((f) => f.foodName).join(", ")}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground/60 italic">
                    Not logged
                  </p>
                )}
              </div>

              {/* Calories or add button */}
              {isLogged ? (
                <span className="text-base font-semibold tabular-nums text-foreground shrink-0">
                  {Math.round(entry.totalNutrition.calories)} kcal
                </span>
              ) : (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 text-primary hover:bg-primary/10"
                  onClick={() => onAddMeal(mealType)}
                  aria-label={`Add ${config.label}`}
                >
                  <Plus className="size-5" />
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
