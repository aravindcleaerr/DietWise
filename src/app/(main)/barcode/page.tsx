"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { MEAL_TYPE_CONFIG } from "@/lib/types";
import type { MealType, LoggedFood, NutritionInfo } from "@/lib/types";
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
import { PageHeader } from "@/components/layout/PageHeader";
import {
  ScanBarcode,
  Camera,
  CameraOff,
  Search,
  ArrowLeft,
  Plus,
  Minus,
  Loader2,
  AlertTriangle,
  PackageOpen,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types for OpenFoodFacts API response
// ---------------------------------------------------------------------------

interface ProductNutriments {
  "energy-kcal_100g"?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
  fiber_100g?: number;
}

interface OpenFoodFactsProduct {
  product_name?: string;
  brands?: string;
  serving_size?: string;
  serving_quantity?: number;
  nutriments?: ProductNutriments;
  image_front_small_url?: string;
  categories_tags?: string[];
}

interface OpenFoodFactsResponse {
  status: number; // 1 = found, 0 = not found
  product?: OpenFoodFactsProduct;
}

// Parsed product data we use in the UI
interface ParsedProduct {
  name: string;
  brand: string;
  servingSize: string;
  servingGrams: number;
  imageUrl: string;
  nutritionPer100g: NutritionInfo;
  nutritionPerServing: NutritionInfo;
  barcode: string;
}

// Page states
type PageState = "scanner" | "loading" | "result" | "not_found";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseServingGrams(servingSize?: string, servingQuantity?: number): number {
  if (servingQuantity && servingQuantity > 0) return servingQuantity;
  if (!servingSize) return 100;
  // Try to extract numeric value from serving size string (e.g., "30g", "250 ml")
  const match = servingSize.match(/(\d+(?:\.\d+)?)/);
  if (match) return parseFloat(match[1]);
  return 100;
}

function scaleNutritionFromPer100g(per100g: NutritionInfo, grams: number): NutritionInfo {
  const factor = grams / 100;
  return {
    calories: Math.round(per100g.calories * factor),
    protein: Math.round(per100g.protein * factor * 10) / 10,
    carbs: Math.round(per100g.carbs * factor * 10) / 10,
    fat: Math.round(per100g.fat * factor * 10) / 10,
    fiber: Math.round(per100g.fiber * factor * 10) / 10,
  };
}

// ---------------------------------------------------------------------------
// BarcodeDetector type declaration (not in standard TS lib)
// ---------------------------------------------------------------------------

declare class BarcodeDetector {
  constructor(options?: { formats: string[] });
  detect(source: HTMLVideoElement | HTMLImageElement | ImageBitmap): Promise<
    Array<{ rawValue: string; format: string }>
  >;
  static getSupportedFormats(): Promise<string[]>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BarcodeScannerPage() {
  const router = useRouter();
  const selectedDate = useStore((s) => s.selectedDate);
  const addFoodToMeal = useStore((s) => s.addFoodToMeal);
  const addToRecent = useStore((s) => s.addToRecent);
  const updateStreak = useStore((s) => s.updateStreak);

  // State
  const [pageState, setPageState] = useState<PageState>("scanner");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [detectedBarcode, setDetectedBarcode] = useState("");
  const [product, setProduct] = useState<ParsedProduct | null>(null);
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [errorMessage, setErrorMessage] = useState("");

  // Camera state
  const [cameraSupported, setCameraSupported] = useState<boolean | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<BarcodeDetector | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // -------------------------------------------------------------------------
  // Check BarcodeDetector support on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    setCameraSupported("BarcodeDetector" in window);
  }, []);

  // -------------------------------------------------------------------------
  // Stop camera utility
  // -------------------------------------------------------------------------
  const stopCamera = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // -------------------------------------------------------------------------
  // Start camera & barcode scanning
  // -------------------------------------------------------------------------
  const startCamera = useCallback(async () => {
    if (!("BarcodeDetector" in window)) {
      setCameraError("BarcodeDetector API is not available in this browser.");
      return;
    }

    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);

      // Create BarcodeDetector instance
      detectorRef.current = new BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e", "code_128", "code_39"],
      });

      // Periodically scan the video feed for barcodes
      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || !detectorRef.current) return;
        if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) return;

        try {
          const barcodes = await detectorRef.current.detect(videoRef.current);
          if (barcodes.length > 0) {
            const code = barcodes[0].rawValue;
            if (code) {
              // Barcode found - stop scanning and look up
              stopCamera();
              setDetectedBarcode(code);
              setBarcodeInput(code);
              lookupBarcode(code);
            }
          }
        } catch {
          // Detection can fail on some frames, ignore
        }
      }, 500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to access camera";
      setCameraError(
        message.includes("NotAllowed") || message.includes("Permission")
          ? "Camera access was denied. Please allow camera permissions and try again."
          : `Could not start camera: ${message}`
      );
      setCameraActive(false);
    }
  }, [stopCamera]);

  // -------------------------------------------------------------------------
  // OpenFoodFacts API lookup
  // -------------------------------------------------------------------------
  const lookupBarcode = async (barcode: string) => {
    const trimmed = barcode.trim();
    if (!trimmed) {
      toast.error("Please enter a barcode number");
      return;
    }

    setPageState("loading");
    setErrorMessage("");
    setDetectedBarcode(trimmed);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${trimmed}.json`
      );

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data: OpenFoodFactsResponse = await response.json();

      if (data.status !== 1 || !data.product) {
        setPageState("not_found");
        return;
      }

      const p = data.product;
      const nutriments = p.nutriments || {};
      const servingGrams = parseServingGrams(p.serving_size, p.serving_quantity);

      const nutritionPer100g: NutritionInfo = {
        calories: Math.round(nutriments["energy-kcal_100g"] || 0),
        protein: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
        carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
        fat: Math.round((nutriments.fat_100g || 0) * 10) / 10,
        fiber: Math.round((nutriments.fiber_100g || 0) * 10) / 10,
      };

      const parsed: ParsedProduct = {
        name: p.product_name || "Unknown Product",
        brand: p.brands || "",
        servingSize: p.serving_size || `${servingGrams}g`,
        servingGrams,
        imageUrl: p.image_front_small_url || "",
        nutritionPer100g,
        nutritionPerServing: scaleNutritionFromPer100g(nutritionPer100g, servingGrams),
        barcode: trimmed,
      };

      setProduct(parsed);
      setServings(1);
      setPageState("result");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      setErrorMessage(`Failed to look up product: ${message}`);
      setPageState("not_found");
    }
  };

  // -------------------------------------------------------------------------
  // Handle manual lookup
  // -------------------------------------------------------------------------
  const handleManualLookup = () => {
    stopCamera();
    lookupBarcode(barcodeInput);
  };

  // -------------------------------------------------------------------------
  // Add product to food log
  // -------------------------------------------------------------------------
  const handleAddToLog = () => {
    if (!product) return;

    const scaledNutrition = scaleNutritionFromPer100g(
      product.nutritionPer100g,
      product.servingGrams * servings
    );

    const loggedFood: LoggedFood = {
      id: generateId(),
      foodId: `barcode_${product.barcode}`,
      foodName: product.name,
      servings,
      servingUnit: product.servingSize,
      nutrition: scaledNutrition,
    };

    addFoodToMeal(selectedDate, mealType, loggedFood);
    addToRecent(`barcode_${product.barcode}`);
    updateStreak(selectedDate);

    toast.success(
      `Added ${product.name} to ${MEAL_TYPE_CONFIG[mealType].label}`
    );

    // Reset to scanner
    setProduct(null);
    setPageState("scanner");
    setBarcodeInput("");
    setDetectedBarcode("");
    setServings(1);
  };

  // -------------------------------------------------------------------------
  // Reset to scanner
  // -------------------------------------------------------------------------
  const handleScanAnother = () => {
    stopCamera();
    setProduct(null);
    setPageState("scanner");
    setBarcodeInput("");
    setDetectedBarcode("");
    setErrorMessage("");
    setServings(1);
  };

  // -------------------------------------------------------------------------
  // Render: Loading state
  // -------------------------------------------------------------------------
  if (pageState === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Barcode Scanner" subtitle="Looking up product..." />
        <main className="mx-auto max-w-lg px-4 py-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-4 py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <p className="font-medium text-lg">Looking up barcode</p>
                <p className="text-muted-foreground text-sm mt-1">
                  {detectedBarcode}
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  Searching OpenFoodFacts database...
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Not Found state
  // -------------------------------------------------------------------------
  if (pageState === "not_found") {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="Barcode Scanner" subtitle="Product not found" />
        <main className="mx-auto max-w-lg px-4 py-8">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center gap-4 py-8">
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-4">
                <PackageOpen className="h-10 w-10 text-orange-500" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">Product Not Found</p>
                <p className="text-muted-foreground text-sm mt-1">
                  Barcode <span className="font-mono font-medium">{detectedBarcode}</span> was
                  not found in the OpenFoodFacts database.
                </p>
                {errorMessage && (
                  <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                )}
              </div>

              <div className="w-full space-y-2 mt-2">
                <Link href="/add" className="block">
                  <Button variant="outline" className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Create a Custom Food Instead
                  </Button>
                </Link>
                <Button
                  className="w-full gap-2"
                  onClick={handleScanAnother}
                >
                  <ScanBarcode className="h-4 w-4" />
                  Scan Another Barcode
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Result state
  // -------------------------------------------------------------------------
  if (pageState === "result" && product) {
    const currentNutrition = scaleNutritionFromPer100g(
      product.nutritionPer100g,
      product.servingGrams * servings
    );

    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-md px-4 py-3">
          <div className="mx-auto max-w-lg flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleScanAnother}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold truncate">{product.name}</h1>
              {product.brand && (
                <p className="text-xs text-muted-foreground truncate">
                  {product.brand}
                </p>
              )}
            </div>
            <Badge variant="secondary" className="text-xs font-mono flex-shrink-0">
              {product.barcode}
            </Badge>
          </div>
        </header>

        <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
          {/* Product Image + Info */}
          {product.imageUrl && (
            <div className="flex justify-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-32 w-32 object-contain rounded-lg bg-white"
              />
            </div>
          )}

          {/* Nutrition Card */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              {/* Calorie display */}
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {currentNutrition.calories}
                </div>
                <div className="text-muted-foreground text-sm">
                  calories
                </div>
              </div>

              {/* Macro breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="rounded-lg bg-[#5C6BC0]/10 p-2">
                  <div className="font-bold text-sm" style={{ color: "#5C6BC0" }}>
                    {currentNutrition.protein}g
                  </div>
                  <div className="text-[10px] text-muted-foreground">Protein</div>
                </div>
                <div className="rounded-lg bg-[#FFA726]/10 p-2">
                  <div className="font-bold text-sm" style={{ color: "#FFA726" }}>
                    {currentNutrition.carbs}g
                  </div>
                  <div className="text-[10px] text-muted-foreground">Carbs</div>
                </div>
                <div className="rounded-lg bg-[#EF5350]/10 p-2">
                  <div className="font-bold text-sm" style={{ color: "#EF5350" }}>
                    {currentNutrition.fat}g
                  </div>
                  <div className="text-[10px] text-muted-foreground">Fat</div>
                </div>
                <div className="rounded-lg bg-[#66BB6A]/10 p-2">
                  <div className="font-bold text-sm" style={{ color: "#66BB6A" }}>
                    {currentNutrition.fiber}g
                  </div>
                  <div className="text-[10px] text-muted-foreground">Fiber</div>
                </div>
              </div>

              {/* Serving Adjuster */}
              <div className="flex items-center justify-between bg-muted rounded-lg p-3">
                <div>
                  <span className="text-sm font-medium">Servings</span>
                  <p className="text-xs text-muted-foreground">
                    {product.servingSize} each
                  </p>
                </div>
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

              {/* Meal Type Selector */}
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Add to meal
                </label>
                <Select
                  value={mealType}
                  onValueChange={(v) => setMealType(v as MealType)}
                >
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

              {/* Add Button */}
              <Button className="w-full h-12 text-base" onClick={handleAddToLog}>
                Add to {MEAL_TYPE_CONFIG[mealType].label}
              </Button>
            </CardContent>
          </Card>

          {/* Nutrition per 100g reference */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Nutrition per 100g (reference)
              </p>
              <div className="grid grid-cols-5 gap-1 text-center text-xs">
                <div>
                  <div className="font-semibold">{product.nutritionPer100g.calories}</div>
                  <div className="text-muted-foreground">kcal</div>
                </div>
                <div>
                  <div className="font-semibold">{product.nutritionPer100g.protein}g</div>
                  <div className="text-muted-foreground">protein</div>
                </div>
                <div>
                  <div className="font-semibold">{product.nutritionPer100g.carbs}g</div>
                  <div className="text-muted-foreground">carbs</div>
                </div>
                <div>
                  <div className="font-semibold">{product.nutritionPer100g.fat}g</div>
                  <div className="text-muted-foreground">fat</div>
                </div>
                <div>
                  <div className="font-semibold">{product.nutritionPer100g.fiber}g</div>
                  <div className="text-muted-foreground">fiber</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Render: Scanner state (default)
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Barcode Scanner"
        subtitle="Scan or enter a barcode to look up nutrition info"
      />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Manual Barcode Entry */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <ScanBarcode className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Enter Barcode</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Type the barcode number from the product packaging.
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="e.g. 8901058851854"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleManualLookup();
                }}
                className="h-12 text-base font-mono"
              />
              <Button
                className="h-12 px-6"
                onClick={handleManualLookup}
                disabled={!barcodeInput.trim()}
              >
                <Search className="h-4 w-4 mr-2" />
                Look Up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Camera Scanner */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Camera className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Camera Scanner</h2>
            </div>

            {cameraSupported === null ? (
              // Still checking support
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking camera support...
              </div>
            ) : !cameraSupported ? (
              // Not supported
              <div className="flex items-start gap-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4">
                <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                    Not Supported
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                    Camera barcode scanning is not supported in this browser.
                    Please enter the barcode manually using the field above.
                  </p>
                </div>
              </div>
            ) : (
              // Supported
              <>
                <p className="text-sm text-muted-foreground">
                  Point your camera at a product barcode to scan it automatically.
                </p>

                {/* Camera Preview */}
                {cameraActive && (
                  <div className="relative overflow-hidden rounded-xl border-2 border-primary/30 bg-black aspect-video">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                    {/* Scan overlay guide */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-3/4 h-1/3 border-2 border-white/60 rounded-lg">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-primary rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-primary rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-primary rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-primary rounded-br-lg" />
                      </div>
                    </div>
                    {/* Scanning indicator */}
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                      <Badge className="gap-1.5 bg-black/70 text-white border-0">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Scanning...
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Hidden video element when camera is not active */}
                {!cameraActive && (
                  <video ref={videoRef} className="hidden" playsInline muted />
                )}

                {/* Camera error */}
                {cameraError && (
                  <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                    <CameraOff className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {cameraError}
                    </p>
                  </div>
                )}

                {/* Camera toggle button */}
                <Button
                  variant={cameraActive ? "destructive" : "default"}
                  className="w-full h-12 gap-2"
                  onClick={() => {
                    if (cameraActive) {
                      stopCamera();
                    } else {
                      startCamera();
                    }
                  }}
                >
                  {cameraActive ? (
                    <>
                      <CameraOff className="h-4 w-4" />
                      Stop Camera
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4" />
                      Start Camera
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Tips</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Look for the barcode on the product packaging (usually on the back).</li>
              <li>EAN-13 barcodes (13 digits) are most common for food products.</li>
              <li>If scanning does not work, enter the number below the barcode manually.</li>
              <li>
                Data comes from{" "}
                <span className="font-medium">OpenFoodFacts</span>, an open
                food products database.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Back button */}
        <Button
          variant="ghost"
          className="w-full gap-2 text-muted-foreground"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </main>
    </div>
  );
}
