"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  Calendar,
  Flame,
  Target,
  Droplets,
  TrendingUp,
  Award,
  ThumbsUp,
  AlertTriangle,
  Dumbbell,
  BarChart3,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helper: format a date string to YYYY-MM-DD
// ---------------------------------------------------------------------------
function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// ---------------------------------------------------------------------------
// Circular Progress Ring (SVG)
// ---------------------------------------------------------------------------
function CircularProgress({
  value,
  size = 140,
  strokeWidth = 10,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = circumference - (clampedValue / 100) * circumference;

  const getColor = () => {
    if (clampedValue >= 80) return "hsl(var(--primary))";
    if (clampedValue >= 50) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold">{Math.round(clampedValue)}%</span>
        <span className="text-xs text-muted-foreground">Adherence</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Reports Page
// ---------------------------------------------------------------------------
export default function ReportsPage() {
  const dailyLogs = useStore((s) => s.dailyLogs);
  const dailyTargets = useStore((s) => s.dailyTargets);
  const exerciseLogs = useStore((s) => s.exerciseLogs);

  const [period, setPeriod] = useState<"week" | "month">("week");

  // ---- Compute date range ---------------------------------------------------
  const dateRange = useMemo(() => {
    const today = new Date();

    if (period === "week") {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }

    // "month": 1st of the current month through today
    const monthStart = startOfMonth(today);
    return eachDayOfInterval({ start: monthStart, end: today });
  }, [period]);

  const dateKeys = useMemo(() => dateRange.map(toDateKey), [dateRange]);

  // ---- Aggregate data -------------------------------------------------------
  const reportData = useMemo(() => {
    // Gather logs that actually have data
    const logsWithData = dateKeys
      .map((key) => ({ key, log: dailyLogs[key] }))
      .filter(({ log }) => log && log.meals.length > 0);

    const daysLogged = logsWithData.length;
    const totalDays = dateKeys.length;

    // Calories
    const totalCalories = logsWithData.reduce(
      (sum, { log }) => sum + log.totalNutrition.calories,
      0
    );
    const avgCalories = daysLogged > 0 ? totalCalories / daysLogged : 0;
    const calorieAdherence =
      dailyTargets.calories > 0
        ? Math.round((avgCalories / dailyTargets.calories) * 100)
        : 0;

    // Protein / Carbs / Fat
    const totalProtein = logsWithData.reduce(
      (sum, { log }) => sum + log.totalNutrition.protein,
      0
    );
    const totalCarbs = logsWithData.reduce(
      (sum, { log }) => sum + log.totalNutrition.carbs,
      0
    );
    const totalFat = logsWithData.reduce(
      (sum, { log }) => sum + log.totalNutrition.fat,
      0
    );

    const avgProtein = daysLogged > 0 ? totalProtein / daysLogged : 0;
    const avgCarbs = daysLogged > 0 ? totalCarbs / daysLogged : 0;
    const avgFat = daysLogged > 0 ? totalFat / daysLogged : 0;

    // Exercise calories
    const totalExerciseCals = dateKeys.reduce((sum, key) => {
      const entries = exerciseLogs[key] ?? [];
      return sum + entries.reduce((s, e) => s + e.caloriesBurned, 0);
    }, 0);

    // Water
    const totalWater = logsWithData.reduce(
      (sum, { log }) => sum + log.waterMl,
      0
    );
    const avgWater = daysLogged > 0 ? totalWater / daysLogged : 0;

    // ---- Daily chart data ---------------------------------------------------
    const chartData = dateKeys.map((key) => {
      const log = dailyLogs[key];
      const calories = log && log.meals.length > 0 ? log.totalNutrition.calories : 0;
      const hasData = log && log.meals.length > 0;
      const diff = Math.abs(calories - dailyTargets.calories);
      const threshold = dailyTargets.calories * 0.1;

      let barColor = "#D1D5DB"; // gray for no data
      if (hasData) {
        barColor = diff <= threshold ? "#43A047" : "#F59E0B"; // green within 10%, amber otherwise
      }

      return {
        date: format(new Date(key + "T00:00:00"), "EEE"),
        fullDate: format(new Date(key + "T00:00:00"), "MMM d"),
        calories,
        hasData,
        barColor,
      };
    });

    // For month view, use shorter labels
    const chartDataWithLabels =
      period === "month"
        ? chartData.map((d) => ({ ...d, date: d.fullDate }))
        : chartData;

    // ---- Best and Worst day -------------------------------------------------
    const loggedDaysWithDiff = logsWithData.map(({ key, log }) => ({
      key,
      calories: log.totalNutrition.calories,
      diff: Math.abs(log.totalNutrition.calories - dailyTargets.calories),
    }));

    loggedDaysWithDiff.sort((a, b) => a.diff - b.diff);

    const bestDay = loggedDaysWithDiff.length > 0 ? loggedDaysWithDiff[0] : null;
    const worstDay =
      loggedDaysWithDiff.length > 0
        ? loggedDaysWithDiff[loggedDaysWithDiff.length - 1]
        : null;

    // ---- Adherence Score ----------------------------------------------------
    const daysWithinTarget = logsWithData.filter(({ log }) => {
      const diff = Math.abs(
        log.totalNutrition.calories - dailyTargets.calories
      );
      return diff <= dailyTargets.calories * 0.1;
    }).length;

    const adherenceScore =
      daysLogged > 0 ? (daysWithinTarget / daysLogged) * 100 : 0;

    // ---- Water chart data ---------------------------------------------------
    const waterChartData = dateKeys.map((key) => {
      const log = dailyLogs[key];
      const water = log ? log.waterMl : 0;
      return {
        date:
          period === "month"
            ? format(new Date(key + "T00:00:00"), "MMM d")
            : format(new Date(key + "T00:00:00"), "EEE"),
        water: Math.round(water),
      };
    });

    return {
      daysLogged,
      totalDays,
      avgCalories,
      calorieAdherence,
      avgProtein,
      avgCarbs,
      avgFat,
      totalExerciseCals,
      avgWater,
      chartDataWithLabels,
      bestDay,
      worstDay,
      adherenceScore,
      daysWithinTarget,
      waterChartData,
    };
  }, [dateKeys, dailyLogs, dailyTargets, exerciseLogs, period]);

  // ---- Macros targets percentage -------------------------------------------
  const proteinPct = dailyTargets.protein > 0
    ? Math.round((reportData.avgProtein / dailyTargets.protein) * 100)
    : 0;
  const carbsPct = dailyTargets.carbs > 0
    ? Math.round((reportData.avgCarbs / dailyTargets.carbs) * 100)
    : 0;
  const fatPct = dailyTargets.fat > 0
    ? Math.round((reportData.avgFat / dailyTargets.fat) * 100)
    : 0;
  const waterPct = dailyTargets.waterMl > 0
    ? Math.round((reportData.avgWater / dailyTargets.waterMl) * 100)
    : 0;

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Weekly & monthly nutrition insights"
      />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* ── Period Toggle ─────────────────────────────────────────────── */}
        <div className="flex gap-2">
          <Button
            variant={period === "week" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setPeriod("week")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            This Week
          </Button>
          <Button
            variant={period === "month" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setPeriod("month")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            This Month
          </Button>
        </div>

        {/* ── Summary Stats Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {/* Avg Daily Calories */}
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
              <div className="text-2xl font-bold">
                {Math.round(reportData.avgCalories)}
              </div>
              <div className="text-xs text-muted-foreground">
                Avg Daily kcal
              </div>
              <Badge
                variant="secondary"
                className={
                  reportData.calorieAdherence >= 90 &&
                  reportData.calorieAdherence <= 110
                    ? "mt-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "mt-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                }
              >
                {reportData.calorieAdherence}% of target
              </Badge>
            </CardContent>
          </Card>

          {/* Avg Daily Protein */}
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <Target className="h-5 w-5 mx-auto mb-1 text-indigo-500" />
              <div className="text-2xl font-bold">
                {Math.round(reportData.avgProtein)}g
              </div>
              <div className="text-xs text-muted-foreground">
                Avg Daily Protein
              </div>
              <Badge variant="secondary" className="mt-1">
                {proteinPct}% of target
              </Badge>
            </CardContent>
          </Card>

          {/* Days Logged */}
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
              <div className="text-2xl font-bold">
                {reportData.daysLogged}
                <span className="text-base font-normal text-muted-foreground">
                  /{reportData.totalDays}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Days Logged</div>
            </CardContent>
          </Card>

          {/* Exercise Calories */}
          <Card>
            <CardContent className="pt-4 pb-3 text-center">
              <Dumbbell className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <div className="text-2xl font-bold">
                {reportData.totalExerciseCals}
              </div>
              <div className="text-xs text-muted-foreground">
                Exercise kcal Burned
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Adherence Score Ring ──────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Adherence Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-4">
            <CircularProgress value={reportData.adherenceScore} />
            <p className="text-sm text-muted-foreground mt-3 text-center">
              {reportData.daysWithinTarget} of {reportData.daysLogged} logged
              day{reportData.daysLogged !== 1 ? "s" : ""} within 10% of your{" "}
              {dailyTargets.calories} kcal target
            </p>
          </CardContent>
        </Card>

        {/* ── Daily Calories Bar Chart ─────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Daily Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={reportData.chartDataWithLabels}
                margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  interval={period === "month" ? Math.floor(dateRange.length / 7) : 0}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    fontSize: 12,
                  }}
                  formatter={(value: number | undefined) => [`${value ?? 0} kcal`, "Calories"]}
                />
                <ReferenceLine
                  y={dailyTargets.calories}
                  stroke="#43A047"
                  strokeDasharray="5 5"
                  label={{
                    value: `Target: ${dailyTargets.calories}`,
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "#43A047",
                  }}
                />
                <Bar dataKey="calories" radius={[4, 4, 0, 0]} maxBarSize={32}>
                  {reportData.chartDataWithLabels.map((entry, index) => (
                    <Cell key={index} fill={entry.barColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#43A047]" />
                Within 10%
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#F59E0B]" />
                Over/Under
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#D1D5DB]" />
                No Data
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ── Macros Breakdown ─────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Average Daily Macros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Protein</span>
                <span className="text-muted-foreground">
                  {Math.round(reportData.avgProtein)}g /{" "}
                  {dailyTargets.protein}g
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, proteinPct)}%`,
                    backgroundColor: "#5C6BC0",
                  }}
                />
              </div>
              <div className="text-right text-xs text-muted-foreground mt-0.5">
                {proteinPct}%
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Carbs</span>
                <span className="text-muted-foreground">
                  {Math.round(reportData.avgCarbs)}g /{" "}
                  {dailyTargets.carbs}g
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, carbsPct)}%`,
                    backgroundColor: "#FFA726",
                  }}
                />
              </div>
              <div className="text-right text-xs text-muted-foreground mt-0.5">
                {carbsPct}%
              </div>
            </div>

            {/* Fat */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Fat</span>
                <span className="text-muted-foreground">
                  {Math.round(reportData.avgFat)}g / {dailyTargets.fat}g
                </span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, fatPct)}%`,
                    backgroundColor: "#EF5350",
                  }}
                />
              </div>
              <div className="text-right text-xs text-muted-foreground mt-0.5">
                {fatPct}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Best & Worst Days ────────────────────────────────────────── */}
        {reportData.daysLogged > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {/* Best Day */}
            {reportData.bestDay && (
              <Card className="border-green-200 dark:border-green-800">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Best Day
                    </span>
                  </div>
                  <div className="text-lg font-bold">
                    {format(
                      new Date(reportData.bestDay.key + "T00:00:00"),
                      "EEE, MMM d"
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(reportData.bestDay.calories)} kcal
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Only {Math.round(reportData.bestDay.diff)} kcal off target
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Worst Day */}
            {reportData.worstDay && reportData.daysLogged > 1 && (
              <Card className="border-amber-200 dark:border-amber-800">
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      Needs Work
                    </span>
                  </div>
                  <div className="text-lg font-bold">
                    {format(
                      new Date(reportData.worstDay.key + "T00:00:00"),
                      "EEE, MMM d"
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(reportData.worstDay.calories)} kcal
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {Math.round(reportData.worstDay.diff)} kcal off target
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Show single card spanning full width if only 1 day logged */}
            {reportData.worstDay && reportData.daysLogged === 1 && (
              <Card>
                <CardContent className="pt-4 pb-3 text-center">
                  <div className="text-sm text-muted-foreground">
                    Log more days to see comparison
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* ── Water Intake ─────────────────────────────────────────────── */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              Water Intake
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Avg Water Stat */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">
                  Avg Daily Intake
                </div>
                <div className="text-xl font-bold">
                  {Math.round(reportData.avgWater)} ml
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Target
                </div>
                <div className="text-xl font-bold text-blue-500">
                  {dailyTargets.waterMl} ml
                </div>
              </div>
            </div>

            {/* Water Progress Bar */}
            <div className="mb-4">
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 bg-blue-500"
                  style={{ width: `${Math.min(100, waterPct)}%` }}
                />
              </div>
              <div className="text-right text-xs text-muted-foreground mt-0.5">
                {waterPct}% of daily target
              </div>
            </div>

            {/* Water Bar Chart */}
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={reportData.waterChartData}
                margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                  interval={period === "month" ? Math.floor(dateRange.length / 7) : 0}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                    color: "hsl(var(--foreground))",
                    fontSize: 12,
                  }}
                  formatter={(value: number | undefined) => [`${value ?? 0} ml`, "Water"]}
                />
                <ReferenceLine
                  y={dailyTargets.waterMl}
                  stroke="#3B82F6"
                  strokeDasharray="5 5"
                />
                <Bar
                  dataKey="water"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                  opacity={0.8}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ── Empty State ──────────────────────────────────────────────── */}
        {reportData.daysLogged === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <h3 className="font-semibold text-lg mb-1">No Data Yet</h3>
              <p className="text-sm text-muted-foreground">
                Start logging your meals to see{" "}
                {period === "week" ? "weekly" : "monthly"} reports here.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
