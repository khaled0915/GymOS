/**
 * Warm-Up Sets Generator domain.
 * Generates scientific progressive ramp-up sets for compound and heavy lifts.
 */

export interface WarmUpSet {
  setNumber: number;
  percentage: number;
  weight: number;
  reps: number;
  label: string;
  restSeconds: number;
}

/**
 * Generate warm-up sets based on target working set weight.
 */
export function generateWarmUpSets(
  workingWeightKg: number,
  options?: { barWeightKg?: number }
): WarmUpSet[] {
  if (workingWeightKg <= 0) {
    throw new Error("Working weight must be positive");
  }

  const barWeight = options?.barWeightKg ?? 20;

  // If working weight is very light (<= bar weight), 1 simple light set is sufficient
  if (workingWeightKg <= barWeight + 5) {
    return [
      {
        setNumber: 1,
        percentage: 100,
        weight: workingWeightKg,
        reps: 8,
        label: "Light Primer",
        restSeconds: 45,
      },
    ];
  }

  const sets: WarmUpSet[] = [];

  // Set 1: Bar or 40% of target (minimum bar weight)
  const set1Weight = Math.max(barWeight, Math.round((workingWeightKg * 0.40) / 2.5) * 2.5);
  sets.push({
    setNumber: 1,
    percentage: Math.round((set1Weight / workingWeightKg) * 100),
    weight: set1Weight,
    reps: 8,
    label: "Joint Primer",
    restSeconds: 45,
  });

  // Set 2: 60% of target
  const set2Weight = Math.max(set1Weight + 5, Math.round((workingWeightKg * 0.60) / 2.5) * 2.5);
  if (set2Weight < workingWeightKg) {
    sets.push({
      setNumber: 2,
      percentage: Math.round((set2Weight / workingWeightKg) * 100),
      weight: set2Weight,
      reps: 5,
      label: "Movement Groove",
      restSeconds: 60,
    });
  }

  // Set 3: 80% of target
  const set3Weight = Math.max(set2Weight + 5, Math.round((workingWeightKg * 0.80) / 2.5) * 2.5);
  if (set3Weight < workingWeightKg) {
    sets.push({
      setNumber: 3,
      percentage: Math.round((set3Weight / workingWeightKg) * 100),
      weight: set3Weight,
      reps: 3,
      label: "Neural Potentiation",
      restSeconds: 90,
    });
  }

  // Set 4: 90% single if target is heavy (>= 100kg)
  if (workingWeightKg >= 100) {
    const set4Weight = Math.round((workingWeightKg * 0.90) / 2.5) * 2.5;
    if (set4Weight > set3Weight && set4Weight < workingWeightKg) {
      sets.push({
        setNumber: 4,
        percentage: Math.round((set4Weight / workingWeightKg) * 100),
        weight: set4Weight,
        reps: 1,
        label: "Heavy Feeler",
        restSeconds: 90,
      });
    }
  }

  return sets;
}
