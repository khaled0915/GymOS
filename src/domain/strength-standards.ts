/**
 * Strength Standards & 1RM Multi-Formula domain.
 * Pure mathematical formulas without external dependencies.
 */

export type StrengthTier = "BEGINNER" | "NOVICE" | "INTERMEDIATE" | "ADVANCED" | "ELITE";

export interface OneRepMaxEstimations {
  epley: number;
  brzycki: number;
  lombardi: number;
  oconner: number;
  mayhew: number;
  average: number;
}

export interface LiftStandardEvaluation {
  liftName: string;
  oneRepMax: number;
  bodyWeightKg: number;
  ratio: number;
  tier: StrengthTier;
  nextTierThresholdKg: number;
  tierProgressPct: number;
}

/**
 * Calculate multi-formula 1RM estimates.
 */
export function calculateAllOneRepMaxes(weight: number, reps: number): OneRepMaxEstimations {
  if (weight <= 0 || reps <= 0) {
    throw new Error("Weight and reps must be positive");
  }

  if (reps === 1) {
    return {
      epley: weight,
      brzycki: weight,
      lombardi: weight,
      oconner: weight,
      mayhew: weight,
      average: weight,
    };
  }

  // Epley: weight * (1 + reps / 30)
  const epley = Math.round(weight * (1 + reps / 30) * 10) / 10;

  // Brzycki: weight * (36 / (37 - reps))
  const brzycki = reps < 37 ? Math.round(weight * (36 / (37 - reps)) * 10) / 10 : epley;

  // Lombardi: weight * (reps ^ 0.10)
  const lombardi = Math.round(weight * Math.pow(reps, 0.10) * 10) / 10;

  // O'Conner: weight * (1 + 0.025 * reps)
  const oconner = Math.round(weight * (1 + 0.025 * reps) * 10) / 10;

  // Mayhew: (100 * weight) / (52.2 + 41.9 * e^(-0.055 * reps))
  const mayhew = Math.round(((100 * weight) / (52.2 + 41.9 * Math.exp(-0.055 * reps))) * 10) / 10;

  const average = Math.round(((epley + brzycki + lombardi + oconner + mayhew) / 5) * 10) / 10;

  return {
    epley,
    brzycki,
    lombardi,
    oconner,
    mayhew,
    average,
  };
}

// Multipliers relative to bodyweight for each tier
const LIFT_MULTIPLIERS: Record<string, [number, number, number, number, number]> = {
  "BENCH_PRESS": [0.5, 0.8, 1.2, 1.6, 2.0],
  "SQUAT": [0.8, 1.2, 1.6, 2.0, 2.4],
  "DEADLIFT": [1.0, 1.4, 1.9, 2.4, 2.8],
  "OVERHEAD_PRESS": [0.35, 0.55, 0.8, 1.05, 1.3],
  "BARBELL_ROW": [0.5, 0.75, 1.0, 1.35, 1.7],
};

const TIERS: StrengthTier[] = ["BEGINNER", "NOVICE", "INTERMEDIATE", "ADVANCED", "ELITE"];

/**
 * Evaluate lift standard against body weight.
 */
export function evaluateStrengthStandard(
  liftType: "BENCH_PRESS" | "SQUAT" | "DEADLIFT" | "OVERHEAD_PRESS" | "BARBELL_ROW",
  oneRepMax: number,
  bodyWeightKg: number
): LiftStandardEvaluation {
  if (oneRepMax <= 0 || bodyWeightKg <= 0) {
    throw new Error("1RM and body weight must be positive");
  }

  const multipliers = LIFT_MULTIPLIERS[liftType] ?? [0.5, 0.8, 1.2, 1.6, 2.0];
  const ratio = Math.round((oneRepMax / bodyWeightKg) * 100) / 100;

  let tierIndex = 0;
  for (let i = 0; i < multipliers.length; i++) {
    if (ratio >= multipliers[i]!) {
      tierIndex = i;
    }
  }

  const currentTier = TIERS[tierIndex]!;
  const nextTierIndex = Math.min(multipliers.length - 1, tierIndex + 1);
  const nextTierMultiplier = multipliers[nextTierIndex]!;
  const nextTierThresholdKg = Math.round(bodyWeightKg * nextTierMultiplier * 2) / 2;

  const currentTierBase = multipliers[tierIndex]! * bodyWeightKg;
  const range = nextTierThresholdKg - currentTierBase;
  const progress = range > 0 ? Math.min(100, Math.round(((oneRepMax - currentTierBase) / range) * 100)) : 100;

  const names: Record<string, string> = {
    "BENCH_PRESS": "Bench Press",
    "SQUAT": "Barbell Squat",
    "DEADLIFT": "Deadlift",
    "OVERHEAD_PRESS": "Overhead Press",
    "BARBELL_ROW": "Barbell Row",
  };

  return {
    liftName: names[liftType] || liftType,
    oneRepMax,
    bodyWeightKg,
    ratio,
    tier: currentTier,
    nextTierThresholdKg,
    tierProgressPct: Math.max(0, progress),
  };
}
