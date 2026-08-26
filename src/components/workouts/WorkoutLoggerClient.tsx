"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  startWorkoutAction,
  addExerciseToWorkoutAction,
  logSetAction,
  completeWorkoutAction,
  getPreviousPerformanceAction,
} from "@/actions/workout.actions";
import {
  Play,
  Check,
  Timer,
  Trophy,
  Square,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Search,
} from "lucide-react";
import type { FullWorkoutSession } from "@/repositories/workout.repository";
import type { Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";

interface WorkoutLoggerProps {
  initialSession: FullWorkoutSession | null;
  availableExercises: Exercise[];
  userId: string;
}

export function WorkoutLoggerClient({
  initialSession,
  availableExercises,
}: WorkoutLoggerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [session, setSession] = useState<FullWorkoutSession | null>(initialSession);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);

  // Set inputs
  const [weight, setWeight] = useState<string>("60");
  const [reps, setReps] = useState<string>("10");
  const [rpe, setRpe] = useState<string>("8");
  const [recentPr, setRecentPr] = useState<string | null>(null);

  // Rest Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Exercise picker modal
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");

  // Previous performance
  const [previousSets, setPreviousSets] = useState<
    { setNumber: number; weight: number; repetitions: number; rpe: number | null }[]
  >([]);

  // Fetch previous performance when active exercise changes
  useEffect(() => {
    const exerciseId = session?.exerciseSessions[activeExerciseIndex]?.exerciseId;
    if (!exerciseId) {
      setPreviousSets([]);
      return;
    }
    getPreviousPerformanceAction(exerciseId).then(setPreviousSets).catch(() => setPreviousSets([]));
  }, [session, activeExerciseIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const handleStartWorkout = async () => {
    startTransition(async () => {
      await startWorkoutAction();
      router.refresh();
    });
  };

  const handleAddExercise = async (exerciseId: string) => {
    if (!session) return;
    startTransition(async () => {
      await addExerciseToWorkoutAction(session.id, exerciseId);
      setShowExercisePicker(false);
      setExerciseSearch("");
      router.refresh();
    });
  };

  const handleLogSet = async (exerciseSessionId: string, exerciseId: string) => {
    if (!weight || !reps) return;

    const currentSets = session?.exerciseSessions[activeExerciseIndex]?.sets || [];
    startTransition(async () => {
      const res = await logSetAction({
        exerciseSessionId,
        exerciseId,
        setNumber: currentSets.length + 1,
        weight: parseFloat(weight),
        repetitions: parseInt(reps),
        rpe: rpe ? parseFloat(rpe) : undefined,
      });

      if (res.newPrs && res.newPrs.length > 0 && res.newPrs[0]) {
        const firstPr = res.newPrs[0];
        setRecentPr(`New PR! ${firstPr.type.replace("_", " ")}: ${firstPr.value}`);
        setTimeout(() => setRecentPr(null), 5000);
      }

      startTimer(90);
      router.refresh();
    });
  };

  const handleFinishWorkout = async () => {
    if (!session) return;
    startTransition(async () => {
      await completeWorkoutAction(session.id);
      router.push("/dashboard");
    });
  };

  // Sync from server refresh
  useEffect(() => {
    setSession(initialSession);
  }, [initialSession]);

  const filteredExercises = availableExercises.filter((e) =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  // ── No active session: show start screen ──
  if (!session) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-6">
        <div className="h-16 w-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Play className="h-8 w-8 fill-current ml-1" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Ready to Train?</h1>
          <p className="text-muted-foreground mt-2">
            Start a fresh workout session and log your sets with live PR detection and rest timers.
          </p>
        </div>
        <Button
          onClick={handleStartWorkout}
          variant="athletic"
          size="lg"
          className="w-full sm:w-auto px-8"
          disabled={isPending}
        >
          {isPending ? "Starting…" : "Start Workout Now"}
        </Button>
      </div>
    );
  }

  const currentExerciseSession = session.exerciseSessions[activeExerciseIndex];
  const totalExercises = session.exerciseSessions.length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border">
        <div>
          <h2 className="font-bold text-lg">Active Session</h2>
          <p className="text-xs text-muted-foreground">
            Started {new Date(session.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            {" · "}{totalExercises} exercise{totalExercises !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowExercisePicker(true)}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Add Exercise
          </Button>
          <Button onClick={handleFinishWorkout} variant="destructive" size="sm" disabled={isPending}>
            <Square className="h-4 w-4 mr-1.5 fill-current" /> Finish
          </Button>
        </div>
      </div>

      {/* PR Alert Banner */}
      {recentPr && (
        <div className="p-3 bg-yellow-500/15 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-400 font-semibold text-sm animate-bounce">
          <Trophy className="h-5 w-5" />
          {recentPr}
        </div>
      )}

      {/* Rest Timer Widget */}
      {timerSeconds > 0 && (
        <Card className="border-emerald-500/50 bg-emerald-500/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Timer className="h-6 w-6 text-emerald-600 animate-spin" />
              <div>
                <p className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">Rest Timer</p>
                <p className="text-2xl font-black font-mono">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <Button size="sm" variant="outline" onClick={() => setTimerSeconds((s) => s + 30)}>+30s</Button>
              <Button size="sm" variant="secondary" onClick={() => setTimerSeconds(0)}>Skip</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Navigator */}
      {totalExercises > 0 && (
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveExerciseIndex((i) => Math.max(0, i - 1))}
            disabled={activeExerciseIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            Exercise {activeExerciseIndex + 1} of {totalExercises}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveExerciseIndex((i) => Math.min(totalExercises - 1, i + 1))}
            disabled={activeExerciseIndex === totalExercises - 1}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Active Workout Content */}
      {totalExercises === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center space-y-4">
            <Plus className="h-10 w-10 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">No exercises added yet.</p>
            <Button variant="athletic" onClick={() => setShowExercisePicker(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Your First Exercise
            </Button>
          </CardContent>
        </Card>
      ) : currentExerciseSession ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">
                {currentExerciseSession.exercise.name}
              </CardTitle>
              {currentExerciseSession.exercise.primaryMuscle && (
                <Badge variant="secondary">{currentExerciseSession.exercise.primaryMuscle}</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Previous Performance */}
            {previousSets.length > 0 && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 space-y-1.5">
                <p className="text-xs font-semibold uppercase text-blue-600 dark:text-blue-400">
                  Previous Session
                </p>
                {previousSets.map((ps) => (
                  <div key={ps.setNumber} className="text-sm text-blue-700 dark:text-blue-300">
                    Set {ps.setNumber}: {ps.weight} kg × {ps.repetitions} reps
                    {ps.rpe ? ` @ RPE ${ps.rpe}` : ""}
                  </div>
                ))}
              </div>
            )}

            {/* Sets Completed so far */}
            {currentExerciseSession.sets.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Logged Sets</p>
                <div className="space-y-1.5">
                  {currentExerciseSession.sets.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 text-sm">
                      <span className="font-medium">Set {s.setNumber}</span>
                      <span className="font-bold">{s.weight} kg × {s.repetitions} reps</span>
                      {s.rpe && <span className="text-xs text-muted-foreground">RPE {s.rpe}</span>}
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Set Logger Inputs */}
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-center font-bold text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Reps</label>
                  <Input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="text-center font-bold text-lg"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">RPE</label>
                  <Input
                    type="number"
                    step="0.5"
                    max="10"
                    value={rpe}
                    onChange={(e) => setRpe(e.target.value)}
                    className="text-center font-bold text-lg"
                  />
                </div>
              </div>

              <Button
                onClick={() => handleLogSet(currentExerciseSession.id, currentExerciseSession.exerciseId)}
                variant="athletic"
                size="lg"
                className="w-full text-base font-bold shadow-md"
                disabled={isPending}
              >
                <Check className="mr-2 h-5 w-5" /> {isPending ? "Logging…" : "Complete Set"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Add Exercise</h3>
              <Button variant="ghost" size="icon" onClick={() => { setShowExercisePicker(false); setExerciseSearch(""); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search exercises…"
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="pl-9"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {filteredExercises.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No exercises found.</p>
              ) : (
                filteredExercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => handleAddExercise(exercise.id)}
                    disabled={isPending}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-sm">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise.primaryMuscle}{exercise.equipment ? ` · ${exercise.equipment}` : ""}
                      </p>
                    </div>
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
