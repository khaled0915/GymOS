import { describe, it, expect } from "vitest";
import {
  calculateConsistencyScore,
  analyzeMuscleBalance,
  generateCoachHighlights,
  type CoachWorkoutData,
} from "../../src/domain/coach";

describe("calculateConsistencyScore", () => {
  it("calculates percentage accurately", () => {
    expect(calculateConsistencyScore(3, 4)).toBe(75);
    expect(calculateConsistencyScore(4, 4)).toBe(100);
    expect(calculateConsistencyScore(5, 4)).toBe(100); // capped at 100
  });

  it("handles 0 target frequency", () => {
    expect(calculateConsistencyScore(0, 0)).toBe(100);
  });
});

describe("analyzeMuscleBalance", () => {
  it("calculates upper vs lower body volume ratio", () => {
    const workouts: CoachWorkoutData[] = [
      {
        completedAt: new Date(),
        exerciseSessions: [
          { primaryMuscle: "CHEST", sets: [{ weight: 100, repetitions: 10 }] }, // 1000 upper
          { primaryMuscle: "BACK", sets: [{ weight: 100, repetitions: 10 }] }, // 1000 upper
          { primaryMuscle: "LEGS", sets: [{ weight: 200, repetitions: 10 }] }, // 2000 lower
        ],
      },
    ];

    const result = analyzeMuscleBalance(workouts);
    expect(result.upperVolume).toBe(2000);
    expect(result.lowerVolume).toBe(2000);
    expect(result.balanceRatio).toContain("50% Upper / 50% Lower");
  });

  it("warns when lower body volume is low", () => {
    const workouts: CoachWorkoutData[] = [
      {
        completedAt: new Date(),
        exerciseSessions: [
          { primaryMuscle: "CHEST", sets: [{ weight: 100, repetitions: 10 }] },
          { primaryMuscle: "BACK", sets: [{ weight: 100, repetitions: 10 }] },
          { primaryMuscle: "SHOULDERS", sets: [{ weight: 100, repetitions: 10 }] },
          { primaryMuscle: "LEGS", sets: [{ weight: 50, repetitions: 5 }] }, // 250 lower
        ],
      },
    ];

    const result = analyzeMuscleBalance(workouts);
    expect(result.advice).toContain("Lower body volume is low");
  });
});

describe("generateCoachHighlights", () => {
  it("includes target reached and pr highlights", () => {
    const highlights = generateCoachHighlights({
      completedThisWeek: 4,
      targetFrequency: 4,
      totalPrs: 2,
      totalVolume: 15000,
    });

    expect(highlights.some((h) => h.includes("Target reached"))).toBe(true);
    expect(highlights.some((h) => h.includes("personal record"))).toBe(true);
    expect(highlights.some((h) => h.includes("volume logged"))).toBe(true);
  });
});
