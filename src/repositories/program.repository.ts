import { db } from "@/lib/db";
import type { Program, WorkoutDay, PlannedExercise, Exercise } from "@prisma/client";

export type FullProgram = Program & {
  workoutDays: (WorkoutDay & {
    plannedExercises: (PlannedExercise & {
      exercise: Exercise;
    })[];
  })[];
};

export class ProgramRepository {
  static async findUserPrograms(userId: string): Promise<FullProgram[]> {
    return db.program.findMany({
      where: { userId },
      include: {
        workoutDays: {
          orderBy: { order: "asc" },
          include: {
            plannedExercises: {
              orderBy: { order: "asc" },
              include: { exercise: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async findById(id: string, userId: string): Promise<FullProgram | null> {
    return db.program.findFirst({
      where: { id, userId },
      include: {
        workoutDays: {
          orderBy: { order: "asc" },
          include: {
            plannedExercises: {
              orderBy: { order: "asc" },
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });
  }

  static async create(userId: string, data: { name: string; description?: string }): Promise<Program> {
    return db.program.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
      },
    });
  }

  static async addWorkoutDay(programId: string, name: string, order: number): Promise<WorkoutDay> {
    return db.workoutDay.create({
      data: { programId, name, order },
    });
  }

  static async addPlannedExercise(data: {
    workoutDayId: string;
    exerciseId: string;
    order: number;
    targetSets: number;
    minReps: number;
    maxReps: number;
    targetRpe?: number;
    restSeconds?: number;
    notes?: string;
  }): Promise<PlannedExercise> {
    return db.plannedExercise.create({
      data,
    });
  }

  static async delete(id: string, userId: string): Promise<void> {
    await db.program.deleteMany({
      where: { id, userId },
    });
  }
}
