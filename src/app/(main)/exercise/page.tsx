"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EXERCISE_DATABASE,
  estimateCalories,
  type ExerciseItem,
} from "@/lib/exercise-database";
import type { ExerciseEntry } from "@/lib/types";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Flame,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  Heart,
  Footprints,
  StretchHorizontal,
  Target,
} from "lucide-react";

const CATEGORY_CONFIG = {
  cardio: { label: "Cardio", icon: Footprints, color: "text-red-500" },
  strength: { label: "Strength", icon: Dumbbell, color: "text-blue-500" },
  flexibility: { label: "Flexibility", icon: StretchHorizontal, color: "text-purple-500" },
  balance: { label: "Balance", icon: Target, color: "text-amber-500" },
} as const;

export default function ExercisePage() {
  const todayDate = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);

  const exerciseLogs = useStore((s) => s.exerciseLogs);
  const addExercise = useStore((s) => s.addExercise);
  const removeExercise = useStore((s) => s.removeExercise);

  const todayExercises = exerciseLogs[todayDate] ?? [];
  const todayTotalCals = todayExercises.reduce((s, e) => s + e.caloriesBurned, 0);
  const todayTotalMins = todayExercises.reduce((s, e) => s + e.durationMinutes, 0);

  // Add form state
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
  const [duration, setDuration] = useState(30);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [showLibrary, setShowLibrary] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredExercises = useMemo(() => {
    if (categoryFilter === "all") return EXERCISE_DATABASE;
    return EXERCISE_DATABASE.filter((e) => e.category === categoryFilter);
  }, [categoryFilter]);

  const handleSelectExercise = (exercise: ExerciseItem) => {
    setSelectedExercise(exercise);
    setDuration(exercise.defaultDuration);
    setSets(exercise.defaultSets ?? 3);
    setReps(exercise.defaultReps ?? 10);
    setShowLibrary(false);
  };

  const handleLogExercise = () => {
    if (!selectedExercise) return;

    const caloriesBurned = estimateCalories(
      selectedExercise.caloriesPer30Min,
      duration
    );

    const entry: Omit<ExerciseEntry, "id"> = {
      date: todayDate,
      exerciseType: selectedExercise.category,
      name: selectedExercise.name,
      durationMinutes: duration,
      caloriesBurned,
      intensity: selectedExercise.intensity,
      sets: selectedExercise.defaultSets ? sets : undefined,
      reps: selectedExercise.defaultReps ? reps : undefined,
    };

    addExercise(entry);
    toast.success(`${selectedExercise.name} logged! (${caloriesBurned} kcal burned)`);
    setSelectedExercise(null);
    setShowLibrary(true);
  };

  const handleRemove = (exerciseId: string) => {
    removeExercise(todayDate, exerciseId);
    toast.success("Exercise removed");
  };

  return (
    <div>
      <PageHeader title="Exercise" subtitle="Track your workouts" />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Today's Summary */}
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Today&apos;s Activity</div>
                <div className="text-2xl font-bold">
                  {todayTotalCals}{" "}
                  <span className="text-base font-normal text-muted-foreground">kcal burned</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {todayTotalMins} min
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="h-4 w-4" />
                  {todayExercises.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Logged Exercises */}
        {todayExercises.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Today&apos;s Exercises</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayExercises.map((ex) => {
                const catConfig = CATEGORY_CONFIG[ex.exerciseType];
                const Icon = catConfig.icon;
                return (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-full flex items-center justify-center bg-muted", catConfig.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{ex.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {ex.durationMinutes} min
                          {ex.sets && ex.reps ? ` · ${ex.sets}×${ex.reps}` : ""}
                          {" · "}
                          {ex.caloriesBurned} kcal
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemove(ex.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Selected Exercise Form */}
        {selectedExercise && !showLibrary && (
          <Card className="border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{selectedExercise.name}</span>
                <Badge variant="secondary">{selectedExercise.intensity}</Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {selectedExercise.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Duration (min)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={120}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value) || 1)}
                  />
                </div>
                <div className="flex items-end">
                  <div className="rounded-lg bg-muted px-3 py-2 text-center w-full">
                    <div className="text-xs text-muted-foreground">Est. Burn</div>
                    <div className="font-bold text-lg text-orange-500">
                      {estimateCalories(selectedExercise.caloriesPer30Min, duration)} kcal
                    </div>
                  </div>
                </div>
              </div>

              {selectedExercise.defaultSets && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Sets</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={sets}
                      onChange={(e) => setSets(Number(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Reps</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={reps}
                      onChange={(e) => setReps(Number(e.target.value) || 1)}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleLogExercise}>
                  <Flame className="h-4 w-4 mr-2" />
                  Log Exercise
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedExercise(null);
                    setShowLibrary(true);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercise Library */}
        {showLibrary && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Exercise Library
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Category filter */}
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    categoryFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  All
                </button>
                {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((cat) => {
                  const cfg = CATEGORY_CONFIG[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                        categoryFilter === cat
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>

              {/* Exercise list */}
              <div className="space-y-1.5">
                {filteredExercises.map((exercise) => {
                  const catConfig = CATEGORY_CONFIG[exercise.category];
                  const Icon = catConfig.icon;
                  return (
                    <button
                      key={exercise.id}
                      onClick={() => handleSelectExercise(exercise)}
                      className="w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
                    >
                      <div className={cn("h-8 w-8 rounded-full flex items-center justify-center bg-muted", catConfig.color)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{exercise.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {exercise.description}
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground shrink-0">
                        <div className="font-mono">{exercise.caloriesPer30Min}</div>
                        <div>cal/30m</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Notice */}
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-start gap-2">
              <Heart className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                <strong>Safety:</strong> Stop if you feel chest pain, dizziness, or shortness of breath.
                Heart rate should stay in moderate zone (85-119 BPM). Consult physician before starting.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
