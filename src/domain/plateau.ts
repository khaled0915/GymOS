/**
 * Plateau Intelligence domain — evaluates stagnation across consecutive workouts
 * and provides deterministic recovery / progression advice.
 */

export interface ExerciseSessionHistory {
  date: Date;
  topWeight: number;
  topReps: number;
  totalVolume: number;
  avgRpe?: number;
}

export type PlateauStatus = "PROGRESSING" | "MAINTAINING" | "PLATEAU_DETECTED";

export interface PlateauAnalysis {
  status: PlateauStatus;
  consecutiveStalledSessions: number;
  reason: string;
  recommendation?: string;
  suggestedWeightDelta?: number; // e.g. -10% for deload
}

/**
 * Analyze exercise history to detect progression or plateaus.
 * Rule: If top weight & top reps do not increase over 3 or more consecutive sessions,
 * a plateau is detected.
 */
export function analyzeExercisePlateau(
  history: ExerciseSessionHistory[],
  options?: { minSessionsToEvaluate?: number; deloadThreshold?: number }
): PlateauAnalysis {
  const minSessions = options?.minSessionsToEvaluate ?? 3;
  const deloadThreshold = options?.deloadThreshold ?? 3;

  if (history.length < minSessions) {
    return {
      status: "PROGRESSING",
      consecutiveStalledSessions: 0,
      reason: `Need at least ${minSessions} sessions to evaluate plateau trends.`,
    };
  }

  // Sort chronological
  const sorted = [...history].sort((a, b) => a.date.getTime() - b.date.getTime());
  const recent = sorted.slice(-minSessions);

  let stalledCount = 0;
  for (let i = 1; i < recent.length; i++) {
    const prev = recent[i - 1]!;
    const curr = recent[i]!;

    const weightIncreased = curr.topWeight > prev.topWeight;
    const repsIncreasedAtSameWeight = curr.topWeight === prev.topWeight && curr.topReps > prev.topReps;
    const volumeIncreasedSignificantly = curr.totalVolume > prev.totalVolume * 1.05;

    if (!weightIncreased && !repsIncreasedAtSameWeight && !volumeIncreasedSignificantly) {
      stalledCount++;
    }
  }

  if (stalledCount >= deloadThreshold - 1) {
    const lastSession = recent[recent.length - 1]!;
    const deloadWeight = Math.round(lastSession.topWeight * 0.9 * 2) / 2; // -10% rounded to 0.5kg
    return {
      status: "PLATEAU_DETECTED",
      consecutiveStalledSessions: stalledCount + 1,
      reason: `No progression in weight or reps over the last ${stalledCount + 1} sessions.`,
      recommendation: `Consider a 1-week deload at ${deloadWeight} kg (-10%) or switch to an alternate exercise variation to stimulate new adaptation.`,
      suggestedWeightDelta: -0.1,
    };
  }

  return {
    status: "PROGRESSING",
    consecutiveStalledSessions: stalledCount,
    reason: "Consistent overload or volume progression detected.",
  };
}
