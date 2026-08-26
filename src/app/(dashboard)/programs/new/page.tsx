import { auth } from "@/lib/auth";
import { ExerciseRepository } from "@/repositories/exercise.repository";
import { ProgramFormClient } from "@/components/programs/ProgramFormClient";

export default async function NewProgramPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const exercises = await ExerciseRepository.findMany({ userId: session.user.id });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Create Program</h1>
        <p className="text-muted-foreground mt-1">
          Design a structured workout program with training days and exercises
        </p>
      </div>

      <ProgramFormClient availableExercises={exercises} />
    </div>
  );
}
