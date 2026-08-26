"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { generateProgramAction } from "@/actions/coach.actions";
import {
  Sparkles,
  Flame,
  Dumbbell,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Wand2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { CoachInsights } from "@/domain/coach";

interface CoachDashboardProps {
  insights: CoachInsights;
  userProfile: { name: string; fitnessGoal: string; weeklyFrequency: number };
}

export function CoachDashboardClient({
  insights,
  userProfile,
}: CoachDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Generator Options
  const [goal, setGoal] = useState<"MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS">("MUSCLE_GAIN");
  const [frequency, setFrequency] = useState<3 | 4 | 5 | 6>(4);
  const [equipment, setEquipment] = useState<"FULL_GYM" | "DUMBBELLS" | "BODYWEIGHT">("FULL_GYM");
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const handleGenerate = () => {
    startTransition(async () => {
      const res = await generateProgramAction({
        goal,
        frequencyDays: frequency,
        equipment,
      });

      if (res.success) {
        setGeneratedSuccess(true);
        setTimeout(() => {
          router.push("/programs");
        }, 1200);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-emerald-500" /> Smart Training Coach
        </h1>
        <p className="text-muted-foreground mt-1">
          Weekly intelligence, muscle balance insights, and AI workout plan generator
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Consistency */}
        <Card className="border-emerald-500/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                Weekly Consistency
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">{insights.consistencyScore}%</span>
              <span className="text-xs text-muted-foreground">
                ({insights.completedThisWeek} / {insights.targetFrequency} workouts)
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${insights.consistencyScore}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Muscle Balance */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                Muscle Group Stimulus
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-bold">{insights.muscleBalance.balanceRatio}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {insights.muscleBalance.advice}
            </p>
          </CardContent>
        </Card>

        {/* Goal Profile */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                Athlete Focus
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-2xl font-bold capitalize">{userProfile.fitnessGoal.toLowerCase()}</p>
            <p className="text-xs text-muted-foreground">
              Targeting {userProfile.weeklyFrequency} training sessions per week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Coach Highlights Feed */}
      {insights.highlights.length > 0 && (
        <Card className="bg-gradient-to-r from-card to-emerald-500/5 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" /> Coach Highlights & Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{h}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Workout Program Generator */}
      <Card className="border-emerald-500/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-emerald-600" /> Workout Program Generator
              </CardTitle>
              <CardDescription className="mt-1">
                Generate a scientifically structured training program tailored to your goals and schedule
              </CardDescription>
            </div>
            <Badge variant="success">Auto-Structured</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Goal Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">1. Primary Training Goal</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "MUSCLE_GAIN", label: "Muscle Gain", desc: "Hypertrophy (8-12 reps)" },
                { id: "STRENGTH", label: "Max Strength", desc: "Heavy compound (4-6 reps)" },
                { id: "FAT_LOSS", label: "Fat Loss", desc: "High density (10-15 reps)" },
                { id: "GENERAL_FITNESS", label: "General Fitness", desc: "Balanced strength & health" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setGoal(item.id as any)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    goal === item.id
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                      : "hover:border-muted-foreground/40 bg-card"
                  }`}
                >
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">2. Weekly Training Frequency</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { days: 3, label: "3 Days / Week", split: "Full Body A/B/C" },
                { days: 4, label: "4 Days / Week", split: "Upper / Lower Split" },
                { days: 5, label: "5 Days / Week", split: "Push / Pull / Legs" },
                { days: 6, label: "6 Days / Week", split: "PPL × 2 Cycles" },
              ].map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => setFrequency(item.days as any)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    frequency === item.days
                      ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                      : "hover:border-muted-foreground/40 bg-card"
                  }`}
                >
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.split}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">3. Equipment Access</Label>
            <div className="flex gap-2">
              {[
                { id: "FULL_GYM", label: "Full Gym (Barbells, Cables, Machines)" },
                { id: "DUMBBELLS", label: "Dumbbells Only" },
                { id: "BODYWEIGHT", label: "Bodyweight / Calisthenics" },
              ].map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant={equipment === item.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEquipment(item.id as any)}
                  className="text-xs"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={handleGenerate}
              variant="athletic"
              size="lg"
              disabled={isPending || generatedSuccess}
              className="w-full sm:w-auto px-8 font-bold"
            >
              {generatedSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5 text-white" /> Program Saved! Redirecting…
                </>
              ) : isPending ? (
                "Structuring & Saving Program…"
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" /> Generate & Save Program
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
