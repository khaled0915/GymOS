import { db } from "@/lib/db";
import { WorkoutRepository } from "@/repositories/workout.repository";
import { ProgressRepository } from "@/repositories/progress.repository";
import { calculateExerciseVolume } from "@/domain/volume";

export class DashboardService {
  static async getDashboardData(userId: string) {
    const [recentWorkouts, activeSession, prs, weightLogs] = await Promise.all([
      WorkoutRepository.findUserHistory(userId, 5),
      WorkoutRepository.findActiveSession(userId),
      ProgressRepository.getPersonalRecords(userId),
      ProgressRepository.getMeasurements(userId, "WEIGHT"),
    ]);

    // Calculate weekly volume
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const thisWeekWorkouts = recentWorkouts.filter(
      (w) => w.completedAt && new Date(w.completedAt) >= oneWeekAgo
    );

    let weeklyVolume = 0;
    for (const workout of thisWeekWorkouts) {
      for (const es of workout.exerciseSessions) {
        weeklyVolume += calculateExerciseVolume(es.sets);
      }
    }

    return {
      activeSession,
      recentWorkouts,
      weeklyWorkoutCount: thisWeekWorkouts.length,
      weeklyVolume,
      recentPrs: prs.slice(0, 5),
      weightHistory: weightLogs.slice(-10),
    };
  }
}
