"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { FOOD_DATABASE, searchFoods } from "@/lib/food-database";
import { generateId } from "@/lib/calculations";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus, Minus, Trash2, BookOpen, ChefHat } from "lucide-react";
import { toast } from "sonner";
import type { FoodItem, NutritionInfo, CustomRecipe } from "@/lib/types";

export default function RecipesPage() {
  const recipes = useStore((s) => s.recipes);
  const addRecipe = useStore((s) => s.addRecipe);
  const removeRecipe = useStore((s) => s.removeRecipe);
  const customFoods = useStore((s) => s.customFoods);
  const addCustomFood = useStore((s) => s.addCustomFood);

  const [creating, setCreating] = useState(false);
  const [recipeName, setRecipeName] = useState("");
  const [recipeServings, setRecipeServings] = useState(1);
  const [ingredients, setIngredients] = useState<
    { foodId: string; foodName: string; servings: number; nutrition: NutritionInfo }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchFoods(searchQuery, customFoods).slice(0, 8);
  }, [searchQuery, customFoods]);

  const totalNutrition = useMemo((): NutritionInfo => {
    return ingredients.reduce(
      (sum, ing) => ({
        calories: sum.calories + ing.nutrition.calories,
        protein: sum.protein + ing.nutrition.protein,
        carbs: sum.carbs + ing.nutrition.carbs,
        fat: sum.fat + ing.nutrition.fat,
        fiber: sum.fiber + ing.nutrition.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );
  }, [ingredients]);

  const perServing = useMemo((): NutritionInfo => {
    const s = recipeServings || 1;
    return {
      calories: Math.round(totalNutrition.calories / s),
      protein: Math.round(totalNutrition.protein / s * 10) / 10,
      carbs: Math.round(totalNutrition.carbs / s * 10) / 10,
      fat: Math.round(totalNutrition.fat / s * 10) / 10,
      fiber: Math.round(totalNutrition.fiber / s * 10) / 10,
    };
  }, [totalNutrition, recipeServings]);

  const addIngredient = (food: FoodItem) => {
    setIngredients((prev) => [
      ...prev,
      {
        foodId: food.id,
        foodName: food.name,
        servings: 1,
        nutrition: { ...food.nutrition },
      },
    ]);
    setSearchQuery("");
  };

  const updateIngredientServings = (idx: number, servings: number) => {
    setIngredients((prev) =>
      prev.map((ing, i) => {
        if (i !== idx) return ing;
        const baseFood = [...FOOD_DATABASE, ...customFoods].find((f) => f.id === ing.foodId);
        if (!baseFood) return ing;
        return {
          ...ing,
          servings,
          nutrition: {
            calories: Math.round(baseFood.nutrition.calories * servings),
            protein: Math.round(baseFood.nutrition.protein * servings * 10) / 10,
            carbs: Math.round(baseFood.nutrition.carbs * servings * 10) / 10,
            fat: Math.round(baseFood.nutrition.fat * servings * 10) / 10,
            fiber: Math.round(baseFood.nutrition.fiber * servings * 10) / 10,
          },
        };
      })
    );
  };

  const handleSaveRecipe = () => {
    if (!recipeName.trim()) {
      toast.error("Recipe name is required");
      return;
    }
    if (ingredients.length === 0) {
      toast.error("Add at least one ingredient");
      return;
    }

    const recipe: CustomRecipe = {
      id: generateId(),
      name: recipeName,
      ingredients,
      totalNutrition,
      servings: recipeServings,
      createdAt: new Date().toISOString(),
    };
    addRecipe(recipe);

    // Also save as a custom food so it appears in food search
    addCustomFood({
      id: `recipe_${recipe.id}`,
      name: `${recipeName} (Recipe)`,
      category: "other",
      servingSize: 1,
      servingUnit: `serving (of ${recipeServings})`,
      nutrition: perServing,
      isVegetarian: true,
      isCustom: true,
    });

    setCreating(false);
    setRecipeName("");
    setRecipeServings(1);
    setIngredients([]);
    toast.success("Recipe saved! It's now available in food search.");
  };

  return (
    <div>
      <PageHeader title="Recipes" subtitle="Build & save custom recipes" />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {!creating ? (
          <>
            <Button className="w-full" onClick={() => setCreating(true)}>
              <ChefHat className="h-4 w-4 mr-2" />
              Create New Recipe
            </Button>

            {recipes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No recipes yet.</p>
                <p className="text-xs">Create recipes to quickly log homemade meals.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recipes.map((recipe) => (
                  <Card key={recipe.id}>
                    <CardContent className="pt-4 pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{recipe.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {recipe.ingredients.length} ingredients &bull; {recipe.servings} serving{recipe.servings > 1 ? "s" : ""}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => {
                            if (confirm("Delete this recipe?")) removeRecipe(recipe.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-3 text-center">
                        <div>
                          <div className="text-sm font-bold text-primary">
                            {Math.round(recipe.totalNutrition.calories / recipe.servings)}
                          </div>
                          <div className="text-[10px] text-muted-foreground">cal/serv</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold" style={{ color: "#5C6BC0" }}>
                            {(recipe.totalNutrition.protein / recipe.servings).toFixed(1)}g
                          </div>
                          <div className="text-[10px] text-muted-foreground">protein</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold" style={{ color: "#FFA726" }}>
                            {(recipe.totalNutrition.carbs / recipe.servings).toFixed(1)}g
                          </div>
                          <div className="text-[10px] text-muted-foreground">carbs</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold" style={{ color: "#EF5350" }}>
                            {(recipe.totalNutrition.fat / recipe.servings).toFixed(1)}g
                          </div>
                          <div className="text-[10px] text-muted-foreground">fat</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Recipe Creation Form */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">New Recipe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm">Recipe Name *</Label>
                  <Input
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    placeholder="e.g. Mom's Dal Makhani"
                    className="mt-1 h-11"
                  />
                </div>
                <div>
                  <Label className="text-sm">Total Servings</Label>
                  <Input
                    type="number"
                    value={recipeServings}
                    onChange={(e) => setRecipeServings(Math.max(1, Number(e.target.value) || 1))}
                    className="mt-1 h-11 w-24"
                    min={1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ingredient Search */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Add Ingredients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search foods..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
                {searchResults.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => addIngredient(food)}
                    className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-accent text-sm"
                  >
                    <span className="truncate">{food.name}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">{food.nutrition.calories} cal</span>
                      <Plus className="h-4 w-4 text-primary" />
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Current Ingredients */}
            {ingredients.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Ingredients ({ingredients.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {ingredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-muted">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{ing.foodName}</div>
                        <div className="text-xs text-muted-foreground">{ing.nutrition.calories} cal</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateIngredientServings(idx, Math.max(0.5, ing.servings - 0.5))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{ing.servings}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateIngredientServings(idx, ing.servings + 0.5)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => setIngredients((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="border-t pt-2 mt-2">
                    <div className="text-sm font-semibold mb-1">Per Serving Nutrition</div>
                    <div className="grid grid-cols-5 gap-2 text-center text-xs">
                      <div><div className="font-bold text-primary">{perServing.calories}</div>cal</div>
                      <div><div className="font-bold" style={{ color: "#5C6BC0" }}>{perServing.protein}g</div>protein</div>
                      <div><div className="font-bold" style={{ color: "#FFA726" }}>{perServing.carbs}g</div>carbs</div>
                      <div><div className="font-bold" style={{ color: "#EF5350" }}>{perServing.fat}g</div>fat</div>
                      <div><div className="font-bold">{perServing.fiber}g</div>fiber</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save / Cancel */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setCreating(false);
                  setIngredients([]);
                  setRecipeName("");
                }}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleSaveRecipe}>
                Save Recipe
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
