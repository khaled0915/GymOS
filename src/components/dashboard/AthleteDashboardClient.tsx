"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Flame,
  Trophy,
  Play,
  ArrowRight,
  Clock,
  Sparkles,
  Utensils,
  Plus,
  Droplets,
  Layers,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logWaterAction } from "@/actions/nutrition.actions";
import type { WeekDayStatus } from "@/services/dashboard.service";

interface DashboardProps {
  userName: string;
  data: {
    activeSession: any;
    recentWorkouts: any[];
    weeklyWorkoutCount: number;
    weeklyVolume: number;
    weeklyMuscleSets: Record<string, number>;
    recentPrs: any[];
    weightHistory: any[];
    todayMeals: any[];
    todayWater: number;
    nutritionGoal: any;
    currentMacros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      water: number;
    };
    weekDays: WeekDayStatus[];
    activeProgram: any;
    nextWorkoutDay: any;
  };
}

export function AthleteDashboardClient({ userName, data }: DashboardProps) {
  const [isPending, startTransition] = useTransition();
  const [waterAmount, setWaterAmount] = useState(data.currentMacros.water);
  const [waterSuccess, setWaterSuccess] = useState(false);

  const goalCalories = data.nutritionGoal?.dailyCalories || 2600;
  const goalProtein = data.nutritionGoal?.dailyProtein || 180;
  const goalCarbs = data.nutritionGoal?.dailyCarbs || 280;
  const goalFat = data.nutritionGoal?.dailyFat || 70;
  const goalWater = data.nutritionGoal?.dailyWaterMl || 3500;

  const handleQuickWater = (ml: number) => {
    setWaterAmount((prev) => prev + ml);
    startTransition(async () => {
      const res = await logWaterAction(ml);
      if (res.success) {
        setWaterSuccess(true);
        setTimeout(() => setWaterSuccess(false), 2000);
      }
    });
  };

  const calPercent = Math.min(100, Math.round((data.currentMacros.calories / goalCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((data.currentMacros.protein / goalProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((data.currentMacros.carbs / goalCarbs) * 100));
  const fatPercent = Math.min(100, Math.round((data.currentMacros.fat / goalFat) * 100));
  const waterPercent = Math.min(100, Math.round((waterAmount / goalWater) * 100));

  const targetWorkouts = 5;
  const consistencyPercent = Math.min(100, Math.round((data.weeklyWorkoutCount / targetWorkouts) * 100));
  const latestPr = data.recentPrs[0];

  return (
    <div className="space-y-8 pb-12">
      {/* ── Top Header & Greeting ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#12161F]/90 via-[#0A0D12]/90 to-[#12161F]/90 border border-border/40 backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Good morning, {userName} 👋
            </h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wide">
              <Flame className="h-3.5 w-3.5 fill-current" /> 14-Day Streak
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Today&apos;s Focus:{" "}
            <span className="font-semibold text-foreground">
              {data.nextWorkoutDay?.name || "Push A: Upper Body Hypertrophy"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-10 px-4 border-border/60 hover:bg-white/5">
            <Link href="/nutrition">
              <Utensils className="mr-2 h-4 w-4 text-blue-400" /> Quick Log Meal
            </Link>
          </Button>
          <Button asChild variant="athletic" size="lg" className="h-10 px-6 font-bold shadow-lg shadow-emerald-500/20 bg-emerald-500 hover:bg-emerald-400 text-black">
            <Link href="/workouts">
              <Play className="mr-2 h-4 w-4 fill-current" />
              {data.activeSession ? "Resume Workout" : "+ Start Workout"}
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Active Workout Alert Bar if running ── */}
      {data.activeSession && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-emerald-400" />
            <div>
              <p className="text-sm font-bold text-emerald-400">Workout Session in Progress</p>
              <p className="text-xs text-muted-foreground">
                Started at {new Date(data.activeSession.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="athletic" className="font-bold">
            <Link href="/workouts">Resume Live Logger <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
          </Button>
        </div>
      )}

      {/* ── Row 1: 4 Key Performance KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Consistency Ring */}
        <div className="p-5 rounded-2xl border border-border/50 bg-[#12161F]/60 backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-4">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Weekly Consistency</span>
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {data.weeklyWorkoutCount} <span className="text-sm font-normal text-muted-foreground">/ {targetWorkouts} Days</span>
              </div>
              <p className="text-xs text-emerald-400 font-semibold mt-1">
                {consistencyPercent}% Target Met
              </p>
            </div>
            {/* Circular Ring SVG */}
            <div className="relative h-12 w-12 flex items-center justify-center">
              <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" className="stroke-muted/30" strokeWidth="3.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  className="stroke-emerald-400 transition-all duration-500"
                  strokeWidth="3.5"
                  strokeDasharray="88"
                  strokeDashoffset={88 - (88 * consistencyPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-bold">{consistencyPercent}%</span>
            </div>
          </div>
          {/* M T W T F S S Indicators */}
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            {data.weekDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className={`text-[10px] font-bold ${d.isToday ? "text-emerald-400" : "text-muted-foreground"}`}>
                  {d.label}
                </span>
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    d.hasWorkout
                      ? "bg-emerald-400 shadow-sm shadow-emerald-400/50"
                      : d.isToday
                      ? "border border-emerald-400/60"
                      : "bg-muted/40"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* KPI 2: Total Volume Tonnage */}
        <div className="p-5 rounded-2xl border border-border/50 bg-[#12161F]/60 backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Weekly Volume</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
              <TrendingUp className="h-3 w-3" /> +12.4%
            </span>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {Math.round(data.weeklyVolume).toLocaleString()}{" "}
              <span className="text-xs font-semibold text-muted-foreground">kg</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total tonnage across completed sets</p>
          </div>
          {/* Visual sparkline simulation */}
          <div className="h-8 flex items-end gap-1.5 pt-2">
            {[40, 55, 35, 70, 60, 85, 95].map((val, idx) => (
              <div
                key={idx}
                className="flex-1 bg-emerald-500/20 hover:bg-emerald-400 transition-colors rounded-t-sm"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>

        {/* KPI 3: Personal Records */}
        <div className="p-5 rounded-2xl border border-border/50 bg-[#12161F]/60 backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Personal Records</span>
            <Trophy className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {data.recentPrs.length} <span className="text-xs font-semibold text-muted-foreground">Broken</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">All-time strength milestones</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-medium text-amber-300 truncate">
            {latestPr ? (
              <span>
                🏆 Latest: {latestPr.exercise.name} ({latestPr.value} {latestPr.recordType === "REP_PR" ? "reps" : "kg"})
              </span>
            ) : (
              <span>Log a session to detect PR breakthroughs</span>
            )}
          </div>
        </div>

        {/* KPI 4: Daily Fuel & Macro Bar */}
        <div className="p-5 rounded-2xl border border-border/50 bg-[#12161F]/60 backdrop-blur-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all space-y-3">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            <span>Daily Fuel & Macros</span>
            <span className="text-xs font-bold text-white">
              {data.currentMacros.calories} <span className="text-muted-foreground">/ {goalCalories} kcal</span>
            </span>
          </div>
          {/* Main Calorie Bar */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" style={{ width: `${calPercent}%` }} />
            </div>
          </div>
          {/* 3 Macro Gauges */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>P</span>
                <span className="text-blue-400 font-bold">{data.currentMacros.protein}g</span>
              </div>
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${proteinPercent}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>C</span>
                <span className="text-amber-400 font-bold">{data.currentMacros.carbs}g</span>
              </div>
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${carbsPercent}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>F</span>
                <span className="text-rose-400 font-bold">{data.currentMacros.fat}g</span>
              </div>
              <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${fatPercent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Split: 65% Left / 35% Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT COLUMN (8 Cols ~ 65%) ── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Workout Routine Card */}
          <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                    Active Program
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">Week 4 · Day 2</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                  {data.nextWorkoutDay?.name || "Push A: Upper Body Hypertrophy"}
                </h2>
              </div>
              <Button asChild size="sm" variant="athletic" className="font-bold bg-emerald-500 hover:bg-emerald-400 text-black">
                <Link href="/workouts">
                  <Play className="mr-1.5 h-4 w-4 fill-current" /> Start Push A Session
                </Link>
              </Button>
            </div>

            {/* Planned Exercises List with Overload Indicators */}
            <div className="space-y-3">
              {[
                { name: "Barbell Bench Press", sets: 4, minReps: 6, maxReps: 8, target: "102.5 kg", overload: true },
                { name: "Incline Dumbbell Press", sets: 3, minReps: 8, maxReps: 10, target: "34.0 kg", overload: false },
                { name: "Standing Overhead Press", sets: 3, minReps: 8, maxReps: 10, target: "55.0 kg", overload: false },
                { name: "Cable Lateral Raises", sets: 4, minReps: 12, maxReps: 15, target: "12.5 kg", overload: true },
                { name: "Tricep Rope Pushdowns", sets: 3, minReps: 10, maxReps: 12, target: "27.5 kg", overload: false },
              ].map((ex, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-card/40 hover:border-emerald-500/30 transition-all text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-lg bg-white/5 flex items-center justify-center font-mono font-bold text-muted-foreground text-[11px]">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{ex.name}</p>
                      <p className="text-muted-foreground text-[11px]">
                        {ex.sets} Sets × {ex.minReps}-{ex.maxReps} Reps · Target: <span className="text-foreground font-semibold">{ex.target}</span>
                      </p>
                    </div>
                  </div>
                  {ex.overload ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      🟢 Overload Ready (+2.5kg)
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground font-mono">Maintain Load</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hypertrophy Volume Landmarks Bar Visualizer */}
          <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Weekly Hypertrophy Landmarks (10–20 Sets)</h3>
              </div>
              <Link href="/analytics" className="text-xs text-emerald-400 font-semibold hover:underline flex items-center">
                Deep Dive <ChevronRight className="h-3 w-3 ml-0.5" />
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { muscle: "Chest", sets: data.weeklyMuscleSets.CHEST || 14, optimal: "12-18" },
                { muscle: "Back", sets: data.weeklyMuscleSets.BACK || 16, optimal: "14-20" },
                { muscle: "Shoulders", sets: data.weeklyMuscleSets.SHOULDERS || 12, optimal: "12-16" },
                { muscle: "Legs (Quads & Hamstrings)", sets: data.weeklyMuscleSets.LEGS || 14, optimal: "12-20" },
                { muscle: "Arms (Biceps & Triceps)", sets: (data.weeklyMuscleSets.BICEPS || 6) + (data.weeklyMuscleSets.TRICEPS || 6), optimal: "10-14" },
              ].map((group, idx) => {
                const percent = Math.min(100, Math.round((group.sets / 20) * 100));
                const inZone = group.sets >= 10 && group.sets <= 20;
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white">{group.muscle}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{group.sets} Sets this week</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${inZone ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                          {inZone ? "🟢 Optimal Zone" : "🟡 Ramp Up"}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN (4 Cols ~ 35%) ── */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Smart Training Coach Insight Widget */}
          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-[#12161F] to-[#0A0D12] backdrop-blur-md space-y-4 shadow-lg shadow-emerald-950/20">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Coach Antigravity</h3>
                  <p className="text-[10px] text-emerald-400 font-semibold">AI Intelligence Active</p>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground hover:text-white">
                <Link href="/coach">Ask Coach</Link>
              </Button>
            </div>

            {/* 3 Actionable AI Feed Items */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <p className="font-bold text-emerald-300 text-[11px] flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Overload Recommendation
                </p>
                <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                  You hit 8 reps at 100kg on Bench Press last session. Increase to 102.5kg today.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <p className="font-bold text-amber-300 text-[11px] flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Plateau Alert
                </p>
                <p className="text-[11px] text-amber-100/80 leading-relaxed">
                  Barbell Squat has stalled for 3 sessions. Consider a 1-week deload (-10% load) or safety bar variation.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-1">
                <p className="font-bold text-blue-300 text-[11px] flex items-center gap-1">
                  <Scale className="h-3 w-3" /> Volume Balance
                </p>
                <p className="text-[11px] text-blue-100/80 leading-relaxed">
                  Upper vs. Lower Volume ratio is 1.1x (Well Balanced). Next leg session scheduled in 48h.
                </p>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
              <Link href="/coach">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Generate Custom Routine
              </Link>
            </Button>
          </div>

          {/* Quick Hydration Widget with 1-Tap Buttons */}
          <div className="p-5 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Quick Hydration</h3>
              </div>
              <span className="text-xs font-bold text-cyan-400">
                {(waterAmount / 1000).toFixed(1)}L / {(goalWater / 1000).toFixed(1)}L
              </span>
            </div>

            <div className="space-y-2">
              <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full transition-all duration-300" style={{ width: `${waterPercent}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground text-center">
                {waterPercent}% of daily 3.5L hydration target
              </p>
            </div>

            {/* 1-Tap Water Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => handleQuickWater(250)}
                className="h-8 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400"
              >
                <Plus className="h-3 w-3 mr-0.5" /> 250ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => handleQuickWater(500)}
                className="h-8 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400"
              >
                <Plus className="h-3 w-3 mr-0.5" /> 500ml
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => handleQuickWater(1000)}
                className="h-8 text-xs font-semibold hover:border-cyan-400 hover:text-cyan-400"
              >
                <Plus className="h-3 w-3 mr-0.5" /> 1.0L
              </Button>
            </div>
            {waterSuccess && (
              <p className="text-[10px] text-cyan-400 text-center font-bold animate-pulse">
                ✓ Hydration Logged
              </p>
            )}
          </div>

          {/* 1RM Strength Standards Radar Tiers */}
          <div className="p-5 rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h3 className="font-bold text-white text-sm">Strength Tier Standards</h3>
              <Link href="/calculator" className="text-xs text-purple-400 font-semibold hover:underline">
                Calculator
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-card/40 border border-border/30">
                <span className="font-semibold text-white">Bench Press</span>
                <Badge variant="outline" className="border-blue-500/40 text-blue-400 text-[10px] font-bold">
                  Intermediate (1.25x BW)
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-card/40 border border-border/30">
                <span className="font-semibold text-white">Barbell Squat</span>
                <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  Advanced (1.85x BW)
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-card/40 border border-border/30">
                <span className="font-semibold text-white">Deadlift</span>
                <Badge variant="outline" className="border-purple-500/40 text-purple-400 text-[10px] font-bold">
                  Advanced (2.30x BW)
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
