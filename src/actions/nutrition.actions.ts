"use server";

import { auth } from "@/lib/auth";
import { NutritionRepository } from "@/repositories/nutrition.repository";
import { UserRepository } from "@/repositories/user.repository";
import { calculateNutritionTargets } from "@/domain/nutrition";
import type { MealType } from "@/types";
import { revalidatePath } from "next/cache";

export async function logMealAction(data: {
  name: string;
  mealType: MealType;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (!data.name.trim()) return { success: false, error: "Meal name is required." };
  if (data.calories <= 0) return { success: false, error: "Calories must be positive." };

  const meal = await NutritionRepository.logMeal({
    userId: session.user.id,
    name: data.name.trim(),
    mealType: data.mealType,
    calories: data.calories,
    protein: data.protein,
    carbs: data.carbs,
    fat: data.fat,
  });

  revalidatePath("/nutrition");
  return { success: true, meal };
}

export async function deleteMealAction(mealId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await NutritionRepository.deleteMeal(mealId, session.user.id);
  revalidatePath("/nutrition");
  return { success: true };
}

export async function logWaterAction(amountMl: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  if (amountMl <= 0) return { success: false, error: "Water amount must be positive." };

  await NutritionRepository.logWater(session.user.id, amountMl);
  revalidatePath("/nutrition");
  return { success: true };
}

export async function saveNutritionGoalAction(data: {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  dailyWaterMl: number;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const goal = await NutritionRepository.upsertGoal(session.user.id, data);
  revalidatePath("/nutrition");
  return { success: true, goal };
}

export async function calculateGoalFromProfileAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await UserRepository.findById(session.user.id);
  if (!user || !user.profile?.currentWeight || !user.profile?.height) {
    return {
      success: false,
      error: "Please complete your weight and height in Profile first.",
    };
  }

  // Calculate age from dateOfBirth if available
  let ageYears = 25;
  if (user.profile.dateOfBirth) {
    const ageDiffMs = Date.now() - new Date(user.profile.dateOfBirth).getTime();
    ageYears = Math.floor(ageDiffMs / (1000 * 60 * 60 * 24 * 365.25));
  }

  const targets = calculateNutritionTargets({
    weightKg: user.profile.currentWeight,
    heightCm: user.profile.height,
    ageYears,
    weeklyFrequency: user.profile.weeklyFrequency ?? 3,
    fitnessGoal: user.profile.fitnessGoal ?? "MAINTENANCE",
  });

  const goal = await NutritionRepository.upsertGoal(session.user.id, {
    dailyCalories: targets.calories,
    dailyProtein: targets.proteinGrams,
    dailyCarbs: targets.carbsGrams,
    dailyFat: targets.fatGrams,
    dailyWaterMl: targets.waterMl,
  });

  revalidatePath("/nutrition");
  return { success: true, goal };
}
