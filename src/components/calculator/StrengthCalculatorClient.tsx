"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  calculateAllOneRepMaxes,
  evaluateStrengthStandard,
  type StrengthTier,
} from "@/domain/strength-standards";
import { Calculator, Trophy, Dumbbell, Target, Sparkles } from "lucide-react";

interface CalculatorProps {
  defaultWeightKg: number;
}

const TIER_COLORS: Record<StrengthTier, string> = {
  BEGINNER: "bg-zinc-500 text-white",
  NOVICE: "bg-blue-500 text-white",
  INTERMEDIATE: "bg-emerald-600 text-white",
  ADVANCED: "bg-purple-600 text-white",
  ELITE: "bg-amber-500 text-white",
};

export function StrengthCalculatorClient({ defaultWeightKg }: CalculatorProps) {
  const [activeTab, setActiveTab] = useState<"1RM" | "STANDARDS">("1RM");

  // 1RM Estimator state
  const [liftWeight, setLiftWeight] = useState("100");
  const [liftReps, setLiftReps] = useState("5");

  // Standards state
  const [selectedLift, setSelectedLift] = useState<
    "BENCH_PRESS" | "SQUAT" | "DEADLIFT" | "OVERHEAD_PRESS" | "BARBELL_ROW"
  >("BENCH_PRESS");
  const [athleteWeight, setAthleteWeight] = useState(defaultWeightKg.toString() || "80");
  const [standardOneRepMax, setStandardOneRepMax] = useState("100");

  const weightNum = parseFloat(liftWeight) || 0;
  const repsNum = parseInt(liftReps) || 1;

  const valid1rm = weightNum > 0 && repsNum > 0;
  const estimates = valid1rm ? calculateAllOneRepMaxes(weightNum, repsNum) : null;

  const bwNum = parseFloat(athleteWeight) || 80;
  const standard1rmNum = parseFloat(standardOneRepMax) || 100;
  const validStandard = bwNum > 0 && standard1rmNum > 0;
  const standardEvaluation = validStandard
    ? evaluateStrengthStandard(selectedLift, standard1rmNum, bwNum)
    : null;

  const repPercentages = estimates
    ? [
        { pct: 100, reps: 1, weight: Math.round(estimates.average * 1.0 * 2) / 2 },
        { pct: 95, reps: 2, weight: Math.round(estimates.average * 0.95 * 2) / 2 },
        { pct: 90, reps: 4, weight: Math.round(estimates.average * 0.90 * 2) / 2 },
        { pct: 85, reps: 6, weight: Math.round(estimates.average * 0.85 * 2) / 2 },
        { pct: 80, reps: 8, weight: Math.round(estimates.average * 0.80 * 2) / 2 },
        { pct: 75, reps: 10, weight: Math.round(estimates.average * 0.75 * 2) / 2 },
        { pct: 70, reps: 12, weight: Math.round(estimates.average * 0.70 * 2) / 2 },
      ]
    : [];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Calculator className="h-7 w-7 text-emerald-600" /> Strength & 1RM Calculator
          </h1>
          <p className="text-muted-foreground mt-1">
            Calculate estimated maximum lifts, rep percentages, and bodyweight strength tiers
          </p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          <Button
            size="sm"
            variant={activeTab === "1RM" ? "default" : "ghost"}
            className="text-xs"
            onClick={() => setActiveTab("1RM")}
          >
            1RM Formulas
          </Button>
          <Button
            size="sm"
            variant={activeTab === "STANDARDS" ? "default" : "ghost"}
            className="text-xs"
            onClick={() => setActiveTab("STANDARDS")}
          >
            Strength Standards
          </Button>
        </div>
      </div>

      {activeTab === "1RM" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Inputs */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Lift Parameters</CardTitle>
              <CardDescription>Enter weight lifted and repetitions performed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={liftWeight}
                  onChange={(e) => setLiftWeight(e.target.value)}
                  className="font-bold text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label>Repetitions</Label>
                <Input
                  type="number"
                  value={liftReps}
                  onChange={(e) => setLiftReps(e.target.value)}
                  className="font-bold text-lg"
                />
              </div>

              {estimates && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-1">
                  <span className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-400">Estimated 1RM</span>
                  <p className="text-4xl font-black text-foreground">
                    {estimates.average} <span className="text-lg font-normal text-muted-foreground">kg</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">Average across 5 scientific formulas</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Formulas & Reps Table */}
          <div className="md:col-span-2 space-y-6">
            {/* Multi-Formula Cards */}
            {estimates && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { name: "Epley", val: estimates.epley },
                  { name: "Brzycki", val: estimates.brzycki },
                  { name: "Lombardi", val: estimates.lombardi },
                  { name: "O'Conner", val: estimates.oconner },
                  { name: "Mayhew", val: estimates.mayhew },
                ].map((f) => (
                  <div key={f.name} className="p-3 bg-card border rounded-lg text-center space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">{f.name}</span>
                    <p className="text-lg font-bold">{f.val} kg</p>
                  </div>
                ))}
              </div>
            )}

            {/* Rep Percentage Matrix */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" /> Training Percentages & Rep Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {repPercentages.map((rp) => (
                    <div key={rp.pct} className="p-2.5 rounded-lg bg-muted/40 text-center space-y-0.5">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{rp.pct}% (≈ {rp.reps} reps)</span>
                      <p className="text-lg font-bold">{rp.weight} kg</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Strength Standards Tab */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Athlete & Lift</CardTitle>
              <CardDescription>Select compound lift and body metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Compound Movement</Label>
                <select
                  value={selectedLift}
                  onChange={(e) => setSelectedLift(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
                >
                  <option value="BENCH_PRESS">Bench Press</option>
                  <option value="SQUAT">Barbell Squat</option>
                  <option value="DEADLIFT">Deadlift</option>
                  <option value="OVERHEAD_PRESS">Overhead Press</option>
                  <option value="BARBELL_ROW">Barbell Row</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Body Weight (kg)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={athleteWeight}
                  onChange={(e) => setAthleteWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Your 1RM or Top Lift (kg)</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={standardOneRepMax}
                  onChange={(e) => setStandardOneRepMax(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Results Evaluation */}
          {standardEvaluation && (
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" /> {standardEvaluation.liftName} Classification
                  </CardTitle>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${TIER_COLORS[standardEvaluation.tier]}`}>
                    {standardEvaluation.tier}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-muted/40 rounded-xl">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Bodyweight Ratio</span>
                    <p className="text-3xl font-black mt-1">{standardEvaluation.ratio}×</p>
                    <p className="text-xs text-muted-foreground">{standardEvaluation.oneRepMax} kg @ {standardEvaluation.bodyWeightKg} kg BW</p>
                  </div>
                  <div className="p-4 bg-muted/40 rounded-xl">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">Next Tier Goal</span>
                    <p className="text-3xl font-black mt-1 text-emerald-600">{standardEvaluation.nextTierThresholdKg} kg</p>
                    <p className="text-xs text-muted-foreground">+{Math.max(0, standardEvaluation.nextTierThresholdKg - standardEvaluation.oneRepMax)} kg needed</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Progress to Next Tier</span>
                    <span>{standardEvaluation.tierProgressPct}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${standardEvaluation.tierProgressPct}%` }}
                    />
                  </div>
                </div>

                {/* Tiers Reference */}
                <div className="pt-4 border-t space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Standards Scale (Ratio of Bodyweight)</p>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                    <div className="p-2 rounded bg-zinc-500/10 border font-medium">Beginner</div>
                    <div className="p-2 rounded bg-blue-500/10 border font-medium">Novice</div>
                    <div className="p-2 rounded bg-emerald-500/10 border font-medium">Intermediate</div>
                    <div className="p-2 rounded bg-purple-500/10 border font-medium">Advanced</div>
                    <div className="p-2 rounded bg-amber-500/10 border font-medium">Elite</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
