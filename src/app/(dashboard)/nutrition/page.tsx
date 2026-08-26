import { auth } from "@/lib/auth";
import { NutritionRepository } from "@/repositories/nutrition.repository";
import { UserRepository } from "@/repositories/user.repository";
import { NutritionDashboardClient } from "@/components/nutrition/NutritionDashboardClient";

export default async function NutritionPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [todayMeals, todayWater, goal, user] = await Promise.all([
    NutritionRepository.getTodayMeals(session.user.id),
    NutritionRepository.getTodayWater(session.user.id),
    NutritionRepository.getGoal(session.user.id),
    UserRepository.findById(session.user.id),
  ]);

  const hasProfileData = Boolean(
    user?.profile?.currentWeight && user?.profile?.height
  );

  return (
    <NutritionDashboardClient
      initialMeals={todayMeals}
      todayWaterMl={todayWater}
      initialGoal={goal}
      hasProfileData={hasProfileData}
    />
  );
}
