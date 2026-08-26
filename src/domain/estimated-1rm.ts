/**
 * Estimated 1RM calculations.
 * These formulas estimate the maximum weight a user could lift for a single repetition
 * based on a weight and rep count performed.
 */

/**
 * Epley formula: 1RM = weight × (1 + reps / 30)
 * Most commonly used. Works well for rep ranges 1–10.
 */
export function epley(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) {
    throw new Error("Weight and reps must be positive");
  }
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30) * 100) / 100;
}

/**
 * Brzycki formula: 1RM = weight × (36 / (37 - reps))
 * More conservative at higher rep ranges.
 */
export function brzycki(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) {
    throw new Error("Weight and reps must be positive");
  }
  if (reps >= 37) {
    throw new Error("Brzycki formula is not valid for 37+ reps");
  }
  if (reps === 1) return weight;
  return Math.round(weight * (36 / (37 - reps)) * 100) / 100;
}

/**
 * Default E1RM calculation using the Epley formula.
 */
export function estimateOneRepMax(weight: number, reps: number): number {
  return epley(weight, reps);
}
