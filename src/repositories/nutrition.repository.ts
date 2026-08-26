import { db } from "@/lib/db";
import type { MealLog, WaterLog, NutritionGoal, MealType } from "@prisma/client";

export class NutritionRepository {
  /**
   * Get all meals logged today for a user.
   */
  static async getTodayMeals(userId: string, date?: Date): Promise<MealLog[]> {
    const targetDate = date ?? new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return db.mealLog.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { loggedAt: "asc" },
    });
  }

  /**
   * Log a new meal.
   */
  static async logMeal(data: {
    userId: string;
    name: string;
    mealType: MealType;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    loggedAt?: Date;
  }): Promise<MealLog> {
    return db.mealLog.create({
      data: {
        userId: data.userId,
        name: data.name,
        mealType: data.mealType,
        calories: data.calories,
        protein: data.protein ?? 0,
        carbs: data.carbs ?? 0,
        fat: data.fat ?? 0,
        loggedAt: data.loggedAt ?? new Date(),
      },
    });
  }

  /**
   * Delete a meal (scoped to user).
   */
  static async deleteMeal(id: string, userId: string): Promise<void> {
    await db.mealLog.deleteMany({
      where: { id, userId },
    });
  }

  /**
   * Get total water logged today.
   */
  static async getTodayWater(userId: string, date?: Date): Promise<number> {
    const targetDate = date ?? new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const logs = await db.waterLog.findMany({
      where: {
        userId,
        loggedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return logs.reduce((total, log) => total + log.amountMl, 0);
  }

  /**
   * Log water intake.
   */
  static async logWater(userId: string, amountMl: number): Promise<WaterLog> {
    return db.waterLog.create({
      data: {
        userId,
        amountMl,
        loggedAt: new Date(),
      },
    });
  }

  /**
   * Get or initialize nutrition goal for a user.
   */
  static async getGoal(userId: string): Promise<NutritionGoal | null> {
    return db.nutritionGoal.findUnique({
      where: { userId },
    });
  }

  /**
   * Save or update nutrition goal.
   */
  static async upsertGoal(
    userId: string,
    data: {
      dailyCalories: number;
      dailyProtein: number;
      dailyCarbs: number;
      dailyFat: number;
      dailyWaterMl: number;
    }
  ): Promise<NutritionGoal> {
    return db.nutritionGoal.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    });
  }
}
