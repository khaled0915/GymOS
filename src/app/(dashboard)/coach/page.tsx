import { auth } from "@/lib/auth";
import { CoachService } from "@/services/coach.service";
import { CoachDashboardClient } from "@/components/coach/CoachDashboardClient";

export default async function CoachPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await CoachService.getCoachDashboard(session.user.id);

  return (
    <CoachDashboardClient
      insights={data.insights}
      userProfile={data.userProfile}
      greeting={data.greeting}
      quickPrompts={data.quickPrompts}
      muscleRecovery={data.coachContext.muscleRecovery}
      muscleBalance={data.coachContext.muscleBalance}
      isGeminiEnabled={data.isGeminiEnabled}
    />
  );
}
