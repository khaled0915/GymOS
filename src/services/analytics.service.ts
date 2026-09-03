import { WorkoutRepository, type FullWorkoutSession } from "@/repositories/workout.repository";
import { ProgressRepository } from "@/repositories/progress.repository";
import {
  aggregateVolumeByMuscleGroup,
  aggregateVolumeByWeek,
  getExerciseProgression,
  calculateAverageWorkoutDuration,
  getWorkoutFrequencyByDay,
  calculateTotalSets,
  type AnalyticsWorkout,
} from "@/domain/analytics";

function toAnalyticsWorkouts(sessions: FullWorkoutSession[]): AnalyticsWorkout[] {
  return sessions
    .filter((s) => s.completedAt != null)
    .map((s) => ({
      completedAt: s.completedAt!,
      durationSeconds: s.durationSeconds,
      exerciseSessions: s.exerciseSessions.map((es) => ({
        exerciseId: es.exerciseId,
        exerciseName: es.exercise.name,
        primaryMuscle: es.exercise.primaryMuscle,
        secondaryMuscles: es.exercise.secondaryMuscles || [],
        sets: es.sets.map((set) => ({
          weight: set.weight,
          repetitions: set.repetitions,
        })),
      })),
    }));
}

export class AnalyticsService {
  static async getAnalyticsData(userId: string) {
    const [allWorkouts, prs] = await Promise.all([
      WorkoutRepository.findUserHistory(userId, 200),
      ProgressRepository.getPersonalRecords(userId),
    ]);

    const analyticsWorkouts = toAnalyticsWorkouts(allWorkouts);

    // Build unique exercise list
    const exerciseMap = new Map<string, string>();
    for (const w of allWorkouts) {
      for (const es of w.exerciseSessions) {
        exerciseMap.set(es.exerciseId, es.exercise.name);
      }
    }
    const uniqueExercises = Array.from(exerciseMap.entries()).map(
      ([id, name]) => ({ id, name }),
    );

    return {
      totalWorkouts: allWorkouts.length,
      totalSets: calculateTotalSets(analyticsWorkouts),
      totalPrs: prs.length,
      avgDuration: calculateAverageWorkoutDuration(analyticsWorkouts),
      volumeByWeek: aggregateVolumeByWeek(analyticsWorkouts),
      volumeByMuscle: aggregateVolumeByMuscleGroup(analyticsWorkouts),
      frequencyByDay: getWorkoutFrequencyByDay(analyticsWorkouts),
      uniqueExercises,
      analyticsWorkouts,
    };
  }

  static async getExerciseProgressionData(
    userId: string,
    exerciseId: string,
  ) {
    const allWorkouts = await WorkoutRepository.findUserHistory(userId, 200);
    const analyticsWorkouts = toAnalyticsWorkouts(allWorkouts);
    return getExerciseProgression(analyticsWorkouts, exerciseId);
  }
}
