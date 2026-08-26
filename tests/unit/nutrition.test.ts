import { describe, it, expect } from "vitest";
import {
  calculateBMR,
  calculateTDEE,
  calculateNutritionTargets,
  calculateDailyMealTotals,
} from "../../src/domain/nutrition";

describe("calculateBMR", () => {
  it("calculates BMR accurately for male athlete", () => {
    // 10 * 80 + 6.25 * 180 - 5 * 25 + 5 = 800 + 1125 - 125 + 5 = 1805
    const bmr = calculateBMR({ weightKg: 80, heightCm: 180, ageYears: 25, gender: "MALE" });
    expect(bmr).toBe(1805);
  });

  it("calculates BMR accurately for female athlete", () => {
    // 10 * 60 + 6.25 * 165 - 5 * 30 - 161 = 600 + 1031.25 - 150 - 161 = 1320.25 -> 1320
    const bmr = calculateBMR({ weightKg: 60, heightCm: 165, ageYears: 30, gender: "FEMALE" });
    expect(bmr).toBe(1320);
  });

  it("throws for non-positive dimensions", () => {
    expect(() => calculateBMR({ weightKg: 0, heightCm: 170 })).toThrow();
    expect(() => calculateBMR({ weightKg: 70, heightCm: -170 })).toThrow();
  });
});

describe("calculateTDEE", () => {
  it("applies correct multiplier based on workout frequency", () => {
    const bmr = 1800;
    expect(calculateTDEE(bmr, 1)).toBe(Math.round(1800 * 1.2));
    expect(calculateTDEE(bmr, 3)).toBe(Math.round(1800 * 1.375));
    expect(calculateTDEE(bmr, 5)).toBe(Math.round(1800 * 1.55));
    expect(calculateTDEE(bmr, 6)).toBe(Math.round(1800 * 1.725));
  });

  it("throws for non-positive BMR", () => {
    expect(() => calculateTDEE(0, 3)).toThrow();
  });
});

describe("calculateNutritionTargets", () => {
  it("calculates surplus and protein for muscle gain", () => {
    const targets = calculateNutritionTargets({
      weightKg: 80,
      heightCm: 180,
      ageYears: 25,
      gender: "MALE",
      weeklyFrequency: 4,
      fitnessGoal: "MUSCLE_GAIN",
    });

    // BMR: 1805 -> TDEE at 4x/wk (1.55): 2798 -> Target (+350): 3148
    expect(targets.calories).toBeGreaterThan(3000);
    expect(targets.proteinGrams).toBe(160); // 2.0g * 80kg
    expect(targets.fatGrams).toBeGreaterThan(50);
    expect(targets.carbsGrams).toBeGreaterThan(200);
    expect(targets.waterMl).toBeGreaterThanOrEqual(2500);
  });

  it("calculates deficit and high protein for fat loss", () => {
    const targets = calculateNutritionTargets({
      weightKg: 80,
      heightCm: 180,
      ageYears: 25,
      gender: "MALE",
      weeklyFrequency: 4,
      fitnessGoal: "FAT_LOSS",
    });

    // Deficit: TDEE (2798) - 500 = 2298
    expect(targets.calories).toBeLessThan(2500);
    expect(targets.proteinGrams).toBe(176); // 2.2g * 80kg
  });
});

describe("calculateDailyMealTotals", () => {
  it("sums calories and macros correctly", () => {
    const meals = [
      { calories: 500, protein: 40, carbs: 50, fat: 15 },
      { calories: 700, protein: 50, carbs: 70, fat: 25 },
      { calories: 200, protein: 25, carbs: 10, fat: 5 },
    ];
    const totals = calculateDailyMealTotals(meals);
    expect(totals.totalCalories).toBe(1400);
    expect(totals.totalProtein).toBe(115);
    expect(totals.totalCarbs).toBe(130);
    expect(totals.totalFat).toBe(45);
  });

  it("handles empty meal logs", () => {
    const totals = calculateDailyMealTotals([]);
    expect(totals.totalCalories).toBe(0);
    expect(totals.totalProtein).toBe(0);
  });
});
