import { describe, it, expect } from "vitest";
import { analyzeExercisePlateau, type ExerciseSessionHistory } from "../../src/domain/plateau";

describe("analyzeExercisePlateau", () => {
  it("reports progressing when weight or reps steadily increase", () => {
    const history: ExerciseSessionHistory[] = [
      { date: new Date("2025-01-01"), topWeight: 80, topReps: 8, totalVolume: 1920 },
      { date: new Date("2025-01-08"), topWeight: 80, topReps: 10, totalVolume: 2400 },
      { date: new Date("2025-01-15"), topWeight: 82.5, topReps: 8, totalVolume: 2500 },
    ];
    const analysis = analyzeExercisePlateau(history);
    expect(analysis.status).toBe("PROGRESSING");
  });

  it("detects plateau when weight and reps are stuck for 3 consecutive sessions", () => {
    const history: ExerciseSessionHistory[] = [
      { date: new Date("2025-01-01"), topWeight: 100, topReps: 5, totalVolume: 1500 },
      { date: new Date("2025-01-08"), topWeight: 100, topReps: 5, totalVolume: 1500 },
      { date: new Date("2025-01-15"), topWeight: 100, topReps: 5, totalVolume: 1500 },
    ];
    const analysis = analyzeExercisePlateau(history);
    expect(analysis.status).toBe("PLATEAU_DETECTED");
    expect(analysis.consecutiveStalledSessions).toBeGreaterThanOrEqual(3);
    expect(analysis.recommendation).toContain("deload");
  });

  it("handles insufficient history gracefully", () => {
    const history: ExerciseSessionHistory[] = [
      { date: new Date("2025-01-01"), topWeight: 100, topReps: 5, totalVolume: 1500 },
    ];
    const analysis = analyzeExercisePlateau(history);
    expect(analysis.status).toBe("PROGRESSING");
    expect(analysis.reason).toContain("Need at least 3 sessions");
  });
});
