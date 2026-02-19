"use client";

import { format, subDays, addDays } from "date-fns";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { CalorieRing } from "@/components/dashboard/CalorieRing";
import { MacroBar } from "@/components/dashboard/MacroBar";
import { WaterTracker } from "@/components/dashboard/WaterTracker";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { MealSummaryCard } from "@/components/dashboard/MealSummaryCard";
import { WeightSparkline } from "@/components/dashboard/WeightSparkline";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Dumbbell } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const profile = useStore((s) => s.profile);
  const dailyTargets = useStore((s) => s.dailyTargets);
  const selectedDate = useStore((s) => s.selectedDate);
  const setSelectedDate = useStore((s) => s.setSelectedDate);
  const getDailyLog = useStore((s) => s.getDailyLog);
  const addWater = useStore((s) => s.addWater);
  const currentStreak = useStore((s) => s.currentStreak);
  const longestStreak = useStore((s) => s.longestStreak);
  const weightHistory = useStore((s) => s.weightHistory);

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

  return (
    <div>
      <PageHeader
        title={`Hi, ${profile?.name || "there"}!`}
        subtitle="Here's your day at a glance"
        showDateNav
        selectedDate={selectedDate}
        onPrevDate={handlePrevDate}
        onNextDate={handleNextDate}
      />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Calorie Ring */}
        <CalorieRing
          consumed={log.totalNutrition.calories}
          target={dailyTargets.calories}
        />

        {/* Macros */}
        <div className="space-y-2">
          <MacroBar
            label="Protein"
            current={log.totalNutrition.protein}
            target={dailyTargets.protein}
            color="#5C6BC0"
          />
          <MacroBar
            label="Carbs"
            current={log.totalNutrition.carbs}
            target={dailyTargets.carbs}
            color="#FFA726"
          />
          <MacroBar
            label="Fat"
            current={log.totalNutrition.fat}
            target={dailyTargets.fat}
            color="#EF5350"
          />
        </div>

        {/* Water & Streak Row */}
        <div className="grid grid-cols-2 gap-3">
          <WaterTracker
            current={log.waterMl}
            target={dailyTargets.waterMl}
            onAdd={() => addWater(selectedDate, 250)}
          />
          <StreakCard
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/meal-plan" className="block">
            <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent h-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">Meal Plan</div>
                <div className="text-xs text-muted-foreground">7-day diet</div>
              </div>
            </div>
          </Link>
          <Link href="/exercise" className="block">
            <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent h-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                <Dumbbell className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-sm">Exercise</div>
                <div className="text-xs text-muted-foreground">Log workout</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Today's Meals */}
        <MealSummaryCard
          meals={log.meals}
          onAddMeal={(mealType) => router.push(`/add?meal=${mealType}&date=${selectedDate}`)}
        />

        {/* Weight Sparkline */}
        {weightHistory.length > 0 && (
          <WeightSparkline
            data={weightHistory.slice(-14).map((w) => ({
              date: w.date,
              weight: w.weightKg,
            }))}
            targetWeight={profile?.targetWeightKg || 82}
          />
        )}
      </main>
    </div>
  );
}
