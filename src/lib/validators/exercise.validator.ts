import { z } from "zod";

const muscleGroupEnum = z.enum([
  "CHEST", "BACK", "SHOULDERS", "BICEPS", "TRICEPS",
  "LEGS", "GLUTES", "ABS", "CALVES", "CARDIO",
]);

const equipmentEnum = z.enum([
  "BARBELL", "DUMBBELL", "CABLE", "MACHINE",
  "BODYWEIGHT", "BAND", "KETTLEBELL", "OTHER",
]);

const difficultyEnum = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);

export const createExerciseSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  primaryMuscle: muscleGroupEnum,
  secondaryMuscles: z.array(muscleGroupEnum).default([]),
  equipment: equipmentEnum.optional(),
  difficulty: difficultyEnum.optional(),
  instructions: z.string().max(5000).optional(),
  mediaUrl: z.string().url().optional(),
});

export const updateExerciseSchema = createExerciseSchema.partial();

export const exerciseSearchSchema = z.object({
  query: z.string().optional(),
  muscle: muscleGroupEnum.optional(),
  equipment: equipmentEnum.optional(),
  difficulty: difficultyEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateExerciseInput = z.infer<typeof createExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof updateExerciseSchema>;
export type ExerciseSearchInput = z.infer<typeof exerciseSearchSchema>;
