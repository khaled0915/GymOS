import { describe, it, expect } from "vitest";
import { evaluateMuscleVolumeLandmarks } from "../../src/domain/volume-landmarks";

describe("evaluateMuscleVolumeLandmarks", () => {
  it("classifies optimal hypertrophy volume correctly", () => {
    const sets = { CHEST: 14, BACK: 16, LEGS: 4 };
    const landmarks = evaluateMuscleVolumeLandmarks(sets);

    const chest = landmarks.find((l) => l.muscleGroup === "Chest")!;
    expect(chest.status).toBe("OPTIMAL");
    expect(chest.completedSets).toBe(14);

    const legs = landmarks.find((l) => l.muscleGroup === "Quads & Hamstrings")!;
    expect(legs.status).toBe("MAINTENANCE");
  });

  it("classifies overreaching volume when sets exceed 20", () => {
    const sets = { SHOULDERS: 25 };
    const landmarks = evaluateMuscleVolumeLandmarks(sets);

    const shoulders = landmarks.find((l) => l.muscleGroup === "Shoulders")!;
    expect(shoulders.status).toBe("OVERREACHING");
    expect(shoulders.recommendation).toContain("High volume");
  });
});
