"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Flame, PartyPopper, Lightbulb } from "lucide-react";
import { FESTIVAL_PLANS, type FestivalPlan } from "@/lib/festival-plans";

export default function FestivalPlansPage() {
  const [selected, setSelected] = useState<FestivalPlan | null>(null);

  if (selected) {
    return (
      <div>
        <PageHeader title={selected.name} subtitle={selected.nameHindi} />

        <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
          <Button variant="ghost" onClick={() => setSelected(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all plans
          </Button>

          {/* Description */}
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">{selected.type === "fasting" ? "Fasting Day" : "Festival"}</Badge>
                <Badge variant="outline">~{selected.totalCalories} kcal</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Meal Timeline */}
          <div className="space-y-3">
            {selected.meals.map((meal, idx) => (
              <Card key={idx}>
                <CardContent className="pt-4 pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{meal.mealType}</h3>
                    <span className="text-xs text-muted-foreground">{meal.time}</span>
                  </div>
                  <div className="space-y-1">
                    {meal.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {item.portion} &bull; {item.calories} cal
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t text-xs text-muted-foreground text-right">
                    {meal.items.reduce((sum, i) => sum + i.calories, 0)} calories
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <ul className="space-y-1.5">
                {selected.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-2">
                    <span className="text-primary font-bold">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const fastingPlans = FESTIVAL_PLANS.filter((p) => p.type === "fasting");
  const festivalPlans = FESTIVAL_PLANS.filter((p) => p.type === "festival");

  return (
    <div>
      <PageHeader title="Festival & Fasting Plans" subtitle="Special diet plans for Indian occasions" />

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Fasting Plans */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-4 w-4 text-orange-500" />
            <h2 className="font-semibold">Fasting Day Plans</h2>
          </div>
          <div className="space-y-2">
            {fastingPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan)}
                className="w-full text-left"
              >
                <Card className="hover:bg-accent/50 transition-colors">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{plan.nameHindi}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{plan.totalCalories} kcal</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {plan.description}
                    </p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Festival Plans */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <PartyPopper className="h-4 w-4 text-purple-500" />
            <h2 className="font-semibold">Festival Plans</h2>
          </div>
          <div className="space-y-2">
            {festivalPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelected(plan)}
                className="w-full text-left"
              >
                <Card className="hover:bg-accent/50 transition-colors">
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{plan.nameHindi}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">{plan.totalCalories} kcal</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {plan.description}
                    </p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">
              These plans are designed for healthy adults. If you have diabetes, blood pressure, or other health conditions, consult your doctor before fasting. Pregnant and breastfeeding women should avoid prolonged fasting.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
