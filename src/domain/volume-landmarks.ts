/**
 * Hypertrophy Volume Landmarks domain.
 * Evaluates weekly direct working sets against scientific hypertrophy ranges (MEV, MAV, MRV).
 */

export type VolumeStatus = "MAINTENANCE" | "UNDER_STIMULATED" | "OPTIMAL" | "OVERREACHING";

export interface MuscleVolumeLandmark {
  muscleGroup: string;
  completedSets: number;
  mev: number; // Minimum effective (6-8)
  mavMin: number; // Optimal min (10)
  mavMax: number; // Optimal max (20)
  mrv: number; // Max recoverable (22+)
  status: VolumeStatus;
  progressPct: number; // progress towards 10-20 optimal zone
  recommendation: string;
}

export function evaluateMuscleVolumeLandmarks(
  setsByMuscle: Record<string, number>
): MuscleVolumeLandmark[] {
  const trackedMuscles = [
    { key: "CHEST", name: "Chest", mev: 8, mavMin: 12, mavMax: 20, mrv: 22 },
    { key: "BACK", name: "Back", mev: 8, mavMin: 14, mavMax: 22, mrv: 25 },
    { key: "LEGS", name: "Quads & Hamstrings", mev: 8, mavMin: 12, mavMax: 20, mrv: 22 },
    { key: "SHOULDERS", name: "Shoulders", mev: 6, mavMin: 12, mavMax: 20, mrv: 24 },
    { key: "BICEPS", name: "Biceps", mev: 6, mavMin: 10, mavMax: 16, mrv: 20 },
    { key: "TRICEPS", name: "Triceps", mev: 6, mavMin: 10, mavMax: 16, mrv: 20 },
    { key: "GLUTES", name: "Glutes", mev: 6, mavMin: 10, mavMax: 18, mrv: 20 },
    { key: "ABS", name: "Core & Abs", mev: 4, mavMin: 8, mavMax: 16, mrv: 18 },
    { key: "CALVES", name: "Calves", mev: 6, mavMin: 10, mavMax: 16, mrv: 20 },
  ];

  return trackedMuscles.map((m) => {
    const completedSets = setsByMuscle[m.key] ?? 0;
    let status: VolumeStatus = "MAINTENANCE";
    let recommendation = "Maintenance volume. Add more sets if this is a priority growth muscle.";

    if (completedSets < m.mev) {
      status = "MAINTENANCE";
      recommendation = `Low volume (${completedSets} sets). Below minimum effective threshold of ${m.mev} sets/week.`;
    } else if (completedSets < m.mavMin) {
      status = "UNDER_STIMULATED";
      recommendation = `Slightly below optimal (${completedSets}/${m.mavMin} sets). Add 2-4 sets for maximal growth.`;
    } else if (completedSets <= m.mavMax) {
      status = "OPTIMAL";
      recommendation = `Optimal hypertrophy stimulus (${completedSets} sets). In the peak adaptation zone.`;
    } else {
      status = "OVERREACHING";
      recommendation = `High volume (${completedSets} sets). Approaching maximum recoverable volume (${m.mrv}). Watch recovery.`;
    }

    const progressPct = Math.min(100, Math.round((completedSets / m.mavMax) * 100));

    return {
      muscleGroup: m.name,
      completedSets,
      mev: m.mev,
      mavMin: m.mavMin,
      mavMax: m.mavMax,
      mrv: m.mrv,
      status,
      progressPct,
      recommendation,
    };
  });
}
