"use server";

import { auth } from "@/lib/auth";
import { UserRepository } from "@/repositories/user.repository";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validators/profile.validator";
import { db } from "@/lib/db";
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

  // Delete user and all related data (cascade)
  await db.user.delete({
    where: { id: session.user.id },
  });

  return { success: true };
}

/**
 * Export all user data as complete JSON archive.
 */
export async function exportUserDataAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      programs: {
        include: {
          workoutDays: {
            include: { plannedExercises: { include: { exercise: true } } },
          },
        },
      },
      workoutSessions: {
        include: {
          workoutDay: true,
          program: true,
          exerciseSessions: {
            include: {
              exercise: true,
              sets: true,
            },
          },
        },
      },
      bodyMeasurements: true,
      personalRecords: { include: { exercise: true } },
      mealLogs: true,
      waterLogs: true,
      nutritionGoal: true,
    },
  });

  if (!user) throw new Error("User not found");

  // Omit password hash
  const { passwordHash: _, ...safeUser } = user;

  return {
    success: true,
    data: {
      exportedAt: new Date().toISOString(),
      user: safeUser,
    },
  };
}

/**
 * Export workout sessions and sets as CSV text.
 */
export async function exportWorkoutsCsvAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const workouts = await db.workoutSession.findMany({
    where: { userId: session.user.id, completedAt: { not: null } },
    orderBy: { startedAt: "desc" },
    include: {
      workoutDay: true,
      program: true,
      exerciseSessions: {
        include: {
          exercise: true,
          sets: { orderBy: { setNumber: "asc" } },
        },
      },
    },
  });

  const headers = [
    "Workout_ID",
    "Date",
    "Routine_Name",
    "Duration_Min",
    "Exercise_Name",
    "Primary_Muscle",
    "Set_Number",
    "Weight_kg",
    "Reps",
    "RPE",
  ];

  const rows: string[] = [headers.join(",")];

  for (const w of workouts) {
    const routine = w.workoutDay?.name || w.program?.name || "Freestyle Workout";
    const dateStr = w.completedAt ? new Date(w.completedAt).toISOString().split("T")[0] : "";
    const duration = w.durationSeconds ? Math.round(w.durationSeconds / 60) : 0;

    for (const es of w.exerciseSessions) {
      for (const s of es.sets) {
        rows.push(
          [
            `"${w.id}"`,
            `"${dateStr}"`,
            `"${routine.replace(/"/g, '""')}"`,
            duration,
            `"${es.exercise.name.replace(/"/g, '""')}"`,
            `"${es.exercise.primaryMuscle}"`,
            s.setNumber,
            s.weight,
            s.repetitions,
            s.rpe ?? "",
          ].join(",")
        );
      }
    }
  }

  return {
    success: true,
    csv: rows.join("\n"),
  };
}
