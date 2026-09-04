import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  Dumbbell,
  ArrowRight,
  Activity,
  Sparkles,
  Utensils,
  Calculator,
  Layers,
  TrendingUp,
  Zap,
  ShieldCheck,
  Cpu,
  BarChart3,
  Bot,
  Database,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Hero13 from "@/components/originkit/hero-13";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import {
  MotionFadeIn,
  MotionStaggerContainer,
  MotionStaggerItem,
} from "@/components/home/FramerScroll";
import StackingCards, { StackingCardItem } from "@/components/ui/stacking-cards";
import AthleteExerciseSlider from "@/components/home/AthleteExerciseSlider";
import HyperdriveHero from "@/components/ui/hyperdrive-hero";

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <SmoothScrollProvider>
      <div className="relative w-full min-h-screen bg-[#0A0D12] text-white flex flex-col selection:bg-emerald-500 selection:text-black overflow-x-clip">
        {/* ── Main content layer that slides over the curtain reveal footer ── */}
        <div className="relative z-10 w-full bg-[#0A0D12] shadow-2xl rounded-b-[2rem] sm:rounded-b-[3rem] border-b border-border/50">
          {/* ── 3D Originkit Hero 13 Motion Section ── */}
          <Hero13 isLoggedIn={isLoggedIn} />

          {/* ── Section 1: Live Athlete Proof & Metrics Ticker ── */}
          <section className="border-y border-border/40 bg-[#0d1117] py-8">
            <MotionStaggerContainer className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <MotionStaggerItem className="space-y-1">
                <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                  <span className="text-emerald-400">0.0s</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Fast Logging Latency</p>
              </MotionStaggerItem>
              <MotionStaggerItem className="space-y-1">
                <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                  <span className="text-emerald-400">100%</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Deterministic Overload</p>
              </MotionStaggerItem>
              <MotionStaggerItem className="space-y-1">
                <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                  <span className="text-emerald-400">10–20</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Hypertrophy Landmarks</p>
              </MotionStaggerItem>
              <MotionStaggerItem className="space-y-1">
                <div className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center gap-1">
                  <span className="text-emerald-400">100%</span>
                </div>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Data Ownership (CSV/JSON)</p>
              </MotionStaggerItem>
            </MotionStaggerContainer>
          </section>

          {/* ── Section 2: High-Performance Bento Grid Feature Matrix ── */}
          <section className="max-w-7xl mx-auto px-6 py-24 w-full space-y-16">
            <MotionFadeIn className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> High-Performance Architecture
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Engineered for Athletes Who Demand Results
              </h2>
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                Eliminate guesswork in the weight room. GymOS provides instant previous performance data, automated progressive overload math, and recovery intelligence.
              </p>
            </MotionFadeIn>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Bento 1: Large Featured Card - Workout Logger & Overload */}
              <MotionFadeIn delay={0.05} className="md:col-span-2 p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-6">
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
              </MotionFadeIn>

              {/* Bento 2: AI Coach Antigravity */}
              <MotionFadeIn delay={0.1} className="p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-5">
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
              </MotionFadeIn>

              {/* Bento 3: Hypertrophy Landmarks */}
              <MotionFadeIn delay={0.05} className="p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-5">
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
              </MotionFadeIn>

              {/* Bento 4: Nutrition & Food Database */}
              <MotionFadeIn delay={0.1} className="p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-5">
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
              </MotionFadeIn>

              {/* Bento 5: 1RM Calculator & Strength Standards */}
              <MotionFadeIn delay={0.15} className="p-8 rounded-3xl border border-border/60 bg-gradient-to-br from-[#161B26] via-[#10141D] to-[#0A0D12] backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/50 transition-all space-y-5">
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
              </MotionFadeIn>
            </div>
          </section>

          {/* ── Section 2.5: Infinite Athlete Movement Gallery (21st.dev / Kaif UI) ── */}
          <AthleteExerciseSlider />

          {/* ── Section 3: The 4-Step Progressive Overload Loop (Stacking Cards) ── */}
          <section className="border-t border-border/40 bg-[#0d1117] pt-24 pb-16 sm:pb-24">
            <div className="max-w-7xl mx-auto px-6 space-y-12">
              <MotionFadeIn className="text-center space-y-3 max-w-2xl mx-auto mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <Activity className="h-3.5 w-3.5" /> Deterministic Framework
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  The GymOS Training Cycle
                </h2>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                  A scientific continuous improvement loop designed to guarantee progressive overload.
                </p>
              </MotionFadeIn>

              {/* ── 21st.dev / Fancy Components Stacking Cards ── */}
              <StackingCards totalCards={4} scaleMultiplier={0.04} className="relative w-full">
                {/* 01 PLAN */}
                <StackingCardItem index={0} className="h-[520px] sm:h-[580px]">
                  <div className="w-full max-w-5xl mx-auto rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-[#121922] via-[#0d131a] to-[#070a0d] p-6 sm:p-8 md:p-10 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[460px]">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
                          01
                        </span>
                        <div className="h-5 w-px bg-border/80" />
                        <span className="text-xs sm:text-sm font-black tracking-widest text-slate-300 uppercase">
                          Phase 01 &bull; Routine Architecture
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                        <Cpu className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
                      <div className="md:col-span-7 space-y-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          Plan Your Athletic Foundation
                        </h3>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                          Select from proven hypertrophy splits or let AI construct a bespoke routine calibrated to your weekly schedule, available gym equipment, and muscle priority targets.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                            Push / Pull / Legs (6-Day)
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                            Upper / Lower (4-Day)
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300">
                            Hypertrophy Landmarks
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#090D12] border border-border/80 space-y-3 font-mono text-xs shadow-inner">
                        <div className="flex items-center justify-between text-slate-300 border-b border-border/50 pb-2">
                          <span className="font-bold text-white">Target Split: PPL Hypertrophy</span>
                          <span className="text-emerald-400 font-bold">16–20 Sets/Wk</span>
                        </div>
                        <div className="space-y-2 text-[11px]">
                          <div className="flex justify-between items-center p-2 rounded-lg bg-[#141923] border border-border/40">
                            <span className="text-slate-200 font-medium">Day 1: Push (Chest / Delts / Tri)</span>
                            <span className="text-emerald-300 font-bold">6 Exercises</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded-lg bg-[#141923] border border-border/40">
                            <span className="text-slate-200 font-medium">Day 2: Pull (Lats / Traps / Bi)</span>
                            <span className="text-emerald-300 font-bold">6 Exercises</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded-lg bg-[#141923] border border-border/40">
                            <span className="text-slate-200 font-medium">Day 3: Legs (Quads / Hams / Calves)</span>
                            <span className="text-emerald-300 font-bold">5 Exercises</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[11px] text-emerald-400/90">
                          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Equipment Synced</span>
                          <span>100% Exportable</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-border/40 pt-3">
                      <span>Scientific Volume Balancing</span>
                      <span className="text-emerald-400 font-semibold font-mono">STEP 01 OF 04 &rarr;</span>
                    </div>
                  </div>
                </StackingCardItem>

                {/* 02 TRAIN */}
                <StackingCardItem index={1} className="h-[520px] sm:h-[580px]">
                  <div className="w-full max-w-5xl mx-auto rounded-3xl border border-blue-500/40 bg-gradient-to-br from-[#101726] via-[#0c111e] to-[#070a0d] p-6 sm:p-8 md:p-10 shadow-2xl shadow-blue-950/30 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[460px]">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl font-black text-blue-400 font-mono tracking-tight">
                          02
                        </span>
                        <div className="h-5 w-px bg-border/80" />
                        <span className="text-xs sm:text-sm font-black tracking-widest text-slate-300 uppercase">
                          Phase 02 &bull; High-Performance Logging
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                        <Dumbbell className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
                      <div className="md:col-span-7 space-y-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          Execute With Previous Performance In-View
                        </h3>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                          Never open sub-menus or guess what you loaded last week. Every set displays your previous weight, reps, and RPE right in the active row, complete with Web Audio rest chimes and 1-tap warm-up calculator.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-bold text-blue-300">
                            Previous Set Visibility
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                            Automatic Audio Rest Chimes
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                            Warm-up Ramp Drawer
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#090D12] border border-border/80 space-y-3 font-mono text-xs shadow-inner">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="font-bold text-white flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" /> Barbell Bench Press
                          </span>
                          <span className="text-blue-300 font-bold flex items-center gap-1">
                            <Clock className="h-3 w-3" /> 02:15 Rest
                          </span>
                        </div>
                        <div className="space-y-1.5 text-[11px]">
                          <div className="flex justify-between items-center p-2 rounded-lg bg-[#141923] border border-border/40 text-slate-200">
                            <span>Set 1 &bull; Prev: 100kg &times; 8</span>
                            <span className="text-emerald-400 font-bold">102.5kg &times; 8 &check;</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded-lg bg-[#141923] border border-border/40 text-slate-200">
                            <span>Set 2 &bull; Prev: 100kg &times; 8</span>
                            <span className="text-emerald-400 font-bold">102.5kg &times; 8 &check;</span>
                          </div>
                          <div className="flex justify-between items-center p-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-200 font-bold">
                            <span>Set 3 &bull; Prev: 100kg &times; 7</span>
                            <span className="text-blue-300">Active [ 102.5kg &times; 8 ]</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[11px] text-blue-400">
                          <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> 0.0s Input Latency</span>
                          <span>Audio Chime Enabled</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-border/40 pt-3">
                      <span>Zero Friction In The Gym</span>
                      <span className="text-blue-400 font-semibold font-mono">STEP 02 OF 04 &rarr;</span>
                    </div>
                  </div>
                </StackingCardItem>

                {/* 03 ANALYZE */}
                <StackingCardItem index={2} className="h-[520px] sm:h-[580px]">
                  <div className="w-full max-w-5xl mx-auto rounded-3xl border border-purple-500/40 bg-gradient-to-br from-[#181126] via-[#120d1e] to-[#070a0d] p-6 sm:p-8 md:p-10 shadow-2xl shadow-purple-950/30 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[460px]">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono tracking-tight">
                          03
                        </span>
                        <div className="h-5 w-px bg-border/80" />
                        <span className="text-xs sm:text-sm font-black tracking-widest text-slate-300 uppercase">
                          Phase 03 &bull; Hypertrophy &amp; PR Analytics
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
                      <div className="md:col-span-7 space-y-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          Algorithmic PR Detection &amp; Volume Landmarks
                        </h3>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                          Every completed workout triggers instant detection across 4 PR categories (Weight, Reps, Volume, Estimated 1RM). Track weekly direct working sets against the scientific 10–20 set hypertrophy sweet spot.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-xs font-bold text-purple-300">
                            4-Dimensional PR Engine
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                            Epley &amp; Brzycki Formulas
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                            SVG Muscle Heatmaps
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#090D12] border border-border/80 space-y-3 font-mono text-xs shadow-inner">
                        <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center gap-2 text-purple-200 font-bold">
                          <Award className="h-4 w-4 text-purple-400 shrink-0" />
                          <div className="truncate">
                            <span className="text-white">NEW E1RM RECORD:</span> 133.3 kg (+3.3 kg)
                          </div>
                        </div>
                        <div className="space-y-2 pt-1 text-[11px]">
                          <div>
                            <div className="flex justify-between pb-1 font-semibold">
                              <span className="text-slate-200">Chest Working Sets</span>
                              <span className="text-emerald-400">16 / 20 (Optimal)</span>
                            </div>
                            <div className="h-2 bg-[#161B26] rounded-full overflow-hidden border border-border/40">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: "80%" }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between pb-1 font-semibold">
                              <span className="text-slate-200">Back Working Sets</span>
                              <span className="text-blue-400">14 / 20 (Optimal)</span>
                            </div>
                            <div className="h-2 bg-[#161B26] rounded-full overflow-hidden border border-border/40">
                              <div className="h-full bg-blue-400 rounded-full" style={{ width: "70%" }} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[11px] text-purple-300">
                          <span>Muscle Recovery: Optimal</span>
                          <span>Zero Guesswork</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-border/40 pt-3">
                      <span>Scientific Hypertrophy Zones</span>
                      <span className="text-purple-400 font-semibold font-mono">STEP 03 OF 04 &rarr;</span>
                    </div>
                  </div>
                </StackingCardItem>

                {/* 04 OVERLOAD */}
                <StackingCardItem index={3} className="h-[520px] sm:h-[580px]">
                  <div className="w-full max-w-5xl mx-auto rounded-3xl border border-amber-500/40 bg-gradient-to-br from-[#241a10] via-[#17110a] to-[#070a0d] p-6 sm:p-8 md:p-10 shadow-2xl shadow-amber-950/30 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[440px] sm:min-h-[460px]">
                    <div className="flex items-center justify-between border-b border-border/50 pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
                          04
                        </span>
                        <div className="h-5 w-px bg-border/80" />
                        <span className="text-xs sm:text-sm font-black tracking-widest text-slate-300 uppercase">
                          Phase 04 &bull; Deterministic Progression
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-auto py-4 items-center">
                      <div className="md:col-span-7 space-y-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          Automated Progressive Overload Math
                        </h3>
                        <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                          Progressive overload is the non-negotiable driver of muscle hypertrophy. GymOS computes your exact weight increment and rep target for your next session based on deterministic mathematical rules.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-bold text-amber-300">
                            Deterministic Overload Math
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                            +2.5 kg Micro-Loading
                          </span>
                          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300">
                            Double Progression System
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#090D12] border border-border/80 space-y-3 font-mono text-xs shadow-inner">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="font-bold text-white">Progression Decision</span>
                          <span className="text-amber-400 font-bold">&check; Overload Triggered</span>
                        </div>
                        <div className="space-y-2 text-[11px]">
                          <div className="p-2.5 rounded-lg bg-[#141923] border border-border/40 text-slate-200">
                            <div className="text-slate-400 text-[10px]">CURRENT PERFORMANCE</div>
                            <div className="font-bold text-white mt-0.5">102.5 kg &times; 8 reps @ RPE 7.5</div>
                            <div className="text-emerald-400 text-[10px] mt-0.5">Top of rep range reached &check;</div>
                          </div>
                          <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-200">
                            <div className="text-amber-300 font-bold text-[10px]">NEXT SESSION DIRECTIVE</div>
                            <div className="font-bold text-white mt-0.5">105.0 kg (+2.5 kg) &bull; 6–8 Reps</div>
                            <div className="text-slate-300 text-[10px] mt-0.5">Deterministic micro-load applied</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 text-[11px] text-amber-400">
                          <span>100% Deterministic</span>
                          <span>Zero Hallucination</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-border/40 pt-3">
                      <span>Guaranteed Overload Trajectory</span>
                      <span className="text-amber-400 font-semibold font-mono">COMPLETE CYCLE &circlearrowright;</span>
                    </div>
                  </div>
                </StackingCardItem>
              </StackingCards>

              {/* Trailing scroll buffer so the final stacked deck can be viewed */}
              <div className="h-16 sm:h-24 pointer-events-none" />
            </div>
          </section>

          {/* ── Section 4: GymOS vs Generic Apps Comparison Matrix ── */}
          <section className="max-w-6xl mx-auto px-6 py-24 w-full space-y-12">
            <MotionFadeIn className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Why Lifters Switch to GymOS
              </h2>
              <p className="text-sm sm:text-base text-slate-200">
                No bloat, no subscription paywalls, no distraction. Built exclusively for athletic progression.
              </p>
            </MotionFadeIn>

            <MotionFadeIn delay={0.1} className="rounded-3xl border border-border/60 bg-[#161B26] backdrop-blur-md overflow-hidden shadow-xl">
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
            </MotionFadeIn>
          </section>

          {/* ── Section 5: Hyperdrive Call to Action (21st.dev / Dhileep Kumar GM) ── */}
          <section className="max-w-6xl mx-auto px-6 pb-24 w-full">
            <HyperdriveHero
              badgeText="Next-Generation Performance OS"
              title="Hyperdrive"
              description="Launch your strength progression at the speed of light. Deterministic progressive overload, scientific hypertrophy landmarks, and 100% data portability."
              buttonText={isLoggedIn ? "Open Dashboard" : "Engage Thrusters"}
              buttonHref={isLoggedIn ? "/dashboard" : "/register"}
            >
              {!isLoggedIn && (
                <div className="pt-3 text-xs text-gray-400">
                  <span>Already tracking? </span>
                  <Link
                    href="/login"
                    className="text-white underline underline-offset-4 hover:text-emerald-400 transition-colors font-medium"
                  >
                    Sign in to your account
                  </Link>
                </div>
              )}
            </HyperdriveHero>
          </section>
        </div>

        {/* ── 21st.dev Cinematic Motion Footer (Curtain Reveal + Parallax GSAP) ── */}
        <CinematicFooter />
      </div>
    </SmoothScrollProvider>
  );
}
