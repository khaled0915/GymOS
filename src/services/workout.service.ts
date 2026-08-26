import { WorkoutRepository } from "@/repositories/workout.repository";
import { ProgressRepository } from "@/repositories/progress.repository";
import { detectPersonalRecords } from "@/domain/personal-records";
import { getNextExerciseRecommendation } from "@/domain/progressive-overload";

export class WorkoutService {
  static async startWorkout(userId: string, programId?: string, workoutDayId?: string) {
    // Check if there is already an active session
    const existing = await WorkoutRepository.findActiveSession(userId);
    if (existing) {
      return existing;
    }
    return WorkoutRepository.create(userId, { programId, workoutDayId });
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

  static async getRecommendation(userId: string, exerciseId: string, targetRepRange: { min: number; max: number }) {
    const previousSets = await WorkoutRepository.getPreviousPerformance(userId, exerciseId);
    if (previousSets.length === 0) return null;

    const lastSet = previousSets[previousSets.length - 1];
    if (!lastSet) return null;

    return getNextExerciseRecommendation(
      { weight: lastSet.weight, reps: lastSet.repetitions, rpe: lastSet.rpe ?? undefined },
      targetRepRange
    );
  }
}
