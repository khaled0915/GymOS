"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  logMealAction,
  deleteMealAction,
  logWaterAction,
  calculateGoalFromProfileAction,
  saveNutritionGoalAction,
} from "@/actions/nutrition.actions";
import {
  Utensils,
  Plus,
  Trash2,
  Droplets,
  Flame,
  Sparkles,
  Check,
  Settings2,
} from "lucide-react";
import type { MealLog, NutritionGoal, MealType } from "@prisma/client";
import { useRouter } from "next/navigation";

interface NutritionProps {
  initialMeals: MealLog[];
  todayWaterMl: number;
  initialGoal: NutritionGoal | null;
  hasProfileData: boolean;
}

const MEAL_TYPES: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

export function NutritionDashboardClient({
  initialMeals,
  todayWaterMl,
  initialGoal,
  hasProfileData,
}: NutritionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Meal Form State
  const [mealName, setMealName] = useState("");
  const [mealType, setMealType] = useState<MealType>("LUNCH");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [mealError, setMealError] = useState<string | null>(null);

  // Goal Form Modal State
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalCalories, setGoalCalories] = useState(initialGoal?.dailyCalories.toString() || "2000");
  const [goalProtein, setGoalProtein] = useState(initialGoal?.dailyProtein.toString() || "150");
  const [goalCarbs, setGoalCarbs] = useState(initialGoal?.dailyCarbs.toString() || "200");
  const [goalFat, setGoalFat] = useState(initialGoal?.dailyFat.toString() || "65");
  const [goalWater, setGoalWater] = useState(initialGoal?.dailyWaterMl.toString() || "2500");

  // Calculate totals
  const totalCalories = initialMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = initialMeals.reduce((acc, m) => acc + m.protein, 0);
  const totalCarbs = initialMeals.reduce((acc, m) => acc + m.carbs, 0);
  const totalFat = initialMeals.reduce((acc, m) => acc + m.fat, 0);

  const goal = initialGoal ?? {
    dailyCalories: 2000,
    dailyProtein: 150,
    dailyCarbs: 200,
    dailyFat: 65,
    dailyWaterMl: 2500,
  };

  const calPct = Math.min(100, Math.round((totalCalories / goal.dailyCalories) * 100));
  const proPct = Math.min(100, Math.round((totalProtein / goal.dailyProtein) * 100));
  const carbPct = Math.min(100, Math.round((totalCarbs / goal.dailyCarbs) * 100));
  const fatPct = Math.min(100, Math.round((totalFat / goal.dailyFat) * 100));
  const waterPct = Math.min(100, Math.round((todayWaterMl / goal.dailyWaterMl) * 100));

  const handleLogMeal = () => {
    if (!mealName.trim() || !calories) {
      setMealError("Meal name and calories are required.");
      return;
    }

    setMealError(null);
    startTransition(async () => {
      const res = await logMealAction({
        name: mealName.trim(),
        mealType,
        calories: parseFloat(calories),
        protein: protein ? parseFloat(protein) : 0,
        carbs: carbs ? parseFloat(carbs) : 0,
        fat: fat ? parseFloat(fat) : 0,
      });

      if (res.success) {
        setMealName("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFat("");
        router.refresh();
      } else {
        setMealError(res.error || "Failed to log meal.");
      }
    });
  };

  const handleDeleteMeal = (id: string) => {
    startTransition(async () => {
      await deleteMealAction(id);
      router.refresh();
    });
  };

  const handleLogWater = (amountMl: number) => {
    startTransition(async () => {
      await logWaterAction(amountMl);
      router.refresh();
    });
  };

  const handleAutoCalculate = () => {
    startTransition(async () => {
      const res = await calculateGoalFromProfileAction();
      if (res.success) {
        router.refresh();
      }
    });
  };

  const handleSaveCustomGoal = () => {
    startTransition(async () => {
      await saveNutritionGoalAction({
        dailyCalories: parseInt(goalCalories) || 2000,
        dailyProtein: parseInt(goalProtein) || 150,
        dailyCarbs: parseInt(goalCarbs) || 200,
        dailyFat: parseInt(goalFat) || 65,
        dailyWaterMl: parseInt(goalWater) || 2500,
      });
      setShowGoalModal(false);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Targets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Nutrition & Macros</h1>
          <p className="text-muted-foreground mt-1">
            Fuel your training with daily calorie, macro, and hydration targets
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasProfileData && (
            <Button
              onClick={handleAutoCalculate}
              variant="outline"
              size="sm"
              disabled={isPending}
              className="text-xs"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> Auto-Calculate
            </Button>
          )}
          <Button
            onClick={() => setShowGoalModal(true)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            <Settings2 className="mr-1.5 h-3.5 w-3.5" /> Adjust Goals
          </Button>
        </div>
      </div>

      {/* Macro Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Calories */}
        <Card className="col-span-2 md:col-span-1 border-emerald-500/30">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Calories</span>
              <Flame className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black">
                {Math.round(totalCalories)} <span className="text-xs font-normal text-muted-foreground">/ {goal.dailyCalories}</span>
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${calPct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protein */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Protein</span>
              <span className="text-xs text-blue-500 font-bold">{proPct}%</span>
            </div>
            <div>
              <p className="text-xl font-bold">
                {Math.round(totalProtein)}g <span className="text-xs font-normal text-muted-foreground">/ {goal.dailyProtein}g</span>
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${proPct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Carbs */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Carbs</span>
              <span className="text-xs text-amber-500 font-bold">{carbPct}%</span>
            </div>
            <div>
              <p className="text-xl font-bold">
                {Math.round(totalCarbs)}g <span className="text-xs font-normal text-muted-foreground">/ {goal.dailyCarbs}g</span>
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${carbPct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fat */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Fat</span>
              <span className="text-xs text-rose-500 font-bold">{fatPct}%</span>
            </div>
            <div>
              <p className="text-xl font-bold">
                {Math.round(totalFat)}g <span className="text-xs font-normal text-muted-foreground">/ {goal.dailyFat}g</span>
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${fatPct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Water */}
        <Card className="col-span-2 md:col-span-1">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Water</span>
              <Droplets className="h-4 w-4 text-cyan-500" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {(todayWaterMl / 1000).toFixed(1)}L <span className="text-xs font-normal text-muted-foreground">/ {(goal.dailyWaterMl / 1000).toFixed(1)}L</span>
              </p>
              <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${waterPct}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Quick Meal Logger & Water Log */}
        <div className="space-y-6 md:col-span-1">
          {/* Quick Water Tracker */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-500" /> Hydration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleLogWater(250)}
                  disabled={isPending}
                >
                  +250 ml
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleLogWater(500)}
                  disabled={isPending}
                >
                  +500 ml
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleLogWater(1000)}
                  disabled={isPending}
                >
                  +1.0 L
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Meal Entry Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-emerald-600" /> Log Meal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Meal Name *</Label>
                <Input
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="e.g. Chicken Rice Bowl"
                  className="h-8 text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Meal Type</Label>
                <div className="grid grid-cols-4 gap-1">
                  {MEAL_TYPES.map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={mealType === t ? "default" : "outline"}
                      size="sm"
                      className="text-[10px] h-7 px-1 capitalize"
                      onClick={() => setMealType(t)}
                    >
                      {t.toLowerCase()}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Calories (kcal) *</Label>
                  <Input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="650"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Protein (g)</Label>
                  <Input
                    type="number"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="45"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Carbs (g)</Label>
                  <Input
                    type="number"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="75"
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Fat (g)</Label>
                  <Input
                    type="number"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="15"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {mealError && <p className="text-xs text-destructive">{mealError}</p>}

              <Button
                onClick={handleLogMeal}
                variant="athletic"
                size="sm"
                className="w-full font-bold"
                disabled={isPending}
              >
                <Plus className="mr-1.5 h-4 w-4" /> {isPending ? "Logging…" : "Add Meal"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Today's Logged Meals */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-emerald-600" /> Today&apos;s Meals ({initialMeals.length})
                </CardTitle>
                <Badge variant="secondary">{Math.round(totalCalories)} kcal consumed</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {initialMeals.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Utensils className="h-10 w-10 text-muted-foreground/30 mx-auto" />
                  <p className="text-sm text-muted-foreground">No meals logged for today.</p>
                  <p className="text-xs text-muted-foreground">Use the quick log form to track your nutrition.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {initialMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card/60 text-sm hover:border-muted-foreground/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{meal.name}</span>
                          <Badge variant="outline" className="text-[10px] uppercase">
                            {meal.mealType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="font-bold text-foreground">{Math.round(meal.calories)} kcal</span>
                          <span>P: {meal.protein}g</span>
                          <span>C: {meal.carbs}g</span>
                          <span>F: {meal.fat}g</span>
                          <span>{new Date(meal.loggedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Adjust Goals Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg">Customize Daily Nutrition Goals</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Daily Calories (kcal)</Label>
                <Input
                  type="number"
                  value={goalCalories}
                  onChange={(e) => setGoalCalories(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Protein (g)</Label>
                  <Input
                    type="number"
                    value={goalProtein}
                    onChange={(e) => setGoalProtein(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Carbs (g)</Label>
                  <Input
                    type="number"
                    value={goalCarbs}
                    onChange={(e) => setGoalCarbs(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-xs">Fat (g)</Label>
                  <Input
                    type="number"
                    value={goalFat}
                    onChange={(e) => setGoalFat(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="text-xs">Water Target (ml)</Label>
                <Input
                  type="number"
                  value={goalWater}
                  onChange={(e) => setGoalWater(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowGoalModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCustomGoal} variant="athletic" disabled={isPending}>
                Save Goals
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
