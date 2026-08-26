"use server";

import { auth } from "@/lib/auth";
import { CoachService } from "@/services/coach.service";
import { revalidatePath } from "next/cache";

export async function generateProgramAction(options: {
  goal: "MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS";
  frequencyDays: 3 | 4 | 5 | 6;
  equipment?: "FULL_GYM" | "DUMBBELLS" | "BODYWEIGHT";
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const program = await CoachService.createGeneratedProgram(session.user.id, options);
  revalidatePath("/programs");
  revalidatePath("/coach");
  return { success: true, programId: program.id };
}
