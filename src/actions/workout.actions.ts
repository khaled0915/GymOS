"use server";

import { auth } from "@/lib/auth";
import { WorkoutRepository } from "@/repositories/workout.repository";
import { WorkoutService } from "@/services/workout.service";
import { revalidatePath } from "next/cache";

export async function startWorkoutAction(programId?: string, workoutDayId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const workout = await WorkoutService.startWorkout(session.user.id, programId, workoutDayId);
  revalidatePath("/workouts");
  return workout;
}

export async function addExerciseToWorkoutAction(workoutSessionId: string, exerciseId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify the session belongs to the user
  const workoutSession = await WorkoutRepository.findById(workoutSessionId, session.user.id);
  if (!workoutSession) throw new Error("Workout session not found");

  const nextOrder = workoutSession.exerciseSessions.length + 1;
  const exerciseSession = await WorkoutRepository.addExerciseSession(workoutSessionId, exerciseId, nextOrder);
  revalidatePath("/workouts");
  return exerciseSession;
}

export async function logSetAction(data: {
  exerciseSessionId: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  repetitions: number;
  rpe?: number;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const result = await WorkoutService.logSet(session.user.id, data);
  revalidatePath("/workouts");
  return result;
}

export async function completeWorkoutAction(workoutSessionId: string, notes?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const workout = await WorkoutRepository.completeWorkout(workoutSessionId, session.user.id, notes);
  revalidatePath("/workouts");
  revalidatePath("/dashboard");
  revalidatePath("/workouts/history");
  return workout;
}

export async function getPreviousPerformanceAction(exerciseId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const sets = await WorkoutRepository.getPreviousPerformance(session.user.id, exerciseId);
  return sets.map((s) => ({
    setNumber: s.setNumber,
    weight: s.weight,
    repetitions: s.repetitions,
    rpe: s.rpe,
  }));
}
