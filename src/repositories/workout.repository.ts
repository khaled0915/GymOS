import { db } from "@/lib/db";
import type { 
  WorkoutSession, 
  ExerciseSession, 
  SetLog, 
  Exercise, 
  Program, 
  WorkoutDay 
} from "@prisma/client";

export type FullWorkoutSession = WorkoutSession & {
  program: Program | null;
  workoutDay: WorkoutDay | null;
  exerciseSessions: (ExerciseSession & {
    exercise: Exercise;
    sets: SetLog[];
  })[];
};

export class WorkoutRepository {
  static async findById(id: string, userId: string): Promise<FullWorkoutSession | null> {
    return db.workoutSession.findFirst({
      where: { id, userId },
      include: {
        program: true,
        workoutDay: true,
        exerciseSessions: {
          orderBy: { order: "asc" },
          include: {
            exercise: true,
            sets: {
              orderBy: { setNumber: "asc" },
            },
          },
        },
      },
    });
  }

  static async findActiveSession(userId: string): Promise<FullWorkoutSession | null> {
    return db.workoutSession.findFirst({
      where: { userId, completedAt: null },
      include: {
        program: true,
        workoutDay: true,
        exerciseSessions: {
          orderBy: { order: "asc" },
          include: {
            exercise: true,
            sets: {
              orderBy: { setNumber: "asc" },
            },
          },
        },
      },
      orderBy: { startedAt: "desc" },
    });
  }

  static async findUserHistory(userId: string, limit = 20): Promise<FullWorkoutSession[]> {
    return db.workoutSession.findMany({
      where: { userId, completedAt: { not: null } },
      include: {
        program: true,
        workoutDay: true,
        exerciseSessions: {
          orderBy: { order: "asc" },
          include: {
            exercise: true,
            sets: {
              orderBy: { setNumber: "asc" },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: limit,
    });
  }

  static async create(userId: string, data: { programId?: string; workoutDayId?: string; notes?: string }): Promise<WorkoutSession> {
    return db.workoutSession.create({
      data: {
        userId,
        programId: data.programId,
        workoutDayId: data.workoutDayId,
        notes: data.notes,
        startedAt: new Date(),
      },
    });
  }

  static async addExerciseSession(workoutSessionId: string, exerciseId: string, order: number): Promise<ExerciseSession> {
    return db.exerciseSession.create({
      data: {
        workoutSessionId,
        exerciseId,
        order,
      },
    });
  }

  static async logSet(data: {
    exerciseSessionId: string;
    setNumber: number;
    weight: number;
    repetitions: number;
    rpe?: number;
    notes?: string;
  }): Promise<SetLog> {
    return db.setLog.create({
      data: {
        ...data,
        completed: true,
      },
    });
  }

  static async updateSet(id: string, data: Partial<SetLog>): Promise<SetLog> {
    return db.setLog.update({
      where: { id },
      data,
    });
  }

  static async completeWorkout(id: string, userId: string, notes?: string): Promise<WorkoutSession> {
    const session = await db.workoutSession.findFirst({
      where: { id, userId },
    });

    if (!session) throw new Error("Workout session not found");

    const completedAt = new Date();
    const durationSeconds = Math.round((completedAt.getTime() - session.startedAt.getTime()) / 1000);

    return db.workoutSession.update({
      where: { id },
      data: {
        completedAt,
        durationSeconds,
        ...(notes ? { notes } : {}),
      },
    });
  }

  static async getPreviousPerformance(userId: string, exerciseId: string): Promise<SetLog[]> {
    const lastSessionWithExercise = await db.exerciseSession.findFirst({
      where: {
        exerciseId,
        workoutSession: {
          userId,
          completedAt: { not: null },
        },
      },
      orderBy: {
        workoutSession: {
          completedAt: "desc",
        },
      },
      include: {
        sets: {
          where: { completed: true },
          orderBy: { setNumber: "asc" },
        },
      },
    });

    return lastSessionWithExercise?.sets ?? [];
  }
}
