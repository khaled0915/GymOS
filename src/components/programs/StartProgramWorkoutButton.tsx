"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { startWorkoutAction } from "@/actions/workout.actions";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

interface StartProgramWorkoutProps {
  programId: string;
  workoutDayId: string;
  dayName: string;
}

export function StartProgramWorkoutButton({
  programId,
  workoutDayId,
  dayName,
}: StartProgramWorkoutProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStart = () => {
    startTransition(async () => {
      await startWorkoutAction(programId, workoutDayId);
      router.push("/workouts");
    });
  };

  return (
    <Button
      onClick={handleStart}
      size="sm"
      variant="athletic"
      disabled={isPending}
      className="h-7 px-2.5 text-xs font-semibold"
    >
      <Play className="mr-1 h-3 w-3 fill-current" />
      {isPending ? "Starting…" : `Start ${dayName}`}
    </Button>
  );
}
