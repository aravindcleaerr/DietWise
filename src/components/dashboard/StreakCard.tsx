"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  const isNewRecord = currentStreak > 0 && currentStreak >= longestStreak;

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="flex items-center gap-4 py-5">
        {/* Fire icon */}
        <div
          className={`
            flex items-center justify-center
            w-16 h-16 sm:w-20 sm:h-20 rounded-2xl
            ${currentStreak > 0 ? "bg-orange-100" : "bg-muted"}
            shrink-0
          `}
        >
          <Flame
            className={`
              size-9 sm:size-11
              ${currentStreak > 0 ? "text-orange-500" : "text-muted-foreground"}
            `}
            fill={currentStreak > 0 ? "currentColor" : "none"}
          />
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl sm:text-4xl font-extrabold text-orange-600 tabular-nums">
              {currentStreak}
            </span>
            <span className="text-lg sm:text-xl font-semibold text-foreground">
              day{currentStreak !== 1 ? "s" : ""} streak!
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Trophy className="size-4 text-amber-500" />
            <span className="text-base">
              Longest: <strong className="text-foreground">{longestStreak}</strong>{" "}
              day{longestStreak !== 1 ? "s" : ""}
            </span>
          </div>

          {isNewRecord && (
            <span className="text-sm font-semibold text-orange-500 mt-0.5">
              New personal record!
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
