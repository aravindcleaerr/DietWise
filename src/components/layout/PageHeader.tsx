"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showDateNav?: boolean;
  selectedDate?: string;
  onPrevDate?: () => void;
  onNextDate?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  showDateNav,
  selectedDate,
  onPrevDate,
  onNextDate,
}: PageHeaderProps) {
  const isToday =
    selectedDate === format(new Date(), "yyyy-MM-dd");

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-md px-4 py-3">
      <div className="mx-auto max-w-lg">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {showDateNav && selectedDate && (
          <div className="mt-1 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onPrevDate}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {isToday
                ? "Today"
                : format(new Date(selectedDate + "T00:00:00"), "EEE, MMM d")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onNextDate}
              disabled={isToday}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
