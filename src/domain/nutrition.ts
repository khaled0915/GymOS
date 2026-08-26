/**
 * Nutrition domain — pure calculations for BMR, TDEE, macros, and daily totals.
 * No framework or database dependencies.
 */

import type { FitnessGoal } from "@/types";

export interface AthleteProfileData {
  weightKg: number;
  heightCm: number;
  ageYears?: number;
  gender?: "MALE" | "FEMALE";
  weeklyFrequency?: number;
  fitnessGoal?: FitnessGoal;
}

export interface MacroSplit {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  waterMl: number;
}

export interface MealItem {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation.
 * BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + (5 for male / -161 for female / -78 default)
 */
export function calculateBMR(data: {
  weightKg: number;
  heightCm: number;
  ageYears?: number;
  gender?: "MALE" | "FEMALE";
}): number {
  if (data.weightKg <= 0 || data.heightCm <= 0) {
    throw new Error("Weight and height must be positive");
  }

  const age = data.ageYears && data.ageYears > 0 ? data.ageYears : 25;
  let genderOffset = -78; // neutral average between +5 and -161
  if (data.gender === "MALE") genderOffset = 5;
  if (data.gender === "FEMALE") genderOffset = -161;

  const bmr = 10 * data.weightKg + 6.25 * data.heightCm - 5 * age + genderOffset;
  return Math.round(bmr);
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE) based on weekly workout frequency.
 * Activity multipliers:
 * - 0-1 days: 1.2 (Sedentary)
 * - 2-3 days: 1.375 (Light)
 * - 4-5 days: 1.55 (Moderate)
 * - 6-7 days: 1.725 (Very Active)
 */
export function calculateTDEE(bmr: number, weeklyFrequency?: number): number {
  if (bmr <= 0) throw new Error("BMR must be positive");

  const freq = weeklyFrequency ?? 3;
  let multiplier = 1.375;

  if (freq <= 1) multiplier = 1.2;
  else if (freq <= 3) multiplier = 1.375;
  else if (freq <= 5) multiplier = 1.55;
  else multiplier = 1.725;

  return Math.round(bmr * multiplier);
}

/**
 * Calculate daily target calories and macros based on goal.
 * - MUSCLE_GAIN: +350 kcal surplus, 2.0g protein/kg, 25% fat, rest carbs.
 * - FAT_LOSS: -500 kcal deficit, 2.2g protein/kg, 25% fat, rest carbs.
 * - STRENGTH: +200 kcal surplus, 2.0g protein/kg, 28% fat, rest carbs.
 * - MAINTENANCE / GENERAL_FITNESS: maintenance calories, 1.8g protein/kg, 25% fat, rest carbs.
 */
export function calculateNutritionTargets(profile: AthleteProfileData): MacroSplit {
  const bmr = calculateBMR({
    weightKg: profile.weightKg,
    heightCm: profile.heightCm,
    ageYears: profile.ageYears,
    gender: profile.gender,
  });

  const tdee = calculateTDEE(bmr, profile.weeklyFrequency);
  const goal = profile.fitnessGoal ?? "MAINTENANCE";

  let targetCalories = tdee;
  let proteinPerKg = 1.8;

  switch (goal) {
    case "MUSCLE_GAIN":
      targetCalories = tdee + 350;
      proteinPerKg = 2.0;
      break;
    case "FAT_LOSS":
      targetCalories = Math.max(1200, tdee - 500);
      proteinPerKg = 2.2;
      break;
    case "STRENGTH":
      targetCalories = tdee + 200;
      proteinPerKg = 2.0;
      break;
    case "MAINTENANCE":
    case "GENERAL_FITNESS":
    default:
      targetCalories = tdee;
      proteinPerKg = 1.8;
      break;
  }

  // Protein: proteinPerKg × weight (4 kcal per g)
  const proteinGrams = Math.round(profile.weightKg * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  // Fat: 25% of total calories (9 kcal per g)
  const fatCalories = targetCalories * 0.25;
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs: Remaining calories (4 kcal per g)
  const remainingCalories = Math.max(0, targetCalories - proteinCalories - (fatGrams * 9));
  const carbsGrams = Math.round(remainingCalories / 4);

  // Water: Base ~35ml per kg of bodyweight
  const waterMl = Math.round((profile.weightKg * 35) / 250) * 250;

  return {
    calories: Math.round(targetCalories),
    proteinGrams,
    carbsGrams,
    fatGrams,
    waterMl: Math.max(2000, waterMl),
  };
}

/**
 * Calculate totals from a list of logged meals.
 */
export function calculateDailyMealTotals(meals: MealItem[]): {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
} {
  return meals.reduce(
    (acc, m) => ({
      totalCalories: Math.round(acc.totalCalories + m.calories),
      totalProtein: Math.round(acc.totalProtein + m.protein),
      totalCarbs: Math.round(acc.totalCarbs + m.carbs),
      totalFat: Math.round(acc.totalFat + m.fat),
    }),
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
  );
}
