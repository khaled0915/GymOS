import { db } from "@/lib/db";
import { WorkoutRepository } from "@/repositories/workout.repository";
import { ProgressRepository } from "@/repositories/progress.repository";
import { NutritionRepository } from "@/repositories/nutrition.repository";
import { calculateExerciseVolume } from "@/domain/volume";

export interface WeekDayStatus {
  label: string; // 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  dayIndex: number; // 0 to 6
  hasWorkout: boolean;
  isToday: boolean;
}

export class DashboardService {
  static async getDashboardData(userId: string) {
    const [recentWorkouts, activeSession, prs, weightLogs, todayMeals, todayWater, nutritionGoal, userPrograms] =
      await Promise.all([
        WorkoutRepository.findUserHistory(userId, 10),
        WorkoutRepository.findActiveSession(userId),
        ProgressRepository.getPersonalRecords(userId),
        ProgressRepository.getMeasurements(userId, "WEIGHT"),
        NutritionRepository.getTodayMeals(userId),
        NutritionRepository.getTodayWater(userId),
        NutritionRepository.getGoal(userId),
        db.program.findMany({
          where: { userId, isActive: true },
          include: {
            workoutDays: {
              include: {
                plannedExercises: {
                  include: { exercise: true },
                  orderBy: { order: "asc" },
                },
              },
              orderBy: { order: "asc" },
            },
          },
        }),
      ]);

    // Calculate weekly volume
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const thisWeekWorkouts = recentWorkouts.filter(
      (w) => w.completedAt && new Date(w.completedAt) >= oneWeekAgo
    );

    let weeklyVolume = 0;
    const weeklyMuscleSets: Record<string, number> = {
      CHEST: 0,
      BACK: 0,
      LEGS: 0,
      SHOULDERS: 0,
      BICEPS: 0,
      TRICEPS: 0,
      ABS: 0,
      CALVES: 0,
    };

    for (const workout of thisWeekWorkouts) {
      for (const es of workout.exerciseSessions) {
        weeklyVolume += calculateExerciseVolume(es.sets);
        const muscle = es.exercise.primaryMuscle;
        const completedSetsCount = es.sets.filter((s) => s.completed).length;
        if (muscle in weeklyMuscleSets) {
          weeklyMuscleSets[muscle] = (weeklyMuscleSets[muscle] || 0) + completedSetsCount;
        }
      }
    }

    // Weekly consistency array (Monday to Sunday)
    const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday
    const mondayOffset = (currentDay + 6) % 7; // days since Monday
    const mondayDate = new Date(now);
    mondayDate.setDate(now.getDate() - mondayOffset);
    mondayDate.setHours(0, 0, 0, 0);

    const daysLabels = ["M", "T", "W", "T", "F", "S", "S"];
    const weekDays: WeekDayStatus[] = daysLabels.map((label, idx) => {
      const d = new Date(mondayDate);
      d.setDate(mondayDate.getDate() + idx);
      const isToday = d.toDateString() === now.toDateString();

      const hasWorkout = recentWorkouts.some((w) => {
        if (!w.completedAt) return false;
        const wDate = new Date(w.completedAt);
        return wDate.toDateString() === d.toDateString();
      });

      return {
        label,
        dayIndex: idx,
        hasWorkout,
        isToday,
      };
    });

    // Compute active macro totals
    const currentCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0);
    const currentProtein = todayMeals.reduce((acc, m) => acc + m.protein, 0);
    const currentCarbs = todayMeals.reduce((acc, m) => acc + m.carbs, 0);
    const currentFat = todayMeals.reduce((acc, m) => acc + m.fat, 0);

    // Active program preview
    const activeProgram = userPrograms[0] || null;
    const nextWorkoutDay = activeProgram?.workoutDays[0] || null;

    return {
      activeSession,
      recentWorkouts,
      weeklyWorkoutCount: thisWeekWorkouts.length,
      weeklyVolume,
      weeklyMuscleSets,
      recentPrs: prs.slice(0, 6),
      weightHistory: weightLogs.slice(-10),
      todayMeals,
      todayWater,
      nutritionGoal,
      currentMacros: {
        calories: currentCalories,
        protein: currentProtein,
        carbs: currentCarbs,
        fat: currentFat,
        water: todayWater,
      },
      weekDays,
      activeProgram,
      nextWorkoutDay,
    };
  }
}
