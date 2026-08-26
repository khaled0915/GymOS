"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  createProgramAction,
  addWorkoutDayAction,
  addPlannedExerciseAction,
} from "@/actions/program.actions";
import { Plus, Trash2, Save, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Exercise } from "@prisma/client";

interface WorkoutDayDraft {
  name: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    targetSets: number;
    minReps: number;
    maxReps: number;
    targetRpe?: number;
    restSeconds?: number;
  }[];
}

interface ProgramFormProps {
  availableExercises: Exercise[];
}

export function ProgramFormClient({ availableExercises }: ProgramFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [days, setDays] = useState<WorkoutDayDraft[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addDay = () => {
    setDays([...days, { name: `Day ${days.length + 1}`, exercises: [] }]);
  };

  const removeDay = (index: number) => {
    setDays(days.filter((_, i) => i !== index));
  };

  const updateDayName = (index: number, name: string) => {
    const updated = [...days];
    if (updated[index]) updated[index].name = name;
    setDays(updated);
  };

  const addExerciseToDay = (dayIndex: number, exercise: Exercise) => {
    const updated = [...days];
    const day = updated[dayIndex];
    if (!day) return;
    day.exercises.push({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      targetSets: 3,
      minReps: 8,
      maxReps: 12,
    });
    setDays(updated);
  };

  const removeExerciseFromDay = (dayIndex: number, exIndex: number) => {
    const updated = [...days];
    const day = updated[dayIndex];
    if (!day) return;
    day.exercises = day.exercises.filter((_, i) => i !== exIndex);
    setDays(updated);
  };

  const updateExerciseField = (
    dayIndex: number,
    exIndex: number,
    field: string,
    value: number
  ) => {
    const updated = [...days];
    const day = updated[dayIndex];
    if (!day) return;
    const ex = day.exercises[exIndex];
    if (!ex) return;
    (ex as any)[field] = value;
    setDays(updated);
  };

  const handleSave = () => {
    if (!programName.trim()) {
      setError("Program name is required.");
      return;
    }
    if (days.length === 0) {
      setError("Add at least one workout day.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        // 1. Create program
        const programRes = await createProgramAction({
          name: programName.trim(),
          description: programDescription.trim() || undefined,
        });
        if (!programRes.success || !programRes.program) {
          setError(programRes.error || "Failed to create program.");
          return;
        }

        // 2. Create workout days and exercises sequentially
        for (let di = 0; di < days.length; di++) {
          const day = days[di];
          if (!day) continue;
          const dayRes = await addWorkoutDayAction({
            programId: programRes.program.id,
            name: day.name,
            order: di + 1,
          });
          if (!dayRes.success || !dayRes.day) continue;

          for (let ei = 0; ei < day.exercises.length; ei++) {
            const ex = day.exercises[ei];
            if (!ex) continue;
            await addPlannedExerciseAction({
              workoutDayId: dayRes.day.id,
              exerciseId: ex.exerciseId,
              order: ei + 1,
              targetSets: ex.targetSets,
              minReps: ex.minReps,
              maxReps: ex.maxReps,
              targetRpe: ex.targetRpe,
              restSeconds: ex.restSeconds,
            });
          }
        }

        router.push("/programs");
      } catch (err) {
        setError("An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Program Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Program Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Program Name *</Label>
            <Input
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              placeholder="e.g. Push/Pull/Legs, Upper/Lower Split"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              placeholder="Optional description"
            />
          </div>
        </CardContent>
      </Card>

      {/* Workout Days */}
      {days.map((day, dayIndex) => (
        <Card key={dayIndex}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Day {dayIndex + 1}</Badge>
                <Input
                  value={day.name}
                  onChange={(e) => updateDayName(dayIndex, e.target.value)}
                  className="h-8 w-48 text-sm font-semibold"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeDay(dayIndex)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Exercises in this day */}
            {day.exercises.map((ex, exIndex) => (
              <div
                key={exIndex}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/40"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{ex.exerciseName}</p>
                  <div className="flex gap-2 mt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground">Sets</label>
                      <Input
                        type="number"
                        value={ex.targetSets}
                        onChange={(e) =>
                          updateExerciseField(
                            dayIndex,
                            exIndex,
                            "targetSets",
                            parseInt(e.target.value) || 3
                          )
                        }
                        className="h-7 w-16 text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground">Min Reps</label>
                      <Input
                        type="number"
                        value={ex.minReps}
                        onChange={(e) =>
                          updateExerciseField(
                            dayIndex,
                            exIndex,
                            "minReps",
                            parseInt(e.target.value) || 8
                          )
                        }
                        className="h-7 w-16 text-xs text-center"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-muted-foreground">Max Reps</label>
                      <Input
                        type="number"
                        value={ex.maxReps}
                        onChange={(e) =>
                          updateExerciseField(
                            dayIndex,
                            exIndex,
                            "maxReps",
                            parseInt(e.target.value) || 12
                          )
                        }
                        className="h-7 w-16 text-xs text-center"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExerciseFromDay(dayIndex, exIndex)}
                  className="text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}

            {/* Add exercise to this day */}
            <div className="pt-2">
              <select
                onChange={(e) => {
                  const exercise = availableExercises.find(
                    (ex) => ex.id === e.target.value
                  );
                  if (exercise) {
                    addExerciseToDay(dayIndex, exercise);
                    e.target.value = "";
                  }
                }}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                defaultValue=""
              >
                <option value="" disabled>
                  + Add exercise…
                </option>
                {availableExercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.primaryMuscle})
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Day Button */}
      <Button variant="outline" onClick={addDay} className="w-full border-dashed">
        <Plus className="mr-1.5 h-4 w-4" /> Add Workout Day
      </Button>

      {/* Error */}
      {error && (
        <p className="text-sm text-destructive font-medium">{error}</p>
      )}

      {/* Save */}
      <Button
        onClick={handleSave}
        variant="athletic"
        size="lg"
        disabled={isPending}
        className="w-full sm:w-auto"
      >
        {isPending ? (
          "Creating…"
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" /> Create Program
          </>
        )}
      </Button>
    </div>
  );
}
