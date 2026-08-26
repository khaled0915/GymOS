"use server";

import { auth } from "@/lib/auth";
import { ProgramRepository } from "@/repositories/program.repository";
import { 
  createProgramSchema, 
  createWorkoutDaySchema, 
  addPlannedExerciseSchema 
} from "@/lib/validators/program.validator";
import { revalidatePath } from "next/cache";

export async function createProgramAction(data: { name: string; description?: string }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createProgramSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const program = await ProgramRepository.create(session.user.id, parsed.data);
  revalidatePath("/programs");
  return { success: true, program };
}

export async function addWorkoutDayAction(data: { programId: string; name: string; order: number }) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createWorkoutDaySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const day = await ProgramRepository.addWorkoutDay(parsed.data.programId, parsed.data.name, parsed.data.order);
  revalidatePath(`/programs/${data.programId}`);
  return { success: true, day };
}

export async function addPlannedExerciseAction(data: {
  workoutDayId: string;
  exerciseId: string;
  order: number;
  targetSets: number;
  minReps: number;
  maxReps: number;
  targetRpe?: number;
  restSeconds?: number;
  notes?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = addPlannedExerciseSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const planned = await ProgramRepository.addPlannedExercise(parsed.data);
  revalidatePath("/programs");
  return { success: true, planned };
}

export async function deleteProgramAction(programId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await ProgramRepository.delete(programId, session.user.id);
  revalidatePath("/programs");
  return { success: true };
}
