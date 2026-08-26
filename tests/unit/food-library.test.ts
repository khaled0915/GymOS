import { describe, it, expect } from "vitest";
import {
  scaleFoodMacros,
  searchFoodLibrary,
  BUILT_IN_FOODS,
} from "../../src/domain/food-library";

describe("scaleFoodMacros", () => {
  it("scales 150g of chicken breast accurately", () => {
    const chicken = BUILT_IN_FOODS.find((f) => f.id === "chicken-breast")!;
    const scaled = scaleFoodMacros(chicken, 150);
    // 165 kcal / 100g * 1.5 = 247.5 -> 248 kcal
    // 31g protein / 100g * 1.5 = 46.5g protein
    expect(scaled.calories).toBe(248);
    expect(scaled.protein).toBeCloseTo(46.5, 1);
  });

  it("scales piece servings like eggs accurately", () => {
    const egg = BUILT_IN_FOODS.find((f) => f.id === "whole-egg")!;
    const scaled = scaleFoodMacros(egg, 2); // 2 eggs = 100g
    expect(scaled.calories).toBe(143);
    expect(scaled.protein).toBeCloseTo(12.6, 1);
  });

  it("throws for non-positive portion", () => {
    const chicken = BUILT_IN_FOODS.find((f) => f.id === "chicken-breast")!;
    expect(() => scaleFoodMacros(chicken, 0)).toThrow();
  });
});

describe("searchFoodLibrary", () => {
  it("filters by query string", () => {
    const results = searchFoodLibrary("rice");
    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.every((f) => f.name.toLowerCase().includes("rice"))).toBe(true);
  });

  it("filters by category", () => {
    const proteins = searchFoodLibrary("", "PROTEIN");
    expect(proteins.length).toBeGreaterThanOrEqual(4);
    expect(proteins.every((f) => f.category === "PROTEIN")).toBe(true);
  });
});
