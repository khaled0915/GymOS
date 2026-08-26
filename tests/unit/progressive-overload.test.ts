import { describe, it, expect } from "vitest";
import { getNextExerciseRecommendation } from "@/domain/progressive-overload";

describe("getNextExerciseRecommendation", () => {
  const repRange = { min: 8, max: 12 };

  it("should increase weight when at top of rep range", () => {
    const result = getNextExerciseRecommendation(
      { weight: 60, reps: 12 },
      repRange,
    );
    expect(result.weight).toBe(62.5);
    expect(result.targetReps).toBe(8);
  });

  it("should maintain weight and increase reps when within range", () => {
    const result = getNextExerciseRecommendation(
      { weight: 60, reps: 9 },
      repRange,
    );
    expect(result.weight).toBe(60);
    expect(result.targetReps).toBe(10);
  });

  it("should maintain weight and aim for min when below range", () => {
    const result = getNextExerciseRecommendation(
      { weight: 60, reps: 6 },
      repRange,
    );
    expect(result.weight).toBe(60);
    expect(result.targetReps).toBe(8);
  });

  it("should increase weight when RPE is low and near top of range", () => {
    const result = getNextExerciseRecommendation(
      { weight: 60, reps: 11, rpe: 6 },
      repRange,
    );
    expect(result.weight).toBe(62.5);
    expect(result.targetReps).toBe(8);
  });

  it("should not increase weight when RPE is high even at top of range", () => {
    const result = getNextExerciseRecommendation(
      { weight: 60, reps: 11, rpe: 9 },
      repRange,
    );
    expect(result.weight).toBe(60);
    expect(result.targetReps).toBe(12);
  });

  it("should use custom weight increment", () => {
    const result = getNextExerciseRecommendation(
      { weight: 20, reps: 12 },
      repRange,
      1.25,
    );
    expect(result.weight).toBe(21.25);
  });
});
