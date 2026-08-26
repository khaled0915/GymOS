import { z } from "zod";

export const createProgramSchema = z.object({
  name: z.string().min(1, "Program name is required").max(200),
  description: z.string().max(1000).optional(),
});

export const updateProgramSchema = createProgramSchema.partial();

export const createWorkoutDaySchema = z.object({
  programId: z.string().cuid(),
  name: z.string().min(1, "Day name is required").max(200),
  order: z.number().int().nonnegative(),
});

export const updateWorkoutDaySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  order: z.number().int().nonnegative().optional(),
});

export const addPlannedExerciseSchema = z.object({
  workoutDayId: z.string().cuid(),
  exerciseId: z.string().cuid(),
  order: z.number().int().nonnegative(),
  targetSets: z.number().int().positive().max(20),
  minReps: z.number().int().positive().max(100),
  maxReps: z.number().int().positive().max(100),
  targetRpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().int().positive().max(600).optional(),
  notes: z.string().max(500).optional(),
}).refine((data) => data.maxReps >= data.minReps, {
  message: "Max reps must be >= min reps",
  path: ["maxReps"],
});

export const updatePlannedExerciseSchema = z.object({
  order: z.number().int().nonnegative().optional(),
  targetSets: z.number().int().positive().max(20).optional(),
  minReps: z.number().int().positive().max(100).optional(),
  maxReps: z.number().int().positive().max(100).optional(),
  targetRpe: z.number().min(1).max(10).optional(),
  restSeconds: z.number().int().positive().max(600).optional(),
  notes: z.string().max(500).optional(),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type CreateWorkoutDayInput = z.infer<typeof createWorkoutDaySchema>;
export type UpdateWorkoutDayInput = z.infer<typeof updateWorkoutDaySchema>;
export type AddPlannedExerciseInput = z.infer<typeof addPlannedExerciseSchema>;
export type UpdatePlannedExerciseInput = z.infer<typeof updatePlannedExerciseSchema>;
