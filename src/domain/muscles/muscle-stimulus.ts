import type { MuscleGroup } from "@prisma/client";
import {
  MUSCLE_IDS,
  type MuscleId,
  MUSCLE_ROLE_WEIGHT,
  PRISMA_MUSCLE_TO_ANATOMICAL,
  type MuscleIntensity,
  type IntensityLevel,
  MUSCLE_LABELS,
} from "./muscle-types";

export interface ExerciseMuscleTarget {
  primaryMuscle: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
}

export interface SetWithCompletion {
  completed?: boolean;
}

export interface SessionWithExerciseAndSets {
  exercise: ExerciseMuscleTarget;
  sets: SetWithCompletion[];
}

/**
 * Calculates raw stimulus contribution for an individual exercise based on completed sets.
 * Formula: completedSets × roleWeight (1.0 for primary, 0.45 for secondary).
 */
export function calculateExerciseMuscleStimulus(
  exercise: ExerciseMuscleTarget,
  completedSets: number,
): Record<MuscleId, number> {
  const result = createZeroMuscleMap();
  if (completedSets <= 0) return result;

  // Primary muscle(s)
  const primaryAnatomical = PRISMA_MUSCLE_TO_ANATOMICAL[exercise.primaryMuscle] || [];
  for (const m of primaryAnatomical) {
    result[m] = (result[m] || 0) + completedSets * MUSCLE_ROLE_WEIGHT.PRIMARY;
  }

  // Secondary muscles
  if (exercise.secondaryMuscles && Array.isArray(exercise.secondaryMuscles)) {
    for (const secGroup of exercise.secondaryMuscles) {
      const secondaryAnatomical = PRISMA_MUSCLE_TO_ANATOMICAL[secGroup] || [];
      for (const m of secondaryAnatomical) {
        // Only apply secondary weight if not already treated as primary
        if (!primaryAnatomical.includes(m)) {
          result[m] = (result[m] || 0) + completedSets * MUSCLE_ROLE_WEIGHT.SECONDARY;
        }
      }
    }
  }

  return result;
}

/**
 * Calculates cumulative raw muscle stimulus across a full workout session.
 * Only counts completed sets.
 */
export function calculateWorkoutMuscleStimulus(
  exerciseSessions: SessionWithExerciseAndSets[],
): Record<MuscleId, number> {
  const result = createZeroMuscleMap();

  for (const session of exerciseSessions) {
    if (!session.exercise) continue;
    const completedSetsCount = (session.sets || []).filter((s) => s.completed !== false).length;
    if (completedSetsCount === 0) continue;

    const sessionStimulus = calculateExerciseMuscleStimulus(session.exercise, completedSetsCount);
    for (const key of Object.values(MUSCLE_IDS)) {
      result[key] = (result[key] || 0) + (sessionStimulus[key] || 0);
    }
  }

  return result;
}

/**
 * Normalizes raw stimulus values (or set counts) into [0.0, 1.0] intensity range.
 */
export function normalizeMuscleIntensities(
  rawContributions: Partial<Record<MuscleId, number>>,
): MuscleIntensity[] {
  let maxVal = 0;
  for (const val of Object.values(rawContributions)) {
    if (typeof val === "number" && val > maxVal) {
      maxVal = val;
    }
  }

  const list: MuscleIntensity[] = [];
  for (const mId of Object.values(MUSCLE_IDS)) {
    const rawVal = rawContributions[mId] || 0;
    const intensity = maxVal > 0 ? Math.round((rawVal / maxVal) * 100) / 100 : 0;
    list.push({
      muscle: mId,
      intensity,
      sets: Math.round(rawVal * 10) / 10,
      label: MUSCLE_LABELS[mId],
    });
  }

  return list;
}

/**
 * Categorizes a normalized intensity (0.0 to 1.0) into discrete semantic levels.
 */
export function getIntensityLevel(intensity: number): IntensityLevel {
  if (intensity <= 0) return "INACTIVE";
  if (intensity < 0.3) return "LOW";
  if (intensity < 0.6) return "MODERATE";
  if (intensity < 0.85) return "HIGH";
  return "VERY_HIGH";
}

/**
 * Returns GymOS dark athletic color styling matching the intensity level.
 */
export function getIntensityColor(intensity: number): {
  fill: string;
  stroke: string;
  glow?: string;
  className: string;
} {
  const level = getIntensityLevel(intensity);
  switch (level) {
    case "VERY_HIGH":
      return {
        fill: "#10B981", // emerald-500
        stroke: "#34D399", // emerald-400
        glow: "rgba(16, 185, 129, 0.45)",
        className: "fill-emerald-500 stroke-emerald-400",
      };
    case "HIGH":
      return {
        fill: "rgba(16, 185, 129, 0.75)",
        stroke: "#10B981",
        glow: "rgba(16, 185, 129, 0.25)",
        className: "fill-emerald-500/75 stroke-emerald-500",
      };
    case "MODERATE":
      return {
        fill: "rgba(16, 185, 129, 0.45)",
        stroke: "#059669",
        className: "fill-emerald-500/45 stroke-emerald-600",
      };
    case "LOW":
      return {
        fill: "rgba(16, 185, 129, 0.22)",
        stroke: "#047857",
        className: "fill-emerald-500/20 stroke-emerald-700",
      };
    case "INACTIVE":
    default:
      return {
        fill: "#1A2230", // neutral athletic slate
        stroke: "#2A364F",
        className: "fill-[#1A2230] stroke-[#2A364F]",
      };
  }
}

/**
 * Creates an initial zeroed muscle stimulus dictionary.
 */
export function createZeroMuscleMap(): Record<MuscleId, number> {
  return {
    chest: 0,
    front_delts: 0,
    side_delts: 0,
    rear_delts: 0,
    biceps: 0,
    triceps: 0,
    forearms: 0,
    lats: 0,
    traps: 0,
    upper_back: 0,
    lower_back: 0,
    abs: 0,
    obliques: 0,
    glutes: 0,
    quads: 0,
    hamstrings: 0,
    calves: 0,
  };
}
