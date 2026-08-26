import { auth } from "@/lib/auth";
import { WorkoutRepository } from "@/repositories/workout.repository";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, Dumbbell, ArrowLeft, CalendarDays } from "lucide-react";

export default async function WorkoutHistoryPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const workouts = await WorkoutRepository.findUserHistory(session.user.id, 50);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Workout History</h1>
          <p className="text-muted-foreground mt-1">
            All your completed training sessions
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/workouts">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Logger
          </Link>
        </Button>
      </div>

      {workouts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center space-y-3">
            <Dumbbell className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">No completed workouts yet.</p>
            <Button asChild variant="athletic">
              <Link href="/workouts">Start Your First Workout</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {workouts.map((workout) => {
            const totalSets = workout.exerciseSessions.reduce(
              (acc, es) => acc + es.sets.length,
              0
            );
            const totalVolume = workout.exerciseSessions.reduce(
              (acc, es) =>
                acc +
                es.sets.reduce(
                  (setAcc, s) => setAcc + s.weight * s.repetitions,
                  0
                ),
              0
            );

            return (
              <Link key={workout.id} href={`/workouts/history/${workout.id}`}>
                <Card className="hover:border-emerald-500/40 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {workout.workoutDay?.name ||
                            workout.program?.name ||
                            "Freestyle Workout"}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {new Date(
                              workout.completedAt || workout.startedAt
                            ).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          {workout.durationSeconds && (
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {Math.round(workout.durationSeconds / 60)} min
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{totalSets} sets</Badge>
                        <Badge variant="success">
                          {Math.round(totalVolume).toLocaleString()} kg
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {workout.exerciseSessions.map((es) => (
                        <div
                          key={es.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <Dumbbell className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">
                              {es.exercise.name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {es.sets.length} set{es.sets.length !== 1 ? "s" : ""}
                            {es.sets.length > 0 && (
                              <>
                                {" · Best: "}
                                {Math.max(...es.sets.map((s) => s.weight))} kg ×{" "}
                                {es.sets.find(
                                  (s) =>
                                    s.weight ===
                                    Math.max(...es.sets.map((s2) => s2.weight))
                                )?.repetitions ?? 0}{" "}
                                reps
                              </>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
