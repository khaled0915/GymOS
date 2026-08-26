import { z } from "zod";

const fitnessGoalEnum = z.enum([
  "MUSCLE_GAIN", "FAT_LOSS", "MAINTENANCE", "STRENGTH", "GENERAL_FITNESS",
]);

const experienceLevelEnum = z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]);
const unitPreferenceEnum = z.enum(["METRIC", "IMPERIAL"]);

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  dateOfBirth: z.coerce.date().optional(),
  height: z.number().positive().max(300).optional(),
  currentWeight: z.number().positive().max(500).optional(),
  fitnessGoal: fitnessGoalEnum.optional(),
  experienceLevel: experienceLevelEnum.optional(),
  preferredUnit: unitPreferenceEnum.optional(),
  weeklyFrequency: z.number().int().min(1).max(7).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
