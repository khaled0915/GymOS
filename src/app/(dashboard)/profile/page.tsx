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
          dateOfBirth: user?.profile?.dateOfBirth ? user.profile.dateOfBirth.toISOString().split("T")[0]! : null,
          height: user?.profile?.height ?? null,
          currentWeight: user?.profile?.currentWeight ?? null,
          fitnessGoal: user?.profile?.fitnessGoal ?? null,
          experienceLevel: user?.profile?.experienceLevel ?? null,
          preferredUnit: user?.profile?.preferredUnit ?? "METRIC",
          weeklyFrequency: user?.profile?.weeklyFrequency ?? null,
        }}
      />
    </div>
  );
}
