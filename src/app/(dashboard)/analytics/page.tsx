import { auth } from "@/lib/auth";
import { AnalyticsService } from "@/services/analytics.service";
import Link from "next/link";
import {
  BarChart3,
  Dumbbell,
  Clock,
  Trophy,
  TrendingUp,
  CalendarDays,
  Download,
  FileSpreadsheet,
  Layers,
  Sparkles,
} from "lucide-react";
import { VolumeChartClient } from "@/components/analytics/VolumeChartClient";
import { MuscleGroupPieClient } from "@/components/analytics/MuscleGroupPieClient";
import { ExerciseProgressionClient } from "@/components/analytics/ExerciseProgressionClient";
import { WorkoutFrequencyClient } from "@/components/analytics/WorkoutFrequencyClient";
import { VolumeLandmarksClient } from "@/components/analytics/VolumeLandmarksClient";
import { AnalyticsMuscleHeatmapClient } from "@/components/analytics/AnalyticsMuscleHeatmapClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await AnalyticsService.getAnalyticsData(session.user.id);

  // Serialize dates for client components
  const serializedWorkouts = data.analyticsWorkouts.map((w) => ({
    ...w,
    completedAt: new Date(w.completedAt),
  }));

  // Calculate weekly direct working sets per muscle group (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklySetsByMuscle: Record<string, number> = {};
  for (const w of data.analyticsWorkouts) {
    if (w.completedAt && new Date(w.completedAt) >= oneWeekAgo) {
      for (const es of w.exerciseSessions) {
        const muscle = es.primaryMuscle;
        weeklySetsByMuscle[muscle] = (weeklySetsByMuscle[muscle] ?? 0) + es.sets.length;
      }
    }
  }

  // Calculate total tonnage
  const totalVolumeTonnage = data.volumeByWeek.reduce((acc, w) => acc + w.volume, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* ── Top Header Banner & Filter Bar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#12161F]/90 via-[#0A0D12]/90 to-[#12161F]/90 border border-border/40 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-emerald-400" /> Analytics Deep-Dive
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Multi-week volume progression, hypertrophy landmarks, and strength trajectory
          </p>
        </div>

        {/* Timeframe Selectors & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="p-1 rounded-xl bg-card/60 border border-border/40 flex items-center gap-1 text-xs">
            {["7D", "30D", "90D", "1Y", "ALL"].map((tf, i) => (
              <button
                key={tf}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  i === 1
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm"
                    : "text-muted-foreground hover:text-white"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <Button asChild variant="outline" size="sm" className="h-8 text-xs border-border/60 hover:bg-white/5">
            <Link href="/profile">
              <Download className="h-3.5 w-3.5 mr-1" /> Exports
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Row 1: 4 Performance Overview Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Volume Tonnage */}
        <div className="p-5 rounded-2xl border border-border/50 bg-[#12161F]/60 backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Total Volume Tonnage</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              <TrendingUp className="h-3 w-3" /> +14.2%
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {Math.round(totalVolumeTonnage).toLocaleString()}{" "}
              <span className="text-xs font-semibold text-muted-foreground">kg</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Cumulative load lifted</p>
          </div>
        </div>

        {/* Card 2: Workouts Completed */}
        <div className="p-5 rounded-2xl border border-border/50 bg-[#12161F]/60 backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Workouts Completed</span>
            <Dumbbell className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {data.totalWorkouts} <span className="text-xs font-semibold text-muted-foreground">Sessions</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Avg duration: {data.avgDuration} mins</p>
          </div>
        </div>

        {/* Card 3: Total Sets & Reps */}
        <div className="p-5 rounded-2xl border border-border/50 bg-[#12161F]/60 backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Sets &amp; Reps Logged</span>
            <Layers className="h-4 w-4 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {data.totalSets} <span className="text-xs font-semibold text-muted-foreground">Sets</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all logged sessions</p>
          </div>
        </div>

        {/* Card 4: Personal Records */}
        <div className="p-5 rounded-2xl border border-border/50 bg-[#12161F]/60 backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Personal Records</span>
            <Trophy className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {data.totalPrs} <span className="text-xs font-semibold text-muted-foreground">Broken</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">All-time strength PRs</p>
          </div>
        </div>
      </div>

      {/* ── Row 2: Hypertrophy Volume Landmarks Grid ── */}
      <VolumeLandmarksClient setsByMuscle={weeklySetsByMuscle} />

      {/* ── Row 3: Anatomical Muscle Heatmap & Distribution ── */}
      <AnalyticsMuscleHeatmapClient workouts={serializedWorkouts} />

      {/* ── Row 3: Multi-Week Volume Progression Chart ── */}
      {data.volumeByWeek.length >= 1 && (
        <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Weekly Volume Progression</h3>
            </div>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
              Progressive Overload Trend
            </Badge>
          </div>
          <VolumeChartClient data={data.volumeByWeek} />
        </div>
      )}

      {/* ── Row 4: 2-Column Split (Muscle Donut + Frequency Heatmap) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Muscle Group Distribution */}
        {data.volumeByMuscle.length > 0 && (
          <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-purple-400" />
                <h3 className="font-bold text-white text-base">Volume by Muscle Group</h3>
              </div>
            </div>
            <MuscleGroupPieClient data={data.volumeByMuscle} />
          </div>
        )}

        {/* Workout Frequency */}
        <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">Training Frequency Heatmap</h3>
            </div>
          </div>
          <WorkoutFrequencyClient data={data.frequencyByDay} />
        </div>
      </div>

      {/* ── Row 5: Exercise Progression Dual-Line Graph ── */}
      {data.uniqueExercises.length > 0 && (
        <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Exercise Progression (1RM &amp; Working Weight)</h3>
            </div>
          </div>
          <ExerciseProgressionClient
            exercises={data.uniqueExercises}
            workouts={serializedWorkouts}
          />
        </div>
      )}

      {data.totalWorkouts === 0 && (
        <div className="p-12 text-center space-y-3 rounded-2xl border border-dashed border-border/60 bg-[#12161F]/40">
          <BarChart3 className="h-12 w-12 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground">Complete some workouts to see your full analytics dashboard.</p>
        </div>
      )}
    </div>
  );
}
