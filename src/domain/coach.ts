/**
 * Coach domain — pure intelligence calculations for training consistency,
 * muscle group balance, progression rate, and coaching insights.
 */

export interface CoachWorkoutData {
  completedAt: Date;
  exerciseSessions: {
    primaryMuscle: string;
    sets: { weight: number; repetitions: number }[];
  }[];
}

export interface CoachInsights {
  consistencyScore: number; // 0-100%
  completedThisWeek: number;
  targetFrequency: number;
  muscleBalance: {
    upperVolume: number;
    lowerVolume: number;
    balanceRatio: string;
    advice: string;
  };
  highlights: string[];
}

const UPPER_MUSCLES = new Set(["CHEST", "BACK", "SHOULDERS", "BICEPS", "TRICEPS", "ABS"]);
const LOWER_MUSCLES = new Set(["LEGS", "GLUTES", "CALVES"]);

/**
 * Calculate weekly consistency score based on target weekly workout frequency.
 */
export function calculateConsistencyScore(completedCount: number, targetFrequency: number): number {
  if (targetFrequency <= 0) return 100;
  const ratio = completedCount / targetFrequency;
  return Math.min(100, Math.round(ratio * 100));
}

/**
 * Analyze muscle balance between upper and lower body volume.
 */
export function analyzeMuscleBalance(workouts: CoachWorkoutData[]): {
  upperVolume: number;
  lowerVolume: number;
  balanceRatio: string;
  advice: string;
} {
  let upper = 0;
  let lower = 0;

  for (const w of workouts) {
    for (const es of w.exerciseSessions) {
      const vol = es.sets.reduce((sum, s) => sum + s.weight * s.repetitions, 0);
      if (UPPER_MUSCLES.has(es.primaryMuscle)) {
        upper += vol;
      } else if (LOWER_MUSCLES.has(es.primaryMuscle)) {
        lower += vol;
      }
    }
  }

  const total = upper + lower;
  if (total === 0) {
    return {
      upperVolume: 0,
      lowerVolume: 0,
      balanceRatio: "No Data",
      advice: "Complete a few workouts to analyze muscle balance.",
    };
  }

  const upperPct = Math.round((upper / total) * 100);
  const lowerPct = Math.round((lower / total) * 100);
  const balanceRatio = `${upperPct}% Upper / ${lowerPct}% Lower`;

  let advice = "Great balance between upper and lower body stimulus!";
  if (lowerPct < 25) {
    advice = "Lower body volume is low. Consider adding more leg and glute training for balanced development.";
  } else if (upperPct < 40) {
    advice = "Upper body volume is lower than optimal. Consider adding more chest, back, and shoulder work.";
  }

  return {
    upperVolume: Math.round(upper),
    lowerVolume: Math.round(lower),
    balanceRatio,
    advice,
  };
}

/**
 * Generate actionable coach highlights.
 */
export function generateCoachHighlights(data: {
  completedThisWeek: number;
  targetFrequency: number;
  totalPrs: number;
  totalVolume: number;
}): string[] {
  const highlights: string[] = [];

  if (data.completedThisWeek >= data.targetFrequency) {
    highlights.push(`🎯 Target reached! Completed ${data.completedThisWeek}/${data.targetFrequency} sessions this week.`);
  } else {
    highlights.push(`⚡ ${data.targetFrequency - data.completedThisWeek} more workout(s) needed to hit your weekly goal of ${data.targetFrequency}.`);
  }

  if (data.totalPrs > 0) {
    highlights.push(`🔥 Incredible strength! You achieved ${data.totalPrs} personal record(s) recently.`);
  }

  if (data.totalVolume > 10000) {
    highlights.push(`💪 Heavy lifting: Over ${(data.totalVolume / 1000).toFixed(1)}k kg of volume logged!`);
  }

  return highlights;
}
