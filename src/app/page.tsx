import { auth } from "@/lib/auth";
import Link from "next/link";
import { Dumbbell, ArrowRight, Activity, Trophy, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
          <Activity className="h-4 w-4" /> The Athlete&apos;s Operating System
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xl">
              <Dumbbell className="h-9 w-9" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Track. Progress. <span className="text-emerald-600">Overload.</span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto">
            A fast, mobile-first workout tracking platform with live PR detection, deterministic progressive overload, and volume analytics.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {session?.user ? (
            <Button asChild size="lg" variant="athletic" className="w-full sm:w-auto px-8 font-bold">
              <Link href="/dashboard">
                Open Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" variant="athletic" className="w-full sm:w-auto px-8 font-bold">
                <Link href="/register">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto px-8">
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 text-left">
          <div className="p-4 rounded-xl border bg-card/60 space-y-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <h3 className="font-bold text-sm">Fast Workout Logger</h3>
            <p className="text-xs text-muted-foreground">
              Previous performance displayed live while logging sets. Minimize taps and typing in the gym.
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-card/60 space-y-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <h3 className="font-bold text-sm">Automatic PR Alerts</h3>
            <p className="text-xs text-muted-foreground">
              Instant detection for weight PRs, rep PRs, estimated 1RM, and session volume records.
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-card/60 space-y-2">
            <Activity className="h-6 w-6 text-emerald-500" />
            <h3 className="font-bold text-sm">Progressive Overload</h3>
            <p className="text-xs text-muted-foreground">
              Deterministic recommendation rules guide your next workout weight and target reps.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
