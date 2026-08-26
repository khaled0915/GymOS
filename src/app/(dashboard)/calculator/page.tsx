import { auth } from "@/lib/auth";
import { UserRepository } from "@/repositories/user.repository";
import { StrengthCalculatorClient } from "@/components/calculator/StrengthCalculatorClient";

export default async function CalculatorPage() {
  const session = await auth();
  let defaultWeightKg = 80;

  if (session?.user?.id) {
    const user = await UserRepository.findById(session.user.id);
    if (user?.profile?.currentWeight) {
      defaultWeightKg = user.profile.currentWeight;
    }
  }

  return <StrengthCalculatorClient defaultWeightKg={defaultWeightKg} />;
}
