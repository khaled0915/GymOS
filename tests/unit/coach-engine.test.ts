import { describe, it, expect } from "vitest";
import {
  classifyIntent,
  generateCoachResponse,
  generateGreeting,
  generateQuickPrompts,
  analyzeUserPlateaus,
  analyzeNutrition,
  analyzeRecovery,
  analyzeVolume,
  estimateMuscleRecovery,
  type CoachContext,
} from "@/domain/coach-engine";

// ──────────────────────────────────────
// Helpers
// ──────────────────────────────────────

function makeBaseContext(overrides: Partial<CoachContext> = {}): CoachContext {
  return {
    userName: "Alex",
    fitnessGoal: "MUSCLE_GAIN",
    experienceLevel: "INTERMEDIATE",
    weightKg: 80,
    heightCm: 180,
    weeklyFrequency: 4,
    totalWorkouts: 20,
    completedThisWeek: 3,
    consistencyScore: 75,
    exercisePlateaus: [],
    recentPrs: [],
    todayCalories: 0,
    todayProtein: 0,
    todayCarbs: 0,
    todayFat: 0,
    todayWater: 0,
    nutritionTargets: null,
    muscleBalance: {
      upperVolume: 5000,
      lowerVolume: 3000,
      balanceRatio: "63% Upper / 37% Lower",
      advice: "Great balance between upper and lower body stimulus!",
    },
    weeklyMuscleSets: {
      CHEST: 12,
      BACK: 14,
      LEGS: 10,
      SHOULDERS: 8,
      BICEPS: 6,
      TRICEPS: 6,
      ABS: 4,
      CALVES: 2,
    },
    weeklyVolume: 25000,
    muscleRecovery: [],
    ...overrides,
  };
}

// ──────────────────────────────────────
// classifyIntent
// ──────────────────────────────────────

describe("classifyIntent", () => {
  it("classifies plateau keywords", () => {
    expect(classifyIntent("My bench press hit a plateau")).toBe("PLATEAU");
    expect(classifyIntent("I'm stuck on squats")).toBe("PLATEAU");
    expect(classifyIntent("not progressing anymore")).toBe("PLATEAU");
  });

  it("classifies nutrition keywords", () => {
    expect(classifyIntent("How many calories should I eat?")).toBe("NUTRITION");
    expect(classifyIntent("Am I getting enough protein?")).toBe("NUTRITION");
    expect(classifyIntent("What about my macros?")).toBe("NUTRITION");
    expect(classifyIntent("Should I be in a surplus?")).toBe("NUTRITION");
  });

  it("classifies balance keywords", () => {
    expect(classifyIntent("Check my upper lower ratio")).toBe("BALANCE");
    expect(classifyIntent("Is my training balanced?")).toBe("BALANCE");
  });

  it("classifies recovery keywords", () => {
    expect(classifyIntent("Am I recovered enough?")).toBe("RECOVERY");
    expect(classifyIntent("I feel sore today")).toBe("RECOVERY");
    expect(classifyIntent("Am I overtraining?")).toBe("RECOVERY");
  });

  it("classifies volume keywords", () => {
    expect(classifyIntent("How many sets per week?")).toBe("VOLUME");
    expect(classifyIntent("Check my training volume")).toBe("VOLUME");
  });

  it("classifies PR keywords", () => {
    expect(classifyIntent("Show me my personal records")).toBe("PR_STATUS");
    expect(classifyIntent("What is my best lift?")).toBe("PR_STATUS");
  });

  it("classifies deload keywords", () => {
    expect(classifyIntent("Should I deload?")).toBe("DELOAD");
    expect(classifyIntent("I need a recovery week")).toBe("DELOAD");
  });

  it("classifies consistency keywords", () => {
    expect(classifyIntent("Am I training consistently?")).toBe("CONSISTENCY");
    expect(classifyIntent("How often am I working out?")).toBe("CONSISTENCY");
  });

  it("falls back to GENERAL for unknown messages", () => {
    expect(classifyIntent("Hello there!")).toBe("GENERAL");
    expect(classifyIntent("What do you think?")).toBe("GENERAL");
  });
});

// ──────────────────────────────────────
// generateGreeting
// ──────────────────────────────────────

describe("generateGreeting", () => {
  it("includes the user's real name", () => {
    const ctx = makeBaseContext({ userName: "Sarah" });
    const result = generateGreeting(ctx);
    expect(result).toContain("Sarah");
  });

  it("shows weekly progress when partially complete", () => {
    const ctx = makeBaseContext({ completedThisWeek: 2, weeklyFrequency: 4 });
    const result = generateGreeting(ctx);
    expect(result).toContain("2/4");
    expect(result).toContain("2 more");
  });

  it("shows congratulations when target is met", () => {
    const ctx = makeBaseContext({ completedThisWeek: 4, weeklyFrequency: 4 });
    const result = generateGreeting(ctx);
    expect(result).toContain("4/4");
    expect(result).toContain("crushed");
  });

  it("mentions plateau exercises when detected", () => {
    const ctx = makeBaseContext({
      exercisePlateaus: [
        {
          exerciseName: "Bench Press",
          exerciseId: "bp1",
          analysis: {
            status: "PLATEAU_DETECTED",
            consecutiveStalledSessions: 3,
            reason: "No progression over last 3 sessions",
          },
        },
      ],
    });
    const result = generateGreeting(ctx);
    expect(result).toContain("Bench Press");
    expect(result).toContain("plateau");
  });
});

// ──────────────────────────────────────
// generateQuickPrompts
// ──────────────────────────────────────

describe("generateQuickPrompts", () => {
  it("returns up to 4 prompts", () => {
    const ctx = makeBaseContext();
    const prompts = generateQuickPrompts(ctx);
    expect(prompts.length).toBeLessThanOrEqual(4);
    expect(prompts.length).toBeGreaterThan(0);
  });

  it("includes plateau-specific prompt when plateau detected", () => {
    const ctx = makeBaseContext({
      exercisePlateaus: [
        {
          exerciseName: "Squat",
          exerciseId: "sq1",
          analysis: {
            status: "PLATEAU_DETECTED",
            consecutiveStalledSessions: 3,
            reason: "Stalled",
          },
        },
      ],
    });
    const prompts = generateQuickPrompts(ctx);
    expect(prompts.some((p) => p.includes("Squat"))).toBe(true);
  });

  it("includes nutrition prompt when targets exist", () => {
    const ctx = makeBaseContext({
      nutritionTargets: {
        calories: 2500,
        proteinGrams: 160,
        carbsGrams: 250,
        fatGrams: 70,
        waterMl: 3000,
      },
    });
    const prompts = generateQuickPrompts(ctx);
    expect(prompts.some((p) => p.toLowerCase().includes("macro") || p.toLowerCase().includes("eat"))).toBe(true);
  });
});

// ──────────────────────────────────────
// analyzeUserPlateaus
// ──────────────────────────────────────

describe("analyzeUserPlateaus", () => {
  it("returns positive message when no plateaus", () => {
    const ctx = makeBaseContext({
      exercisePlateaus: [
        {
          exerciseName: "Bench Press",
          exerciseId: "bp1",
          analysis: {
            status: "PROGRESSING",
            consecutiveStalledSessions: 0,
            reason: "Consistent progression",
          },
        },
      ],
    });
    const result = analyzeUserPlateaus(ctx);
    expect(result).toContain("progressing");
  });

  it("identifies stalled exercises by name", () => {
    const ctx = makeBaseContext({
      exercisePlateaus: [
        {
          exerciseName: "Overhead Press",
          exerciseId: "ohp1",
          analysis: {
            status: "PLATEAU_DETECTED",
            consecutiveStalledSessions: 3,
            reason: "No progression in weight or reps over the last 3 sessions.",
            recommendation: "Consider a deload at 36 kg",
            suggestedWeightDelta: -0.1,
          },
        },
      ],
    });
    const result = analyzeUserPlateaus(ctx);
    expect(result).toContain("Overhead Press");
    expect(result).toContain("deload");
  });

  it("handles no data gracefully", () => {
    const ctx = makeBaseContext({ exercisePlateaus: [] });
    const result = analyzeUserPlateaus(ctx);
    expect(result).toContain("enough workout data");
  });
});

// ──────────────────────────────────────
// analyzeNutrition
// ──────────────────────────────────────

describe("analyzeNutrition", () => {
  it("tells user to set targets when none exist", () => {
    const ctx = makeBaseContext({ nutritionTargets: null });
    const result = analyzeNutrition(ctx);
    expect(result).toContain("haven't set nutrition targets");
  });

  it("shows shortfall when under target", () => {
    const ctx = makeBaseContext({
      todayCalories: 1800,
      todayProtein: 100,
      todayWater: 1500,
      nutritionTargets: {
        calories: 2500,
        proteinGrams: 160,
        carbsGrams: 250,
        fatGrams: 70,
        waterMl: 3000,
      },
    });
    const result = analyzeNutrition(ctx);
    expect(result).toContain("700");
    expect(result).toContain("60g more protein");
  });

  it("shows success when targets are met", () => {
    const ctx = makeBaseContext({
      todayCalories: 2500,
      todayProtein: 165,
      todayWater: 3200,
      nutritionTargets: {
        calories: 2500,
        proteinGrams: 160,
        carbsGrams: 250,
        fatGrams: 70,
        waterMl: 3000,
      },
    });
    const result = analyzeNutrition(ctx);
    expect(result).toContain("✅");
  });
});

// ──────────────────────────────────────
// analyzeRecovery
// ──────────────────────────────────────

describe("analyzeRecovery", () => {
  it("handles empty recovery data", () => {
    const ctx = makeBaseContext({ muscleRecovery: [] });
    const result = analyzeRecovery(ctx);
    expect(result).toContain("No workout data");
  });

  it("shows recovery status for trained muscles", () => {
    const ctx = makeBaseContext({
      muscleRecovery: [
        { muscle: "CHEST", daysSinceTraining: 0, estimatedRecoveryPct: 10, status: "Fatigued" },
        { muscle: "BACK", daysSinceTraining: 3, estimatedRecoveryPct: 85, status: "Ready" },
      ],
    });
    const result = analyzeRecovery(ctx);
    expect(result).toContain("CHEST");
    expect(result).toContain("BACK");
    expect(result).toContain("Ready to train");
    expect(result).toContain("Still recovering");
  });
});

// ──────────────────────────────────────
// analyzeVolume
// ──────────────────────────────────────

describe("analyzeVolume", () => {
  it("shows weekly volume with muscle breakdown", () => {
    const ctx = makeBaseContext();
    const result = analyzeVolume(ctx);
    expect(result).toContain("25,000");
    expect(result).toContain("CHEST");
    expect(result).toContain("12 sets");
  });

  it("identifies muscles below MEV", () => {
    const ctx = makeBaseContext({
      weeklyMuscleSets: { CHEST: 4, BACK: 14, LEGS: 0 },
    });
    const result = analyzeVolume(ctx);
    expect(result).toContain("Below MEV");
  });

  it("identifies muscles in MAV", () => {
    const ctx = makeBaseContext({
      weeklyMuscleSets: { CHEST: 15, BACK: 14 },
    });
    const result = analyzeVolume(ctx);
    expect(result).toContain("optimal zone");
  });
});

// ──────────────────────────────────────
// estimateMuscleRecovery
// ──────────────────────────────────────

describe("estimateMuscleRecovery", () => {
  it("returns Fatigued for muscles trained today", () => {
    const result = estimateMuscleRecovery("CHEST", 0);
    expect(result.status).toBe("Fatigued");
    expect(result.estimatedRecoveryPct).toBeLessThanOrEqual(15);
  });

  it("returns Fatigued for muscles trained 1 day ago", () => {
    const result = estimateMuscleRecovery("CHEST", 1);
    expect(result.status).toBe("Fatigued");
    expect(result.estimatedRecoveryPct).toBe(40);
  });

  it("returns Recovering for muscles trained 2 days ago", () => {
    const result = estimateMuscleRecovery("CHEST", 2);
    expect(result.status).toBe("Recovering");
  });

  it("returns Ready for muscles trained 3+ days ago", () => {
    const result = estimateMuscleRecovery("CHEST", 3);
    expect(result.status).toBe("Ready");
  });

  it("large muscles recover slower", () => {
    const small = estimateMuscleRecovery("BICEPS", 2);
    const large = estimateMuscleRecovery("LEGS", 2);
    expect(large.estimatedRecoveryPct).toBeLessThan(small.estimatedRecoveryPct);
  });

  it("caps at 100%", () => {
    const result = estimateMuscleRecovery("CHEST", 10);
    expect(result.estimatedRecoveryPct).toBeLessThanOrEqual(100);
  });
});

// ──────────────────────────────────────
// generateCoachResponse (integration)
// ──────────────────────────────────────

describe("generateCoachResponse", () => {
  it("returns a string for every intent type", () => {
    const ctx = makeBaseContext();
    const intents = [
      "PLATEAU", "NUTRITION", "BALANCE", "RECOVERY", "VOLUME",
      "PROGRAM", "PR_STATUS", "DELOAD", "CONSISTENCY", "GENERAL",
    ] as const;

    for (const intent of intents) {
      const response = generateCoachResponse(intent, ctx);
      expect(typeof response).toBe("string");
      expect(response.length).toBeGreaterThan(10);
    }
  });

  it("plateau response contains exercise names when plateaus exist", () => {
    const ctx = makeBaseContext({
      exercisePlateaus: [
        {
          exerciseName: "Deadlift",
          exerciseId: "dl1",
          analysis: {
            status: "PLATEAU_DETECTED",
            consecutiveStalledSessions: 4,
            reason: "No progression over last 4 sessions.",
            recommendation: "Deload to 150 kg",
          },
        },
      ],
    });
    const response = generateCoachResponse("PLATEAU", ctx);
    expect(response).toContain("Deadlift");
  });

  it("general response mentions issues when they exist", () => {
    const ctx = makeBaseContext({
      consistencyScore: 50,
      exercisePlateaus: [
        {
          exerciseName: "Bench",
          exerciseId: "b1",
          analysis: { status: "PLATEAU_DETECTED", consecutiveStalledSessions: 3, reason: "Stalled" },
        },
      ],
    });
    const response = generateCoachResponse("GENERAL", ctx);
    expect(response).toContain("plateau");
    expect(response).toContain("consistency");
  });
});
