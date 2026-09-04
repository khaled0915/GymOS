"use client";

import React from "react";
import {
  TrendingUp,
  Flame,
  Trophy,
  Utensils,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeekDayStatus } from "@/services/dashboard.service";

interface DashboardSectionCardsProps {
  weeklyWorkoutCount: number;
  targetWorkouts?: number;
  weeklyVolume: number;
  recentPrs: any[];
  weekDays: WeekDayStatus[];
  currentMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  nutritionGoal?: {
    dailyCalories?: number;
    dailyProtein?: number;
    dailyCarbs?: number;
    dailyFat?: number;
  };
}

export function DashboardSectionCards({
  weeklyWorkoutCount,
  targetWorkouts = 5,
  weeklyVolume,
  recentPrs,
  weekDays,
  currentMacros,
  nutritionGoal,
}: DashboardSectionCardsProps) {
  const goalCalories = nutritionGoal?.dailyCalories || 2600;
  const goalProtein = nutritionGoal?.dailyProtein || 180;
  const goalCarbs = nutritionGoal?.dailyCarbs || 280;
  const goalFat = nutritionGoal?.dailyFat || 70;

  const consistencyPercent = Math.min(
    100,
    Math.round((weeklyWorkoutCount / targetWorkouts) * 100)
  );

  const calPercent = Math.min(
    100,
    Math.round((currentMacros.calories / goalCalories) * 100)
  );
  const proteinPercent = Math.min(
    100,
    Math.round((currentMacros.protein / goalProtein) * 100)
  );
  const carbsPercent = Math.min(
    100,
    Math.round((currentMacros.carbs / goalCarbs) * 100)
  );
  const fatPercent = Math.min(
    100,
    Math.round((currentMacros.fat / goalFat) * 100)
  );

  const latestPr = recentPrs[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ── Card 1: Consistency & Streak ── */}
      <Card className="rounded-2xl border-border/60 bg-[#12161F]/70 backdrop-blur-md hover:border-emerald-500/40 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Weekly Consistency
          </CardTitle>
          <div className="h-8 w-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Flame className="h-4 w-4 fill-current" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {weeklyWorkoutCount}
            </span>
            <span className="text-xs text-muted-foreground font-normal">
              / {targetWorkouts} sessions target
            </span>
          </div>

          {/* Weekday indicator dots */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30">
            {weekDays.map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-muted-foreground">
                  {day.label}
                </span>
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-all ${
                    day.hasWorkout
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : day.isToday
                      ? "border border-emerald-400/80 bg-transparent animate-pulse"
                      : "bg-[#1F293D]"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Card 2: Volume Tonnage ── */}
      <Card className="rounded-2xl border-border/60 bg-[#12161F]/70 backdrop-blur-md hover:border-emerald-500/40 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Volume Tonnage
          </CardTitle>
          <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {weeklyVolume.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-medium">kg</span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Badge
              variant="outline"
              className="text-[10px] font-bold border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5"
            >
              +12.4% vs last wk
            </Badge>
            <span className="text-[11px] text-muted-foreground truncate">
              Overload progressing
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Card 3: Personal Records ── */}
      <Card className="rounded-2xl border-border/60 bg-[#12161F]/70 backdrop-blur-md hover:border-amber-500/40 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Personal Records
          </CardTitle>
          <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy className="h-4 w-4 fill-current" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {recentPrs.length}
            </span>
            <span className="text-xs text-muted-foreground font-normal">
              PRs documented
            </span>
          </div>

          <div className="pt-1 text-[11px] text-muted-foreground truncate">
            {latestPr ? (
              <span className="flex items-center gap-1.5 text-white font-medium truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Latest:{" "}
                <span className="text-amber-400 font-bold truncate">
                  {latestPr.exercise?.name || "Bench Press"}
                </span>{" "}
                ({latestPr.value}kg)
              </span>
            ) : (
              <span>Break milestones this week</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Card 4: Daily Fuel & Macros ── */}
      <Card className="rounded-2xl border-border/60 bg-[#12161F]/70 backdrop-blur-md hover:border-blue-500/40 transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Daily Fuel &amp; Macros
          </CardTitle>
          <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Utensils className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {currentMacros.calories}
              </span>
              <span className="text-xs text-muted-foreground">
                / {goalCalories} kcal
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-400">
              {calPercent}%
            </span>
          </div>

          {/* Micro Macro Bars (Protein, Carbs, Fat) */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-border/30">
            <div>
              <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                <span>PRO</span>
                <span className="text-blue-400 font-bold">{currentMacros.protein}g</span>
              </div>
              <div className="h-1 w-full bg-[#1A2230] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 rounded-full"
                  style={{ width: `${proteinPercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                <span>CHO</span>
                <span className="text-amber-400 font-bold">{currentMacros.carbs}g</span>
              </div>
              <div className="h-1 w-full bg-[#1A2230] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${carbsPercent}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] text-muted-foreground mb-0.5">
                <span>FAT</span>
                <span className="text-rose-400 font-bold">{currentMacros.fat}g</span>
              </div>
              <div className="h-1 w-full bg-[#1A2230] rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full"
                  style={{ width: `${fatPercent}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
