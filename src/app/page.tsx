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
  CheckCircle2,
  TrendingUp,
  Zap,
  ShieldCheck,
  Cpu,
  Timer,
  ChevronRight,
  BarChart3,
  Bot,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Hero13 from "@/components/originkit/hero-13";

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <main className="min-h-screen bg-[#0A0D12] text-white flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* ── 3D Originkit Hero 13 Motion Section ── */}
      <Hero13 isLoggedIn={isLoggedIn} />

      {/* ── Section 1: Live Athlete Proof & Metrics Ticker ── */}
      <section className="border-y border-border/40 bg-[#0d1117] py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1">
              <span className="text-emerald-400">0.0s</span>
            </div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fast Logging Latency</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1">
              <span className="text-emerald-400">100%</span>
            </div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Deterministic Overload</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1">
              <span className="text-emerald-400">10–20</span>
            </div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Hypertrophy Landmarks</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1">
              <span className="text-emerald-400">100%</span>
            </div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Data Ownership (CSV/JSON)</p>
          </div>
        </div>
      </section>

      {/* ── Section 2: High-Performance Bento Grid Feature Matrix ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" /> High-Performance Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Engineered for Athletes Who Demand Results
          </h2>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
            Eliminate guesswork in the weight room. GymOS provides instant previous performance data, automated progressive overload math, and recovery intelligence.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Large Featured Card - Workout Logger & Overload */}
          <div className="md:col-span-2 p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/15 text-emerald-300 text-xs font-bold">
                  Core Workflow
                </Badge>
                <h3 className="text-2xl font-black text-white">Interactive Workout Logger &amp; Overload Engine</h3>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
                <Zap className="h-5 w-5 fill-current" />
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl">
              Never forget what you lifted last week. While logging a set, see your previous weights and reps right on screen with automated audio rest timers and live PR detection.
            </p>

            {/* Live Interactive UI Mock inside Card */}
            <div className="p-5 rounded-2xl bg-[#0A0D12] border border-border/80 space-y-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white text-sm">Barbell Bench Press</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">CHEST</span>
                </div>
                <span className="text-xs text-emerald-300 font-bold">Overload Target: 102.5 kg × 8</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-[#161B26] border border-border/50 text-white font-medium">Set 1: 102.5kg × 8 ✓</div>
                <div className="p-2.5 rounded-lg bg-[#161B26] border border-border/50 text-white font-medium">Set 2: 102.5kg × 8 ✓</div>
                <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold">Set 3: Active [ 102.5 ]</div>
                <div className="p-2.5 rounded-lg bg-[#12161F] border border-border/30 text-slate-300">Set 4: Upcoming</div>
              </div>
            </div>
          </div>

          {/* Bento 2: AI Coach Antigravity */}
          <div className="p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-5">
            <div className="h-10 w-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <Bot className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">AI Coach Antigravity</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Break plateaus before they happen. Context-aware coaching suggests deloads and generates custom 3 to 6-day splits based on your equipment.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-xs text-blue-100 leading-relaxed font-mono">
              &quot;Stalled on Squat at 140kg? Deload 10% this session and add Safety Bar Squats.&quot;
            </div>
          </div>

          {/* Bento 3: Hypertrophy Landmarks */}
          <div className="p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-5">
            <div className="h-10 w-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Layers className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Volume Landmarks</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Track weekly direct working sets per muscle group against the scientific 10–20 set hypertrophy sweet spot.
              </p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-white">Chest Volume</span>
                <span className="text-emerald-300">16 / 20 Sets (Optimal)</span>
              </div>
              <div className="h-2 bg-[#0A0D12] border border-border/40 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: "80%" }} />
              </div>
            </div>
          </div>

          {/* Bento 4: Nutrition & Food Database */}
          <div className="p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-5">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Utensils className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Nutrition &amp; Food Library</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                BMR/TDEE macro calculator, hydration logs, and a built-in 30+ food library with 1-tap portion scaling.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2.5 py-1 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-bold">Protein 180g</span>
              <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">Carbs 280g</span>
              <span className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">Fat 70g</span>
            </div>
          </div>

          {/* Bento 5: 1RM Calculator & Strength Standards */}
          <div className="p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-5">
            <div className="h-10 w-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Calculator className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Strength Standards &amp; 1RM</h3>
              <p className="text-sm text-slate-200 leading-relaxed">
                Multi-formula 1RM comparisons (Epley, Brzycki, Lombardi) and bodyweight-relative strength tier classifications.
              </p>
            </div>
            <div className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-[#0A0D12] border border-border/60 font-mono">
              <span className="text-white font-bold">Bench Press</span>
              <span className="text-purple-300 font-bold">Advanced (1.8x BW)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 3: The 4-Step Progressive Overload Loop ── */}
      <section className="border-t border-border/40 bg-[#0d1117] py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5" /> Deterministic Framework
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              The GymOS Training Cycle
            </h2>
            <p className="text-sm sm:text-base text-slate-200">
              A scientific continuous improvement loop designed to guarantee progressive overload.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Plan", desc: "Select or AI-generate structured PPL, Upper/Lower, or Full Body routines.", icon: Cpu },
              { step: "02", title: "Train", desc: "Execute sets with automatic rest countdowns, audio chimes, and previous performance reference.", icon: Dumbbell },
              { step: "03", title: "Analyze", desc: "Detect new PR breakthroughs and track weekly volume against hypertrophy landmarks.", icon: BarChart3 },
              { step: "04", title: "Overload", desc: "Receive deterministic target weight increases and rep goals for your next workout.", icon: TrendingUp },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-border/50 bg-[#161B26] backdrop-blur-sm space-y-4 relative group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-white/30 group-hover:text-emerald-400 transition-colors font-mono">
                    {item.step}
                  </span>
                  <item.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: GymOS vs Generic Apps Comparison Matrix ── */}
      <section className="max-w-6xl mx-auto px-6 py-24 w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Why Lifters Switch to GymOS
          </h2>
          <p className="text-sm sm:text-base text-slate-200">
            No bloat, no subscription paywalls, no distraction. Built exclusively for athletic progression.
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-[#161B26] backdrop-blur-md overflow-hidden shadow-xl">
          <div className="grid grid-cols-3 p-5 sm:p-6 bg-white/10 border-b border-border/50 text-xs font-bold uppercase tracking-wider text-white">
            <div>Feature</div>
            <div className="text-center text-rose-300 font-bold">Generic Workout Trackers</div>
            <div className="text-center text-emerald-300 font-bold">GymOS Athletic OS</div>
          </div>

          {[
            { feature: "Live Progressive Overload Targets", generic: "❌ Manual Guesswork", gymos: "✅ Deterministic Math" },
            { feature: "Previous Set Performance In-Logger", generic: "❌ Buried in Sub-menus", gymos: "✅ Visible on Screen" },
            { feature: "Live Rest Timer with Audio Chime", generic: "❌ Often Premium Only", gymos: "✅ Built-in Web Audio" },
            { feature: "Scientific Warm-Up Ramp Generator", generic: "❌ Not Available", gymos: "✅ 1-Tap Load Drawer" },
            { feature: "Hypertrophy Landmarks (10-20 sets)", generic: "❌ Basic Bar Charts", gymos: "✅ Evidence-Based Zones" },
            { feature: "Full Data Ownership & CSV Export", generic: "❌ Locked in App", gymos: "✅ 1-Click Complete Backup" },
          ].map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-3 p-4 sm:p-5 text-xs sm:text-sm items-center ${
                idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.04]"
              } border-b border-border/40 last:border-0`}
            >
              <div className="font-bold text-white">{row.feature}</div>
              <div className="text-center text-slate-300 text-xs">{row.generic}</div>
              <div className="text-center font-bold text-emerald-300 text-xs">{row.gymos}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: High-Impact Cyberpunk Call to Action (CTA) ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 w-full">
        <div className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#161B26] via-[#10141D] to-[#0A0D12] border border-emerald-500/50 text-center space-y-8 overflow-hidden shadow-2xl shadow-emerald-950/50">
          {/* Radial ambient glow in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3.5 py-1">
              Free Forever for Athletes
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Take Control of Your Overload Today
            </h2>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
              Join serious lifters who track with precision. No credit card required, zero ads, 100% data portability.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLoggedIn ? (
              <Button asChild size="lg" variant="athletic" className="h-12 px-8 font-bold text-black bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/30 text-base">
                <Link href="/dashboard">
                  Open Athlete Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" variant="athletic" className="h-12 px-8 font-bold text-black bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/30 text-base">
                  <Link href="/register">
                    Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 font-bold text-white border-white/30 hover:bg-white/10">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-400" /> Private &amp; Secure</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-emerald-400" /> Instant Overload Math</span>
            <span className="flex items-center gap-1.5"><Database className="h-4 w-4 text-emerald-400" /> 100% Exportable</span>
          </div>
        </div>
      </section>

      {/* ── Modern Dark Footer ── */}
      <footer className="border-t border-border/50 bg-[#07090D] py-12 text-xs text-slate-300 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <Dumbbell className="h-4 w-4" />
            </div>
            <div>
              <span className="font-black text-white text-sm">GymOS</span>
              <span className="text-[11px] text-slate-300 ml-2 font-mono">v1.0 Athletic OS</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 font-medium text-slate-200">
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link href="/workouts" className="hover:text-emerald-400 transition-colors">Workout Logger</Link>
            <Link href="/coach" className="hover:text-emerald-400 transition-colors">AI Coach</Link>
            <Link href="/nutrition" className="hover:text-emerald-400 transition-colors">Nutrition</Link>
            <Link href="/calculator" className="hover:text-emerald-400 transition-colors">1RM Calculator</Link>
            <Link href="/analytics" className="hover:text-emerald-400 transition-colors">Analytics</Link>
          </div>

          <p className="text-slate-300">© {new Date().getFullYear()} GymOS. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
