"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface ExerciseProgressionProps {
  exercises: { id: string; name: string }[];
  workouts: {
    completedAt: Date;
    durationSeconds: number | null;
    exerciseSessions: {
      exerciseId: string;
      exerciseName: string;
      primaryMuscle: string;
      sets: { weight: number; repetitions: number }[];
    }[];
  }[];
}

export function ExerciseProgressionClient({
  exercises,
  workouts,
}: ExerciseProgressionProps) {
  const [selectedExercise, setSelectedExercise] = useState(
    exercises[0]?.id || ""
  );

  const progressionData = getProgression(workouts, selectedExercise);

  return (
    <div className="space-y-4">
      <select
        value={selectedExercise}
        onChange={(e) => setSelectedExercise(e.target.value)}
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm w-full max-w-xs"
      >
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>

      {progressionData.length < 2 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Not enough data for this exercise yet. Log at least 2 sessions.
        </p>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressionData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                unit=" kg"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(160, 60%, 45%)"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(160, 60%, 45%)" }}
                activeDot={{ r: 6 }}
                name="Best Weight (kg)"
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="hsl(200, 70%, 50%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, fill: "hsl(200, 70%, 50%)" }}
                name="Session Volume (kg)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function getProgression(
  workouts: ExerciseProgressionProps["workouts"],
  exerciseId: string
) {
  const points: { date: string; weight: number; reps: number; volume: number }[] = [];

  for (const w of workouts) {
    if (!w.completedAt) continue;
    const es = w.exerciseSessions.find((e) => e.exerciseId === exerciseId);
    if (!es || es.sets.length === 0) continue;

    const bestSet = es.sets.reduce(
      (best, s) => (s.weight > best.weight ? s : best),
      es.sets[0]!
    );
    const totalVolume = es.sets.reduce(
      (acc, s) => acc + s.weight * s.repetitions,
      0
    );

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
