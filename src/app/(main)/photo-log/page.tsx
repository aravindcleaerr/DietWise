"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { useStore } from "@/lib/store";
import { FOOD_DATABASE, searchFoods } from "@/lib/food-database";
import { generateId } from "@/lib/calculations";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Upload, Search, ArrowLeft, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MEAL_TYPE_CONFIG } from "@/lib/types";
import type { MealType, FoodItem, LoggedFood } from "@/lib/types";

// Simple keyword extraction from common Indian food visual descriptions
const VISUAL_FOOD_KEYWORDS: Record<string, string[]> = {
  roti: ["bread_roti", "bread_phulka", "bread_roti_ghee"],
  paratha: ["bread_paratha_plain", "bread_paratha_aloo", "pj_gobhi_paratha", "pj_paneer_paratha"],
  rice: ["rice_white", "rice_brown", "rice_jeera", "rice_pulao"],
  dal: ["dal_moong", "dal_toor", "dal_masoor", "dal_tadka"],
  sabzi: ["sabzi_mixed_veg", "sabzi_aloo_gobi", "sabzi_palak"],
  paneer: ["dairy_paneer", "sabzi_palak_paneer", "pj_paneer_tikka", "sabzi_kadai_paneer"],
  idli: ["breakfast_idli"],
  dosa: ["breakfast_dosa", "breakfast_masala_dosa", "si_rava_dosa"],
  sambar: ["dal_sambhar"],
  curry: ["sabzi_mixed_veg", "sabzi_aloo_matar", "pj_kadhi_pakora"],
  curd: ["dairy_curd", "dairy_lowfat_curd"],
  salad: ["other_salad"],
  fruit: ["fruit_apple", "fruit_banana", "fruit_papaya", "fruit_orange"],
  milk: ["dairy_whole_milk", "dairy_toned_milk"],
  tea: ["drink_masala_chai", "drink_chai_sugar", "drink_green_tea"],
  coffee: ["drink_coffee_milk", "drink_black_coffee"],
};

export default function PhotoLogPage() {
  const selectedDate = useStore((s) => s.selectedDate);
  const addFoodToMeal = useStore((s) => s.addFoodToMeal);
  const addToRecent = useStore((s) => s.addToRecent);
  const updateStreak = useStore((s) => s.updateStreak);
  const customFoods = useStore((s) => s.customFoods);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<FoodItem[]>([]);
  const [step, setStep] = useState<"capture" | "identify">("capture");
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const searchResults = useMemo(() => {
    if (!query.trim()) return suggestions;
    return searchFoods(query, customFoods).slice(0, 10);
  }, [query, suggestions, customFoods]);

  const handlePhoto = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    setStep("identify");

    // Generate smart suggestions based on meal type and common foods
    const mealSuggestionIds: string[] = [];

    // Add contextual suggestions based on meal type
    if (mealType === "breakfast" || mealType === "pre_breakfast") {
      mealSuggestionIds.push("breakfast_poha", "breakfast_idli", "breakfast_dosa", "breakfast_oats_porridge", "bread_roti", "drink_masala_chai");
    } else if (mealType === "lunch" || mealType === "dinner") {
      mealSuggestionIds.push("bread_roti", "rice_white", "dal_toor", "sabzi_mixed_veg", "dairy_curd", "other_salad");
    } else if (mealType === "evening_snack" || mealType === "mid_morning") {
      mealSuggestionIds.push("drink_green_tea", "fruit_apple", "nuts_almonds", "snack_roasted_chana", "dairy_buttermilk");
    }

    const allFoods = [...FOOD_DATABASE, ...customFoods];
    const suggested = mealSuggestionIds
      .map((id) => allFoods.find((f) => f.id === id))
      .filter(Boolean) as FoodItem[];
    setSuggestions(suggested);
  }, [mealType, customFoods]);

  const handleAddFood = (food: FoodItem) => {
    const loggedFood: LoggedFood = {
      id: generateId(),
      foodId: food.id,
      foodName: food.name,
      servings: 1,
      servingUnit: food.servingUnit,
      nutrition: { ...food.nutrition },
    };

    addFoodToMeal(selectedDate, mealType, loggedFood);
    addToRecent(food.id);
    updateStreak(selectedDate);
    toast.success(`Added ${food.name}`);
  };

  return (
    <div>
      <PageHeader title="Photo Food Log" subtitle="Snap a photo to log your meal" />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {step === "capture" ? (
          <>
            {/* Meal Type Selector */}
            <div>
              <label className="text-sm font-medium mb-1 block">Meal Type</label>
              <Select value={mealType} onValueChange={(v) => setMealType(v as MealType)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(MEAL_TYPE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.icon} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Camera Capture */}
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center space-y-4">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground/40" />
                <p className="text-muted-foreground text-sm">
                  Take a photo of your meal and we&apos;ll help you identify the foods
                </p>

                <div className="flex gap-2 justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={cameraRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhoto(file);
                    }}
                  />
                  <Button onClick={() => cameraRef.current?.click()}>
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhoto(file);
                    }}
                  />
                  <Button variant="outline" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Gallery
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Keyword Suggestions */}
            <Card>
              <CardContent className="pt-4 pb-3">
                <h3 className="text-sm font-semibold mb-2">Quick Add by Category</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(VISUAL_FOOD_KEYWORDS).map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer text-sm py-1.5 px-3 capitalize hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => {
                        setStep("identify");
                        const allFoods = [...FOOD_DATABASE, ...customFoods];
                        const ids = VISUAL_FOOD_KEYWORDS[keyword];
                        const items = ids.map((id) => allFoods.find((f) => f.id === id)).filter(Boolean) as FoodItem[];
                        setSuggestions(items);
                        setQuery(keyword);
                      }}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Photo Preview + Food Selection */}
            <Button variant="ghost" onClick={() => { setStep("capture"); setPhotoUrl(null); setSuggestions([]); setQuery(""); }}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {photoUrl && (
              <div className="rounded-xl overflow-hidden border aspect-video bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Meal photo" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search and add foods from your photo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-11"
                autoFocus
              />
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && !query.trim() && (
              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-primary">Smart Suggestions for {MEAL_TYPE_CONFIG[mealType].label}</span>
                </div>
                <div className="space-y-1">
                  {suggestions.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleAddFood(food)}
                      className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-accent border"
                    >
                      <span className="text-sm font-medium truncate">{food.name}</span>
                      <span className="text-xs text-primary font-medium">{food.nutrition.calories} cal — Tap to add</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query.trim() && (
              <div className="space-y-1">
                {searchResults.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground text-sm">No foods found</p>
                ) : (
                  searchResults.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => handleAddFood(food)}
                      className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-accent border"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium truncate block">{food.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {food.servingSize} {food.servingUnit}
                        </span>
                      </div>
                      <span className="text-xs text-primary font-medium ml-2">{food.nutrition.calories} cal</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
