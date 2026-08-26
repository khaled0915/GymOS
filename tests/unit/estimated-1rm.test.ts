import { describe, it, expect } from "vitest";
import { epley, brzycki, estimateOneRepMax } from "@/domain/estimated-1rm";

describe("epley", () => {
  it("should return weight itself for 1 rep", () => {
    expect(epley(100, 1)).toBe(100);
  });

  it("should calculate E1RM correctly", () => {
    // 100 × (1 + 10/30) = 100 × 1.3333 = 133.33
    expect(epley(100, 10)).toBeCloseTo(133.33, 1);
  });

  it("should throw for non-positive weight", () => {
    expect(() => epley(0, 5)).toThrow();
    expect(() => epley(-10, 5)).toThrow();
  });

  it("should throw for non-positive reps", () => {
    expect(() => epley(100, 0)).toThrow();
    expect(() => epley(100, -1)).toThrow();
  });
});

describe("brzycki", () => {
  it("should return weight itself for 1 rep", () => {
    expect(brzycki(100, 1)).toBe(100);
  });

  it("should calculate E1RM correctly", () => {
    // 100 × (36 / (37 - 10)) = 100 × (36/27) = 133.33
    expect(brzycki(100, 10)).toBeCloseTo(133.33, 1);
  });

  it("should throw for reps >= 37", () => {
    expect(() => brzycki(100, 37)).toThrow();
  });
});

describe("estimateOneRepMax", () => {
  it("should use Epley formula by default", () => {
    expect(estimateOneRepMax(60, 8)).toBe(epley(60, 8));
  });
});
