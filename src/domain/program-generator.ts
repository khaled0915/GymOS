/**
 * Program Generator domain — automatically generates structured workout programs
 * based on training goal, weekly frequency, and equipment availability.
 */

export interface GeneratedDayExercise {
  exerciseSlug: string;
  name: string;
  primaryMuscle: string;
  targetSets: number;
  minReps: number;
  maxReps: number;
  restSeconds: number;
}

export interface GeneratedWorkoutDay {
  name: string;
  order: number;
  exercises: GeneratedDayExercise[];
}

export interface GeneratedProgram {
  name: string;
  description: string;
  days: GeneratedWorkoutDay[];
}

export function generateProgramTemplate(options: {
  goal: "MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS";
  frequencyDays: 3 | 4 | 5 | 6;
  equipment?: "FULL_GYM" | "DUMBBELLS" | "BODYWEIGHT";
}): GeneratedProgram {
  const { goal, frequencyDays } = options;

  let repRange = { min: 8, max: 12 };
  let restSec = 90;
  if (goal === "STRENGTH") {
    repRange = { min: 4, max: 6 };
    restSec = 150;
  } else if (goal === "FAT_LOSS") {
    repRange = { min: 10, max: 15 };
    restSec = 60;
  }

  // 3-Day Split: Full Body A / B / C
  if (frequencyDays === 3) {
    return {
      name: `Full Body 3-Day (${goal.replace("_", " ")})`,
      description: `Balanced 3-day full body training split optimized for ${goal.toLowerCase().replace("_", " ")}.`,
      days: [
        {
          name: "Full Body A",
          order: 1,
          exercises: [
            { exerciseSlug: "barbell-bench-press", name: "Barbell Bench Press", primaryMuscle: "CHEST", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "barbell-squat", name: "Barbell Squat", primaryMuscle: "LEGS", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "lat-pulldown", name: "Lat Pulldown", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "standing-overhead-press", name: "Overhead Press", primaryMuscle: "SHOULDERS", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "barbell-curl", name: "Barbell Curl", primaryMuscle: "BICEPS", targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60 },
          ],
        },
        {
          name: "Full Body B",
          order: 2,
          exercises: [
            { exerciseSlug: "incline-dumbbell-press", name: "Incline DB Press", primaryMuscle: "CHEST", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "romanian-deadlift", name: "Romanian Deadlift", primaryMuscle: "GLUTES", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "seated-cable-row", name: "Seated Cable Row", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "dumbbell-lateral-raise", name: "Lateral Raise", primaryMuscle: "SHOULDERS", targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60 },
            { exerciseSlug: "triceps-rope-pushdown", name: "Triceps Pushdown", primaryMuscle: "TRICEPS", targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60 },
          ],
        },
        {
          name: "Full Body C",
          order: 3,
          exercises: [
            { exerciseSlug: "leg-press", name: "Leg Press", primaryMuscle: "LEGS", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "dumbbell-chest-fly", name: "Dumbbell Fly", primaryMuscle: "CHEST", targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60 },
            { exerciseSlug: "single-arm-dumbbell-row", name: "DB Row", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "hanging-leg-raise", name: "Hanging Leg Raise", primaryMuscle: "ABS", targetSets: 3, minReps: 10, maxReps: 15, restSeconds: 60 },
          ],
        },
      ],
    };
  }

  // 4-Day Split: Upper / Lower / Upper / Lower
  if (frequencyDays === 4) {
    return {
      name: `Upper / Lower 4-Day (${goal.replace("_", " ")})`,
      description: `Hypertrophy & strength 4-day split with dedicated upper and lower sessions.`,
      days: [
        {
          name: "Upper Body 1",
          order: 1,
          exercises: [
            { exerciseSlug: "barbell-bench-press", name: "Barbell Bench Press", primaryMuscle: "CHEST", targetSets: 4, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "lat-pulldown", name: "Lat Pulldown", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "standing-overhead-press", name: "Overhead Press", primaryMuscle: "SHOULDERS", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "seated-cable-row", name: "Seated Cable Row", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "triceps-rope-pushdown", name: "Triceps Pushdown", primaryMuscle: "TRICEPS", targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60 },
          ],
        },
        {
          name: "Lower Body 1",
          order: 2,
          exercises: [
            { exerciseSlug: "barbell-squat", name: "Barbell Squat", primaryMuscle: "LEGS", targetSets: 4, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "romanian-deadlift", name: "Romanian Deadlift", primaryMuscle: "GLUTES", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "leg-press", name: "Leg Press", primaryMuscle: "LEGS", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "standing-calf-raise", name: "Calf Raise", primaryMuscle: "CALVES", targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60 },
            { exerciseSlug: "cable-woodchopper", name: "Cable Woodchopper", primaryMuscle: "ABS", targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60 },
          ],
        },
        {
          name: "Upper Body 2",
          order: 3,
          exercises: [
            { exerciseSlug: "incline-dumbbell-press", name: "Incline DB Press", primaryMuscle: "CHEST", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "single-arm-dumbbell-row", name: "DB Row", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "dumbbell-lateral-raise", name: "Lateral Raise", primaryMuscle: "SHOULDERS", targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60 },
            { exerciseSlug: "barbell-curl", name: "Barbell Curl", primaryMuscle: "BICEPS", targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60 },
            { exerciseSlug: "dumbbell-chest-fly", name: "Dumbbell Fly", primaryMuscle: "CHEST", targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60 },
          ],
        },
        {
          name: "Lower Body 2",
          order: 4,
          exercises: [
            { exerciseSlug: "deadlift", name: "Conventional Deadlift", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "leg-press", name: "Leg Press", primaryMuscle: "LEGS", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
            { exerciseSlug: "hanging-leg-raise", name: "Hanging Leg Raise", primaryMuscle: "ABS", targetSets: 3, minReps: 10, maxReps: 15, restSeconds: 60 },
            { exerciseSlug: "standing-calf-raise", name: "Calf Raise", primaryMuscle: "CALVES", targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60 },
          ],
        },
      ],
    };
  }

  // 5 or 6-Day Split: Push / Pull / Legs
  return {
    name: `Push / Pull / Legs (${goal.replace("_", " ")})`,
    description: `Classic high-frequency PPL routine targeting every muscle group with optimal recovery.`,
    days: [
      {
        name: "Push (Chest, Shoulders, Triceps)",
        order: 1,
        exercises: [
          { exerciseSlug: "barbell-bench-press", name: "Bench Press", primaryMuscle: "CHEST", targetSets: 4, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
          { exerciseSlug: "standing-overhead-press", name: "Overhead Press", primaryMuscle: "SHOULDERS", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
          { exerciseSlug: "incline-dumbbell-press", name: "Incline DB Press", primaryMuscle: "CHEST", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
          { exerciseSlug: "dumbbell-lateral-raise", name: "Lateral Raise", primaryMuscle: "SHOULDERS", targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60 },
          { exerciseSlug: "triceps-rope-pushdown", name: "Triceps Pushdown", primaryMuscle: "TRICEPS", targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60 },
        ],
      },
      {
        name: "Pull (Back, Biceps)",
        order: 2,
        exercises: [
          { exerciseSlug: "deadlift", name: "Deadlift", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
          { exerciseSlug: "lat-pulldown", name: "Lat Pulldown", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
          { exerciseSlug: "seated-cable-row", name: "Seated Cable Row", primaryMuscle: "BACK", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
          { exerciseSlug: "barbell-curl", name: "Barbell Curl", primaryMuscle: "BICEPS", targetSets: 3, minReps: 10, maxReps: 12, restSeconds: 60 },
          { exerciseSlug: "hanging-leg-raise", name: "Hanging Leg Raise", primaryMuscle: "ABS", targetSets: 3, minReps: 10, maxReps: 15, restSeconds: 60 },
        ],
      },
      {
        name: "Legs (Quads, Hamstrings, Calves)",
        order: 3,
        exercises: [
          { exerciseSlug: "barbell-squat", name: "Barbell Squat", primaryMuscle: "LEGS", targetSets: 4, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
          { exerciseSlug: "romanian-deadlift", name: "Romanian Deadlift", primaryMuscle: "GLUTES", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
          { exerciseSlug: "leg-press", name: "Leg Press", primaryMuscle: "LEGS", targetSets: 3, minReps: repRange.min, maxReps: repRange.max, restSeconds: restSec },
          { exerciseSlug: "standing-calf-raise", name: "Calf Raise", primaryMuscle: "CALVES", targetSets: 3, minReps: 12, maxReps: 15, restSeconds: 60 },
        ],
      },
    ],
  };
}
