import { auth } from "@/lib/auth";
import { ExerciseRepository } from "@/repositories/exercise.repository";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Dumbbell, Activity } from "lucide-react";
import { MuscleMap } from "@/components/muscle-map/MuscleMap";
import {
  calculateExerciseMuscleStimulus,
  normalizeMuscleIntensities,
} from "@/domain/muscles/muscle-stimulus";
import { PRISMA_MUSCLE_TO_ANATOMICAL } from "@/domain/muscles/muscle-types";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = await ExerciseRepository.findById(id);

  if (!exercise) {
    notFound();
  }

  // Calculate normalized muscle map targets
  const stimulus = calculateExerciseMuscleStimulus(
    {
      primaryMuscle: exercise.primaryMuscle,
      secondaryMuscles: exercise.secondaryMuscles,
    },
    1 // Base set for relative intensity visualization
  );
  const normalizedMuscles = normalizeMuscleIntensities(stimulus).map((m) => {
    const isPrimary = PRISMA_MUSCLE_TO_ANATOMICAL[exercise.primaryMuscle]?.includes(m.muscle);
    return {
      ...m,
      role: isPrimary ? ("PRIMARY" as const) : m.intensity > 0 ? ("SECONDARY" as const) : undefined,
    };
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <Button asChild variant="ghost" size="sm">
        <Link href="/exercises">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to exercises
        </Link>
      </Button>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-black tracking-tight">{exercise.name}</h1>
          <Badge variant="success">{exercise.primaryMuscle}</Badge>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          {exercise.equipment && <span>Equipment: <strong>{exercise.equipment}</strong></span>}
          {exercise.difficulty && <span>• Difficulty: <strong>{exercise.difficulty}</strong></span>}
        </div>
      </div>

      {/* ── Muscles Worked Visualizer ── */}
      <Card className="border-border/60 bg-[#12161F]/60 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" /> Muscles Worked
            </CardTitle>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Primary
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500/70 font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-500/40" /> Secondary
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <MuscleMap muscles={normalizedMuscles} view="both" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/40">
            <div className="p-3 rounded-xl bg-[#0A0D12]/70 border border-border/40 space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Primary Target
              </h4>
              <Badge variant="success" className="font-bold">
                {exercise.primaryMuscle}
              </Badge>
            </div>
            <div className="p-3 rounded-xl bg-[#0A0D12]/70 border border-border/40 space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Secondary Assisting
              </h4>
              <div className="flex flex-wrap gap-1">
                {exercise.secondaryMuscles.length > 0 ? (
                  exercise.secondaryMuscles.map((muscle) => (
                    <Badge key={muscle} variant="outline" className="border-border/60">
                      {muscle}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">None</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions &amp; Technique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground/90">
            {exercise.instructions || "No specific instructions provided for this exercise."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
