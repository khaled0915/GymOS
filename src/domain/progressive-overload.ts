/**
 * Deterministic progressive overload engine.
 * Recommends the next target weight and rep count based on previous performance.
 *
 * Architecture doc reference: getNextExerciseRecommendation(exerciseHistory, targetRepRange, progressionRules)
 */

export interface PerformanceData {
  weight: number;
  reps: number;
  rpe?: number;
}

export interface RepRange {
  min: number;
  max: number;
}

export interface ProgressionRecommendation {
  weight: number;
  targetReps: number;
  reason: string;
}

const DEFAULT_WEIGHT_INCREMENT = 2.5; // kg
const DEFAULT_WEIGHT_INCREMENT_LOWER = 1.25; // kg for smaller muscle groups

/**
 * Get the next exercise recommendation based on previous performance.
 *
 * Rules:
 * 1. If reps < min of target range → keep weight, aim for min reps
 * 2. If reps within target range → keep weight, aim for +1 rep
 * 3. If reps >= max of target range → increase weight, reset to min reps
 * 4. If RPE < 7 and reps at max → increase weight (user found it easy)
 */
export function getNextExerciseRecommendation(
  lastPerformance: PerformanceData,
  targetRepRange: RepRange,
  weightIncrement: number = DEFAULT_WEIGHT_INCREMENT,
): ProgressionRecommendation {
  const { weight, reps, rpe } = lastPerformance;
  const { min, max } = targetRepRange;

  // Case 3: At or above top of range → increase weight
  if (reps >= max) {
    const newWeight = roundToNearest(weight + weightIncrement, weightIncrement);
    return {
      weight: newWeight,
      targetReps: min,
      reason: `Hit ${max} reps — increase weight to ${newWeight} kg and reset to ${min} reps.`,
    };
  }

  // Case 4: Easy RPE and near top of range
  if (rpe !== undefined && rpe < 7 && reps >= max - 1) {
    const newWeight = roundToNearest(weight + weightIncrement, weightIncrement);
    return {
      weight: newWeight,
      targetReps: min,
      reason: `RPE ${rpe} is low — increase weight to ${newWeight} kg.`,
    };
  }

  // Case 1: Below target range → maintain weight, aim for min
  if (reps < min) {
    return {
      weight,
      targetReps: min,
      reason: `Below target range — maintain ${weight} kg and aim for ${min} reps.`,
    };
  }

  // Case 2: Within target range → maintain weight, aim for +1 rep
  return {
    weight,
    targetReps: Math.min(reps + 1, max),
    reason: `Within range — maintain ${weight} kg and aim for ${reps + 1} reps.`,
  };
}

function roundToNearest(value: number, increment: number): number {
  return Math.round(value / increment) * increment;
}

export { DEFAULT_WEIGHT_INCREMENT, DEFAULT_WEIGHT_INCREMENT_LOWER };
