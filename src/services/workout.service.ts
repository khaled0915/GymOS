import { db } from "@/lib/db";
import { WorkoutRepository } from "@/repositories/workout.repository";
import { ProgressRepository } from "@/repositories/progress.repository";
import { detectPersonalRecords } from "@/domain/personal-records";
import { getNextExerciseRecommendation } from "@/domain/progressive-overload";
import { analyzeExercisePlateau } from "@/domain/plateau";

export class WorkoutService {
  static async startWorkout(userId: string, programId?: string, workoutDayId?: string) {
    // Check if there is already an active session
    const existing = await WorkoutRepository.findActiveSession(userId);
    if (existing) {
      return existing;
    }

    const session = await WorkoutRepository.create(userId, { programId, workoutDayId });

    // If starting from a specific workout day, pre-populate planned exercises
    if (workoutDayId) {
      const workoutDay = await db.workoutDay.findUnique({
        where: { id: workoutDayId },
        include: {
          plannedExercises: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (workoutDay && workoutDay.plannedExercises.length > 0) {
        for (const planned of workoutDay.plannedExercises) {
          await WorkoutRepository.addExerciseSession(session.id, planned.exerciseId, planned.order);
        }
      }
    }

    return WorkoutRepository.findById(session.id, userId);
  }

  static async logSet(userId: string, data: {
    exerciseSessionId: string;
    exerciseId: string;
    setNumber: number;
    weight: number;
    repetitions: number;
    rpe?: number;
    notes?: string;
  }) {
    const set = await WorkoutRepository.logSet({
      exerciseSessionId: data.exerciseSessionId,
      setNumber: data.setNumber,
      weight: data.weight,
      repetitions: data.repetitions,
      rpe: data.rpe,
      notes: data.notes,
    });

    // Check for PRs
    const existingPrs = await ProgressRepository.getPersonalRecords(userId, data.exerciseId);
    const existingMap = {
      weightPr: existingPrs.find(p => p.recordType === "WEIGHT_PR")?.value ?? null,
      repPr: existingPrs.find(p => p.recordType === "REP_PR")?.value ?? null,
      volumePr: existingPrs.find(p => p.recordType === "VOLUME_PR")?.value ?? null,
      e1rmPr: existingPrs.find(p => p.recordType === "E1RM_PR")?.value ?? null,
    };

    const newPrs = detectPersonalRecords(
      { weight: data.weight, repetitions: data.repetitions },
      existingMap
    );

    for (const pr of newPrs) {
      await ProgressRepository.savePersonalRecord({
        userId,
        exerciseId: data.exerciseId,
        recordType: pr.type,
        value: pr.value,
        sourceSetId: set.id,
      });
    }

    return { set, newPrs };
  }

  static async getExerciseGuidance(userId: string, exerciseId: string, targetRepRange = { min: 8, max: 12 }) {
    const previousSets = await WorkoutRepository.getPreviousPerformance(userId, exerciseId);

    // Get progression recommendation if sets exist
    let recommendation = null;
    if (previousSets.length > 0) {
      const topSet = previousSets.reduce(
        (best, s) => (s.weight > best.weight ? s : best),
        previousSets[0]!
      );
      recommendation = getNextExerciseRecommendation(
        { weight: topSet.weight, reps: topSet.repetitions, rpe: topSet.rpe ?? undefined },
        targetRepRange
      );
    }

    // Get historical sessions for plateau detection
    const history = await db.exerciseSession.findMany({
      where: {
        exerciseId,
        workoutSession: {
          userId,
          completedAt: { not: null },
        },
      },
      orderBy: { workoutSession: { completedAt: "asc" } },
      include: {
        workoutSession: true,
        sets: { where: { completed: true } },
      },
    });

    const sessionHistory = history
      .filter((h) => h.workoutSession.completedAt && h.sets.length > 0)
      .map((h) => {
        const topSet = h.sets.reduce((best, s) => (s.weight > best.weight ? s : best), h.sets[0]!);
        const vol = h.sets.reduce((sum, s) => sum + s.weight * s.repetitions, 0);
        return {
          date: h.workoutSession.completedAt!,
          topWeight: topSet.weight,
          topReps: topSet.repetitions,
          totalVolume: vol,
        };
      });

    const plateauAnalysis = analyzeExercisePlateau(sessionHistory);

    return {
      previousSets: previousSets.map((s) => ({
        setNumber: s.setNumber,
        weight: s.weight,
        repetitions: s.repetitions,
        rpe: s.rpe,
      })),
      recommendation,
      plateauAnalysis,
    };
  }
}
