"use client";

import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { FOOD_DATABASE, searchFoods } from "@/lib/food-database";
import { MEAL_TYPE_CONFIG } from "@/lib/types";
import type { MealType, FoodItem, LoggedFood } from "@/lib/types";
import { generateId } from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Star, Clock, ArrowLeft, Plus, Minus, PlusCircle, Camera } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";

function AddFoodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDate = useStore((s) => s.selectedDate);
  const addFoodToMeal = useStore((s) => s.addFoodToMeal);
  const addToRecent = useStore((s) => s.addToRecent);
  const favoriteFoodIds = useStore((s) => s.favoriteFoodIds);
  const recentFoodIds = useStore((s) => s.recentFoodIds);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const updateStreak = useStore((s) => s.updateStreak);
  const customFoods = useStore((s) => s.customFoods);
  const addCustomFood = useStore((s) => s.addCustomFood);

  const mealParam = searchParams.get("meal") as MealType | null;
  const dateParam = searchParams.get("date") || selectedDate;

  const [mealType, setMealType] = useState<MealType>(mealParam || "lunch");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "recent" | "favorites" | "custom">("all");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState(1);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: "", nameHindi: "", category: "other" as FoodItem["category"],
    servingSize: 100, servingUnit: "g",
    calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
  });

  const allFoods = useMemo(() => [...FOOD_DATABASE, ...customFoods], [customFoods]);

  const results = useMemo(() => {
    if (tab === "favorites") {
      return allFoods.filter((f) => favoriteFoodIds.includes(f.id));
    }
    if (tab === "recent") {
      return recentFoodIds
        .map((id) => allFoods.find((f) => f.id === id))
        .filter(Boolean) as FoodItem[];
    }
    if (tab === "custom") {
      return customFoods;
    }
    if (query.trim()) {
      return searchFoods(query, customFoods);
    }
    return allFoods.slice(0, 30);
  }, [query, tab, favoriteFoodIds, recentFoodIds, allFoods, customFoods]);

  const handleCreateCustomFood = () => {
    if (!customForm.name.trim()) {
      toast.error("Food name is required");
      return;
    }
    const newFood: FoodItem = {
      id: `custom_${generateId()}`,
      name: customForm.name,
      nameHindi: customForm.nameHindi || undefined,
      category: customForm.category,
      servingSize: customForm.servingSize,
      servingUnit: customForm.servingUnit,
      nutrition: {
        calories: customForm.calories,
        protein: customForm.protein,
        carbs: customForm.carbs,
        fat: customForm.fat,
        fiber: customForm.fiber,
      },
      isVegetarian: true,
      isCustom: true,
    };
    addCustomFood(newFood);
    setShowCustomForm(false);
    setSelectedFood(newFood);
    setCustomForm({ name: "", nameHindi: "", category: "other", servingSize: 100, servingUnit: "g", calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    toast.success("Custom food created!");
  };

  const handleAddFood = () => {
    if (!selectedFood) return;

    const loggedFood: LoggedFood = {
      id: generateId(),
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      servings,
      servingUnit: selectedFood.servingUnit,
      nutrition: {
        calories: Math.round(selectedFood.nutrition.calories * servings),
        protein: Math.round(selectedFood.nutrition.protein * servings * 10) / 10,
        carbs: Math.round(selectedFood.nutrition.carbs * servings * 10) / 10,
        fat: Math.round(selectedFood.nutrition.fat * servings * 10) / 10,
        fiber: Math.round(selectedFood.nutrition.fiber * servings * 10) / 10,
      },
    };

    addFoodToMeal(dateParam, mealType, loggedFood);
    addToRecent(selectedFood.id);
    updateStreak(dateParam);

    toast.success(`Added ${selectedFood.name} to ${MEAL_TYPE_CONFIG[mealType].label}`);
    setSelectedFood(null);
    setServings(1);
    setQuery("");
  };

  // Detail view for selected food
  if (selectedFood) {
    const nutrition = selectedFood.nutrition;
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-md px-4 py-3">
          <div className="mx-auto max-w-lg flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setSelectedFood(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold">{selectedFood.name}</h1>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {Math.round(nutrition.calories * servings)}
                </div>
                <div className="text-muted-foreground">calories</div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-[#5C6BC0]/10 p-2">
                  <div className="font-bold" style={{ color: "#5C6BC0" }}>
                    {(nutrition.protein * servings).toFixed(1)}g
                  </div>
                  <div className="text-xs text-muted-foreground">Protein</div>
                </div>
                <div className="rounded-lg bg-[#FFA726]/10 p-2">
                  <div className="font-bold" style={{ color: "#FFA726" }}>
                    {(nutrition.carbs * servings).toFixed(1)}g
                  </div>
                  <div className="text-xs text-muted-foreground">Carbs</div>
                </div>
                <div className="rounded-lg bg-[#EF5350]/10 p-2">
                  <div className="font-bold" style={{ color: "#EF5350" }}>
                    {(nutrition.fat * servings).toFixed(1)}g
                  </div>
                  <div className="text-xs text-muted-foreground">Fat</div>
                </div>
              </div>

              {/* Serving Size */}
              <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                <span className="text-sm font-medium">Servings</span>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-bold min-w-[40px] text-center">
                    {servings}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setServings(servings + 0.5)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground text-center">
                {selectedFood.servingSize * servings} {selectedFood.servingUnit} per serving
              </div>

              {/* Meal Type Selector */}
              <div>
                <label className="text-sm font-medium mb-1 block">Add to meal</label>
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

              <Button className="w-full h-12 text-base" onClick={handleAddFood}>
                Add to {MEAL_TYPE_CONFIG[mealType].label}
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-md px-4 py-3">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold flex-1">Add Food</h1>
            <Link href="/photo-log">
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Camera className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {format(new Date(dateParam + "T00:00:00"), "EEE, MMM d")} &bull; {MEAL_TYPE_CONFIG[mealType].icon} {MEAL_TYPE_CONFIG[mealType].label}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search Indian foods..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              autoFocus
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-3">
        {/* Tabs */}
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {[
            { key: "all" as const, label: "All Foods" },
            { key: "recent" as const, label: "Recent", icon: Clock },
            { key: "favorites" as const, label: "Favorites", icon: Star },
            { key: "custom" as const, label: "My Foods", icon: PlusCircle },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setQuery(""); }}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors ${
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {t.icon && <t.icon className="h-3.5 w-3.5" />}
              {t.label}
            </button>
          ))}
        </div>

        {/* Create Custom Food Button */}
        {(tab === "custom" || (tab === "all" && query.trim() && results.length === 0)) && !showCustomForm && (
          <Button
            variant="outline"
            className="w-full mb-3 border-dashed"
            onClick={() => { setShowCustomForm(true); if (query.trim()) setCustomForm((f) => ({ ...f, name: query })); }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Custom Food
          </Button>
        )}

        {/* Custom Food Form */}
        {showCustomForm && (
          <Card className="mb-3">
            <CardContent className="pt-4 space-y-3">
              <h3 className="font-semibold text-sm">New Custom Food</h3>
              <div>
                <Label className="text-xs">Food Name *</Label>
                <Input value={customForm.name} onChange={(e) => setCustomForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 h-10" placeholder="e.g. Mom's Special Dal" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Serving Size</Label>
                  <Input type="number" value={customForm.servingSize} onChange={(e) => setCustomForm((f) => ({ ...f, servingSize: Number(e.target.value) || 0 }))} className="mt-1 h-10" />
                </div>
                <div>
                  <Label className="text-xs">Unit</Label>
                  <Input value={customForm.servingUnit} onChange={(e) => setCustomForm((f) => ({ ...f, servingUnit: e.target.value }))} className="mt-1 h-10" placeholder="g / ml / piece" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Calories *</Label>
                  <Input type="number" value={customForm.calories || ""} onChange={(e) => setCustomForm((f) => ({ ...f, calories: Number(e.target.value) || 0 }))} className="mt-1 h-10" />
                </div>
                <div>
                  <Label className="text-xs">Protein (g)</Label>
                  <Input type="number" value={customForm.protein || ""} onChange={(e) => setCustomForm((f) => ({ ...f, protein: Number(e.target.value) || 0 }))} className="mt-1 h-10" />
                </div>
                <div>
                  <Label className="text-xs">Carbs (g)</Label>
                  <Input type="number" value={customForm.carbs || ""} onChange={(e) => setCustomForm((f) => ({ ...f, carbs: Number(e.target.value) || 0 }))} className="mt-1 h-10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Fat (g)</Label>
                  <Input type="number" value={customForm.fat || ""} onChange={(e) => setCustomForm((f) => ({ ...f, fat: Number(e.target.value) || 0 }))} className="mt-1 h-10" />
                </div>
                <div>
                  <Label className="text-xs">Fiber (g)</Label>
                  <Input type="number" value={customForm.fiber || ""} onChange={(e) => setCustomForm((f) => ({ ...f, fiber: Number(e.target.value) || 0 }))} className="mt-1 h-10" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowCustomForm(false)}>Cancel</Button>
                <Button className="flex-1" onClick={handleCreateCustomFood}>Create Food</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="space-y-2">
          {results.length === 0 && !showCustomForm ? (
            <div className="text-center py-8 text-muted-foreground">
              {tab === "custom" ? "No custom foods yet. Create one above!" : "No foods found. Try a different search."}
            </div>
          ) : (
            results.map((food) => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="w-full text-left"
              >
                <Card className="hover:bg-accent/50 transition-colors">
                  <CardContent className="py-3 px-4 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{food.name}</span>
                        {food.isCustom && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Custom</Badge>
                        )}
                        {favoriteFoodIds.includes(food.id) && (
                          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {food.servingSize} {food.servingUnit}
                        {food.nameHindi && ` • ${food.nameHindi}`}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                      <div className="font-bold text-primary">
                        {food.nutrition.calories}
                      </div>
                      <div className="text-xs text-muted-foreground">cal</div>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))
          )}
        </div>

        {/* Quick Category Tags */}
        {tab === "all" && !query && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-2 text-muted-foreground">Browse by category</div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "breakfast", label: "Breakfast" },
                { key: "bread", label: "Rotis" },
                { key: "rice", label: "Rice" },
                { key: "dal", label: "Dal & Legumes" },
                { key: "sabzi", label: "Sabzi" },
                { key: "dairy", label: "Dairy" },
                { key: "fruit", label: "Fruits" },
                { key: "nuts_seeds", label: "Nuts & Seeds" },
                { key: "snack", label: "Snacks" },
                { key: "drink", label: "Drinks" },
                { key: "south_indian", label: "South Indian" },
                { key: "bengali", label: "Bengali" },
                { key: "gujarati", label: "Gujarati" },
                { key: "punjabi", label: "Punjabi" },
                { key: "rajasthani", label: "Rajasthani" },
              ].map((cat) => (
                <Badge
                  key={cat.key}
                  variant="secondary"
                  className="cursor-pointer text-sm py-1.5 px-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setQuery(cat.label)}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AddFoodPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <AddFoodContent />
    </Suspense>
  );
}
