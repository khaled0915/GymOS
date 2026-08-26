import { describe, it, expect } from "vitest";
import { generateProgramTemplate } from "../../src/domain/program-generator";

describe("generateProgramTemplate", () => {
  it("generates 3-day full body program", () => {
    const program = generateProgramTemplate({ goal: "MUSCLE_GAIN", frequencyDays: 3 });
    expect(program.days).toHaveLength(3);
    expect(program.days[0]!.name).toContain("Full Body A");
    expect(program.days[0]!.exercises.length).toBeGreaterThan(3);
    expect(program.days[0]!.exercises[0]!.targetSets).toBe(3);
  });

  it("generates 4-day upper/lower program", () => {
    const program = generateProgramTemplate({ goal: "STRENGTH", frequencyDays: 4 });
    expect(program.days).toHaveLength(4);
    expect(program.days[0]!.name).toContain("Upper Body");
    expect(program.days[1]!.name).toContain("Lower Body");
    // Strength sets have lower min reps
    expect(program.days[0]!.exercises[0]!.minReps).toBe(4);
  });

  it("generates 5 or 6 day PPL program", () => {
    const program = generateProgramTemplate({ goal: "FAT_LOSS", frequencyDays: 5 });
    expect(program.days).toHaveLength(3); // PPL cycle
    expect(program.days[0]!.name).toContain("Push");
    expect(program.days[1]!.name).toContain("Pull");
    expect(program.days[2]!.name).toContain("Legs");
  });
});
