/**
 * Food Database & Portion Scaling domain.
 * Pure data and mathematical operations without external dependencies.
 */

export interface FoodItem {
  id: string;
  name: string;
  category: "PROTEIN" | "CARB" | "FAT" | "DAIRY" | "FRUIT_VEG" | "SUPPLEMENT";
  servingUnit: string; // "g" or "serving" or "piece"
  defaultServing: number; // e.g. 100g, 1 scoop (30g), 1 egg (50g)
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export interface ScaledNutrition {
  name: string;
  portion: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const BUILT_IN_FOODS: FoodItem[] = [
  // Proteins
  { id: "chicken-breast", name: "Chicken Breast (Cooked)", category: "PROTEIN", servingUnit: "g", defaultServing: 150, caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
  { id: "whole-egg", name: "Whole Egg (Large)", category: "PROTEIN", servingUnit: "egg", defaultServing: 1, caloriesPer100g: 143, proteinPer100g: 12.6, carbsPer100g: 0.7, fatPer100g: 9.5 },
  { id: "egg-whites", name: "Liquid Egg Whites", category: "PROTEIN", servingUnit: "g", defaultServing: 150, caloriesPer100g: 52, proteinPer100g: 11, carbsPer100g: 0.7, fatPer100g: 0.2 },
  { id: "salmon-fillet", name: "Salmon Fillet (Cooked)", category: "PROTEIN", servingUnit: "g", defaultServing: 150, caloriesPer100g: 206, proteinPer100g: 22, carbsPer100g: 0, fatPer100g: 12.3 },
  { id: "canned-tuna", name: "Canned Tuna (In Water)", category: "PROTEIN", servingUnit: "g", defaultServing: 120, caloriesPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 1 },
  { id: "lean-beef", name: "Lean Ground Beef (90/10)", category: "PROTEIN", servingUnit: "g", defaultServing: 150, caloriesPer100g: 217, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 12 },
  { id: "whey-protein", name: "Whey Protein Powder", category: "SUPPLEMENT", servingUnit: "scoop (30g)", defaultServing: 1, caloriesPer100g: 400, proteinPer100g: 80, carbsPer100g: 6.6, fatPer100g: 5 },
  { id: "tofu-firm", name: "Tofu (Firm)", category: "PROTEIN", servingUnit: "g", defaultServing: 150, caloriesPer100g: 144, proteinPer100g: 17, carbsPer100g: 3, fatPer100g: 8 },

  // Carbohydrates
  { id: "rolled-oats", name: "Rolled Oats (Dry)", category: "CARB", servingUnit: "g", defaultServing: 60, caloriesPer100g: 389, proteinPer100g: 16.9, carbsPer100g: 66.3, fatPer100g: 6.9 },
  { id: "white-rice", name: "White Jasmine Rice (Cooked)", category: "CARB", servingUnit: "g", defaultServing: 200, caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28.2, fatPer100g: 0.3 },
  { id: "brown-rice", name: "Brown Rice (Cooked)", category: "CARB", servingUnit: "g", defaultServing: 200, caloriesPer100g: 112, proteinPer100g: 2.6, carbsPer100g: 23.5, fatPer100g: 0.9 },
  { id: "sweet-potato", name: "Sweet Potato (Baked)", category: "CARB", servingUnit: "g", defaultServing: 180, caloriesPer100g: 90, proteinPer100g: 2, carbsPer100g: 20.7, fatPer100g: 0.1 },
  { id: "wheat-bread", name: "Whole Wheat Bread", category: "CARB", servingUnit: "slice (40g)", defaultServing: 2, caloriesPer100g: 247, proteinPer100g: 13, carbsPer100g: 41, fatPer100g: 3.4 },
  { id: "lentils-cooked", name: "Lentils (Cooked)", category: "CARB", servingUnit: "g", defaultServing: 150, caloriesPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.4 },

  // Dairy & Alternatives
  { id: "greek-yogurt", name: "Greek Yogurt (0% Non-Fat)", category: "DAIRY", servingUnit: "g", defaultServing: 170, caloriesPer100g: 59, proteinPer100g: 10.3, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { id: "cottage-cheese", name: "Cottage Cheese (Low Fat)", category: "DAIRY", servingUnit: "g", defaultServing: 150, caloriesPer100g: 72, proteinPer100g: 12.4, carbsPer100g: 2.7, fatPer100g: 1 },
  { id: "whole-milk", name: "Whole Milk", category: "DAIRY", servingUnit: "ml", defaultServing: 250, caloriesPer100g: 62, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3 },

  // Healthy Fats
  { id: "peanut-butter", name: "Natural Peanut Butter", category: "FAT", servingUnit: "tbsp (16g)", defaultServing: 2, caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50 },
  { id: "olive-oil", name: "Extra Virgin Olive Oil", category: "FAT", servingUnit: "tbsp (14g)", defaultServing: 1, caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { id: "almonds", name: "Raw Almonds", category: "FAT", servingUnit: "g", defaultServing: 30, caloriesPer100g: 579, proteinPer100g: 21.2, carbsPer100g: 21.6, fatPer100g: 49.9 },
  { id: "avocado", name: "Avocado", category: "FAT", servingUnit: "g", defaultServing: 100, caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 8.5, fatPer100g: 14.7 },

  // Fruits & Vegetables
  { id: "banana", name: "Banana (Medium)", category: "FRUIT_VEG", servingUnit: "piece (118g)", defaultServing: 1, caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 22.8, fatPer100g: 0.3 },
  { id: "apple", name: "Apple", category: "FRUIT_VEG", servingUnit: "piece (150g)", defaultServing: 1, caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 13.8, fatPer100g: 0.2 },
  { id: "broccoli", name: "Broccoli (Steamed)", category: "FRUIT_VEG", servingUnit: "g", defaultServing: 150, caloriesPer100g: 35, proteinPer100g: 2.4, carbsPer100g: 7.2, fatPer100g: 0.4 },
  { id: "spinach", name: "Fresh Spinach", category: "FRUIT_VEG", servingUnit: "g", defaultServing: 100, caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
];

/**
 * Scale food item macros to a specified portion in grams or unit servings.
 */
export function scaleFoodMacros(food: FoodItem, amount: number): ScaledNutrition {
  if (amount <= 0) {
    throw new Error("Portion amount must be positive");
  }

  // If unit is piece/serving/scoop/egg/tbsp, calculate effective weight in grams
  let grams = amount;
  if (food.servingUnit.includes("egg")) {
    grams = amount * 50; // 50g per egg
  } else if (food.servingUnit.includes("scoop")) {
    grams = amount * 30; // 30g per scoop
  } else if (food.servingUnit.includes("tbsp")) {
    grams = amount * 15; // 15g per tbsp
  } else if (food.servingUnit.includes("slice")) {
    grams = amount * 40; // 40g per slice
  } else if (food.servingUnit.includes("piece")) {
    grams = amount * 120; // 120g average piece
  }

  const factor = grams / 100;

  return {
    name: food.name,
    portion: amount,
    unit: food.servingUnit,
    calories: Math.round(food.caloriesPer100g * factor),
    protein: Math.round(food.proteinPer100g * factor * 10) / 10,
    carbs: Math.round(food.carbsPer100g * factor * 10) / 10,
    fat: Math.round(food.fatPer100g * factor * 10) / 10,
  };
}

/**
 * Search the built-in food library by query and category.
 */
export function searchFoodLibrary(query?: string, category?: string): FoodItem[] {
  let results = BUILT_IN_FOODS;

  if (category && category !== "ALL") {
    results = results.filter((f) => f.category === category);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter((f) => f.name.toLowerCase().includes(q));
  }

  return results;
}
