"use client";

import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBMI, getBMICategory } from "@/lib/calculations";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Scale, Trophy, Flame, Target, TrendingDown } from "lucide-react";

const ACHIEVEMENTS = [
  { id: "first_meal", name: "Getting Started", description: "Log your first meal", icon: "🍽️" },
  { id: "week_warrior", name: "Week Warrior", description: "7-day logging streak", icon: "🗓️" },
  { id: "hydration_hero", name: "Hydration Hero", description: "Hit water goal 7 days", icon: "💧" },
  { id: "century_club", name: "Century Club", description: "Log 100 meals", icon: "💯" },
  { id: "consistency_king", name: "Consistency King", description: "30-day logging streak", icon: "👑" },
  { id: "first_kg", name: "First Milestone", description: "Lose your first 1 kg", icon: "🎯" },
  { id: "halfway", name: "Halfway There", description: "Reach 50% of weight goal", icon: "⭐" },
  { id: "early_bird", name: "Early Bird", description: "Log breakfast before 9am for 7 days", icon: "🌅" },
];

export default function ProgressPage() {
  const profile = useStore((s) => s.profile);
  const weightHistory = useStore((s) => s.weightHistory);
  const addWeight = useStore((s) => s.addWeight);
  const currentStreak = useStore((s) => s.currentStreak);
  const longestStreak = useStore((s) => s.longestStreak);
  const dailyLogs = useStore((s) => s.dailyLogs);

  const [newWeight, setNewWeight] = useState("");

  // Compute achievement statuses from real data
  const achievementStatus = useMemo(() => {
    const totalMeals = Object.values(dailyLogs).reduce(
      (sum, log) => sum + log.meals.length,
      0
    );
    const totalFoods = Object.values(dailyLogs).reduce(
      (sum, log) => sum + log.meals.reduce((ms, m) => ms + m.foods.length, 0),
      0
    );

    const daysWithWaterGoalMet = Object.values(dailyLogs).filter(
      (log) => log.waterMl >= 3000
    ).length;

    const startW = profile?.weightKg ?? 94;
    const targetW = profile?.targetWeightKg ?? 82;
    const currentW =
      weightHistory.length > 0
        ? weightHistory[weightHistory.length - 1].weightKg
        : startW;
    const lostKg = startW - currentW;
    const totalGoal = startW - targetW;

    // Check early bird: count days where breakfast was logged before 9am
    const earlyBirdDays = Object.values(dailyLogs).filter((log) => {
      const breakfastMeal = log.meals.find((m) => m.mealType === "breakfast");
      if (!breakfastMeal) return false;
      const [h] = breakfastMeal.time.split(":").map(Number);
      return h < 9;
    }).length;

    return {
      first_meal: totalFoods >= 1,
      week_warrior: longestStreak >= 7,
      hydration_hero: daysWithWaterGoalMet >= 7,
      century_club: totalFoods >= 100,
      consistency_king: longestStreak >= 30,
      first_kg: lostKg >= 1,
      halfway: totalGoal > 0 && lostKg >= totalGoal / 2,
      early_bird: earlyBirdDays >= 7,
    };
  }, [dailyLogs, longestStreak, weightHistory, profile]);

  const handleLogWeight = () => {
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }
    addWeight(format(new Date(), "yyyy-MM-dd"), weight);
    setNewWeight("");
    toast.success(`Weight logged: ${weight} kg`);
  };

  const currentWeight = weightHistory.length > 0
    ? weightHistory[weightHistory.length - 1].weightKg
    : profile?.weightKg || 94;

  const startWeight = profile?.weightKg || 94;
  const targetWeight = profile?.targetWeightKg || 82;
  const totalToLose = startWeight - targetWeight;
  const lostSoFar = startWeight - currentWeight;
  const progressPercent = totalToLose > 0 ? Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100)) : 0;

  const bmi = calculateBMI(currentWeight, profile?.heightCm || 170);

  const chartData = weightHistory.slice(-30).map((w) => ({
    date: format(new Date(w.date + "T00:00:00"), "MMM d"),
    weight: w.weightKg,
  }));

  return (
    <div>
      <PageHeader title="Progress" subtitle="Track your journey" />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        <Tabs defaultValue="weight">
          <TabsList className="w-full">
            <TabsTrigger value="weight" className="flex-1">Weight</TabsTrigger>
            <TabsTrigger value="streaks" className="flex-1">Streaks</TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1">Badges</TabsTrigger>
          </TabsList>

          {/* Weight Tab */}
          <TabsContent value="weight" className="space-y-4 mt-4">
            {/* Log Weight */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Today's weight (kg)"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="h-12 text-base flex-1"
                  />
                  <Button className="h-12 px-6" onClick={handleLogWeight}>
                    <Scale className="h-4 w-4 mr-2" />
                    Log
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <div className="text-2xl font-bold">{currentWeight}</div>
                  <div className="text-xs text-muted-foreground">Current (kg)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {targetWeight}
                  </div>
                  <div className="text-xs text-muted-foreground">Target (kg)</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <div className="text-2xl font-bold">
                    {bmi.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">{getBMICategory(bmi)}</div>
                </CardContent>
              </Card>
            </div>

            {/* Goal Progress */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Goal Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-2">
                  <span>{startWeight} kg</span>
                  <span className="text-primary font-semibold">{targetWeight} kg</span>
                </div>
                <div className="h-4 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{lostSoFar.toFixed(1)} kg lost</span>
                  <span>{Math.max(0, currentWeight - targetWeight).toFixed(1)} kg to go</span>
                </div>
              </CardContent>
            </Card>

            {/* Weight Chart */}
            {chartData.length > 1 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingDown className="h-4 w-4" />
                    Weight Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11 }}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <YAxis
                        domain={["dataMin - 1", "dataMax + 1"]}
                        tick={{ fontSize: 11 }}
                        stroke="hsl(var(--muted-foreground))"
                      />
                      <Tooltip />
                      <ReferenceLine
                        y={targetWeight}
                        stroke="#43A047"
                        strokeDasharray="5 5"
                        label={{ value: "Goal", position: "right", fontSize: 11 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke="#43A047"
                        strokeWidth={2}
                        dot={{ fill: "#43A047", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Streaks Tab */}
          <TabsContent value="streaks" className="space-y-4 mt-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Flame className="h-16 w-16 mx-auto mb-3" style={{ color: "#FF6D00" }} />
                <div className="text-5xl font-bold" style={{ color: "#FF6D00" }}>
                  {currentStreak}
                </div>
                <div className="text-lg text-muted-foreground mt-1">
                  day streak
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  Longest streak: <span className="font-semibold">{longestStreak} days</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Streak Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Log at least one meal each day to keep your streak alive.</p>
                <p>Consistency beats perfection. Even logging a quick snack counts!</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-3 mt-4">
            {ACHIEVEMENTS.map((badge) => {
              const isEarned = achievementStatus[badge.id as keyof typeof achievementStatus] ?? false;
              return (
                <Card key={badge.id} className={!isEarned ? "opacity-50" : ""}>
                  <CardContent className="py-3 px-4 flex items-center gap-3">
                    <div className="text-3xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {badge.name}
                        {isEarned && (
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            Earned!
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {badge.description}
                      </div>
                    </div>
                    {isEarned && <Trophy className="h-5 w-5 text-yellow-500" />}
                  </CardContent>
                </Card>
              );
            })}
            <div className="text-center text-xs text-muted-foreground pt-2">
              {Object.values(achievementStatus).filter(Boolean).length} of {ACHIEVEMENTS.length} earned
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
