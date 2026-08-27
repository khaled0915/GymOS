import { auth } from "@/lib/auth";
import { DashboardService } from "@/services/dashboard.service";
import { AthleteDashboardClient } from "@/components/dashboard/AthleteDashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await DashboardService.getDashboardData(session.user.id);
  const firstName = session.user.name?.split(" ")[0] || "Athlete";

  return <AthleteDashboardClient userName={firstName} data={data} />;
}
