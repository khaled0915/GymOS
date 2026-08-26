import { auth } from "@/lib/auth";
import { CustomExerciseFormClient } from "@/components/exercises/CustomExerciseFormClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewExercisePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Create Custom Exercise</h1>
          <p className="text-muted-foreground mt-1">
            Add a personal movement variation to your exercise library
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/exercises">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Library
          </Link>
        </Button>
      </div>

      <CustomExerciseFormClient />
    </div>
  );
}
