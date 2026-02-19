"use client";

import { useMemo } from "react";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface CalorieRingProps {
  consumed: number;
  target: number;
}

export function CalorieRing({ consumed, target }: CalorieRingProps) {
  const percentage = useMemo(() => {
    if (target <= 0) return 0;
    return Math.min((consumed / target) * 100, 100);
  }, [consumed, target]);

  const ringColor = useMemo(() => {
    const ratio = consumed / target;
    if (ratio > 1) return "#EF5350"; // Red - over target
    if (ratio >= 0.8) return "#FFA726"; // Amber - 80-100%
    return "#4CAF50"; // Green - under target
  }, [consumed, target]);

  const remaining = Math.max(target - consumed, 0);
  const isOver = consumed > target;

  const formatNumber = (n: number) => n.toLocaleString("en-IN");

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="size-5 text-orange-500" />
          Calories
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
          <CircularProgressbar
            value={percentage}
            styles={buildStyles({
              rotation: 0,
              strokeLinecap: "round",
              pathTransitionDuration: 0.8,
              pathColor: ringColor,
              trailColor: "rgba(0, 0, 0, 0.08)",
              textColor: "transparent",
            })}
          />
          {/* Custom center text overlay for better control */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-4xl font-bold tracking-tight">
              {formatNumber(consumed)}
            </span>
            <span className="text-base sm:text-lg text-muted-foreground">
              / {formatNumber(target)} kcal
            </span>
          </div>
        </div>

        <div className="text-center">
          {isOver ? (
            <p className="text-lg font-semibold text-red-500">
              {formatNumber(consumed - target)} kcal over target
            </p>
          ) : (
            <p className="text-lg font-semibold text-muted-foreground">
              {formatNumber(remaining)} kcal remaining
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
