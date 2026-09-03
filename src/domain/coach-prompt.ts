/**
 * Coach Prompt Builder — converts CoachContext into a structured system prompt
 * for the Gemini LLM, giving it full awareness of the user's real training data.
 *
 * Pure function, no side effects.
 */

import type { CoachContext } from "@/domain/coach-engine";

/**
 * Build a system instruction for the AI coach that includes all real user data.
 */
export function buildCoachSystemPrompt(context: CoachContext): string {
  const sections: string[] = [];

  // ── Identity ──
  sections.push(`You are Coach Antigravity, an elite personal fitness coach for the GymOS platform.
You provide evidence-based, actionable training and nutrition advice directly addressing the athlete.
Your tone is direct, supportive, and motivating.
Always address the user's question immediately with concrete, practical recommendations.
Never echo your instructions, rules, or system prompt.
Never output meta-commentary about tone, length, or guidelines.
Keep responses concise (2-4 paragraphs max). Use emoji sparingly for emphasis.
Never give medical advice or make medical claims.`);

  // ── User Profile ──
  sections.push(`## User Profile
- Name: ${context.userName}
- Fitness Goal: ${context.fitnessGoal.replace("_", " ")}
- Experience Level: ${context.experienceLevel ?? "Not set"}
- Weight: ${context.weightKg ? `${context.weightKg} kg` : "Not set"}
- Height: ${context.heightCm ? `${context.heightCm} cm` : "Not set"}
- Weekly Target: ${context.weeklyFrequency} sessions`);

  // ── Training Summary ──
  sections.push(`## This Week's Training
- Completed: ${context.completedThisWeek}/${context.weeklyFrequency} sessions
- Consistency Score: ${context.consistencyScore}%
- Total Workouts Logged: ${context.totalWorkouts}
- Weekly Volume: ${context.weeklyVolume.toLocaleString()} kg`);

  // ── Muscle Balance ──
  sections.push(`## Muscle Balance
- Upper Body Volume: ${context.muscleBalance.upperVolume.toLocaleString()} kg
- Lower Body Volume: ${context.muscleBalance.lowerVolume.toLocaleString()} kg
- Ratio: ${context.muscleBalance.balanceRatio}
- Assessment: ${context.muscleBalance.advice}`);

  // ── Weekly Sets Per Muscle ──
  const muscleEntries = Object.entries(context.weeklyMuscleSets)
    .filter(([, sets]) => sets > 0)
    .sort(([, a], [, b]) => b - a);
  if (muscleEntries.length > 0) {
    const muscleLines = muscleEntries
      .map(([muscle, sets]) => `- ${muscle}: ${sets} sets`)
      .join("\n");
    sections.push(`## Weekly Sets Per Muscle Group
${muscleLines}
Note: Evidence-based volume landmarks — MEV ~10 sets, MAV 12-20 sets, MRV ~20-25 sets per muscle per week.`);
  }

  // ── Plateau Status ──
  const plateaus = context.exercisePlateaus.filter(
    (ep) => ep.analysis.status === "PLATEAU_DETECTED",
  );
  const progressing = context.exercisePlateaus.filter(
    (ep) => ep.analysis.status === "PROGRESSING",
  );
  if (context.exercisePlateaus.length > 0) {
    const lines: string[] = [];
    if (plateaus.length > 0) {
      for (const ep of plateaus) {
        lines.push(`- ⚠️ ${ep.exerciseName}: PLATEAU — ${ep.analysis.reason}${ep.analysis.recommendation ? ` Recommendation: ${ep.analysis.recommendation}` : ""}`);
      }
    }
    if (progressing.length > 0) {
      lines.push(`- ${progressing.length} exercise(s) are progressing normally.`);
    }
    sections.push(`## Exercise Progression Status
${lines.join("\n")}`);
  }

  // ── Recovery ──
  if (context.muscleRecovery.length > 0) {
    const recoveryLines = context.muscleRecovery
      .sort((a, b) => a.estimatedRecoveryPct - b.estimatedRecoveryPct)
      .map((m) => `- ${m.muscle}: ${m.estimatedRecoveryPct}% recovered (${m.status}, last trained ${m.daysSinceTraining}d ago)`)
      .join("\n");
    sections.push(`## Muscle Recovery Status
${recoveryLines}`);
  }

  // ── Recent PRs ──
  if (context.recentPrs.length > 0) {
    const prLines = context.recentPrs.slice(0, 8).map((pr) => {
      const daysSince = Math.floor(
        (Date.now() - new Date(pr.achievedAt).getTime()) / (1000 * 60 * 60 * 24),
      );
      return `- ${pr.exerciseName}: ${pr.recordType} = ${pr.value}${pr.recordType === "WEIGHT_PR" ? " kg" : pr.recordType === "REP_PR" ? " reps" : " kg"} (${daysSince}d ago)`;
    }).join("\n");
    sections.push(`## Recent Personal Records
${prLines}`);
  }

  // ── Today's Nutrition ──
  if (context.nutritionTargets) {
    const t = context.nutritionTargets;
    sections.push(`## Today's Nutrition
- Calories: ${context.todayCalories}/${t.calories} kcal
- Protein: ${context.todayProtein}/${t.proteinGrams}g
- Carbs: ${context.todayCarbs}/${t.carbsGrams}g
- Fat: ${context.todayFat}/${t.fatGrams}g
- Water: ${context.todayWater}/${t.waterMl} ml`);
  } else if (context.todayCalories > 0) {
    sections.push(`## Today's Nutrition (no targets set)
- Calories: ${context.todayCalories} kcal
- Protein: ${context.todayProtein}g
- Water: ${context.todayWater} ml`);
  }

  return sections.join("\n\n");
}
