"use client";

import { useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, GlassWater } from "lucide-react";

const GLASS_ML = 250;

interface WaterTrackerProps {
  current: number;
  target: number;
  onAdd: () => void;
  onRemove?: () => void;
}

export function WaterTracker({
  current,
  target,
  onAdd,
  onRemove,
}: WaterTrackerProps) {
  const totalGlasses = Math.ceil(target / GLASS_ML);
  const filledGlasses = Math.floor(current / GLASS_ML);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);

  const handlePointerDown = useCallback(() => {
    isLongPressRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onRemove?.();
    }, 500);
  }, [onRemove]);

  const handlePointerUp = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    if (!isLongPressRef.current) {
      onAdd();
    }
    isLongPressRef.current = false;
  }, [onAdd]);

  const handlePointerCancel = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    isLongPressRef.current = false;
  }, []);

  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="size-5 text-blue-500" />
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Summary line */}
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold text-blue-600">
            {filledGlasses}{" "}
            <span className="text-base font-normal text-muted-foreground">
              / {totalGlasses} glasses
            </span>
          </span>
          <span className="text-base text-muted-foreground tabular-nums">
            {current} / {target} ml
          </span>
        </div>

        {/* Overall progress bar */}
        <div className="w-full h-3 rounded-full bg-blue-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Glass grid */}
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {Array.from({ length: totalGlasses }).map((_, index) => {
            const isFilled = index < filledGlasses;
            return (
              <button
                key={index}
                type="button"
                className={`
                  flex items-center justify-center
                  w-full aspect-square rounded-xl
                  transition-all duration-200
                  select-none touch-none
                  ${
                    isFilled
                      ? "bg-blue-500 text-white shadow-md scale-100"
                      : "bg-blue-50 text-blue-300 hover:bg-blue-100"
                  }
                  active:scale-90
                `}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onContextMenu={(e) => e.preventDefault()}
                aria-label={
                  isFilled
                    ? `Glass ${index + 1}: filled. Long press to remove.`
                    : `Glass ${index + 1}: empty. Tap to add.`
                }
              >
                <GlassWater className="size-5 sm:size-6" />
              </button>
            );
          })}
        </div>

        {/* Hint text */}
        <p className="text-sm text-muted-foreground text-center">
          Tap to add a glass{onRemove ? " -- long press to remove" : ""}
        </p>
      </CardContent>
    </Card>
  );
}
