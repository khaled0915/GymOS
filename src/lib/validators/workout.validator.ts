import { z } from "zod";

export const startWorkoutSchema = z.object({
  programId: z.string().cuid().optional(),
  workoutDayId: z.string().cuid().optional(),
  notes: z.string().max(1000).optional(),
});

export const completeWorkoutSchema = z.object({
  workoutSessionId: z.string().cuid(),
  notes: z.string().max(1000).optional(),
});

export const logSetSchema = z.object({
  exerciseSessionId: z.string().cuid(),
  setNumber: z.number().int().positive().max(50),
  weight: z.number().nonnegative().max(1000),
  repetitions: z.number().int().positive().max(500),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().max(500).optional(),
});

export const updateSetSchema = z.object({
  weight: z.number().nonnegative().max(1000).optional(),
  repetitions: z.number().int().positive().max(500).optional(),
  rpe: z.number().min(1).max(10).optional(),
  completed: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

export type StartWorkoutInput = z.infer<typeof startWorkoutSchema>;
export type CompleteWorkoutInput = z.infer<typeof completeWorkoutSchema>;
export type LogSetInput = z.infer<typeof logSetSchema>;
export type UpdateSetInput = z.infer<typeof updateSetSchema>;
