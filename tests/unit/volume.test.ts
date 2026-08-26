import { describe, it, expect } from "vitest";
import {
  calculateSetVolume,
  calculateTotalVolume,
  calculateExerciseVolume,
} from "@/domain/volume";

describe("calculateSetVolume", () => {
  it("should calculate volume as weight × reps", () => {
    expect(calculateSetVolume(60, 10)).toBe(600);
  });

  it("should return 0 for 0 weight", () => {
    expect(calculateSetVolume(0, 10)).toBe(0);
  });

  it("should return 0 for 0 reps", () => {
    expect(calculateSetVolume(60, 0)).toBe(0);
  });

  it("should throw for negative weight", () => {
    expect(() => calculateSetVolume(-10, 5)).toThrow();
  });

  it("should throw for negative reps", () => {
    expect(() => calculateSetVolume(60, -1)).toThrow();
  });
});

describe("calculateTotalVolume", () => {
  it("should sum volume across multiple sets", () => {
    const sets = [
      { weight: 60, repetitions: 10 },
      { weight: 60, repetitions: 8 },
      { weight: 55, repetitions: 12 },
    ];
    expect(calculateTotalVolume(sets)).toBe(60 * 10 + 60 * 8 + 55 * 12);
  });

  it("should return 0 for empty array", () => {
    expect(calculateTotalVolume([])).toBe(0);
  });
});

describe("calculateExerciseVolume", () => {
  it("should only include completed sets", () => {
    const sets = [
      { weight: 60, repetitions: 10, completed: true },
      { weight: 60, repetitions: 8, completed: false },
      { weight: 55, repetitions: 12, completed: true },
    ];
    expect(calculateExerciseVolume(sets)).toBe(60 * 10 + 55 * 12);
  });
});
