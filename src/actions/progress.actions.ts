"use server";

import { auth } from "@/lib/auth";
import { ProgressRepository } from "@/repositories/progress.repository";
import { logWeightSchema, logBodyMeasurementSchema } from "@/lib/validators/progress.validator";
import { revalidatePath } from "next/cache";

export async function logWeightAction(data: { value: number; unit: "kg" | "lbs" }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = logWeightSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  // Always store in base kg unit
  const kgValue = data.unit === "lbs" ? data.value / 2.20462 : data.value;

  const measurement = await ProgressRepository.logMeasurement({
    userId: session.user.id,
    measurementType: "WEIGHT",
    value: Math.round(kgValue * 100) / 100,
    unit: data.unit,
  });

  revalidatePath("/progress");
  revalidatePath("/dashboard");
  return { success: true, measurement };
}

export async function logMeasurementAction(data: {
  measurementType: any;
  value: number;
  unit: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = logBodyMeasurementSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const measurement = await ProgressRepository.logMeasurement({
    userId: session.user.id,
    measurementType: data.measurementType,
    value: data.value,
    unit: data.unit,
  });

  revalidatePath("/progress");
  return { success: true, measurement };
}
