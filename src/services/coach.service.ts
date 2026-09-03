import { db } from "@/lib/db";
import { WorkoutRepository } from "@/repositories/workout.repository";
import { UserRepository } from "@/repositories/user.repository";
import { ProgressRepository } from "@/repositories/progress.repository";
import { NutritionRepository } from "@/repositories/nutrition.repository";
import { ProgramRepository } from "@/repositories/program.repository";
import {
  calculateConsistencyScore,
  analyzeMuscleBalance,
  generateCoachHighlights,
  type CoachInsights,
} from "@/domain/coach";
import { generateProgramTemplate } from "@/domain/program-generator";
import { analyzeExercisePlateau, type ExerciseSessionHistory } from "@/domain/plateau";
import { calculateNutritionTargets } from "@/domain/nutrition";
import {
  type CoachContext,
  type CoachExercisePlateau,
  type CoachMuscleRecovery,
  classifyIntent,
  generateCoachResponse,
  generateGreeting,
  generateQuickPrompts,
  estimateMuscleRecovery,
} from "@/domain/coach-engine";
import { getGeminiClient, COACH_MODEL } from "@/lib/gemini";
import { buildCoachSystemPrompt } from "@/domain/coach-prompt";
import { ThinkingLevel } from "@google/genai";

// ──────────────────────────────────────
// Muscle groups for recovery tracking
// ──────────────────────────────────────
const ALL_TRACKED_MUSCLES = ["CHEST", "BACK", "SHOULDERS", "BICEPS", "TRICEPS", "LEGS", "GLUTES", "ABS", "CALVES"];

export class CoachService {
  /**
   * Build the full CoachContext from all user data sources.
   * Used by both the initial page load and the chat action.
   */
  static async getCoachContext(userId: string): Promise<CoachContext> {
    const [user, recentWorkouts, prs, todayMeals, todayWater, nutritionGoal] =
      await Promise.all([
        UserRepository.findById(userId),
        WorkoutRepository.findUserHistory(userId, 50),
        ProgressRepository.getPersonalRecords(userId),
        NutritionRepository.getTodayMeals(userId),
        NutritionRepository.getTodayWater(userId),
        NutritionRepository.getGoal(userId),
      ]);

    const profile = user?.profile;
    const targetFrequency = profile?.weeklyFrequency ?? 4;
    const fitnessGoal = profile?.fitnessGoal ?? "GENERAL_FITNESS";
    const weightKg = profile?.currentWeight ?? null;
    const heightCm = profile?.height ?? null;

    // ── Weekly metrics ──
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const thisWeekWorkouts = recentWorkouts.filter(
      (w) => w.completedAt && new Date(w.completedAt) >= oneWeekAgo,
    );

    const consistencyScore = calculateConsistencyScore(
      thisWeekWorkouts.length,
      targetFrequency,
    );

    // ── Muscle balance ──
    const coachWorkouts = recentWorkouts
      .filter((w) => w.completedAt)
      .map((w) => ({
        completedAt: w.completedAt!,
        exerciseSessions: w.exerciseSessions.map((es) => ({
          primaryMuscle: es.exercise.primaryMuscle,
          sets: es.sets.map((s) => ({
            weight: s.weight,
            repetitions: s.repetitions,
          })),
        })),
      }));

    const muscleBalance = analyzeMuscleBalance(coachWorkouts);

    // ── Weekly volume & muscle sets ──
    let weeklyVolume = 0;
    const weeklyMuscleSets: Record<string, number> = {};
    for (const muscle of ALL_TRACKED_MUSCLES) {
      weeklyMuscleSets[muscle] = 0;
    }

    for (const workout of thisWeekWorkouts) {
      for (const es of workout.exerciseSessions) {
        const muscle = es.exercise.primaryMuscle;
        const completedSets = es.sets.filter((s) => s.completed).length;
        weeklyMuscleSets[muscle] = (weeklyMuscleSets[muscle] ?? 0) + completedSets;
        weeklyVolume += es.sets.reduce(
          (acc, s) => acc + s.weight * s.repetitions,
          0,
        );
      }
    }

    // ── Per-exercise plateau detection ──
    // Group exercise sessions by exerciseId across all workouts
    const exerciseHistoryMap = new Map<
      string,
      { name: string; sessions: ExerciseSessionHistory[] }
    >();

    for (const w of recentWorkouts) {
      if (!w.completedAt) continue;
      for (const es of w.exerciseSessions) {
        if (es.sets.length === 0) continue;
        const topSet = es.sets.reduce(
          (best, s) => (s.weight > best.weight ? s : best),
          es.sets[0]!,
        );
        const totalVol = es.sets.reduce(
          (acc, s) => acc + s.weight * s.repetitions,
          0,
        );

        if (!exerciseHistoryMap.has(es.exerciseId)) {
          exerciseHistoryMap.set(es.exerciseId, {
            name: es.exercise.name,
            sessions: [],
          });
        }

        exerciseHistoryMap.get(es.exerciseId)!.sessions.push({
          date: new Date(w.completedAt!),
          topWeight: topSet.weight,
          topReps: topSet.repetitions,
          totalVolume: totalVol,
        });
      }
    }

    const exercisePlateaus: CoachExercisePlateau[] = [];
    for (const [exerciseId, data] of exerciseHistoryMap) {
      if (data.sessions.length >= 3) {
        const analysis = analyzeExercisePlateau(data.sessions);
        exercisePlateaus.push({
          exerciseName: data.name,
          exerciseId,
          analysis,
        });
      }
    }

    // ── Muscle recovery estimation ──
    const lastTrainedMap = new Map<string, Date>();
    for (const w of recentWorkouts) {
      if (!w.completedAt) continue;
      for (const es of w.exerciseSessions) {
        const muscle = es.exercise.primaryMuscle;
        const wDate = new Date(w.completedAt);
        const existing = lastTrainedMap.get(muscle);
        if (!existing || wDate > existing) {
          lastTrainedMap.set(muscle, wDate);
        }
      }
    }

    const now = new Date();
    const muscleRecovery: CoachMuscleRecovery[] = [];
    for (const muscle of ALL_TRACKED_MUSCLES) {
      const lastTrained = lastTrainedMap.get(muscle);
      if (lastTrained) {
        const daysSince = Math.floor(
          (now.getTime() - lastTrained.getTime()) / (1000 * 60 * 60 * 24),
        );
        muscleRecovery.push(estimateMuscleRecovery(muscle, daysSince));
      }
    }

    // ── Nutrition targets (calculated from profile) ──
    let nutritionTargets = null;
    if (weightKg && heightCm) {
      const ageYears = profile?.dateOfBirth
        ? Math.floor(
            (now.getTime() - new Date(profile.dateOfBirth).getTime()) /
              (1000 * 60 * 60 * 24 * 365.25),
          )
        : undefined;
      nutritionTargets = calculateNutritionTargets({
        weightKg,
        heightCm,
        ageYears,
        gender: undefined, // not in profile model
        weeklyFrequency: targetFrequency,
        fitnessGoal,
      });
    }

    // ── Today's nutrition totals ──
    const todayCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0);
    const todayProtein = todayMeals.reduce((acc, m) => acc + m.protein, 0);
    const todayCarbs = todayMeals.reduce((acc, m) => acc + m.carbs, 0);
    const todayFat = todayMeals.reduce((acc, m) => acc + m.fat, 0);

    // ── Recent PRs formatted ──
    const formattedPrs = prs.slice(0, 20).map((pr) => ({
      exerciseName: pr.exercise.name,
      recordType: pr.recordType,
      value: pr.value,
      achievedAt: pr.achievedAt,
    }));

    return {
      userName: user?.name || "Athlete",
      fitnessGoal,
      experienceLevel: profile?.experienceLevel ?? null,
      weightKg,
      heightCm,
      weeklyFrequency: targetFrequency,
      totalWorkouts: recentWorkouts.length,
      completedThisWeek: thisWeekWorkouts.length,
      consistencyScore,
      exercisePlateaus,
      recentPrs: formattedPrs,
      todayCalories: Math.round(todayCalories),
      todayProtein: Math.round(todayProtein),
      todayCarbs: Math.round(todayCarbs),
      todayFat: Math.round(todayFat),
      todayWater,
      nutritionTargets,
      muscleBalance,
      weeklyMuscleSets,
      weeklyVolume: Math.round(weeklyVolume),
      muscleRecovery,
    };
  }

  /**
   * Handle a user chat message — calls Gemini with real user data as context.
   * Falls back to deterministic engine if Gemini is unavailable.
   */
  static async getCoachResponse(
    userId: string,
    message: string,
  ): Promise<{ reply: string; quickPrompts: string[] }> {
    const context = await CoachService.getCoachContext(userId);
    const quickPrompts = generateQuickPrompts(context);

    // Try Gemini first
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const systemPrompt = buildCoachSystemPrompt(context);
        const response = await gemini.models.generateContent({
          model: COACH_MODEL,
          contents: message,
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 2048,
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.MINIMAL,
            },
          },
        });

        const reply = response.text?.trim();
        if (reply && reply.length >= 30) {
          return { reply, quickPrompts };
        }
      } catch (error) {
        // Log but don't throw — fall through to deterministic fallback
        console.error("[CoachService] Gemini API error, falling back to deterministic engine:", error);
      }
    }

    // Fallback: deterministic rule-based engine
    const intent = classifyIntent(message);
    const reply = generateCoachResponse(intent, context);
    return { reply, quickPrompts };
  }

  /**
   * Get full dashboard data including CoachContext for initial rendering.
   */
  static async getCoachDashboard(userId: string): Promise<{
    insights: CoachInsights;
    userProfile: { name: string; fitnessGoal: string; weeklyFrequency: number };
    coachContext: CoachContext;
    greeting: string;
    quickPrompts: string[];
    isGeminiEnabled: boolean;
  }> {
    const context = await CoachService.getCoachContext(userId);

    const highlights = generateCoachHighlights({
      completedThisWeek: context.completedThisWeek,
      targetFrequency: context.weeklyFrequency,
      totalPrs: context.recentPrs.length,
      totalVolume: context.weeklyVolume,
    });

    return {
      insights: {
        consistencyScore: context.consistencyScore,
        completedThisWeek: context.completedThisWeek,
        targetFrequency: context.weeklyFrequency,
        muscleBalance: context.muscleBalance,
        highlights,
      },
      userProfile: {
        name: context.userName,
        fitnessGoal: context.fitnessGoal.replace("_", " "),
        weeklyFrequency: context.weeklyFrequency,
      },
      coachContext: context,
      greeting: generateGreeting(context),
      quickPrompts: generateQuickPrompts(context),
      isGeminiEnabled: getGeminiClient() !== null,
    };
  }

  static async createGeneratedProgram(
    userId: string,
    options: {
      goal: "MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS";
      frequencyDays: 3 | 4 | 5 | 6;
      equipment?: "FULL_GYM" | "DUMBBELLS" | "BODYWEIGHT";
    },
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
            (e) => e.name.toLowerCase() === exDraft.name.toLowerCase(),
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
