import { describe, it, expect } from "vitest";
import {
  calculateAllOneRepMaxes,
  evaluateStrengthStandard,
} from "../../src/domain/strength-standards";

describe("calculateAllOneRepMaxes", () => {
  it("returns exact weight for 1 rep", () => {
    const res = calculateAllOneRepMaxes(100, 1);
    expect(res.epley).toBe(100);
    expect(res.brzycki).toBe(100);
    expect(res.average).toBe(100);
  });

  it("calculates multi-formula 1RM for 100kg x 5 reps", () => {
    const res = calculateAllOneRepMaxes(100, 5);
    // Epley: 100 * (1 + 5/30) = 116.7
    expect(res.epley).toBeCloseTo(116.7, 0);
    expect(res.brzycki).toBeGreaterThan(110);
    expect(res.lombardi).toBeGreaterThan(110);
    expect(res.average).toBeGreaterThan(110);
  });

  it("throws for non-positive inputs", () => {
    expect(() => calculateAllOneRepMaxes(0, 5)).toThrow();
    expect(() => calculateAllOneRepMaxes(100, -2)).toThrow();
  });
});

describe("evaluateStrengthStandard", () => {
  it("evaluates bench press standard accurately", () => {
    // 80kg lifter benching 100kg (1.25x bodyweight) -> Intermediate (1.2x)
    const evalResult = evaluateStrengthStandard("BENCH_PRESS", 100, 80);
    expect(evalResult.tier).toBe("INTERMEDIATE");
    expect(evalResult.ratio).toBe(1.25);
    expect(evalResult.liftName).toBe("Bench Press");
    expect(evalResult.nextTierThresholdKg).toBe(128); // 1.6x 80kg = 128kg for Advanced
  });

  it("evaluates beginner squat accurately", () => {
    // 70kg lifter squatting 50kg (0.71x bodyweight) -> Beginner (< 0.8x)
    const evalResult = evaluateStrengthStandard("SQUAT", 50, 70);
    expect(evalResult.tier).toBe("BEGINNER");
  });

  it("evaluates elite deadlift accurately", () => {
    // 80kg lifter deadlifting 230kg (2.875x bodyweight) -> Elite (>= 2.8x)
    const evalResult = evaluateStrengthStandard("DEADLIFT", 230, 80);
    expect(evalResult.tier).toBe("ELITE");
  });
});
