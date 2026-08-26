import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  Dumbbell,
  ArrowRight,
  Activity,
  Trophy,
  Flame,
  Sparkles,
  Utensils,
  Calculator,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Hero13 from "@/components/originkit/hero-13";

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* 3D Originkit Hero 13 Section */}
      <Hero13 isLoggedIn={isLoggedIn} />

      {/* Feature Showcase Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> Built for Serious Lifters
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Everything You Need to Break Plateaus
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            From the gym floor to the kitchen, GymOS equips you with automated analytics and intelligent guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Fast Logger */}
          <div className="p-6 rounded-2xl border bg-card hover:border-emerald-500/40 transition-all space-y-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Flame className="h-5 w-5 fill-current" />
            </div>
            <h3 className="font-bold text-base">Fast Workout Logger</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              View previous session weights and reps directly while logging sets. Automatic rest countdown with audio chime alerts.
            </p>
          </div>

          {/* Card 2: Overload & PRs */}
          <div className="p-6 rounded-2xl border bg-card hover:border-emerald-500/40 transition-all space-y-3">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Progressive Overload & PRs</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time personal record detection for weight, reps, volume, and 1RM. Deterministic target weight suggestions.
            </p>
          </div>

          {/* Card 3: Smart Coach */}
          <div className="p-6 rounded-2xl border bg-card hover:border-emerald-500/40 transition-all space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">AI Training Coach & Splits</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Generate scientifically structured Full Body, Upper/Lower, and PPL routines matched to your schedule and equipment.
            </p>
          </div>

          {/* Card 4: Nutrition & Food Database */}
          <div className="p-6 rounded-2xl border bg-card hover:border-emerald-500/40 transition-all space-y-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Utensils className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Nutrition & Food Database</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              BMR and TDEE calorie calculator with dynamic macro targets, hydration logs, and a built-in 30+ food library with portion scaling.
            </p>
          </div>

          {/* Card 5: Strength Standards */}
          <div className="p-6 rounded-2xl border bg-card hover:border-emerald-500/40 transition-all space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Strength Standards & 1RM</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Compare Epley, Brzycki, and Lombardi formulas side-by-side. Classify your compound lifts across Beginner to Elite tiers.
            </p>
          </div>

          {/* Card 6: Hypertrophy Landmarks */}
          <div className="p-6 rounded-2xl border bg-card hover:border-emerald-500/40 transition-all space-y-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base">Hypertrophy Volume Landmarks</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track direct working sets per muscle group against the optimal 10–20 weekly set hypertrophy sweet spot.
            </p>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-card to-emerald-950/40 border border-emerald-500/30 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ready to Take Your Training to the Next Level?
          </h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Free forever for athletes. No clutter, zero ads, 100% data ownership.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isLoggedIn ? (
              <Button asChild size="lg" variant="athletic" className="px-8 font-bold">
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" variant="athletic" className="px-8 font-bold">
                  <Link href="/register">
                    Create Free Account <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-xs text-muted-foreground mt-auto">
        <p>© {new Date().getFullYear()} GymOS — The Athlete&apos;s Operating System. All rights reserved.</p>
      </footer>
    </main>
  );
}
