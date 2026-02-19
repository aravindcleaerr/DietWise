"use client";

import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateBMI, getBMICategory, calculateDailyTargets } from "@/lib/calculations";
import { useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  User,
  Target,
  Activity,
  Calculator,
  RotateCcw,
  Dumbbell,
  Sun,
  Moon,
  Monitor,
  Bell,
  BellOff,
  Download,
  Upload,
  HardDrive,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { UserProfile } from "@/lib/types";
import {
  loadReminderConfig,
  saveReminderConfig,
  requestNotificationPermission,
  hasNotificationSupport,
  startMealReminders,
  startWaterReminders,
  type ReminderConfig,
} from "@/lib/reminders";
import {
  exportFoodLogs,
  exportDailySummaries,
  exportWeightHistory,
  exportExerciseLogs,
} from "@/lib/export";
import { exportFullBackup, parseBackupFile, applyBackup } from "@/lib/backup";

export default function ProfilePage() {
  const profile = useStore((s) => s.profile);
  const setProfile = useStore((s) => s.setProfile);
  const dailyTargets = useStore((s) => s.dailyTargets);
  const weightHistory = useStore((s) => s.weightHistory);
  const currentStreak = useStore((s) => s.currentStreak);
  const dailyLogs = useStore((s) => s.dailyLogs);
  const exerciseLogs = useStore((s) => s.exerciseLogs);

  const { theme, setTheme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile || {} as UserProfile);
  const [reminders, setReminders] = useState<ReminderConfig>(() => loadReminderConfig());

  // Start/stop reminders when config changes
  useEffect(() => {
    if (!reminders.enabled) return;
    const cleanups: (() => void)[] = [];
    if (reminders.mealReminders) {
      cleanups.push(startMealReminders(reminders.mealTimes));
    }
    if (reminders.waterReminders) {
      cleanups.push(startWaterReminders(reminders.waterIntervalMinutes));
    }
    return () => cleanups.forEach((fn) => fn());
  }, [reminders]);

  const toggleReminders = useCallback(async (enabled: boolean) => {
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        toast.error("Notification permission denied. Enable it in browser settings.");
        return;
      }
    }
    const updated = { ...reminders, enabled };
    setReminders(updated);
    saveReminderConfig(updated);
    toast.success(enabled ? "Reminders enabled!" : "Reminders disabled");
  }, [reminders]);

  const updateReminder = useCallback((partial: Partial<ReminderConfig>) => {
    setReminders((prev) => {
      const updated = { ...prev, ...partial };
      saveReminderConfig(updated);
      return updated;
    });
  }, []);

  const currentWeight = weightHistory.length > 0
    ? weightHistory[weightHistory.length - 1].weightKg
    : profile?.weightKg || 94;

  const bmi = calculateBMI(currentWeight, profile?.heightCm || 170);

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setProfile({ ...form, isOnboarded: true });
    setEditing(false);
    toast.success("Profile updated!");
  };

  if (!profile) return null;

  return (
    <div>
      <PageHeader title="Profile" subtitle="Your settings & goals" />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {profile.age} years old &bull; {profile.heightCm} cm &bull; {currentWeight} kg
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">BMI</span>
              </div>
              <div className="text-xl font-bold">{bmi.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">{getBMICategory(bmi)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Streak</span>
              </div>
              <div className="text-xl font-bold">{currentStreak} days</div>
              <div className="text-xs text-muted-foreground">Current streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Targets */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Daily Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "Calories", value: `${dailyTargets.calories} kcal` },
              { label: "Protein", value: `${dailyTargets.protein}g` },
              { label: "Carbs", value: `${dailyTargets.carbs}g` },
              { label: "Fat", value: `${dailyTargets.fat}g` },
              { label: "Fiber", value: `${dailyTargets.fiber}g` },
              { label: "Water", value: `${(dailyTargets.waterMl / 1000).toFixed(1)}L` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-1">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Edit Profile
              </CardTitle>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => { setForm(profile); setEditing(true); }}>
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          {editing && (
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm">Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="mt-1 h-11"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Age</Label>
                  <Input
                    type="number"
                    value={form.age}
                    onChange={(e) => update("age", parseInt(e.target.value) || 0)}
                    className="mt-1 h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm">Height (cm)</Label>
                  <Input
                    type="number"
                    value={form.heightCm}
                    onChange={(e) => update("heightCm", parseInt(e.target.value) || 0)}
                    className="mt-1 h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">Current Weight (kg)</Label>
                  <Input
                    type="number"
                    value={form.weightKg}
                    onChange={(e) => update("weightKg", parseFloat(e.target.value) || 0)}
                    className="mt-1 h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm">Target Weight (kg)</Label>
                  <Input
                    type="number"
                    value={form.targetWeightKg}
                    onChange={(e) => update("targetWeightKg", parseFloat(e.target.value) || 0)}
                    className="mt-1 h-11"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm">Activity Level</Label>
                <Select
                  value={form.activityLevel}
                  onValueChange={(v) => update("activityLevel", v)}
                >
                  <SelectTrigger className="mt-1 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Lightly Active</SelectItem>
                    <SelectItem value="moderate">Moderately Active</SelectItem>
                    <SelectItem value="active">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[
                { value: "light", label: "Light", Icon: Sun },
                { value: "dark", label: "Dark", Icon: Moon },
                { value: "system", label: "System", Icon: Monitor },
              ].map(({ value, label, Icon }) => (
                <Button
                  key={value}
                  variant={theme === value ? "default" : "outline"}
                  className="flex-1"
                  size="sm"
                  onClick={() => setTheme(value)}
                >
                  <Icon className="h-4 w-4 mr-1.5" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              {reminders.enabled ? (
                <Bell className="h-4 w-4" />
              ) : (
                <BellOff className="h-4 w-4" />
              )}
              Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Enable reminders</Label>
              <Switch
                checked={reminders.enabled}
                onCheckedChange={toggleReminders}
                disabled={!hasNotificationSupport()}
              />
            </div>
            {!hasNotificationSupport() && (
              <p className="text-xs text-muted-foreground">
                Notifications are not supported in this browser.
              </p>
            )}
            {reminders.enabled && (
              <>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Meal reminders</Label>
                  <Switch
                    checked={reminders.mealReminders}
                    onCheckedChange={(v) => updateReminder({ mealReminders: v })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Water reminders</Label>
                  <Switch
                    checked={reminders.waterReminders}
                    onCheckedChange={(v) => updateReminder({ waterReminders: v })}
                  />
                </div>
                {reminders.waterReminders && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Remind every
                    </Label>
                    <Select
                      value={String(reminders.waterIntervalMinutes)}
                      onValueChange={(v) =>
                        updateReminder({ waterIntervalMinutes: Number(v) })
                      }
                    >
                      <SelectTrigger className="mt-1 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportFoodLogs(dailyLogs);
                  toast.success("Food logs exported!");
                }}
              >
                Food Logs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportDailySummaries(dailyLogs);
                  toast.success("Daily summaries exported!");
                }}
              >
                Daily Summary
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportWeightHistory(weightHistory);
                  toast.success("Weight history exported!");
                }}
              >
                Weight History
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  exportExerciseLogs(exerciseLogs);
                  toast.success("Exercise logs exported!");
                }}
              >
                Exercise Logs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup & Restore */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Backup &amp; Restore
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              onClick={() => {
                exportFullBackup();
                toast.success("Backup downloaded!");
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Full Backup (JSON)
            </Button>
            <div>
              <input
                type="file"
                accept=".json"
                id="backup-file"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const result = await parseBackupFile(file);
                  if (result.success) {
                    if (confirm("This will replace ALL your current data. Continue?")) {
                      applyBackup(result.state);
                    }
                  } else {
                    toast.error(result.error);
                  }
                  e.target.value = "";
                }}
              />
              <Button
                variant="outline"
                className="w-full"
                size="sm"
                onClick={() => document.getElementById("backup-file")?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Restore from Backup
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Backup saves all your data as a JSON file. Use it to transfer data between devices.
            </p>
          </CardContent>
        </Card>

        {/* Reset */}
        <Card>
          <CardContent className="pt-4">
            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => {
                if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
                  localStorage.removeItem("dietwise-storage");
                  window.location.href = "/onboarding";
                }
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All Data
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
