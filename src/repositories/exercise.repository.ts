import { db } from "@/lib/db";
import type { Exercise, MuscleGroup, Equipment, Difficulty } from "@prisma/client";

export interface ExerciseFilters {
  query?: string;
  muscle?: MuscleGroup;
  equipment?: Equipment;
  difficulty?: Difficulty;
  userId?: string;
}

export class ExerciseRepository {
  static async findMany(filters: ExerciseFilters = {}): Promise<Exercise[]> {
    const { query, muscle, equipment, difficulty, userId } = filters;

    return db.exercise.findMany({
      where: {
        AND: [
          {
            OR: [
              { isSystemExercise: true },
              ...(userId ? [{ createdByUserId: userId }] : []),
            ],
          },
          query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { instructions: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
          muscle ? { primaryMuscle: muscle } : {},
          equipment ? { equipment } : {},
          difficulty ? { difficulty } : {},
        ],
      },
      orderBy: { name: "asc" },
      include: {
        alternatives: true,
      },
    });
  }

  static async findById(id: string): Promise<(Exercise & { alternatives: Exercise[] }) | null> {
    return db.exercise.findUnique({
      where: { id },
      include: { alternatives: true },
    });
  }

  static async create(data: {
    name: string;
    slug: string;
    primaryMuscle: MuscleGroup;
    secondaryMuscles?: MuscleGroup[];
    equipment?: Equipment;
    difficulty?: Difficulty;
    instructions?: string;
    mediaUrl?: string;
    createdByUserId?: string;
  }): Promise<Exercise> {
    return db.exercise.create({
      data: {
        name: data.name,
        slug: data.slug,
        primaryMuscle: data.primaryMuscle,
        secondaryMuscles: data.secondaryMuscles ?? [],
        equipment: data.equipment,
        difficulty: data.difficulty,
        instructions: data.instructions,
        mediaUrl: data.mediaUrl,
        isSystemExercise: false,
        createdByUserId: data.createdByUserId,
      },
    });
  }
}
