import { describe, it, expect } from "vitest";
import {
  calculateExerciseMuscleStimulus,
  calculateWorkoutMuscleStimulus,
  normalizeMuscleIntensities,
  getIntensityLevel,
  getIntensityColor,
} from "@/domain/muscles/muscle-stimulus";
import { MUSCLE_IDS } from "@/domain/muscles/muscle-types";

describe("Muscle Stimulus Domain Engine", () => {
  describe("calculateExerciseMuscleStimulus", () => {
    it("calculates Test 1: Bench Press (4 sets, primary: CHEST, secondary: SHOULDERS, TRICEPS)", () => {
      const exercise = {
        primaryMuscle: "CHEST" as const,
        secondaryMuscles: ["SHOULDERS" as const, "TRICEPS" as const],
      };

      const stimulus = calculateExerciseMuscleStimulus(exercise, 4);

      // Primary: 4 sets × 1.0 = 4.0
      expect(stimulus.chest).toBe(4);

      // Secondary: 4 sets × 0.45 = 1.8
      expect(stimulus.front_delts).toBeCloseTo(1.8, 2);
      expect(stimulus.triceps).toBeCloseTo(1.8, 2);

      // Untrained muscles remain 0
      expect(stimulus.quads).toBe(0);
      expect(stimulus.lats).toBe(0);
    });

    it("returns zero when completedSets is 0 or negative", () => {
      const exercise = { primaryMuscle: "CHEST" as const };
      const zeroResult = calculateExerciseMuscleStimulus(exercise, 0);
      expect(zeroResult.chest).toBe(0);

      const negResult = calculateExerciseMuscleStimulus(exercise, -2);
      expect(negResult.chest).toBe(0);
    });

    it("does not crash on missing or empty secondary muscles", () => {
      const exercise = { primaryMuscle: "BICEPS" as const };
      const result = calculateExerciseMuscleStimulus(exercise, 3);
      expect(result.biceps).toBe(3);
    });
  });

  describe("calculateWorkoutMuscleStimulus", () => {
    it("calculates Test 2: Combined workout (Bench Press, Lateral Raise, Triceps Pushdown)", () => {
      const workout = [
        {
          exercise: {
            primaryMuscle: "CHEST" as const,
            secondaryMuscles: ["SHOULDERS" as const, "TRICEPS" as const],
          },
          sets: [{ completed: true }, { completed: true }, { completed: true }], // 3 sets
        },
        {
          exercise: {
            primaryMuscle: "SHOULDERS" as const,
          },
          sets: [{ completed: true }, { completed: true }, { completed: true }], // 3 sets
        },
        {
          exercise: {
            primaryMuscle: "TRICEPS" as const,
          },
          sets: [{ completed: true }, { completed: true }, { completed: true }], // 3 sets
        },
      ];

      const stimulus = calculateWorkoutMuscleStimulus(workout);

      // Chest: 3 sets from bench = 3.0
      expect(stimulus.chest).toBe(3);

      // Triceps: 3 sets primary + (3 × 0.45 = 1.35) secondary from bench = 4.35
      expect(stimulus.triceps).toBeCloseTo(4.35, 2);

      // Side Delts: 3 sets primary from shoulders + 1.35 secondary from bench = 4.35
      expect(stimulus.side_delts).toBeCloseTo(4.35, 2);

      // Front Delts: 3 sets primary from shoulders + 1.35 secondary from bench = 4.35
      expect(stimulus.front_delts).toBeCloseTo(4.35, 2);
    });

    it("calculates Test 3: Only completed working sets contribute", () => {
      const workout = [
        {
          exercise: { primaryMuscle: "CHEST" as const },
          sets: [
            { completed: true },
            { completed: false }, // skipped set
            { completed: true },
          ],
        },
      ];

      const stimulus = calculateWorkoutMuscleStimulus(workout);
      // Only 2 completed sets should count
      expect(stimulus.chest).toBe(2);
    });

    it("handles empty workout or sessions with no sets gracefully (Test 4)", () => {
      expect(() => calculateWorkoutMuscleStimulus([])).not.toThrow();
      const res = calculateWorkoutMuscleStimulus([]);
      expect(res.chest).toBe(0);

      const emptySetsWorkout = [
        {
          exercise: { primaryMuscle: "LEGS" as const },
          sets: [],
        },
      ];
      expect(calculateWorkoutMuscleStimulus(emptySetsWorkout).quads).toBe(0);
    });
  });

  describe("normalizeMuscleIntensities", () => {
    it("calculates Test 5: Intensity normalization returns values strictly between 0 and 1", () => {
      const raw = {
        [MUSCLE_IDS.CHEST]: 10,
        [MUSCLE_IDS.TRICEPS]: 5,
        [MUSCLE_IDS.BICEPS]: 0,
      };

      const normalized = normalizeMuscleIntensities(raw);

      for (const item of normalized) {
        expect(item.intensity).toBeGreaterThanOrEqual(0);
        expect(item.intensity).toBeLessThanOrEqual(1);
      }

      const chestItem = normalized.find((n) => n.muscle === "chest");
      const tricepsItem = normalized.find((n) => n.muscle === "triceps");
      const bicepsItem = normalized.find((n) => n.muscle === "biceps");

      expect(chestItem?.intensity).toBe(1.0);
      expect(tricepsItem?.intensity).toBe(0.5);
      expect(bicepsItem?.intensity).toBe(0);
    });

    it("handles all-zero input safely", () => {
      const normalized = normalizeMuscleIntensities({});
      for (const item of normalized) {
        expect(item.intensity).toBe(0);
      }
    });
  });

  describe("Semantic level and styling mappings", () => {
    it("maps intensity values to appropriate semantic levels", () => {
      expect(getIntensityLevel(0)).toBe("INACTIVE");
      expect(getIntensityLevel(0.2)).toBe("LOW");
      expect(getIntensityLevel(0.5)).toBe("MODERATE");
      expect(getIntensityLevel(0.75)).toBe("HIGH");
      expect(getIntensityLevel(0.95)).toBe("VERY_HIGH");
    });

    it("returns valid athletic color tokens", () => {
      const activeColor = getIntensityColor(1.0);
      expect(activeColor.fill).toBe("#10B981");

      const inactiveColor = getIntensityColor(0);
      expect(inactiveColor.fill).toBe("#1A2230");
    });
  });
});
