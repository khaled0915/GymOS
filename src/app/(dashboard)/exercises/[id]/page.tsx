import { auth } from "@/lib/auth";
import { ExerciseRepository } from "@/repositories/exercise.repository";
import { notFound } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";

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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions & Technique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-foreground/90">
            {exercise.instructions || "No specific instructions provided for this exercise."}
          </p>

          {exercise.secondaryMuscles.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                Secondary Muscles
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {exercise.secondaryMuscles.map((muscle) => (
                  <Badge key={muscle} variant="outline">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
