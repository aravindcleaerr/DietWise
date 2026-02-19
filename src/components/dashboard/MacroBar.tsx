"use client";

import { useMemo } from "react";

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

export function MacroBar({
  label,
  current,
  target,
  color,
  unit = "g",
}: MacroBarProps) {
  const percentage = useMemo(() => {
    if (target <= 0) return 0;
    return Math.min((current / target) * 100, 100);
  }, [current, target]);

  const isOver = current > target;

  return (
    <div className="flex items-center gap-3 w-full">
      {/* Label */}
      <span
        className="text-base font-semibold min-w-[80px] sm:min-w-[90px]"
        style={{ color }}
      >
        {label}
      </span>

      {/* Progress bar */}
      <div className="flex-1 h-3.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            opacity: isOver ? 0.85 : 1,
          }}
        />
      </div>

      {/* Value */}
      <span
        className={`text-base font-medium min-w-[90px] sm:min-w-[100px] text-right tabular-nums ${
          isOver ? "text-red-500 font-bold" : "text-muted-foreground"
        }`}
      >
        {Math.round(current)} / {Math.round(target)} {unit}
      </span>
    </div>
  );
}

// Convenience presets for common macro bars
export function ProteinBar({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  return (
    <MacroBar
      label="Protein"
      current={current}
      target={target}
      color="#5C6BC0"
    />
  );
}

export function CarbsBar({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  return (
    <MacroBar
      label="Carbs"
      current={current}
      target={target}
      color="#FFA726"
    />
  );
}

export function FatBar({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  return (
    <MacroBar label="Fat" current={current} target={target} color="#EF5350" />
  );
}

export function FiberBar({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  return (
    <MacroBar
      label="Fiber"
      current={current}
      target={target}
      color="#66BB6A"
    />
  );
}
