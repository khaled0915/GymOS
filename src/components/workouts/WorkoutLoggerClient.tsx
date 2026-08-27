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
  getExerciseGuidanceAction,
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
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Volume2,
  VolumeX,
  Flame,
  Dumbbell,
  CheckCircle2,
} from "lucide-react";
import { generateWarmUpSets, type WarmUpSet } from "@/domain/warmup";
import type { FullWorkoutSession } from "@/repositories/workout.repository";
import type { Exercise } from "@prisma/client";
import { useRouter } from "next/navigation";

function playRestChime() {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1320, now + 0.15);
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);
  } catch {
    // Audio autoplay restrictions catch
  }
}

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
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Elapsed Session Time
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Exercise picker modal
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");

  // Warm-Up Modal state
  const [showWarmUpModal, setShowWarmUpModal] = useState(false);

  // Intelligence State (Guidance + Plateau)
  const [recommendation, setRecommendation] = useState<{
    weight: number;
    targetReps: number;
    reason: string;
  } | null>(null);
  const [plateauAlert, setPlateauAlert] = useState<{
    stalledSessions: number;
    reason: string;
    recommendation: string;
  } | null>(null);
  const [previousSets, setPreviousSets] = useState<
    Array<{ setNumber: number; weight: number; repetitions: number; rpe?: number | null }>
  >([]);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (soundEnabled) playRestChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, soundEnabled]);

  // Session clock
  useEffect(() => {
    if (!session) return;
    const start = new Date(session.startedAt).getTime();
    const updateElapsed = () => {
      const diff = Math.floor((Date.now() - start) / 1000);
      setElapsedSeconds(Math.max(0, diff));
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [session]);

  // Fetch guidance whenever exercise changes
  const activeExerciseSession = session?.exerciseSessions[activeExerciseIndex];
  useEffect(() => {
    if (!activeExerciseSession?.exerciseId) return;

    let isMounted = true;
    getExerciseGuidanceAction(activeExerciseSession.exerciseId).then((res) => {
      if (!isMounted || !res) return;
      setRecommendation(res.recommendation);
      setPlateauAlert(
        res.plateauAnalysis?.status === "PLATEAU_DETECTED"
          ? {
              stalledSessions: res.plateauAnalysis.consecutiveStalledSessions,
              reason: res.plateauAnalysis.reason,
              recommendation: res.plateauAnalysis.recommendation || "Deload suggested",
            }
          : null
      );
      setPreviousSets(res.previousSets);
      if (res.recommendation) {
        setWeight(res.recommendation.weight.toString());
        setReps(res.recommendation.targetReps.toString());
      } else if (res.previousSets.length > 0) {
        const lastSet = res.previousSets[0];
        if (lastSet) {
          setWeight(lastSet.weight.toString());
          setReps(lastSet.repetitions.toString());
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeExerciseSession?.exerciseId]);

  const handleStartWorkout = () => {
    startTransition(async () => {
      const workout = await startWorkoutAction();
      if (workout) {
        setSession(workout);
      }
    });
  };

  const handleAddExercise = (exerciseId: string) => {
    if (!session) return;
    startTransition(async () => {
      const exerciseSession = await addExerciseToWorkoutAction(session.id, exerciseId);
      if (exerciseSession) {
        const exMeta = availableExercises.find((e) => e.id === exerciseId);
        const newEs: any = {
          ...exerciseSession,
          exercise: exMeta || { id: exerciseId, name: "Exercise", primaryMuscle: "CHEST" },
          sets: [],
        };
        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            exerciseSessions: [...prev.exerciseSessions, newEs],
          };
        });
        setActiveExerciseIndex(session.exerciseSessions.length);
        setShowExercisePicker(false);
      }
    });
  };

  const handleLogSet = () => {
    if (!activeExerciseSession) return;
    const w = parseFloat(weight);
    const r = parseInt(reps, 10);
    const rpeVal = rpe ? parseFloat(rpe) : undefined;

    if (isNaN(w) || isNaN(r) || w < 0 || r <= 0) return;

    startTransition(async () => {
      const nextSetNumber = activeExerciseSession.sets.length + 1;
      const res = await logSetAction({
        exerciseSessionId: activeExerciseSession.id,
        exerciseId: activeExerciseSession.exerciseId,
        setNumber: nextSetNumber,
        weight: w,
        repetitions: r,
        rpe: rpeVal,
      });

      if (res && res.set) {
        setSession((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            exerciseSessions: prev.exerciseSessions.map((es, idx) =>
              idx === activeExerciseIndex
                ? { ...es, sets: [...es.sets, res.set as any] }
                : es
            ),
          };
        });

        if (res.newPrs && res.newPrs.length > 0) {
          const prTypes = res.newPrs.map((pr: any) => pr.type).join(", ");
          setRecentPr(`🏆 New PR detected: ${prTypes}!`);
          setTimeout(() => setRecentPr(null), 5000);
        }

        setTimerSeconds(90);
        setIsTimerRunning(true);
      }
    });
  };

  const handleFinishWorkout = () => {
    if (!session) return;
    startTransition(async () => {
      const workout = await completeWorkoutAction(session.id);
      if (workout) {
        setSession(null);
        router.push("/dashboard");
      }
    });
  };

  const filteredExercises = availableExercises.filter((e) =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    e.primaryMuscle.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const currentWorkingWeight = parseFloat(weight) || 60;
  const warmUpRampSets = generateWarmUpSets(currentWorkingWeight);

  // Total session calculations
  const totalSetsLogged = session?.exerciseSessions.reduce((acc, es) => acc + es.sets.length, 0) || 0;
  const totalVolumeLifted = session?.exerciseSessions.reduce((acc, es) => {
    return acc + es.sets.reduce((sAcc, s) => sAcc + (s.completed ? s.weight * s.repetitions : 0), 0);
  }, 0) || 0;

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center border border-border/50 bg-[#12161F]/60 rounded-3xl backdrop-blur-md space-y-6 max-w-lg mx-auto mt-6">
        <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Play className="h-8 w-8 fill-current ml-1" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">No Active Workout</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Ready to log your training session? Load previous weights, monitor rest times, and hit live overload targets.
          </p>
        </div>
        <Button
          onClick={handleStartWorkout}
          variant="athletic"
          size="lg"
          className="w-full sm:w-auto px-8 font-bold text-black bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
          disabled={isPending}
        >
          {isPending ? "Starting…" : "+ Start New Workout"}
        </Button>
      </div>
    );
  }

  const currentExerciseSession = session.exerciseSessions[activeExerciseIndex];
  const totalExercises = session.exerciseSessions.length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-20">
      {/* ── Top Live Session Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border/60 bg-[#12161F]/80 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="font-black text-lg text-white">Live Training Session</h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>⏱️ Elapsed: <strong className="text-white">{formatElapsed(elapsedSeconds)}</strong></span>
            <span>🏋️ Volume: <strong className="text-emerald-400">{Math.round(totalVolumeLifted).toLocaleString()} kg</strong></span>
            <span>Sets: <strong className="text-white">{totalSetsLogged}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowExercisePicker(true)}
            variant="outline"
            size="sm"
            className="h-9 px-3 text-xs border-border/60 hover:bg-white/5"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Exercise
          </Button>
          <Button
            onClick={handleFinishWorkout}
            variant="destructive"
            size="sm"
            className="h-9 px-4 text-xs font-bold shadow-md shadow-rose-950/20"
            disabled={isPending}
          >
            <Square className="h-3.5 w-3.5 mr-1 fill-current" /> Finish Session
          </Button>
        </div>
      </div>

      {/* PR Alert Notification */}
      {recentPr && (
        <div className="p-3.5 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-300 font-bold text-xs animate-bounce shadow-md">
          <Trophy className="h-4 w-4 text-amber-400" />
          {recentPr}
        </div>
      )}

      {/* ── Active Exercise Navigator Pills ── */}
      {totalExercises > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {session.exerciseSessions.map((es, idx) => (
            <button
              key={es.id}
              onClick={() => setActiveExerciseIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                idx === activeExerciseIndex
                  ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-sm"
                  : "bg-[#12161F]/60 border-border/40 text-muted-foreground hover:text-white"
              }`}
            >
              {idx + 1}. {es.exercise.name} ({es.sets.length} sets)
            </button>
          ))}
        </div>
      )}

      {/* ── Active Exercise Card ── */}
      {totalExercises === 0 ? (
        <div className="p-10 text-center space-y-4 rounded-2xl border border-dashed border-border/60 bg-[#12161F]/40">
          <Dumbbell className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <p className="text-sm text-muted-foreground">No exercises added to this session yet.</p>
          <Button variant="athletic" onClick={() => setShowExercisePicker(true)} className="font-bold text-black bg-emerald-500">
            <Plus className="h-4 w-4 mr-1.5" /> Add First Exercise
          </Button>
        </div>
      ) : currentExerciseSession ? (
        <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  {currentExerciseSession.exercise.primaryMuscle}
                </Badge>
                {currentExerciseSession.exercise.equipment && (
                  <span className="text-[10px] text-muted-foreground uppercase font-mono">
                    {currentExerciseSession.exercise.equipment}
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {currentExerciseSession.exercise.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs px-3 border-orange-500/40 text-orange-400 hover:bg-orange-500/10 font-semibold"
                onClick={() => setShowWarmUpModal(true)}
              >
                <Flame className="h-3.5 w-3.5 mr-1 fill-current" /> Warm-Up Ramp
              </Button>
            </div>
          </div>

          {/* Plateau Warning Alert */}
          {plateauAlert && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Plateau Alert ({plateauAlert.reason})
              </div>
              <p className="text-amber-200/80 leading-relaxed">{plateauAlert.recommendation}</p>
            </div>
          )}

          {/* Live Overload Guidance Target Badge */}
          {recommendation && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-sm">
                  <Sparkles className="h-4 w-4" /> Overload Target: {recommendation.weight} kg × {recommendation.targetReps} reps
                </div>
                <p className="text-muted-foreground text-[11px]">{recommendation.reason}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 px-3 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 font-bold"
                onClick={() => {
                  setWeight(recommendation.weight.toString());
                  setReps(recommendation.targetReps.toString());
                }}
              >
                Use Target
              </Button>
            </div>
          )}

          {/* Previous Performance Reference */}
          {previousSets.length > 0 && (
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Previous Workout Reference
              </p>
              <div className="flex flex-wrap gap-2">
                {previousSets.map((ps) => (
                  <div key={ps.setNumber} className="text-xs px-2.5 py-1 rounded-lg bg-card border border-border/50">
                    <span className="text-muted-foreground font-mono">Set {ps.setNumber}: </span>
                    <strong className="text-white">{ps.weight}kg × {ps.repetitions}</strong>
                    {ps.rpe && <span className="text-[10px] text-muted-foreground ml-1">(@{ps.rpe})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Interactive Set Table ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sets for this Session</p>

            {/* Completed Sets */}
            {currentExerciseSession.sets.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border/40 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-[11px]">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-bold text-white text-sm">Set {s.setNumber}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-white font-mono"><strong>{s.weight}</strong> kg</span>
                  <span className="text-white font-mono"><strong>{s.repetitions}</strong> reps</span>
                  {s.rpe && <span className="text-muted-foreground font-mono">RPE {s.rpe}</span>}
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                    Completed
                  </span>
                </div>
              </div>
            ))}

            {/* Active Row Inputs (Set to be logged) */}
            <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>Set {currentExerciseSession.sets.length + 1} (Active)</span>
                <span className="text-[10px] text-muted-foreground font-mono">Enter Weight & Reps</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Weight (kg)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-10 text-base font-bold font-mono bg-background border-border/60 focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Reps</label>
                  <Input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="h-10 text-base font-bold font-mono bg-background border-border/60 focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">RPE (1-10)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={rpe}
                    onChange={(e) => setRpe(e.target.value)}
                    className="h-10 text-base font-bold font-mono bg-background border-border/60 focus:border-emerald-400"
                  />
                </div>
              </div>

              <Button
                onClick={handleLogSet}
                variant="athletic"
                className="w-full h-11 font-bold text-black bg-emerald-500 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 text-sm"
                disabled={isPending}
              >
                <Check className="h-4 w-4 mr-2 stroke-[3]" /> Log Set {currentExerciseSession.sets.length + 1}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Floating Rest Timer Widget (Bottom Right) ── */}
      {timerSeconds > 0 && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl border border-emerald-500/50 bg-[#12161F]/95 backdrop-blur-xl shadow-2xl shadow-emerald-950/50 flex items-center gap-4">
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" className="stroke-muted/30" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                className="stroke-emerald-400 animate-pulse"
                strokeWidth="3"
                strokeDasharray="88"
                strokeDashoffset={88 - (88 * timerSeconds) / 90}
                strokeLinecap="round"
              />
            </svg>
            <Timer className="absolute h-5 w-5 text-emerald-400" />
          </div>

          <div>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Rest Timer</p>
            <p className="text-2xl font-black font-mono text-white">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, "0")}
            </p>
          </div>

          <div className="flex items-center gap-1.5 pl-2 border-l border-border/40">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-white"
              onClick={() => setSoundEnabled((prev) => !prev)}
              title={soundEnabled ? "Mute Timer" : "Enable Chime"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs font-mono" onClick={() => setTimerSeconds((s) => s + 30)}>
              +30s
            </Button>
            <Button size="sm" variant="secondary" className="h-8 text-xs" onClick={() => setTimerSeconds(0)}>
              Skip
            </Button>
          </div>
        </div>
      )}

      {/* ── Warm-Up Modal ── */}
      {showWarmUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-[#12161F] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-400 fill-current" />
                <h3 className="font-bold text-white text-base">Scientific Warm-Up Ramp</h3>
              </div>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setShowWarmUpModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on your target working weight of <strong className="text-white">{currentWorkingWeight} kg</strong>:
            </p>
            <div className="space-y-2 text-xs">
              {warmUpRampSets.map((ws) => (
                <div key={ws.setNumber} className="flex items-center justify-between p-2.5 rounded-xl bg-card/60 border border-border/40">
                  <div>
                    <span className="font-bold text-white">Set {ws.setNumber} ({ws.percentage}%)</span>
                    <span className="text-muted-foreground ml-2">{ws.weight} kg × {ws.reps} reps</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] px-2"
                    onClick={() => {
                      setWeight(ws.weight.toString());
                      setReps(ws.reps.toString());
                      setShowWarmUpModal(false);
                    }}
                  >
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Exercise Picker Modal ── */}
      {showExercisePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border/60 bg-[#12161F] p-6 space-y-4 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="font-bold text-white text-base">Select Exercise</h3>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setShowExercisePicker(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exercise by name or muscle..."
                value={exerciseSearch}
                onChange={(e) => setExerciseSearch(e.target.value)}
                className="pl-9 h-10 bg-background"
              />
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {filteredExercises.map((e) => (
                <button
                  key={e.id}
                  onClick={() => handleAddExercise(e.id)}
                  className="w-full text-left p-3 rounded-xl border border-border/40 bg-card/40 hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all flex items-center justify-between group text-xs"
                >
                  <div>
                    <p className="font-bold text-white text-sm group-hover:text-emerald-400">{e.name}</p>
                    <p className="text-muted-foreground text-[11px]">{e.primaryMuscle} · {e.equipment || "Standard"}</p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground group-hover:text-emerald-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
