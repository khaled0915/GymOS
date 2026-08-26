"use server";

import { auth } from "@/lib/auth";
import { ExerciseRepository, type ExerciseFilters } from "@/repositories/exercise.repository";
import { createExerciseSchema, type CreateExerciseInput } from "@/lib/validators/exercise.validator";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getExercisesAction(filters?: ExerciseFilters) {
  const session = await auth();
  return ExerciseRepository.findMany({
    ...filters,
    userId: session?.user?.id,
  });
}

export async function createExerciseAction(data: CreateExerciseInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createExerciseSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  let baseSlug = parsed.data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  if (!baseSlug) baseSlug = "custom-exercise";

  // Ensure unique slug
  let slug = baseSlug;
  const existing = await db.exercise.findUnique({ where: { slug } });
  if (existing) {
    slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;
  }

  const exercise = await ExerciseRepository.create({
    ...parsed.data,
    slug,
    createdByUserId: session.user.id,
  });

  revalidatePath("/exercises");
  revalidatePath("/workouts");
  revalidatePath("/programs/new");
  return { success: true, exercise };
}
