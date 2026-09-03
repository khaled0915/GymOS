/**
 * Coach Engine — deterministic, rule-based coaching intelligence.
 *
 * Classifies user intents from chat messages and generates personalized
 * responses using real user data (workout history, nutrition, PRs, recovery).
 *
 * No LLM calls, no database dependencies — pure functions only.
 */

import type { FitnessGoal, ExperienceLevel } from "@/types";
import type { PlateauAnalysis } from "@/domain/plateau";
import type { MacroSplit } from "@/domain/nutrition";

// ──────────────────────────────────────
// Types
// ──────────────────────────────────────

export type CoachIntent =
  | "PLATEAU"
  | "NUTRITION"
  | "BALANCE"
  | "RECOVERY"
  | "VOLUME"
  | "PROGRAM"
  | "PR_STATUS"
  | "DELOAD"
  | "CONSISTENCY"
  | "GENERAL";

export interface CoachMuscleRecovery {
  muscle: string;
  daysSinceTraining: number;
  /** 0–100, where 100 = fully recovered */
  estimatedRecoveryPct: number;
  status: "Ready" | "Recovering" | "Fatigued";
}

export interface CoachExercisePlateau {
  exerciseName: string;
  exerciseId: string;
  analysis: PlateauAnalysis;
}

export interface CoachContext {
  // Profile
  userName: string;
  fitnessGoal: FitnessGoal;
  experienceLevel: ExperienceLevel | null;
  weightKg: number | null;
  heightCm: number | null;
  weeklyFrequency: number;

  // Workout summary
  totalWorkouts: number;
  completedThisWeek: number;
  consistencyScore: number;

  // Per-exercise plateaus
  exercisePlateaus: CoachExercisePlateau[];

  // Recent PRs
  recentPrs: {
    exerciseName: string;
    recordType: string;
    value: number;
    achievedAt: Date;
  }[];

  // Nutrition (today)
  todayCalories: number;
  todayProtein: number;
  todayCarbs: number;
  todayFat: number;
  todayWater: number;
  nutritionTargets: MacroSplit | null;

  // Volume & Balance
  muscleBalance: {
    upperVolume: number;
    lowerVolume: number;
    balanceRatio: string;
    advice: string;
  };
  weeklyMuscleSets: Record<string, number>;
  weeklyVolume: number;

  // Recovery
  muscleRecovery: CoachMuscleRecovery[];

  // Historical top exercises
  topExercises?: Array<{
    name: string;
    sessionsCount: number;
    maxWeight: number;
  }>;
}

// ──────────────────────────────────────
// Intent Classification
// ──────────────────────────────────────

const INTENT_KEYWORDS: Record<CoachIntent, string[]> = {
  PLATEAU: ["plateau", "stall", "stuck", "not progressing", "stagnant", "can't increase", "no progress"],
  NUTRITION: ["calorie", "calories", "protein", "carb", "carbs", "fat", "macro", "surplus", "deficit", "eat", "diet", "nutrition", "food", "meal", "tdee", "bmr"],
  BALANCE: ["balance", "ratio", "upper", "lower", "symmetry", "imbalance", "proportion"],
  RECOVERY: ["recovery", "recover", "rest", "sore", "soreness", "fatigue", "tired", "overtraining", "overtrain", "ready to train"],
  VOLUME: ["volume", "sets", "set count", "how many sets", "training volume", "weekly sets", "mev", "mrv"],
  PROGRAM: ["program", "routine", "split", "schedule", "plan", "workout plan"],
  PR_STATUS: ["pr", "personal record", "best", "max", "1rm", "one rep max", "strongest"],
  DELOAD: ["deload", "de-load", "deloading", "back off", "light week", "recovery week"],
  CONSISTENCY: ["consistency", "consistent", "streak", "frequency", "how often", "missed", "skipped"],
  GENERAL: [],
};

/**
 * Classify a user's message into the most relevant coaching intent.
 * Falls back to GENERAL if no keywords match.
 */
export function classifyIntent(message: string): CoachIntent {
  const lower = message.toLowerCase().trim();

  // Check each intent category (order matters — more specific first)
  const priorityOrder: CoachIntent[] = [
    "PLATEAU", "DELOAD", "NUTRITION", "RECOVERY", "BALANCE",
    "VOLUME", "PR_STATUS", "CONSISTENCY", "PROGRAM", "GENERAL",
  ];

  for (const intent of priorityOrder) {
    const keywords = INTENT_KEYWORDS[intent];
    if (keywords.some((kw) => lower.includes(kw))) {
      return intent;
    }
  }

  return "GENERAL";
}

// ──────────────────────────────────────
// Response Generators
// ──────────────────────────────────────

/**
 * Main dispatcher — classifies intent and returns a personalized response.
 */
export function generateCoachResponse(
  intent: CoachIntent,
  context: CoachContext,
): string {
  switch (intent) {
    case "PLATEAU":
      return analyzeUserPlateaus(context);
    case "NUTRITION":
      return analyzeNutrition(context);
    case "BALANCE":
      return analyzeBalance(context);
    case "RECOVERY":
      return analyzeRecovery(context);
    case "VOLUME":
      return analyzeVolume(context);
    case "DELOAD":
      return analyzeDeload(context);
    case "PR_STATUS":
      return analyzePrStatus(context);
    case "CONSISTENCY":
      return analyzeConsistency(context);
    case "PROGRAM":
      return analyzeProgramAdvice(context);
    case "GENERAL":
      return generateGeneralAdvice(context);
  }
}

/**
 * Personalized greeting based on real user data.
 */
export function generateGreeting(context: CoachContext): string {
  const name = context.userName || "Athlete";
  const parts: string[] = [];

  parts.push(`Hey ${name}! 👋`);

  // Weekly progress
  if (context.completedThisWeek >= context.weeklyFrequency) {
    parts.push(`You've crushed your weekly target — ${context.completedThisWeek}/${context.weeklyFrequency} sessions done! 🎯`);
  } else if (context.completedThisWeek > 0) {
    const remaining = context.weeklyFrequency - context.completedThisWeek;
    parts.push(`You've completed ${context.completedThisWeek}/${context.weeklyFrequency} sessions this week. ${remaining} more to hit your target.`);
  } else {
    parts.push(`Time to kick off this week's training — your target is ${context.weeklyFrequency} sessions.`);
  }

  // PRs highlight
  const recentPrCount = context.recentPrs.filter((pr) => {
    const daysSince = daysBetween(pr.achievedAt, new Date());
    return daysSince <= 7;
  }).length;
  if (recentPrCount > 0) {
    parts.push(`🔥 ${recentPrCount} new PR${recentPrCount > 1 ? "s" : ""} this week — you're getting stronger!`);
  }

  // Plateau alert
  const plateauExercises = context.exercisePlateaus.filter(
    (ep) => ep.analysis.status === "PLATEAU_DETECTED",
  );
  if (plateauExercises.length > 0) {
    const names = plateauExercises.map((ep) => ep.exerciseName).slice(0, 2).join(" and ");
    parts.push(`⚠️ I noticed a plateau on ${names}. Ask me about it and I'll help you break through.`);
  }

  return parts.join(" ");
}

/**
 * Generate dynamic quick-prompt suggestions based on current user state.
 */
export function generateQuickPrompts(context: CoachContext): string[] {
  const prompts: string[] = [];

  // Plateau-specific prompt
  const plateauExercises = context.exercisePlateaus.filter(
    (ep) => ep.analysis.status === "PLATEAU_DETECTED",
  );
  if (plateauExercises.length > 0) {
    prompts.push(`Fix my ${plateauExercises[0]!.exerciseName} plateau`);
  }

  // Nutrition prompt if not tracking today
  if (context.todayCalories === 0 && context.nutritionTargets) {
    prompts.push("What should I eat today?");
  } else if (context.nutritionTargets) {
    prompts.push("Am I hitting my macros?");
  }

  // Recovery prompt
  const fatiguedMuscles = context.muscleRecovery.filter(
    (m) => m.status === "Fatigued",
  );
  if (fatiguedMuscles.length > 0) {
    prompts.push("Check my recovery status");
  }

  // Balance prompt
  prompts.push("Check Upper/Lower balance");

  // Consistency prompt
  if (context.completedThisWeek < context.weeklyFrequency) {
    prompts.push("Am I training enough?");
  }

  // PR status
  if (context.recentPrs.length > 0) {
    prompts.push("Show my recent PRs");
  }

  // Limit to 4 most relevant
  return prompts.slice(0, 4);
}

// ──────────────────────────────────────
// Individual Analyzers
// ──────────────────────────────────────

export function analyzeUserPlateaus(context: CoachContext): string {
  const plateaus = context.exercisePlateaus.filter(
    (ep) => ep.analysis.status === "PLATEAU_DETECTED",
  );

  if (plateaus.length === 0) {
    const progressing = context.exercisePlateaus.filter(
      (ep) => ep.analysis.status === "PROGRESSING",
    );
    if (progressing.length > 0) {
      return `Great news — all ${progressing.length} tracked exercise${progressing.length > 1 ? "s are" : " is"} progressing well! No plateaus detected. Keep following your current progressive overload strategy.`;
    }
    return "I don't have enough workout data yet to analyze plateaus. Complete a few more sessions and I'll track your progression trends.";
  }

  const parts: string[] = [];
  parts.push(`I detected plateau${plateaus.length > 1 ? "s" : ""} on ${plateaus.length} exercise${plateaus.length > 1 ? "s" : ""}:`);

  for (const ep of plateaus.slice(0, 3)) {
    parts.push("");
    parts.push(`📊 **${ep.exerciseName}**: ${ep.analysis.reason}`);
    if (ep.analysis.recommendation) {
      parts.push(`→ ${ep.analysis.recommendation}`);
    }
  }

  if (plateaus.length > 3) {
    parts.push(`\n...and ${plateaus.length - 3} more. Consider a full deload week.`);
  }

  return parts.join("\n");
}

export function analyzeNutrition(context: CoachContext): string {
  if (!context.nutritionTargets) {
    return "You haven't set nutrition targets yet. Head to your Profile to enter your weight, height, and fitness goal — I'll calculate your ideal macros automatically.";
  }

  const targets = context.nutritionTargets;
  const parts: string[] = [];

  // Goal context
  const goalLabel = formatGoalLabel(context.fitnessGoal);
  parts.push(`Based on your ${goalLabel} goal, here's your nutrition status today:`);
  parts.push("");

  // Calorie tracking
  const calDiff = targets.calories - context.todayCalories;
  if (context.todayCalories === 0) {
    parts.push(`🍽️ Calories: No meals logged yet. Your target is ${targets.calories} kcal.`);
  } else if (calDiff > 200) {
    parts.push(`🍽️ Calories: ${context.todayCalories}/${targets.calories} kcal — you need ${calDiff} more kcal.`);
  } else if (calDiff < -200) {
    parts.push(`🍽️ Calories: ${context.todayCalories}/${targets.calories} kcal — you're ${Math.abs(calDiff)} kcal over target.`);
  } else {
    parts.push(`🍽️ Calories: ${context.todayCalories}/${targets.calories} kcal ✅ — right on track!`);
  }

  // Protein tracking
  const protDiff = targets.proteinGrams - context.todayProtein;
  if (protDiff > 20) {
    parts.push(`🥩 Protein: ${context.todayProtein}/${targets.proteinGrams}g — eat ${protDiff}g more protein.`);
  } else if (protDiff <= 0) {
    parts.push(`🥩 Protein: ${context.todayProtein}/${targets.proteinGrams}g ✅ — target reached!`);
  } else {
    parts.push(`🥩 Protein: ${context.todayProtein}/${targets.proteinGrams}g — almost there, ${protDiff}g to go.`);
  }

  // Water tracking
  const waterTarget = targets.waterMl;
  if (context.todayWater < waterTarget * 0.5) {
    parts.push(`💧 Water: ${context.todayWater}/${waterTarget} ml — drink more water!`);
  } else if (context.todayWater >= waterTarget) {
    parts.push(`💧 Water: ${context.todayWater}/${waterTarget} ml ✅ — well hydrated!`);
  } else {
    parts.push(`💧 Water: ${context.todayWater}/${waterTarget} ml — keep drinking.`);
  }

  return parts.join("\n");
}

export function analyzeBalance(context: CoachContext): string {
  const { muscleBalance } = context;

  if (muscleBalance.upperVolume === 0 && muscleBalance.lowerVolume === 0) {
    return "I need more workout data to analyze your muscle balance. Complete a few sessions with both upper and lower body exercises.";
  }

  const parts: string[] = [];
  parts.push(`Your current volume distribution is ${muscleBalance.balanceRatio}.`);
  parts.push("");
  parts.push(`Upper body volume: ${muscleBalance.upperVolume.toLocaleString()} kg`);
  parts.push(`Lower body volume: ${muscleBalance.lowerVolume.toLocaleString()} kg`);
  parts.push("");
  parts.push(`💡 ${muscleBalance.advice}`);

  // Weekly set breakdown
  const muscleEntries = Object.entries(context.weeklyMuscleSets)
    .filter(([, sets]) => sets > 0)
    .sort(([, a], [, b]) => b - a);

  if (muscleEntries.length > 0) {
    parts.push("");
    parts.push("Weekly sets per muscle group:");
    for (const [muscle, sets] of muscleEntries) {
      const bar = sets >= 15 ? "🟢" : sets >= 10 ? "🟡" : "🔴";
      parts.push(`${bar} ${muscle}: ${sets} sets`);
    }
  }

  return parts.join("\n");
}

export function analyzeRecovery(context: CoachContext): string {
  if (context.muscleRecovery.length === 0) {
    return "No workout data available to estimate recovery. Train a few sessions and I'll start tracking your muscle recovery status.";
  }

  const parts: string[] = [];
  parts.push("Here's your current muscle recovery status:");
  parts.push("");

  // Sort: fatigued first, then recovering, then ready
  const sorted = [...context.muscleRecovery].sort(
    (a, b) => a.estimatedRecoveryPct - b.estimatedRecoveryPct,
  );

  for (const m of sorted) {
    const icon = m.status === "Ready" ? "🟢" : m.status === "Recovering" ? "🟡" : "🔴";
    const dayLabel = m.daysSinceTraining === 0
      ? "today"
      : m.daysSinceTraining === 1
        ? "yesterday"
        : `${m.daysSinceTraining} days ago`;
    parts.push(`${icon} **${m.muscle}**: ${m.estimatedRecoveryPct}% recovered (last trained ${dayLabel}) — ${m.status}`);
  }

  // Recommendation
  const readyMuscles = sorted.filter((m) => m.status === "Ready");
  if (readyMuscles.length > 0) {
    parts.push("");
    parts.push(`✅ Ready to train: ${readyMuscles.map((m) => m.muscle).join(", ")}`);
  }

  const fatiguedMuscles = sorted.filter((m) => m.status === "Fatigued");
  if (fatiguedMuscles.length > 0) {
    parts.push(`⚠️ Still recovering: ${fatiguedMuscles.map((m) => m.muscle).join(", ")} — give these groups more rest.`);
  }

  return parts.join("\n");
}

export function analyzeVolume(context: CoachContext): string {
  const parts: string[] = [];
  parts.push(`Your total weekly training volume is ${context.weeklyVolume.toLocaleString()} kg.`);
  parts.push("");

  const muscleEntries = Object.entries(context.weeklyMuscleSets)
    .filter(([, sets]) => sets > 0)
    .sort(([, a], [, b]) => b - a);

  if (muscleEntries.length === 0) {
    parts.push("No workout data this week yet. Start training and I'll track your volume landmarks.");
    return parts.join("\n");
  }

  // Evidence-based volume landmarks (sets per muscle per week)
  // MEV ≈ 8-10 sets, MAV ≈ 12-20 sets, MRV ≈ 20-25 sets
  parts.push("Weekly sets per muscle (evidence-based landmarks):");
  parts.push("• MEV (Minimum Effective Volume): ~10 sets");
  parts.push("• MAV (Maximum Adaptive Volume): 12-20 sets");
  parts.push("• MRV (Maximum Recoverable Volume): ~20-25 sets");
  parts.push("");

  for (const [muscle, sets] of muscleEntries) {
    let zone = "Below MEV ⚠️";
    if (sets >= 20) zone = "Near MRV — monitor recovery ⚡";
    else if (sets >= 12) zone = "In MAV — optimal zone ✅";
    else if (sets >= 10) zone = "At MEV — minimum effective 🟡";

    parts.push(`${muscle}: ${sets} sets → ${zone}`);
  }

  return parts.join("\n");
}

export function analyzeDeload(context: CoachContext): string {
  const plateaus = context.exercisePlateaus.filter(
    (ep) => ep.analysis.status === "PLATEAU_DETECTED",
  );

  const parts: string[] = [];

  if (plateaus.length >= 3) {
    parts.push("⚠️ Multiple exercises are stalled — a full deload week is strongly recommended.");
    parts.push("");
    parts.push("**Deload Protocol:**");
    parts.push("1. Reduce all working weights by 40-50%");
    parts.push("2. Keep the same exercises and rep ranges");
    parts.push("3. Reduce total sets by 30-40%");
    parts.push("4. Focus on technique and mind-muscle connection");
    parts.push("5. Duration: 1 full week (then resume normal intensity)");
  } else if (plateaus.length > 0) {
    parts.push(`You have ${plateaus.length} stalled exercise${plateaus.length > 1 ? "s" : ""}. A targeted mini-deload may help:`);
    for (const ep of plateaus) {
      if (ep.analysis.recommendation) {
        parts.push(`→ ${ep.exerciseName}: ${ep.analysis.recommendation}`);
      }
    }
  } else {
    parts.push("No signs of overtraining or plateaus detected right now. You don't need a deload yet.");
    parts.push("");
    parts.push("General guideline: Schedule a deload every 4-6 weeks of hard training, or when you notice 2+ exercises stalling.");
  }

  return parts.join("\n");
}

export function analyzePrStatus(context: CoachContext): string {
  if (context.recentPrs.length === 0) {
    return "No personal records logged yet. Keep training consistently and I'll track your PRs automatically when you hit new bests!";
  }

  const parts: string[] = [];
  parts.push(`You have ${context.recentPrs.length} personal record${context.recentPrs.length > 1 ? "s" : ""} on file:`);
  parts.push("");

  // Show the most recent PRs (up to 6)
  for (const pr of context.recentPrs.slice(0, 6)) {
    const typeLabel = formatRecordType(pr.recordType);
    const daysSince = daysBetween(pr.achievedAt, new Date());
    const timeLabel = daysSince === 0 ? "today" : daysSince <= 7 ? `${daysSince}d ago` : `${Math.round(daysSince / 7)}w ago`;
    parts.push(`🏆 **${pr.exerciseName}** — ${typeLabel}: ${pr.value}${pr.recordType === "WEIGHT_PR" ? " kg" : pr.recordType === "REP_PR" ? " reps" : " kg"} (${timeLabel})`);
  }

  if (context.recentPrs.length > 6) {
    parts.push(`\n...and ${context.recentPrs.length - 6} more.`);
  }

  return parts.join("\n");
}

export function analyzeConsistency(context: CoachContext): string {
  const parts: string[] = [];

  parts.push(`Your weekly target is ${context.weeklyFrequency} sessions.`);
  parts.push(`This week: ${context.completedThisWeek}/${context.weeklyFrequency} completed.`);
  parts.push(`Consistency score: ${context.consistencyScore}%`);
  parts.push("");

  if (context.consistencyScore >= 100) {
    parts.push("🎯 Target reached! You're on fire this week. Keep it up!");
  } else if (context.consistencyScore >= 75) {
    parts.push("💪 Almost there! One or two more sessions and you'll hit your goal.");
  } else if (context.consistencyScore >= 50) {
    parts.push("⚡ You're halfway there. Try to schedule your remaining sessions to stay consistent.");
  } else {
    parts.push("⚠️ Your consistency is below target. Consistency is the #1 factor for progress — even short sessions count!");
  }

  parts.push("");
  parts.push(`Total workouts logged: ${context.totalWorkouts}`);

  return parts.join("\n");
}

function analyzeProgramAdvice(context: CoachContext): string {
  const parts: string[] = [];
  const goalLabel = formatGoalLabel(context.fitnessGoal);

  parts.push(`Based on your ${goalLabel} goal and ${context.weeklyFrequency}-day schedule, here's my recommendation:`);
  parts.push("");

  if (context.weeklyFrequency <= 3) {
    parts.push("📋 **Full Body Split** — train all major muscle groups each session.");
    parts.push("Best for your frequency since each muscle gets 3x/week stimulus.");
  } else if (context.weeklyFrequency === 4) {
    parts.push("📋 **Upper/Lower Split** — alternate between upper and lower days.");
    parts.push("Gives each muscle 2x/week frequency with more volume per session.");
  } else if (context.weeklyFrequency === 5) {
    parts.push("📋 **Push/Pull/Legs** — focus on one movement pattern per day.");
    parts.push("Great for higher volume per muscle group while maintaining frequency.");
  } else {
    parts.push("📋 **PPL or Arnold Split** — high frequency, high volume for advanced lifters.");
    parts.push("Make sure you're eating and sleeping enough to recover from 6 sessions/week.");
  }

  parts.push("");
  parts.push("Use the Workout Program Generator on the right to build a customized routine →");

  return parts.join("\n");
}

function generateGeneralAdvice(context: CoachContext): string {
  // Pick the most relevant advice based on current context
  const issues: string[] = [];

  // Check for plateaus
  const plateauCount = context.exercisePlateaus.filter(
    (ep) => ep.analysis.status === "PLATEAU_DETECTED",
  ).length;
  if (plateauCount > 0) {
    issues.push(`I noticed ${plateauCount} exercise${plateauCount > 1 ? "s" : ""} at a plateau. Ask me "plateau" for a detailed breakdown.`);
  }

  // Check nutrition
  if (context.nutritionTargets && context.todayCalories > 0) {
    const calDiff = context.nutritionTargets.calories - context.todayCalories;
    if (calDiff > 500) {
      issues.push(`You're ${calDiff} kcal under your daily target. Ask me "nutrition" for a full macro breakdown.`);
    }
  }

  // Check consistency
  if (context.consistencyScore < 75) {
    issues.push(`Your training consistency is at ${context.consistencyScore}%. Ask me "consistency" for tips.`);
  }

  // Check recovery
  const fatigued = context.muscleRecovery.filter((m) => m.status === "Fatigued");
  if (fatigued.length > 0) {
    issues.push(`${fatigued.length} muscle group${fatigued.length > 1 ? "s are" : " is"} still fatigued. Ask me "recovery" for details.`);
  }

  if (issues.length > 0) {
    return `Here's what I'm seeing in your training data:\n\n${issues.map((i) => `• ${i}`).join("\n")}\n\nAsk me about any of these topics for personalized advice!`;
  }

  return `Your training looks solid, ${context.userName || "Athlete"}! You're hitting your targets and progressing well. Keep following your current plan and I'll flag any issues as they arise. Ask me about plateaus, nutrition, recovery, or volume anytime.`;
}

// ──────────────────────────────────────
// Recovery Estimation
// ──────────────────────────────────────

/**
 * Estimate muscle recovery based on days since last training.
 *
 * Recovery model (simplified, evidence-based):
 * - 0 days: 10% (just trained)
 * - 1 day:  40% (acute fatigue)
 * - 2 days: 70% (recovering)
 * - 3+ days: 85-100% (recovered/supercompensated)
 *
 * Large muscles (legs, back) recover slower than small muscles (biceps, triceps).
 */
export function estimateMuscleRecovery(
  muscle: string,
  daysSinceTraining: number,
): CoachMuscleRecovery {
  const isLargeMuscle = ["LEGS", "BACK", "GLUTES"].includes(muscle);
  const recoveryRate = isLargeMuscle ? 0.85 : 1.0; // large muscles recover ~15% slower

  let basePct: number;
  if (daysSinceTraining <= 0) basePct = 10;
  else if (daysSinceTraining === 1) basePct = 40;
  else if (daysSinceTraining === 2) basePct = 70;
  else if (daysSinceTraining === 3) basePct = 85;
  else basePct = Math.min(100, 85 + (daysSinceTraining - 3) * 5);

  const pct = Math.min(100, Math.round(basePct * recoveryRate));

  let status: CoachMuscleRecovery["status"];
  if (pct >= 80) status = "Ready";
  else if (pct >= 50) status = "Recovering";
  else status = "Fatigued";

  return {
    muscle,
    daysSinceTraining,
    estimatedRecoveryPct: pct,
    status,
  };
}

// ──────────────────────────────────────
// Helpers
// ──────────────────────────────────────

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(Math.abs(b.getTime() - a.getTime()) / msPerDay);
}

function formatGoalLabel(goal: FitnessGoal): string {
  const labels: Record<string, string> = {
    MUSCLE_GAIN: "muscle gain",
    FAT_LOSS: "fat loss",
    STRENGTH: "strength",
    MAINTENANCE: "maintenance",
    GENERAL_FITNESS: "general fitness",
  };
  return labels[goal] ?? "fitness";
}

function formatRecordType(type: string): string {
  const labels: Record<string, string> = {
    WEIGHT_PR: "Weight PR",
    REP_PR: "Rep PR",
    VOLUME_PR: "Volume PR",
    E1RM_PR: "Est. 1RM PR",
  };
  return labels[type] ?? type;
}
