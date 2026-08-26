import { auth } from "@/lib/auth";
import { UserRepository } from "@/repositories/user.repository";
import { ProfileFormClient } from "@/components/profile/ProfileFormClient";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await UserRepository.findById(session.user.id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Athlete Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and physical metrics
        </p>
      </div>

      <ProfileFormClient
        initialData={{
          name: user?.name || "",
          email: user?.email || "",
          height: user?.profile?.height ?? undefined,
          currentWeight: user?.profile?.currentWeight ?? undefined,
          fitnessGoal: user?.profile?.fitnessGoal ?? undefined,
          experienceLevel: user?.profile?.experienceLevel ?? undefined,
          preferredUnit: user?.profile?.preferredUnit ?? "METRIC",
          weeklyFrequency: user?.profile?.weeklyFrequency ?? undefined,
        }}
      />
    </div>
  );
}
