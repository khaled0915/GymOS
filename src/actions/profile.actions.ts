"use server";

import { auth } from "@/lib/auth";
import { UserRepository } from "@/repositories/user.repository";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validators/profile.validator";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: UpdateProfileInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const profile = await UserRepository.updateProfile(session.user.id, {
    dateOfBirth: parsed.data.dateOfBirth,
    height: parsed.data.height,
    currentWeight: parsed.data.currentWeight,
    fitnessGoal: parsed.data.fitnessGoal,
    experienceLevel: parsed.data.experienceLevel,
    preferredUnit: parsed.data.preferredUnit,
    weeklyFrequency: parsed.data.weeklyFrequency,
  });

  revalidatePath("/profile");
  return { success: true, profile };
}

export async function deleteAccountAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Import db at the top of the file if not already imported
  const { db } = await import("@/lib/db");

  // Delete user and all related data (cascade)
  await db.user.delete({
    where: { id: session.user.id },
  });

  return { success: true };
}
