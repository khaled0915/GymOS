import { db } from "@/lib/db";
import { WorkoutRepository } from "@/repositories/workout.repository";
import { UserRepository } from "@/repositories/user.repository";
import { ProgressRepository } from "@/repositories/progress.repository";
import { ProgramRepository } from "@/repositories/program.repository";
import {
  calculateConsistencyScore,
  analyzeMuscleBalance,
  generateCoachHighlights,
  type CoachInsights,
} from "@/domain/coach";
import { generateProgramTemplate, type GeneratedProgram } from "@/domain/program-generator";

export class CoachService {
  static async getCoachDashboard(userId: string): Promise<{
    insights: CoachInsights;
    userProfile: { name: string; fitnessGoal: string; weeklyFrequency: number };
  }> {
    const [user, recentWorkouts, prs] = await Promise.all([
      UserRepository.findById(userId),
      WorkoutRepository.findUserHistory(userId, 50),
      ProgressRepository.getPersonalRecords(userId),
    ]);

    const targetFrequency = user?.profile?.weeklyFrequency ?? 4;
    const fitnessGoal = user?.profile?.fitnessGoal ?? "GENERAL_FITNESS";

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const thisWeekWorkouts = recentWorkouts.filter(
      (w) => w.completedAt && new Date(w.completedAt) >= oneWeekAgo
    );

    const consistencyScore = calculateConsistencyScore(thisWeekWorkouts.length, targetFrequency);

    const coachWorkouts = recentWorkouts
      .filter((w) => w.completedAt)
      .map((w) => ({
        completedAt: w.completedAt!,
        exerciseSessions: w.exerciseSessions.map((es) => ({
          primaryMuscle: es.exercise.primaryMuscle,
          sets: es.sets.map((s) => ({ weight: s.weight, repetitions: s.repetitions })),
        })),
      }));

    const muscleBalance = analyzeMuscleBalance(coachWorkouts);

    const totalVolume = recentWorkouts.reduce(
      (acc, w) =>
        acc +
        w.exerciseSessions.reduce(
          (eAcc, es) => eAcc + es.sets.reduce((sAcc, s) => sAcc + s.weight * s.repetitions, 0),
          0
        ),
      0
    );

    const highlights = generateCoachHighlights({
      completedThisWeek: thisWeekWorkouts.length,
      targetFrequency,
      totalPrs: prs.length,
      totalVolume,
    });

    return {
      insights: {
        consistencyScore,
        completedThisWeek: thisWeekWorkouts.length,
        targetFrequency,
        muscleBalance,
        highlights,
      },
      userProfile: {
        name: user?.name || "Athlete",
        fitnessGoal: fitnessGoal.replace("_", " "),
        weeklyFrequency: targetFrequency,
      },
    };
  }

  static async createGeneratedProgram(
    userId: string,
    options: {
      goal: "MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS";
      frequencyDays: 3 | 4 | 5 | 6;
      equipment?: "FULL_GYM" | "DUMBBELLS" | "BODYWEIGHT";
    }
  ) {
    const template = generateProgramTemplate(options);

    // 1. Create Program
    const program = await ProgramRepository.create(userId, {
      name: template.name,
      description: template.description,
    });

    // 2. Fetch system/user exercises
    const allExercises = await db.exercise.findMany({
      where: {
        OR: [{ isSystemExercise: true }, { createdByUserId: userId }],
      },
    });

    // 3. Create Days and Planned Exercises
    for (let di = 0; di < template.days.length; di++) {
      const dayDraft = template.days[di]!;
      const day = await ProgramRepository.addWorkoutDay(program.id, dayDraft.name, di + 1);

      for (let ei = 0; ei < dayDraft.exercises.length; ei++) {
        const exDraft = dayDraft.exercises[ei]!;

        // Match exercise by slug or fallback to name
        let matchedExercise = allExercises.find((e) => e.slug === exDraft.exerciseSlug);
        if (!matchedExercise) {
          matchedExercise = allExercises.find(
            (e) => e.name.toLowerCase() === exDraft.name.toLowerCase()
          );
        }
        if (!matchedExercise && allExercises[0]) {
          matchedExercise = allExercises[0];
        }

        if (matchedExercise) {
          await ProgramRepository.addPlannedExercise({
            workoutDayId: day.id,
            exerciseId: matchedExercise.id,
            order: ei + 1,
            targetSets: exDraft.targetSets,
            minReps: exDraft.minReps,
            maxReps: exDraft.maxReps,
            restSeconds: exDraft.restSeconds,
          });
        }
      }
    }

    return program;
  }
}
