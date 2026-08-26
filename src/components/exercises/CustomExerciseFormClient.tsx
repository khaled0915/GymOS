"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createExerciseAction } from "@/actions/exercise.actions";
import { Plus, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MUSCLE_GROUPS = [
  "CHEST", "BACK", "SHOULDERS", "BICEPS", "TRICEPS",
  "LEGS", "GLUTES", "ABS", "CALVES", "CARDIO",
] as const;

const EQUIPMENT_OPTIONS = [
  "BARBELL", "DUMBBELL", "CABLE", "MACHINE",
  "BODYWEIGHT", "BAND", "KETTLEBELL", "OTHER",
] as const;

const DIFFICULTY_OPTIONS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export function CustomExerciseFormClient() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [primaryMuscle, setPrimaryMuscle] = useState<string>("CHEST");
  const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([]);
  const [equipment, setEquipment] = useState<string>("BARBELL");
  const [difficulty, setDifficulty] = useState<string>("INTERMEDIATE");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleSecondary = (muscle: string) => {
    if (muscle === primaryMuscle) return;
    setSecondaryMuscles((prev) =>
      prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
    );
  };

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Exercise name is required.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const res = await createExerciseAction({
        name: name.trim(),
        primaryMuscle: primaryMuscle as any,
        secondaryMuscles: secondaryMuscles as any,
        equipment: equipment as any,
        difficulty: difficulty as any,
        instructions: instructions.trim() || undefined,
      });

      if (res.success && res.exercise) {
        router.push(`/exercises/${res.exercise.id}`);
      } else {
        setError(res.error || "Failed to create exercise.");
      }
    });
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Exercise Details</CardTitle>
        <CardDescription>Custom exercises will be available in your workout tracker and programs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <Label>Exercise Name *</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Incline Dumbbell Hammer Curl"
          />
        </div>

        {/* Primary Muscle & Equipment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Muscle *</Label>
            <select
              value={primaryMuscle}
              onChange={(e) => {
                const val = e.target.value;
                setPrimaryMuscle(val);
                setSecondaryMuscles((prev) => prev.filter((m) => m !== val));
              }}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {MUSCLE_GROUPS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Equipment</Label>
            <select
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              {EQUIPMENT_OPTIONS.map((eq) => (
                <option key={eq} value={eq}>
                  {eq}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <div className="flex gap-2">
            {DIFFICULTY_OPTIONS.map((d) => (
              <Button
                key={d}
                type="button"
                variant={difficulty === d ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficulty(d)}
              >
                {d}
              </Button>
            ))}
          </div>
        </div>

        {/* Secondary Muscles */}
        <div className="space-y-2">
          <Label>Secondary Muscles (Optional)</Label>
          <div className="flex flex-wrap gap-1.5">
            {MUSCLE_GROUPS.filter((m) => m !== primaryMuscle).map((m) => (
              <Button
                key={m}
                type="button"
                variant={secondaryMuscles.includes(m) ? "secondary" : "outline"}
                size="sm"
                className="text-xs h-7"
                onClick={() => toggleSecondary(m)}
              >
                {m}
              </Button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <Label>Form & Technique Instructions</Label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Describe cues, setup, and key execution tips..."
            className="w-full min-h-[100px] rounded-md border border-input bg-transparent p-3 text-sm"
          />
        </div>

        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button onClick={handleCreate} variant="athletic" size="lg" disabled={isPending}>
            <Plus className="mr-2 h-4 w-4" /> {isPending ? "Creating…" : "Save Custom Exercise"}
          </Button>
          <Button asChild variant="ghost">
            <Link href="/exercises">Cancel</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
