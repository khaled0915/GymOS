import type { MuscleGroup } from "@prisma/client";

/**
 * Canonical anatomical muscle identifiers used throughout GymOS.
 * One single source of truth for all muscle mapping and visualization.
 */
export const MUSCLE_IDS = {
  CHEST: "chest",
  FRONT_DELTS: "front_delts",
  SIDE_DELTS: "side_delts",
  REAR_DELTS: "rear_delts",
  BICEPS: "biceps",
  TRICEPS: "triceps",
  FOREARMS: "forearms",
  LATS: "lats",
  TRAPS: "traps",
  UPPER_BACK: "upper_back",
  LOWER_BACK: "lower_back",
  ABS: "abs",
  OBLIQUES: "obliques",
  GLUTES: "glutes",
  QUADS: "quads",
  HAMSTRINGS: "hamstrings",
  CALVES: "calves",
} as const;

export type MuscleId = (typeof MUSCLE_IDS)[keyof typeof MUSCLE_IDS];

export type MuscleRole = "PRIMARY" | "SECONDARY";

/**
 * Deterministic stimulus weighting constants.
 * Primary muscles receive full weight (1.0).
 * Secondary assisting muscles receive secondary stimulus (0.45).
 */
export const MUSCLE_ROLE_WEIGHT: Record<MuscleRole, number> = {
  PRIMARY: 1.0,
  SECONDARY: 0.45,
};

/**
 * Human-readable anatomical labels for tooltips and legends.
 */
export const MUSCLE_LABELS: Record<MuscleId, string> = {
  chest: "Chest (Pectorals)",
  front_delts: "Front Deltoids",
  side_delts: "Side / Lateral Deltoids",
  rear_delts: "Rear Deltoids",
  biceps: "Biceps",
  triceps: "Triceps",
  forearms: "Forearms",
  lats: "Latissimus Dorsi",
  traps: "Trapezius",
  upper_back: "Upper Back & Rhomboids",
  lower_back: "Lower Back (Erectors)",
  abs: "Abdominals",
  obliques: "Obliques",
  glutes: "Glutes",
  quads: "Quadriceps",
  hamstrings: "Hamstrings",
  calves: "Calves",
};

/**
 * Maps high-level Prisma MuscleGroup enums to one or more canonical anatomical MuscleIds.
 */
export const PRISMA_MUSCLE_TO_ANATOMICAL: Record<MuscleGroup, MuscleId[]> = {
  CHEST: [MUSCLE_IDS.CHEST],
  BACK: [MUSCLE_IDS.LATS, MUSCLE_IDS.UPPER_BACK, MUSCLE_IDS.TRAPS, MUSCLE_IDS.LOWER_BACK],
  SHOULDERS: [MUSCLE_IDS.FRONT_DELTS, MUSCLE_IDS.SIDE_DELTS, MUSCLE_IDS.REAR_DELTS],
  BICEPS: [MUSCLE_IDS.BICEPS],
  TRICEPS: [MUSCLE_IDS.TRICEPS],
  LEGS: [MUSCLE_IDS.QUADS, MUSCLE_IDS.HAMSTRINGS],
  GLUTES: [MUSCLE_IDS.GLUTES],
  ABS: [MUSCLE_IDS.ABS, MUSCLE_IDS.OBLIQUES],
  CALVES: [MUSCLE_IDS.CALVES],
  CARDIO: [MUSCLE_IDS.QUADS, MUSCLE_IDS.CALVES],
};

/**
 * Normalized muscle intensity used by the MuscleMap SVG components.
 */
export interface MuscleIntensity {
  muscle: MuscleId;
  intensity: number; // 0.0 to 1.0
  sets?: number;
  label?: string;
  role?: MuscleRole;
}

export type IntensityLevel = "INACTIVE" | "LOW" | "MODERATE" | "HIGH" | "VERY_HIGH";
