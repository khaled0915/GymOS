"use client";

import React, { useState, useMemo } from "react";
import type { AnalyticsWorkout } from "@/domain/analytics";
import { MuscleMap } from "@/components/muscle-map/MuscleMap";
import {
  calculateWorkoutMuscleStimulus,
  normalizeMuscleIntensities,
} from "@/domain/muscles/muscle-stimulus";
import { MUSCLE_LABELS, type MuscleId } from "@/domain/muscles/muscle-types";
import { Badge } from "@/components/ui/badge";
import { Activity, Flame, Dumbbell } from "lucide-react";

interface AnalyticsMuscleHeatmapClientProps {
  workouts: AnalyticsWorkout[];
}

export function AnalyticsMuscleHeatmapClient({
  workouts,
}: AnalyticsMuscleHeatmapClientProps) {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "ALL">("7D");

  // Filter workouts by selected timeframe
  const filteredWorkouts = useMemo(() => {
    if (timeframe === "ALL") return workouts;

    const now = new Date();
    const cutoffDays = timeframe === "7D" ? 7 : 30;
    const cutoff = new Date(now.getTime() - cutoffDays * 24 * 60 * 60 * 1000);

    return workouts.filter((w) => new Date(w.completedAt) >= cutoff);
  }, [workouts, timeframe]);

  // Compute stimulus and normalized intensities
  const { normalizedMuscles, rankedMuscles, totalSetsInPeriod } = useMemo(() => {
    const rawStimulus = calculateWorkoutMuscleStimulus(
      filteredWorkouts.flatMap((w) =>
        w.exerciseSessions.map((es) => ({
          exercise: {
            primaryMuscle: es.primaryMuscle as any,
            secondaryMuscles: (es.secondaryMuscles || []) as any,
          },
          sets: es.sets.map(() => ({ completed: true })),
        }))
      )
    );

    const normalized = normalizeMuscleIntensities(rawStimulus);
    const ranked = [...normalized]
      .filter((m) => (m.sets || 0) > 0)
      .sort((a, b) => (b.sets || 0) - (a.sets || 0));

    const totalSets = ranked.reduce((acc, m) => acc + (m.sets || 0), 0);

    return {
      normalizedMuscles: normalized,
      rankedMuscles: ranked,
      totalSetsInPeriod: Math.round(totalSets),
    };
  }, [filteredWorkouts]);

  return (
    <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-5">
      {/* ── Header & Timeframe Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">
              Anatomical Muscle Distribution
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Cumulative volume and training stimulus distribution across your physique
          </p>
        </div>

        {/* Timeframe pill selector */}
        <div className="flex items-center p-1 rounded-xl bg-[#0A0D12] border border-border/50 text-xs self-start sm:self-auto">
          {(["7D", "30D", "ALL"] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                timeframe === tf
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              {tf === "7D" ? "Last 7 Days" : tf === "30D" ? "Last 30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content Grid: Left Map + Right Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Muscle Map */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#0A0D12]/50 border border-border/40">
          <MuscleMap muscles={normalizedMuscles} view="both" />
        </div>

        {/* Right: Stimulus Breakdown & Sets */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Trained Muscles ({rankedMuscles.length})
            </span>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px]">
              {totalSetsInPeriod} Total Sets Involved
            </Badge>
          </div>

          {rankedMuscles.length > 0 ? (
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 no-scrollbar text-xs">
              {rankedMuscles.map((m) => {
                const pct = Math.round(m.intensity * 100);
                return (
                  <div
                    key={m.muscle}
                    className="p-2.5 rounded-xl bg-[#0D121B] border border-border/40 space-y-1.5 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">
                        {MUSCLE_LABELS[m.muscle]}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {m.sets} sets
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="h-1.5 w-full bg-[#1A2230] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border/50 bg-[#0A0D12]/40 space-y-2">
              <Dumbbell className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <p className="text-xs text-muted-foreground">
                No workouts logged during this timeframe. Complete a session to visualize your training distribution.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
