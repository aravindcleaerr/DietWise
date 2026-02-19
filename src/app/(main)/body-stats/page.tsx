"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  calculateBMI,
  getBMICategory,
  getBMICategoryColor,
  calculateBMR,
  calculateTDEE,
  calculateDailyTargets,
  calculateDeficitInfo,
  calculateWeightGoalDate,
  calculateWeeksToGoal,
} from "@/lib/calculations";
import { format } from "date-fns";
import {
  Activity,
  Brain,
  Calendar,
  Droplets,
  Flame,
  Heart,
  Info,
  Lightbulb,
  Ruler,
  Scale,
  Target,
  TrendingDown,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Activity level labels for display
// ---------------------------------------------------------------------------

const ACTIVITY_LABELS: Record<string, string> = {
  sedentary: "Sedentary (little to no exercise)",
  light: "Lightly Active (1-3 days/week)",
  moderate: "Moderately Active (3-5 days/week)",
  active: "Active (6-7 days/week)",
  very_active: "Very Active (hard exercise + physical job)",
};

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// ---------------------------------------------------------------------------
// BMI Scale ranges (Asian cutoffs)
// ---------------------------------------------------------------------------

const BMI_RANGES = [
  { label: "Underweight", min: 0, max: 18.5, color: "bg-blue-400" },
  { label: "Normal", min: 18.5, max: 23, color: "bg-green-500" },
  { label: "Overweight", min: 23, max: 25, color: "bg-yellow-400" },
  { label: "Obese I", min: 25, max: 30, color: "bg-orange-500" },
  { label: "Obese II", min: 30, max: 40, color: "bg-red-500" },
];

// ---------------------------------------------------------------------------
// Helper: compute the position (0-100%) on the BMI scale bar for a given BMI
// The scale spans from BMI 15 to BMI 40.
// ---------------------------------------------------------------------------

function bmiToPercent(bmi: number): number {
  const min = 15;
  const max = 40;
  const clamped = Math.min(max, Math.max(min, bmi));
  return ((clamped - min) / (max - min)) * 100;
}

// ---------------------------------------------------------------------------
// Helper: healthy weight range for a given height using BMI 18.5 - 22.9
// ---------------------------------------------------------------------------

function healthyWeightRange(heightCm: number): { low: number; high: number } {
  const heightM = heightCm / 100;
  const low = Math.round(18.5 * heightM * heightM * 10) / 10;
  const high = Math.round(22.9 * heightM * heightM * 10) / 10;
  return { low, high };
}

// ===========================================================================
// Body Stats Page
// ===========================================================================

export default function BodyStatsPage() {
  const profile = useStore((s) => s.profile);
  const weightHistory = useStore((s) => s.weightHistory);
  const dailyTargets = useStore((s) => s.dailyTargets);

  // Determine current weight from latest weight history entry or profile
  const currentWeight = useMemo(() => {
    if (weightHistory.length > 0) {
      return weightHistory[weightHistory.length - 1].weightKg;
    }
    return profile?.weightKg ?? 0;
  }, [weightHistory, profile]);

  // Pre-compute all values when profile is available
  const stats = useMemo(() => {
    if (!profile) return null;

    const profileWithCurrentWeight = { ...profile, weightKg: currentWeight };

    const bmi = calculateBMI(currentWeight, profile.heightCm);
    const bmiCategory = getBMICategory(bmi);
    const bmiColor = getBMICategoryColor(bmi);
    const bmr = calculateBMR(profileWithCurrentWeight);
    const tdee = calculateTDEE(profileWithCurrentWeight);
    const targets = calculateDailyTargets(profileWithCurrentWeight);
    const deficitInfo = calculateDeficitInfo(profileWithCurrentWeight);
    const weeksToGoal = calculateWeeksToGoal(
      currentWeight,
      profile.targetWeightKg,
      Math.abs(deficitInfo.weeklyWeightChange) || 0.5
    );
    const goalDate = calculateWeightGoalDate(
      currentWeight,
      profile.targetWeightKg,
      Math.abs(deficitInfo.weeklyWeightChange) || 0.5
    );
    const activityMultiplier =
      ACTIVITY_MULTIPLIERS[profile.activityLevel] ?? 1.2;
    const activityBonus = tdee - bmr;
    const healthy = healthyWeightRange(profile.heightCm);

    // Macro percentages (calories from each macro)
    const proteinCals = targets.protein * 4;
    const carbsCals = targets.carbs * 4;
    const fatCals = targets.fat * 9;
    const totalMacroCals = proteinCals + carbsCals + fatCals;
    const proteinPct =
      totalMacroCals > 0 ? Math.round((proteinCals / totalMacroCals) * 100) : 0;
    const carbsPct =
      totalMacroCals > 0 ? Math.round((carbsCals / totalMacroCals) * 100) : 0;
    const fatPct =
      totalMacroCals > 0 ? Math.round((fatCals / totalMacroCals) * 100) : 0;

    // Goal progress
    const weightDiff = Math.abs(currentWeight - profile.targetWeightKg);
    const startDiff = Math.abs(profile.weightKg - profile.targetWeightKg);
    const progressPercent =
      startDiff > 0
        ? Math.min(
            100,
            Math.max(0, ((startDiff - weightDiff) / startDiff) * 100)
          )
        : profile.goalType === "maintenance"
          ? 100
          : 0;

    return {
      bmi,
      bmiCategory,
      bmiColor,
      bmr,
      tdee,
      targets,
      deficitInfo,
      weeksToGoal,
      goalDate,
      activityMultiplier,
      activityBonus,
      healthy,
      proteinCals,
      carbsCals,
      fatCals,
      proteinPct,
      carbsPct,
      fatPct,
      weightDiff,
      progressPercent,
    };
  }, [profile, currentWeight]);

  // -------------------------------------------------------------------
  // No profile: onboarding prompt
  // -------------------------------------------------------------------

  if (!profile || !stats) {
    return (
      <div>
        <PageHeader title="Body Stats" subtitle="Your health metrics" />
        <main className="mx-auto max-w-lg px-4 py-12">
          <Card>
            <CardContent className="pt-6 text-center space-y-3">
              <Scale className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-lg font-semibold">No Profile Found</h2>
              <p className="text-sm text-muted-foreground">
                Please complete the onboarding process first so we can calculate
                your BMI, BMR, TDEE, and personalized calorie targets.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------

  return (
    <div>
      <PageHeader title="Body Stats" subtitle="Your health metrics at a glance" />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-5">
        {/* ============================================================= */}
        {/* 1. BMI SECTION                                                 */}
        {/* ============================================================= */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Body Mass Index (BMI)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Large BMI display */}
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold ${stats.bmiColor}`}>
                {stats.bmi.toFixed(1)}
              </span>
              <Badge
                variant="secondary"
                className={`text-sm ${
                  stats.bmi < 18.5
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : stats.bmi < 23
                      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      : stats.bmi < 25
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                        : stats.bmi < 30
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}
              >
                {stats.bmiCategory}
              </Badge>
            </div>

            {/* Visual BMI scale bar */}
            <div className="space-y-1">
              <div className="relative h-4 rounded-full overflow-hidden flex">
                {BMI_RANGES.map((range) => {
                  // Each segment's width is proportional to the range it covers on the 15-40 scale
                  const totalSpan = 40 - 15;
                  const segMin = Math.max(range.min, 15);
                  const segMax = Math.min(range.max, 40);
                  const widthPct = ((segMax - segMin) / totalSpan) * 100;
                  return (
                    <div
                      key={range.label}
                      className={`${range.color} h-full`}
                      style={{ width: `${widthPct}%` }}
                    />
                  );
                })}

                {/* Marker for user's BMI */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-foreground"
                  style={{ left: `${bmiToPercent(stats.bmi)}%` }}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-foreground text-background px-1 rounded">
                    {stats.bmi.toFixed(1)}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[5px] border-l-transparent border-r-transparent border-b-foreground rotate-180" />
                </div>
              </div>

              {/* Scale labels */}
              <div className="flex text-[10px] text-muted-foreground">
                <div style={{ width: "14%" }} className="text-center">
                  &lt;18.5
                </div>
                <div style={{ width: "18%" }} className="text-center">
                  18.5-22.9
                </div>
                <div style={{ width: "8%" }} className="text-center">
                  23-24.9
                </div>
                <div style={{ width: "20%" }} className="text-center">
                  25-29.9
                </div>
                <div style={{ width: "40%" }} className="text-center">
                  30+
                </div>
              </div>
            </div>

            {/* Asian BMI cutoffs table */}
            <div className="rounded-lg border p-3 space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                Asian BMI Classification
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  &lt;18.5 Underweight
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  18.5-22.9 Normal
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  23-24.9 Overweight
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  25-29.9 Obese I
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  30+ Obese II
                </div>
              </div>
            </div>

            {/* Healthy weight range */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Ruler className="h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm">
                Healthy weight for your height ({profile.heightCm} cm):{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {stats.healthy.low} - {stats.healthy.high} kg
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ============================================================= */}
        {/* 2. BMR SECTION                                                 */}
        {/* ============================================================= */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Basal Metabolic Rate (BMR)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Large BMR display */}
            <div className="text-center py-2">
              <span className="text-4xl font-bold text-foreground">
                {stats.bmr.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground ml-1">
                kcal/day
              </span>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Your body burns{" "}
              <span className="font-semibold text-foreground">
                {stats.bmr.toLocaleString()} calories
              </span>{" "}
              per day at complete rest.
            </p>

            {/* Explanation */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Brain className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                This keeps your heart beating, lungs breathing, and organs
                functioning. It represents the minimum energy your body needs to
                survive.
              </p>
            </div>

            {/* Mifflin-St Jeor Formula */}
            <div className="rounded-lg border p-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">
                Mifflin-St Jeor Formula
              </p>
              <div className="font-mono text-xs space-y-0.5">
                {profile.gender === "male" ? (
                  <>
                    <p>BMR = (10 x weight) + (6.25 x height) - (5 x age) - 5</p>
                    <p className="text-muted-foreground">
                      BMR = (10 x {currentWeight}) + (6.25 x {profile.heightCm})
                      - (5 x {profile.age}) - 5
                    </p>
                  </>
                ) : profile.gender === "female" ? (
                  <>
                    <p>
                      BMR = (10 x weight) + (6.25 x height) - (5 x age) - 161
                    </p>
                    <p className="text-muted-foreground">
                      BMR = (10 x {currentWeight}) + (6.25 x {profile.heightCm})
                      - (5 x {profile.age}) - 161
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      BMR = (10 x weight) + (6.25 x height) - (5 x age) - 83
                    </p>
                    <p className="text-muted-foreground">
                      BMR = (10 x {currentWeight}) + (6.25 x {profile.heightCm})
                      - (5 x {profile.age}) - 83
                    </p>
                  </>
                )}
                <p className="font-semibold text-foreground">
                  = {stats.bmr.toLocaleString()} kcal/day
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============================================================= */}
        {/* 3. TDEE SECTION                                                */}
        {/* ============================================================= */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Total Daily Energy Expenditure (TDEE)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Large TDEE display */}
            <div className="text-center py-2">
              <span className="text-4xl font-bold text-foreground">
                {stats.tdee.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground ml-1">
                kcal/day
              </span>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              You burn approximately{" "}
              <span className="font-semibold text-foreground">
                {stats.tdee.toLocaleString()} calories
              </span>{" "}
              per day including your daily activities.
            </p>

            {/* Visual: BMR + Activity Bonus = TDEE */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium w-28">BMR</span>
                <div className="flex-1 h-6 rounded bg-muted overflow-hidden relative">
                  <div
                    className="h-full bg-red-400/70 rounded-l flex items-center justify-center text-[10px] font-medium text-white"
                    style={{
                      width: `${(stats.bmr / stats.tdee) * 100}%`,
                    }}
                  >
                    {stats.bmr.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium w-28">+ Activity</span>
                <div className="flex-1 h-6 rounded bg-muted overflow-hidden relative">
                  <div
                    className="h-full bg-orange-400/70 rounded-l flex items-center justify-center text-[10px] font-medium text-white"
                    style={{
                      width: `${(stats.activityBonus / stats.tdee) * 100}%`,
                    }}
                  >
                    +{stats.activityBonus.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm border-t pt-2">
                <span className="font-semibold w-28">= TDEE</span>
                <div className="flex-1 h-6 rounded overflow-hidden relative">
                  <div className="h-full bg-primary/80 rounded flex items-center justify-center text-[10px] font-medium text-primary-foreground w-full">
                    {stats.tdee.toLocaleString()} kcal
                  </div>
                </div>
              </div>
            </div>

            {/* Activity level */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
              <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="text-sm">
                <span className="font-medium">Activity Level:</span>{" "}
                {ACTIVITY_LABELS[profile.activityLevel] ?? profile.activityLevel}
                <span className="text-muted-foreground">
                  {" "}
                  (x{stats.activityMultiplier})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============================================================= */}
        {/* 4. CALORIE BUDGET SECTION                                      */}
        {/* ============================================================= */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Utensils className="h-4 w-4 text-primary" />
              Daily Calorie Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Target calories display */}
            <div className="text-center py-2">
              <span className="text-4xl font-bold text-primary">
                {stats.targets.calories.toLocaleString()}
              </span>
              <span className="text-lg text-muted-foreground ml-1">
                kcal/day
              </span>
              <div className="mt-1">
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    profile.goalType === "weight_loss"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                      : profile.goalType === "weight_gain"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300"
                  }`}
                >
                  {profile.goalType === "weight_loss"
                    ? "Weight Loss"
                    : profile.goalType === "weight_gain"
                      ? "Weight Gain"
                      : "Maintenance"}
                </Badge>
              </div>
            </div>

            {/* Deficit/Surplus visual */}
            {profile.goalType === "weight_loss" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>TDEE</span>
                  <span className="font-medium">
                    {stats.tdee.toLocaleString()} kcal
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-red-500">
                  <span>- Deficit</span>
                  <span className="font-medium">
                    -{stats.deficitInfo.dailyDeficit.toLocaleString()} kcal
                  </span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between text-sm font-semibold">
                  <span>= Target</span>
                  <span className="text-primary">
                    {stats.targets.calories.toLocaleString()} kcal
                  </span>
                </div>

                {/* Visual bar */}
                <div className="h-5 rounded-full bg-muted overflow-hidden flex">
                  <div
                    className="h-full bg-primary/80 rounded-l"
                    style={{
                      width: `${(stats.targets.calories / stats.tdee) * 100}%`,
                    }}
                  />
                  <div
                    className="h-full bg-red-400/40"
                    style={{
                      width: `${(stats.deficitInfo.dailyDeficit / stats.tdee) * 100}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Expected weekly loss:{" "}
                  <span className="font-semibold text-foreground">
                    ~{Math.abs(stats.deficitInfo.weeklyWeightChange).toFixed(2)}{" "}
                    kg/week
                  </span>
                </p>
              </div>
            )}

            {profile.goalType === "weight_gain" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>TDEE</span>
                  <span className="font-medium">
                    {stats.tdee.toLocaleString()} kcal
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-green-500">
                  <span>+ Surplus</span>
                  <span className="font-medium">
                    +
                    {Math.abs(stats.deficitInfo.dailyDeficit).toLocaleString()}{" "}
                    kcal
                  </span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between text-sm font-semibold">
                  <span>= Target</span>
                  <span className="text-primary">
                    {stats.targets.calories.toLocaleString()} kcal
                  </span>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Expected weekly gain:{" "}
                  <span className="font-semibold text-foreground">
                    ~{Math.abs(stats.deficitInfo.weeklyWeightChange).toFixed(2)}{" "}
                    kg/week
                  </span>
                </p>
              </div>
            )}

            {profile.goalType === "maintenance" && (
              <p className="text-sm text-muted-foreground text-center">
                Your target calories match your TDEE to maintain your current
                weight.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ============================================================= */}
        {/* 5. GOAL TIMELINE SECTION                                       */}
        {/* ============================================================= */}
        {profile.goalType !== "maintenance" && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Goal Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current -> Target */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold">{currentWeight}</p>
                  <p className="text-xs text-muted-foreground">Current (kg)</p>
                </div>

                <div className="flex-1 mx-4 flex flex-col items-center">
                  {profile.goalType === "weight_loss" ? (
                    <TrendingDown className="h-5 w-5 text-blue-500 mb-1" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                  )}
                  <div className="w-full h-0.5 bg-muted-foreground/20 relative">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary h-full"
                      style={{
                        width: `${stats.progressPercent}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {profile.targetWeightKg}
                  </p>
                  <p className="text-xs text-muted-foreground">Target (kg)</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{Math.round(stats.progressPercent)}%</span>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${stats.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Timeline stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <Zap className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-bold">{stats.weeksToGoal}</p>
                  <p className="text-xs text-muted-foreground">
                    Weeks to goal
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-center">
                  <Calendar className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-lg font-bold">
                    {format(stats.goalDate, "MMM d")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Est. {format(stats.goalDate, "yyyy")}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {stats.weightDiff.toFixed(1)} kg remaining at ~
                {Math.abs(stats.deficitInfo.weeklyWeightChange).toFixed(2)}{" "}
                kg/week
              </p>
            </CardContent>
          </Card>
        )}

        {/* ============================================================= */}
        {/* 6. MACRO BREAKDOWN SECTION                                     */}
        {/* ============================================================= */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Daily Macro Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Macro split description */}
            <p className="text-xs text-muted-foreground text-center">
              {profile.goalType === "weight_loss"
                ? "High-protein split for weight loss: Protein 25-30% | Carbs 40-45% | Fat 25-30%"
                : profile.goalType === "weight_gain"
                  ? "Growth-focused split: Protein 20-25% | Carbs 50-55% | Fat 20-25%"
                  : "Balanced split: Protein 20-25% | Carbs 45-50% | Fat 25-30%"}
            </p>

            {/* Macro visual bar */}
            <div className="h-6 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-blue-500 flex items-center justify-center text-[10px] font-medium text-white"
                style={{ width: `${stats.proteinPct}%` }}
              >
                {stats.proteinPct}%
              </div>
              <div
                className="h-full bg-amber-500 flex items-center justify-center text-[10px] font-medium text-white"
                style={{ width: `${stats.carbsPct}%` }}
              >
                {stats.carbsPct}%
              </div>
              <div
                className="h-full bg-rose-400 flex items-center justify-center text-[10px] font-medium text-white"
                style={{ width: `${stats.fatPct}%` }}
              >
                {stats.fatPct}%
              </div>
            </div>

            {/* Individual macros */}
            <div className="space-y-3">
              {/* Protein */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm font-medium">Protein</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">
                    {dailyTargets.protein}g
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({stats.proteinPct}% = {stats.proteinCals} kcal)
                  </span>
                </div>
              </div>

              {/* Carbs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium">Carbs</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">
                    {dailyTargets.carbs}g
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({stats.carbsPct}% = {stats.carbsCals} kcal)
                  </span>
                </div>
              </div>

              {/* Fat */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="text-sm font-medium">Fat</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold">
                    {dailyTargets.fat}g
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({stats.fatPct}% = {stats.fatCals} kcal)
                  </span>
                </div>
              </div>

              {/* Fiber */}
              <div className="flex items-center justify-between border-t pt-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium">Fiber</span>
                </div>
                <span className="text-sm font-semibold">
                  {dailyTargets.fiber}g
                </span>
              </div>

              {/* Water */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-3 h-3 text-sky-500" />
                  <span className="text-sm font-medium">Water</span>
                </div>
                <span className="text-sm font-semibold">
                  {(dailyTargets.waterMl / 1000).toFixed(1)}L{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({dailyTargets.waterMl} ml)
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ============================================================= */}
        {/* 7. EDUCATIONAL TIPS CARD                                       */}
        {/* ============================================================= */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Did You Know?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold dark:bg-green-900/40 dark:text-green-300 shrink-0">
                1
              </span>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Safe weight loss is 0.5-1 kg per week.
                </span>{" "}
                Faster loss often means losing muscle mass along with fat, and
                is harder to sustain long-term.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-bold dark:bg-red-900/40 dark:text-red-300 shrink-0">
                2
              </span>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Never go below 1,200 calories/day.
                </span>{" "}
                Very low calorie diets can slow your metabolism, cause nutrient
                deficiencies, and lead to muscle loss.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/40 dark:text-blue-300 shrink-0">
                3
              </span>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  Protein is essential for muscle preservation during weight
                  loss.
                </span>{" "}
                Aim for at least 1.6g per kg of body weight to protect lean mass
                while in a calorie deficit.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom spacer for mobile navigation */}
        <div className="h-4" />
      </main>
    </div>
  );
}
