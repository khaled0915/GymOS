/**
 * Analytics domain — pure functions for training data aggregation.
 * No database or framework dependencies.
 */

export interface AnalyticsSet {
  weight: number;
  repetitions: number;
}

export interface AnalyticsExerciseSession {
  exerciseId: string;
  exerciseName: string;
  primaryMuscle: string;
  secondaryMuscles?: string[];
  sets: AnalyticsSet[];
}

export interface AnalyticsWorkout {
  completedAt: Date;
  durationSeconds: number | null;
  exerciseSessions: AnalyticsExerciseSession[];
}

/** Total volume (kg × reps) for a list of sets. */
export function calculateTotalVolume(sets: AnalyticsSet[]): number {
  return sets.reduce((total, s) => total + s.weight * s.repetitions, 0);
}

/** Aggregate volume by muscle group across all workouts. */
export function aggregateVolumeByMuscleGroup(
  workouts: AnalyticsWorkout[],
): { muscle: string; volume: number }[] {
  const map = new Map<string, number>();

  for (const w of workouts) {
    for (const es of w.exerciseSessions) {
      const vol = calculateTotalVolume(es.sets);
      map.set(es.primaryMuscle, (map.get(es.primaryMuscle) ?? 0) + vol);
    }
  }

  return Array.from(map.entries())
    .map(([muscle, volume]) => ({ muscle, volume: Math.round(volume) }))
    .sort((a, b) => b.volume - a.volume);
}

/** Aggregate volume by ISO week (Monday start). */
export function aggregateVolumeByWeek(
  workouts: AnalyticsWorkout[],
): { week: string; volume: number }[] {
  const map = new Map<string, number>();

  for (const w of workouts) {
    if (!w.completedAt) continue;
    const d = new Date(w.completedAt);
    // Find the Monday of this week
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d);
    monday.setDate(diff);
    const weekKey = monday.toISOString().split("T")[0]!;

    let vol = 0;
    for (const es of w.exerciseSessions) {
      vol += calculateTotalVolume(es.sets);
    }
    map.set(weekKey, (map.get(weekKey) ?? 0) + vol);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, volume]) => ({ week, volume: Math.round(volume) }));
}

/**
 * Exercise progression — returns the best set and total volume
 * per workout session for a given exercise, sorted by date.
 */
export function getExerciseProgression(
  workouts: AnalyticsWorkout[],
  exerciseId: string,
): { date: string; weight: number; reps: number; volume: number }[] {
  const points: { date: string; weight: number; reps: number; volume: number }[] = [];

  for (const w of workouts) {
    if (!w.completedAt) continue;
    const es = w.exerciseSessions.find((e) => e.exerciseId === exerciseId);
    if (!es || es.sets.length === 0) continue;

    const bestSet = es.sets.reduce(
      (best, s) => (s.weight > best.weight ? s : best),
      es.sets[0]!,
    );
    const totalVolume = calculateTotalVolume(es.sets);

    points.push({
      date: new Date(w.completedAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      weight: bestSet.weight,
      reps: bestSet.repetitions,
      volume: Math.round(totalVolume),
    });
  }

  return points;
}

/** Average workout duration in minutes. */
export function calculateAverageWorkoutDuration(
  workouts: AnalyticsWorkout[],
): number {
  const withDuration = workouts.filter(
    (w) => w.durationSeconds != null && w.durationSeconds > 0,
  );
  if (withDuration.length === 0) return 0;
  const total = withDuration.reduce(
    (acc, w) => acc + (w.durationSeconds ?? 0),
    0,
  );
  return Math.round(total / withDuration.length / 60);
}

/** Workout count per day of the week. */
export function getWorkoutFrequencyByDay(
  workouts: AnalyticsWorkout[],
): { day: string; count: number }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts = [0, 0, 0, 0, 0, 0, 0];

  for (const w of workouts) {
    if (!w.completedAt) continue;
    counts[new Date(w.completedAt).getDay()]!++;
  }

  return days.map((day, i) => ({ day, count: counts[i]! }));
}

/** Total sets completed across all workouts. */
export function calculateTotalSets(workouts: AnalyticsWorkout[]): number {
  let total = 0;
  for (const w of workouts) {
    for (const es of w.exerciseSessions) {
      total += es.sets.length;
    }
  }
  return total;
}
