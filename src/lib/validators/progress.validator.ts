import { z } from "zod";

const measurementTypeEnum = z.enum([
  "WEIGHT", "BODY_FAT", "CHEST", "WAIST",
  "ARMS", "THIGHS", "NECK", "CUSTOM",
]);

export const logBodyMeasurementSchema = z.object({
  measurementType: measurementTypeEnum,
  value: z.number().positive("Value must be positive").max(1000),
  unit: z.string().min(1).max(10),
  measuredAt: z.coerce.date().optional(),
});

export const logWeightSchema = z.object({
  value: z.number().positive("Weight must be positive").max(500),
  unit: z.enum(["kg", "lbs"]),
  measuredAt: z.coerce.date().optional(),
});

export type LogBodyMeasurementInput = z.infer<typeof logBodyMeasurementSchema>;
export type LogWeightInput = z.infer<typeof logWeightSchema>;
