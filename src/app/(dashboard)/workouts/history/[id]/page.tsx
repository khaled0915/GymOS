import { auth } from "@/lib/auth";
import { WorkoutRepository } from "@/repositories/workout.repository";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays, Dumbbell, Check } from "lucide-react";
import { notFound } from "next/navigation";

export default async function WorkoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { id } = await params;
  const workout = await WorkoutRepository.findById(id, session.user.id);

  if (!workout || !workout.completedAt) {
    notFound();
  }

  const totalSets = workout.exerciseSessions.reduce(
    (acc, es) => acc + es.sets.length,
    0,
  );
  const totalVolume = workout.exerciseSessions.reduce(
    (acc, es) =>
      acc +
      es.sets.reduce((setAcc, s) => setAcc + s.weight * s.repetitions, 0),
    0,
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {workout.workoutDay?.name ||
              workout.program?.name ||
              "Freestyle Workout"}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center">
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              {new Date(workout.completedAt).toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {workout.durationSeconds && (
              <span className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {Math.round(workout.durationSeconds / 60)} min
              </span>
            )}
          </div>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/workouts/history">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Link>
        </Button>
      </div>

      {/* Summary Badges */}
      <div className="flex gap-3">
        <Badge variant="secondary">{workout.exerciseSessions.length} exercises</Badge>
        <Badge variant="secondary">{totalSets} sets</Badge>
        <Badge variant="success">{Math.round(totalVolume).toLocaleString()} kg total volume</Badge>
      </div>

      {/* Exercise Breakdown */}
      <div className="space-y-4">
        {workout.exerciseSessions.map((es, esIndex) => (
          <Card key={es.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-sm font-bold text-muted-foreground">
                    {esIndex + 1}.
                  </span>
                  {es.exercise.name}
                </CardTitle>
                <Badge variant="secondary">{es.exercise.primaryMuscle}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {es.sets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sets logged.</p>
              ) : (
                <div className="space-y-1.5">
                  {/* Header */}
                  <div className="grid grid-cols-4 gap-2 text-xs font-semibold uppercase text-muted-foreground px-2.5">
                    <span>Set</span>
                    <span>Weight</span>
                    <span>Reps</span>
                    <span>RPE</span>
                  </div>
                  {/* Rows */}
                  {es.sets.map((s) => (
                    <div
                      key={s.id}
                      className="grid grid-cols-4 gap-2 p-2.5 rounded-lg bg-muted/40 text-sm items-center"
                    >
                      <span className="font-medium">Set {s.setNumber}</span>
                      <span className="font-bold">{s.weight} kg</span>
                      <span className="font-bold">{s.repetitions} reps</span>
                      <span className="text-muted-foreground">
                        {s.rpe ? `RPE ${s.rpe}` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notes */}
      {workout.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{workout.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
