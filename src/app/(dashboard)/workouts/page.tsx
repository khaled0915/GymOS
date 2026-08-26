import { auth } from "@/lib/auth";
import { WorkoutRepository } from "@/repositories/workout.repository";
import { ExerciseRepository } from "@/repositories/exercise.repository";
import { WorkoutLoggerClient } from "@/components/workouts/WorkoutLoggerClient";

export default async function WorkoutsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [activeSession, allExercises] = await Promise.all([
    WorkoutRepository.findActiveSession(session.user.id),
    ExerciseRepository.findMany({ userId: session.user.id }),
  ]);

  return (
    <WorkoutLoggerClient
      initialSession={activeSession}
      availableExercises={allExercises}
      userId={session.user.id}
    />
  );
}
