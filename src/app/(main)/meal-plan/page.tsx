"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  WEEKLY_MEAL_PLAN,
  getDayNumberFromDate,
  type DayPlan,
  type MealPlanSlot,
} from "@/lib/meal-plans";
import { MEAL_TYPE_CONFIG } from "@/lib/types";
import type { MealType, LoggedFood } from "@/lib/types";
import { generateId } from "@/lib/calculations";
import { toast } from "sonner";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Check,
  CopyPlus,
  Flame,
  Utensils,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function MealPlanPage() {
  const todayDayNumber = getDayNumberFromDate(new Date());
  const [selectedDay, setSelectedDay] = useState(todayDayNumber);

  const addFoodToMeal = useStore((s) => s.addFoodToMeal);
  const dailyLogs = useStore((s) => s.dailyLogs);
  const updateStreak = useStore((s) => s.updateStreak);

  const dayPlan = useMemo(
    () => WEEKLY_MEAL_PLAN.find((d) => d.day === selectedDay)!,
    [selectedDay]
  );

  // Get today's date string for logging
  const todayDate = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  // Check what's already logged today
  const todayLog = dailyLogs[todayDate];
  const loggedMealTypes = useMemo(() => {
    if (!todayLog) return new Set<MealType>();
    return new Set(todayLog.meals.map((m) => m.mealType));
  }, [todayLog]);

  const handleLogMeal = (slot: MealPlanSlot) => {
    slot.foods.forEach((food) => {
      const loggedFood: LoggedFood = {
        id: generateId(),
        foodId: food.foodId || food.name.toLowerCase().replace(/\s+/g, "_"),
        foodName: food.name,
        servings: 1,
        servingUnit: "serving",
        nutrition: {
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat,
          fiber: 0,
        },
      };
      addFoodToMeal(todayDate, slot.mealType, loggedFood);
    });
    updateStreak(todayDate);
    toast.success(
      `${MEAL_TYPE_CONFIG[slot.mealType].label} logged!`
    );
  };

  const handleLogAllMeals = () => {
    let count = 0;
    dayPlan.meals.forEach((slot) => {
      if (!loggedMealTypes.has(slot.mealType)) {
        handleLogMeal(slot);
        count++;
      }
    });
    if (count === 0) {
      toast.info("All meals already logged for today!");
    } else {
      toast.success(`${count} meals logged for today!`);
    }
  };

  return (
    <div>
      <PageHeader title="Meal Plan" subtitle="7-day Indian vegetarian plan" />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Day Selector */}
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDay((d) => (d === 1 ? 7 : d - 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <div className="text-lg font-bold">{dayPlan.dayName}</div>
                <div className="text-sm text-muted-foreground">
                  Day {dayPlan.day} of 7
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDay((d) => (d === 7 ? 1 : d + 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Day pills */}
            <div className="flex gap-1.5 justify-center">
              {WEEKLY_MEAL_PLAN.map((plan) => (
                <button
                  key={plan.day}
                  onClick={() => setSelectedDay(plan.day)}
                  className={cn(
                    "h-9 w-9 rounded-full text-sm font-medium transition-colors",
                    plan.day === selectedDay
                      ? "bg-primary text-primary-foreground"
                      : plan.day === todayDayNumber
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {plan.dayName.slice(0, 2)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Flame className="h-4 w-4" />
                  Daily Total
                </div>
                <div className="text-2xl font-bold">
                  {dayPlan.totalCalories}{" "}
                  <span className="text-base font-normal text-muted-foreground">
                    kcal
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div>
                  P:{" "}
                  {dayPlan.meals
                    .flatMap((m) => m.foods)
                    .reduce((s, f) => s + f.protein, 0)}
                  g
                </div>
                <div>
                  C:{" "}
                  {dayPlan.meals
                    .flatMap((m) => m.foods)
                    .reduce((s, f) => s + f.carbs, 0)}
                  g
                </div>
                <div>
                  F:{" "}
                  {dayPlan.meals
                    .flatMap((m) => m.foods)
                    .reduce((s, f) => s + f.fat, 0)}
                  g
                </div>
              </div>
            </div>

            {/* Log All button for today */}
            {selectedDay === todayDayNumber && (
              <Button
                className="w-full mt-3"
                onClick={handleLogAllMeals}
              >
                <CopyPlus className="h-4 w-4 mr-2" />
                Log All Meals for Today
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Meal Timeline */}
        {dayPlan.meals.map((slot) => {
          const config = MEAL_TYPE_CONFIG[slot.mealType];
          const isLogged = loggedMealTypes.has(slot.mealType);

          return (
            <Card key={slot.mealType} className={cn(isLogged && "border-primary/30 bg-primary/5")}>
              <CardContent className="pt-4 pb-3">
                {/* Meal header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">
                        {config.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {slot.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono">
                      {slot.totalCalories} kcal
                    </Badge>
                    {isLogged ? (
                      <div className="flex items-center gap-1 text-xs text-primary font-medium">
                        <Check className="h-4 w-4" />
                        Logged
                      </div>
                    ) : selectedDay === todayDayNumber ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLogMeal(slot)}
                        className="h-7 text-xs"
                      >
                        <CopyPlus className="h-3 w-3 mr-1" />
                        Log
                      </Button>
                    ) : null}
                  </div>
                </div>

                {/* Food items */}
                <div className="space-y-1.5 ml-8">
                  {slot.foods.map((food, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {food.name}
                      </span>
                      <span className="text-xs tabular-nums text-muted-foreground/70">
                        {food.calories} cal
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Tips card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Portion Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm text-muted-foreground">
            <p>
              <strong>The Plate Method:</strong> 50% veggies & salad, 25% protein (dal/paneer), 25% carbs (roti/rice).
            </p>
            <p>
              <strong>Hand portions:</strong> Protein = 1 palm, Carbs = 1 cupped hand, Veggies = 2 fists, Fat = 1 thumb.
            </p>
            <p>
              Eat slowly (20 min per meal). Start with salad first. Drink water 30 min before meals.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
