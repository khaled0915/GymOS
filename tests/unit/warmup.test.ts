import { describe, it, expect } from "vitest";
import { generateWarmUpSets } from "../../src/domain/warmup";

describe("generateWarmUpSets", () => {
  it("generates progressive warm-up sets for 100kg working weight", () => {
    const sets = generateWarmUpSets(100);
    // Should have 4 progressive sets
    expect(sets.length).toBeGreaterThanOrEqual(3);
    // Set 1: ~40% (40kg)
    expect(sets[0]!.weight).toBe(40);
    expect(sets[0]!.reps).toBe(8);
    // Set 2: ~60% (60kg)
    expect(sets[1]!.weight).toBe(60);
    expect(sets[1]!.reps).toBe(5);
    // Set 3: ~80% (80kg)
    expect(sets[2]!.weight).toBe(80);
    expect(sets[2]!.reps).toBe(3);
  });

  it("handles light weights safely", () => {
    const sets = generateWarmUpSets(20);
    expect(sets).toHaveLength(1);
    expect(sets[0]!.weight).toBe(20);
  });

  it("throws for non-positive weight", () => {
    expect(() => generateWarmUpSets(0)).toThrow();
  });
});
