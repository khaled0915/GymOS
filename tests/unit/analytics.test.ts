import { describe, it, expect } from "vitest";
import {
  calculateTotalVolume,
  aggregateVolumeByMuscleGroup,
  aggregateVolumeByWeek,
  getExerciseProgression,
  calculateAverageWorkoutDuration,
  getWorkoutFrequencyByDay,
  calculateTotalSets,
  type AnalyticsWorkout,
} from "../../src/domain/analytics";

const makeWorkout = (
  dateStr: string,
  durationSeconds: number | null,
  exercises: {
    exerciseId: string;
    exerciseName: string;
    primaryMuscle: string;
    sets: { weight: number; repetitions: number }[];
  }[],
): AnalyticsWorkout => ({
  completedAt: new Date(dateStr),
  durationSeconds,
  exerciseSessions: exercises,
});

const sampleWorkouts: AnalyticsWorkout[] = [
  makeWorkout("2025-01-06T10:00:00Z", 3600, [
    // Monday
    {
      exerciseId: "bench",
      exerciseName: "Bench Press",
      primaryMuscle: "CHEST",
      sets: [
        { weight: 60, repetitions: 10 },
        { weight: 60, repetitions: 8 },
        { weight: 65, repetitions: 6 },
      ],
    },
    {
      exerciseId: "row",
      exerciseName: "Barbell Row",
      primaryMuscle: "BACK",
      sets: [
        { weight: 50, repetitions: 10 },
        { weight: 55, repetitions: 8 },
      ],
    },
  ]),
  makeWorkout("2025-01-08T10:00:00Z", 2700, [
    // Wednesday
    {
      exerciseId: "squat",
      exerciseName: "Squat",
      primaryMuscle: "LEGS",
      sets: [
        { weight: 80, repetitions: 8 },
        { weight: 80, repetitions: 8 },
      ],
    },
  ]),
  makeWorkout("2025-01-13T10:00:00Z", 3300, [
    // Next Monday
    {
      exerciseId: "bench",
      exerciseName: "Bench Press",
      primaryMuscle: "CHEST",
      sets: [
        { weight: 65, repetitions: 10 },
        { weight: 65, repetitions: 9 },
        { weight: 67.5, repetitions: 7 },
      ],
    },
  ]),
];

describe("calculateTotalVolume", () => {
  it("calculates volume as weight × reps summed across sets", () => {
    const sets = [
      { weight: 60, repetitions: 10 },
      { weight: 60, repetitions: 8 },
    ];
    expect(calculateTotalVolume(sets)).toBe(60 * 10 + 60 * 8);
  });

  it("returns 0 for empty sets", () => {
    expect(calculateTotalVolume([])).toBe(0);
  });
});

describe("aggregateVolumeByMuscleGroup", () => {
  it("groups volume by primary muscle", () => {
    const result = aggregateVolumeByMuscleGroup(sampleWorkouts);
    const chestEntry = result.find((r) => r.muscle === "CHEST");
    const backEntry = result.find((r) => r.muscle === "BACK");
    const legsEntry = result.find((r) => r.muscle === "LEGS");

    // Workout 1 chest: 60*10 + 60*8 + 65*6 = 600+480+390 = 1470
    // Workout 3 chest: 65*10 + 65*9 + 67.5*7 = 650+585+472.5 = 1707.5 → 1708
    expect(chestEntry).toBeDefined();
    expect(chestEntry!.volume).toBe(Math.round(1470 + 1707.5));

    // Back: 50*10 + 55*8 = 500+440 = 940
    expect(backEntry).toBeDefined();
    expect(backEntry!.volume).toBe(940);

    // Legs: 80*8 + 80*8 = 640+640 = 1280
    expect(legsEntry).toBeDefined();
    expect(legsEntry!.volume).toBe(1280);
  });

  it("sorts by volume descending", () => {
    const result = aggregateVolumeByMuscleGroup(sampleWorkouts);
    for (let i = 1; i < result.length; i++) {
      expect(result[i]!.volume).toBeLessThanOrEqual(result[i - 1]!.volume);
    }
  });

  it("returns empty for no workouts", () => {
    expect(aggregateVolumeByMuscleGroup([])).toEqual([]);
  });
});

describe("aggregateVolumeByWeek", () => {
  it("groups workouts into ISO weeks", () => {
    const result = aggregateVolumeByWeek(sampleWorkouts);
    // Two weeks: 2025-01-06 and 2025-01-13
    expect(result).toHaveLength(2);
    expect(result[0]!.week).toBe("2025-01-06");
    expect(result[1]!.week).toBe("2025-01-13");
  });

  it("sums volume within the same week", () => {
    const result = aggregateVolumeByWeek(sampleWorkouts);
    // Week 1 (Jan 6): Workout 1 + Workout 2
    // Workout 1: 1470 + 940 = 2410
    // Workout 2: 1280
    // Total: 3690
    expect(result[0]!.volume).toBe(3690);
  });
});

describe("getExerciseProgression", () => {
  it("tracks best weight per session for an exercise", () => {
    const result = getExerciseProgression(sampleWorkouts, "bench");
    expect(result).toHaveLength(2);
    expect(result[0]!.weight).toBe(65); // Best set in workout 1
    expect(result[1]!.weight).toBe(67.5); // Best set in workout 3
  });

  it("returns empty for unknown exercise", () => {
    expect(getExerciseProgression(sampleWorkouts, "unknown")).toEqual([]);
  });
});

describe("calculateAverageWorkoutDuration", () => {
  it("calculates average in minutes", () => {
    // 3600 + 2700 + 3300 = 9600 / 3 = 3200 seconds = 53.33 → 53 minutes
    expect(calculateAverageWorkoutDuration(sampleWorkouts)).toBe(53);
  });

  it("returns 0 for no workouts", () => {
    expect(calculateAverageWorkoutDuration([])).toBe(0);
  });

  it("ignores workouts with null duration", () => {
    const workouts = [
      makeWorkout("2025-01-06", null, []),
      makeWorkout("2025-01-07", 3600, []),
    ];
    expect(calculateAverageWorkoutDuration(workouts)).toBe(60);
  });
});

describe("getWorkoutFrequencyByDay", () => {
  it("counts workouts per day of week", () => {
    const result = getWorkoutFrequencyByDay(sampleWorkouts);
    expect(result).toHaveLength(7);
    // Jan 6 2025 = Monday, Jan 8 = Wednesday, Jan 13 = Monday
    const monday = result.find((r) => r.day === "Mon");
    const wednesday = result.find((r) => r.day === "Wed");
    expect(monday!.count).toBe(2);
    expect(wednesday!.count).toBe(1);
  });
});

describe("calculateTotalSets", () => {
  it("counts all sets across all workouts", () => {
    // Workout 1: 3+2=5, Workout 2: 2, Workout 3: 3 → 10
    expect(calculateTotalSets(sampleWorkouts)).toBe(10);
  });

  it("returns 0 for empty", () => {
    expect(calculateTotalSets([])).toBe(0);
  });
});
