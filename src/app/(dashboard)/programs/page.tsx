import { auth } from "@/lib/auth";
import { ProgramRepository } from "@/repositories/program.repository";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, Plus, Dumbbell, Sparkles } from "lucide-react";
import { StartProgramWorkoutButton } from "@/components/programs/StartProgramWorkoutButton";

export default async function ProgramsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const programs = await ProgramRepository.findUserPrograms(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Workout Programs</h1>
          <p className="text-muted-foreground mt-1">Structure your training splits and routine</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/coach">
              <Sparkles className="mr-1.5 h-4 w-4 text-emerald-500" /> AI Generator
            </Link>
          </Button>
          <Button asChild variant="athletic">
            <Link href="/programs/new">
              <Plus className="mr-1.5 h-4 w-4" /> New Program
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {programs.length === 0 ? (
          <div className="col-span-full text-center py-12 space-y-4">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">You haven&apos;t created any workout programs yet.</p>
            <div className="flex justify-center gap-3">
              <Button asChild variant="outline">
                <Link href="/coach">Generate with AI Coach</Link>
              </Button>
              <Button asChild variant="athletic">
                <Link href="/programs/new">Create Custom Program</Link>
              </Button>
            </div>
          </div>
        ) : (
          programs.map((prog) => (
            <Card key={prog.id} className="hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{prog.name}</CardTitle>
                  <Badge variant={prog.isActive ? "success" : "secondary"}>
                    {prog.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {prog.description && (
                  <CardDescription>{prog.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Workout Days ({prog.workoutDays.length})
                </p>
                <div className="space-y-2">
                  {prog.workoutDays.map((day) => (
                    <div
                      key={day.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-sm">{day.name}</span>
                        <p className="text-muted-foreground">
                          {day.plannedExercises.length} planned exercise{day.plannedExercises.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <StartProgramWorkoutButton
                        programId={prog.id}
                        workoutDayId={day.id}
                        dayName={day.name}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
