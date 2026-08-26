/**
 * Calculate volume for a single set.
 * Volume = weight × repetitions
 */
export function calculateSetVolume(weight: number, repetitions: number): number {
  if (weight < 0 || repetitions < 0) {
    throw new Error("Weight and repetitions must be non-negative");
  }
  return weight * repetitions;
}

/**
 * Calculate total volume for multiple sets.
 */
export function calculateTotalVolume(
  sets: Array<{ weight: number; repetitions: number }>,
): number {
  return sets.reduce((total, set) => total + calculateSetVolume(set.weight, set.repetitions), 0);
}

/**
 * Calculate total volume for a specific exercise across a workout session.
 */
export function calculateExerciseVolume(
  sets: Array<{ weight: number; repetitions: number; completed: boolean }>,
): number {
  return sets
    .filter((set) => set.completed)
    .reduce((total, set) => total + calculateSetVolume(set.weight, set.repetitions), 0);
}
