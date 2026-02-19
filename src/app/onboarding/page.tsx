"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateBMI, getBMICategory, calculateDailyTargets } from "@/lib/calculations";
import type { UserProfile } from "@/lib/types";
import { Target, User, Activity, Salad } from "lucide-react";

const STEPS = ["goal", "personal", "activity", "summary"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const setProfile = useStore((s) => s.setProfile);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    age: 50,
    gender: "male" as const,
    heightCm: 170,
    weightKg: 94,
    activityLevel: "light" as UserProfile["activityLevel"],
    goalType: "weight_loss" as UserProfile["goalType"],
    targetWeightKg: 82,
    dietaryPreference: "vegetarian" as const,
  });

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const bmi = calculateBMI(form.weightKg, form.heightCm);
  const targets = calculateDailyTargets({
    ...form,
    isOnboarded: false,
  });

  const handleComplete = () => {
    setProfile({
      ...form,
      isOnboarded: true,
    });
    router.replace("/dashboard");
  };

  const canProceed = () => {
    if (step === 0) return !!form.goalType;
    if (step === 1) return form.name.length > 0 && form.age > 0 && form.heightCm > 0 && form.weightKg > 0;
    if (step === 2) return !!form.activityLevel;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary">DietWise</h1>
            <p className="text-muted-foreground mt-1">
              Your personal diet companion
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step
                    ? "w-8 bg-primary"
                    : i < step
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step 0: Goal */}
          {step === 0 && (
            <Card>
              <CardHeader className="text-center">
                <Target className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-xl">What&apos;s your goal?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { value: "weight_loss", label: "Lose Weight", desc: "Reduce body weight safely" },
                  { value: "maintenance", label: "Maintain Weight", desc: "Stay at current weight" },
                  { value: "weight_gain", label: "Gain Weight", desc: "Build muscle mass" },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => update("goalType", goal.value)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                      form.goalType === goal.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="font-semibold">{goal.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {goal.desc}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <Card>
              <CardHeader className="text-center">
                <User className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-xl">About you</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-base">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Enter your name"
                    className="mt-1 h-12 text-base"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="age" className="text-base">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={form.age}
                      onChange={(e) => update("age", parseInt(e.target.value) || 0)}
                      className="mt-1 h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-base">Gender</Label>
                    <Select
                      value={form.gender}
                      onValueChange={(v) => update("gender", v)}
                    >
                      <SelectTrigger className="mt-1 h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="height" className="text-base">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={form.heightCm}
                      onChange={(e) => update("heightCm", parseInt(e.target.value) || 0)}
                      className="mt-1 h-12 text-base"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-base">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={form.weightKg}
                      onChange={(e) => update("weightKg", parseFloat(e.target.value) || 0)}
                      className="mt-1 h-12 text-base"
                    />
                  </div>
                </div>
                {form.goalType === "weight_loss" && (
                  <div>
                    <Label htmlFor="target" className="text-base">Target Weight (kg)</Label>
                    <Input
                      id="target"
                      type="number"
                      value={form.targetWeightKg}
                      onChange={(e) => update("targetWeightKg", parseFloat(e.target.value) || 0)}
                      className="mt-1 h-12 text-base"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Activity Level */}
          {step === 2 && (
            <Card>
              <CardHeader className="text-center">
                <Activity className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-xl">Activity Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { value: "sedentary", label: "Sedentary", desc: "Desk job, very little exercise" },
                  { value: "light", label: "Lightly Active", desc: "Light walking 1-3 days/week" },
                  { value: "moderate", label: "Moderately Active", desc: "Exercise 3-5 days/week" },
                  { value: "active", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => update("activityLevel", level.value)}
                    className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                      form.activityLevel === level.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="font-semibold">{level.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {level.desc}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <Card>
              <CardHeader className="text-center">
                <Salad className="h-10 w-10 text-primary mx-auto mb-2" />
                <CardTitle className="text-xl">Your Personalized Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-2">
                  <div className="text-sm text-muted-foreground">
                    BMI: {bmi.toFixed(1)} ({getBMICategory(bmi)})
                  </div>
                  <div className="text-4xl font-bold text-primary mt-2">
                    {targets.calories}
                  </div>
                  <div className="text-muted-foreground">calories per day</div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-[#5C6BC0]/10 p-3 text-center">
                    <div className="text-lg font-bold" style={{ color: "#5C6BC0" }}>
                      {targets.protein}g
                    </div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                  <div className="rounded-lg bg-[#FFA726]/10 p-3 text-center">
                    <div className="text-lg font-bold" style={{ color: "#FFA726" }}>
                      {targets.carbs}g
                    </div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                  <div className="rounded-lg bg-[#EF5350]/10 p-3 text-center">
                    <div className="text-lg font-bold" style={{ color: "#EF5350" }}>
                      {targets.fat}g
                    </div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Fiber</span>
                    <span className="font-medium">{targets.fiber}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Daily Water</span>
                    <span className="font-medium">{(targets.waterMl / 1000).toFixed(1)}L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Goal</span>
                    <span className="font-medium">
                      {form.weightKg}kg → {form.targetWeightKg}kg
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Based on your profile, we recommend {targets.calories} calories/day
                  to safely reach your goal weight.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button
                variant="outline"
                className="flex-1 h-12 text-base"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button
                className="flex-1 h-12 text-base"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Next
              </Button>
            ) : (
              <Button
                className="flex-1 h-12 text-base"
                onClick={handleComplete}
              >
                Start Tracking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
