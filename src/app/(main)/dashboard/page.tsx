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
import { CalendarDays, Dumbbell, AlertTriangle, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  calculateDailyMicronutrients,
  getMicronutrientAlerts,
  MICRONUTRIENT_CONFIG,
  DAILY_RECOMMENDED,
} from "@/lib/micronutrients";
import { shareProgress } from "@/lib/share";
import { Button } from "@/components/ui/button";
import { format as fnsFormat } from "date-fns";

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

  const activeFasting = useStore((s) => s.activeFasting);
  const log = getDailyLog(selectedDate);
  const today = format(new Date(), "yyyy-MM-dd");

  const microTotals = calculateDailyMicronutrients(log);
  const microAlerts = getMicronutrientAlerts(microTotals);

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
          <Link href="/fasting" className="block">
            <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent h-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/10">
                <span className="text-lg">⏱️</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Fasting</div>
                <div className="text-xs text-muted-foreground">IF timer</div>
              </div>
            </div>
          </Link>
          <Link href="/recipes" className="block">
            <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent h-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
                <span className="text-lg">👨‍🍳</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Recipes</div>
                <div className="text-xs text-muted-foreground">Custom meals</div>
              </div>
            </div>
          </Link>
          <Link href="/festival-plans" className="block">
            <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent h-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                <span className="text-lg">🪔</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Festival Plans</div>
                <div className="text-xs text-muted-foreground">Navratri, Ekadashi</div>
              </div>
            </div>
          </Link>
          <Link href="/photo-log" className="block">
            <div className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-accent h-full">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/10">
                <span className="text-lg">📸</span>
              </div>
              <div>
                <div className="font-semibold text-sm">Photo Log</div>
                <div className="text-xs text-muted-foreground">Snap & log</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Micronutrient Alerts */}
        {log.meals.length > 0 && microAlerts.length > 0 && (
          <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Micronutrient Alerts</span>
              </div>
              <div className="space-y-1.5">
                {microAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.nutrient} className="text-xs text-amber-700 dark:text-amber-300">
                    <span className="font-medium">{MICRONUTRIENT_CONFIG[alert.nutrient].label}</span>
                    {" — "}{alert.pct}% of daily goal. {alert.tip}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Micronutrient Summary */}
        {log.meals.length > 0 && (
          <Card>
            <CardContent className="pt-4 pb-3">
              <h3 className="text-sm font-semibold mb-2">Key Micronutrients</h3>
              <div className="grid grid-cols-5 gap-1 text-center">
                {(Object.keys(MICRONUTRIENT_CONFIG) as (keyof typeof MICRONUTRIENT_CONFIG)[]).map((key) => {
                  const config = MICRONUTRIENT_CONFIG[key];
                  const value = microTotals[key];
                  const target = DAILY_RECOMMENDED[key];
                  const pct = Math.min(100, Math.round((value / target) * 100));
                  return (
                    <div key={key} className="space-y-1">
                      <div className="text-[10px] text-muted-foreground leading-tight">{config.label.replace("Vitamin ", "Vit. ").replace("Omega-3 (ALA)", "Ω-3")}</div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: config.color }} />
                      </div>
                      <div className="text-[10px] font-medium">{pct}%</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Fasting Banner */}
        {activeFasting && (
          <Link href="/fasting">
            <Card className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20 cursor-pointer hover:bg-green-100/50">
              <CardContent className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <div>
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">Fasting Active</div>
                    <div className="text-xs text-green-600 dark:text-green-500">{activeFasting.protocol} protocol</div>
                  </div>
                </div>
                <span className="text-xs text-green-600">Tap to view →</span>
              </CardContent>
            </Card>
          </Link>
        )}

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

        {/* Share Progress */}
        {log.meals.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const firstWeight = weightHistory.length > 0 ? weightHistory[0].weightKg : (profile?.weightKg || 0);
              const currentWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weightKg : (profile?.weightKg || 0);
              const lost = Math.max(0, firstWeight - currentWeight);

              shareProgress({
                name: profile?.name || "User",
                date: fnsFormat(new Date(selectedDate + "T00:00:00"), "EEE, MMM d yyyy"),
                calories: { consumed: Math.round(log.totalNutrition.calories), target: dailyTargets.calories },
                protein: { consumed: Math.round(log.totalNutrition.protein), target: dailyTargets.protein },
                streak: currentStreak,
                weightLost: Math.round(lost * 10) / 10,
                waterMl: log.waterMl,
              });
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Today&apos;s Progress
          </Button>
        )}
      </main>
    </div>
  );
}
