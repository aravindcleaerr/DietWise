"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus, Scale } from "lucide-react";

interface WeightSparklineProps {
  data: { date: string; weight: number }[];
  targetWeight: number;
}

export function WeightSparkline({ data, targetWeight }: WeightSparklineProps) {
  // Take the last 14 entries max
  const chartData = useMemo(() => {
    const recent = data.slice(-14);
    return recent.map((entry) => ({
      ...entry,
      // Format date for display (e.g., "12 Feb")
      label: new Date(entry.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
    }));
  }, [data]);

  const currentWeight = chartData.length > 0 ? chartData[chartData.length - 1].weight : 0;
  const previousWeight = chartData.length > 1 ? chartData[chartData.length - 2].weight : currentWeight;
  const weightChange = currentWeight - previousWeight;

  // Calculate Y axis domain with some padding
  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 100];
    const weights = [
      ...chartData.map((d) => d.weight),
      targetWeight,
    ];
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const padding = Math.max((max - min) * 0.2, 1);
    return [Math.floor(min - padding), Math.ceil(max + padding)];
  }, [chartData, targetWeight]);

  const TrendIcon = useMemo(() => {
    if (Math.abs(weightChange) < 0.1) return Minus;
    return weightChange > 0 ? TrendingUp : TrendingDown;
  }, [weightChange]);

  const trendColor = useMemo(() => {
    if (Math.abs(weightChange) < 0.1) return "text-muted-foreground";
    // If target < current, weight loss is desired, so going down is good
    if (targetWeight < currentWeight) {
      return weightChange < 0 ? "text-green-600" : "text-red-500";
    }
    // If target > current, weight gain is desired, so going up is good
    return weightChange > 0 ? "text-green-600" : "text-red-500";
  }, [weightChange, targetWeight, currentWeight]);

  if (chartData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="size-5 text-primary" />
            Weight Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-muted-foreground text-center py-8">
            No weight data yet. Log your weight to see trends.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-lg">
            <Scale className="size-5 text-primary" />
            Weight Trend
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Current weight display */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-bold tabular-nums">
              {currentWeight.toFixed(1)}
            </span>
            <span className="text-lg text-muted-foreground">kg</span>
          </div>
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="size-5" />
            <span className="text-base font-semibold tabular-nums">
              {weightChange > 0 ? "+" : ""}
              {weightChange.toFixed(1)} kg
            </span>
          </div>
        </div>

        {/* Target weight */}
        <p className="text-sm text-muted-foreground">
          Target: <strong>{targetWeight.toFixed(1)} kg</strong>
          {" -- "}
          {Math.abs(currentWeight - targetWeight).toFixed(1)} kg to go
        </p>

        {/* Chart */}
        <div className="w-full h-40 sm:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={yDomain}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  fontSize: "14px",
                  padding: "8px 12px",
                }}
                formatter={(value: number | undefined) => [
                  `${(value ?? 0).toFixed(1)} kg`,
                  "Weight",
                ]}
                labelFormatter={(label) => String(label)}
              />
              <ReferenceLine
                y={targetWeight}
                stroke="#4CAF50"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                label={{
                  value: "Target",
                  position: "insideTopRight",
                  fill: "#4CAF50",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "var(--color-primary)",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 6,
                  fill: "var(--color-primary)",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
