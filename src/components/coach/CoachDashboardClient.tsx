"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { generateProgramAction } from "@/actions/coach.actions";
import {
  Sparkles,
  Flame,
  Dumbbell,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Wand2,
  Send,
  Bot,
  AlertTriangle,
  Scale,
  Mic,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { CoachInsights } from "@/domain/coach";

interface CoachDashboardProps {
  insights: CoachInsights;
  userProfile: { name: string; fitnessGoal: string; weeklyFrequency: number };
}

interface ChatMessage {
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export function CoachDashboardClient({
  insights,
  userProfile,
}: CoachDashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Generator Options
  const [goal, setGoal] = useState<"MUSCLE_GAIN" | "FAT_LOSS" | "STRENGTH" | "GENERAL_FITNESS">("MUSCLE_GAIN");
  const [frequency, setFrequency] = useState<3 | 4 | 5 | 6>(5);
  const [equipment, setEquipment] = useState<"FULL_GYM" | "DUMBBELLS" | "BODYWEIGHT">("FULL_GYM");
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  // Conversational Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "coach",
      text: "Hello Alex! I am Coach Antigravity. I analyzed your recent lifting logs and volume distribution. How can I help fine-tune your training today?",
      timestamp: "Just now",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");

    // Simulated Smart Coach responses
    setTimeout(() => {
      let replyText = "Based on your progressive overload trend, your recovery is optimal. Keep adding weight when you hit the top rep bracket.";
      if (text.toLowerCase().includes("plateau") || text.toLowerCase().includes("bench")) {
        replyText = "Looking at your last 3 workouts, your RPE reached 9.5 and rep velocity dropped. Here is your breakthrough plan: 1. Deload next session (-10% weight) and focus on explosive speed. 2. Add Close-Grip Incline Press as an accessory to build tricep lockout. 3. Volume Check: You're at 16 sets/week for chest (optimal zone).";
      } else if (text.toLowerCase().includes("balance") || text.toLowerCase().includes("ratio")) {
        replyText = `Your Upper vs. Lower Volume ratio is currently ${insights.muscleBalance.balanceRatio}. ${insights.muscleBalance.advice}`;
      } else if (text.toLowerCase().includes("calorie") || text.toLowerCase().includes("surplus")) {
        replyText = "For maximum muscle hypertrophy with minimal fat gain, aim for a conservative +250 to +350 kcal surplus above your TDEE with 2.0g protein per kg of bodyweight.";
      }

      const coachMsg: ChatMessage = {
        sender: "coach",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, coachMsg]);
    }, 600);
  };

  const handleGenerate = () => {
    startTransition(async () => {
      const res = await generateProgramAction({
        goal,
        frequencyDays: frequency,
        equipment,
      });

      if (res.success) {
        setGeneratedSuccess(true);
        setTimeout(() => {
          router.push("/programs");
        }, 1200);
      }
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ── Top Header Banner ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#12161F]/90 via-[#0A0D12]/90 to-[#12161F]/90 border border-border/40 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-emerald-400" /> AI Coach &amp; Routine Architect
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Real-time plateau intelligence, volume balance ratios, and adaptive program generation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 font-bold">
            <Bot className="h-3.5 w-3.5 mr-1" /> Coach Antigravity Online
          </Badge>
        </div>
      </div>

      {/* ── 2-Column Split: 50% Left Coach Chat / 50% Right Program Architect ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── LEFT COLUMN (6 Cols ~ 50%) Interactive AI Coach Chat ── */}
        <div className="lg:col-span-6 flex flex-col h-[640px] rounded-2xl border border-border/60 bg-[#12161F]/80 backdrop-blur-md overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-border/40 bg-[#0A0D12]/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sparkles className="h-5 w-5" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#12161F]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Coach Antigravity</h3>
                <p className="text-[10px] text-emerald-400 font-semibold">Analyzing Personal Lifting Data</p>
              </div>
            </div>

            <Badge variant="secondary" className="text-[10px] font-mono">
              GPT-4 / Gemini Powered
            </Badge>
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs no-scrollbar">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "coach" && (
                  <div className="h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl leading-relaxed ${
                    m.sender === "user"
                      ? "bg-emerald-500 text-black font-semibold rounded-tr-none"
                      : "bg-[#0A0D12]/90 border border-border/50 text-white rounded-tl-none space-y-1.5"
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block ${m.sender === "user" ? "text-black/70" : "text-muted-foreground"}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Suggestion Chips */}
          <div className="px-4 py-2 border-t border-border/30 bg-[#0A0D12]/30 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              "Analyze my Bench Press plateau",
              "Check Upper/Lower ratio",
              "Suggest Deload Plan",
              "Calculate Calorie Surplus",
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-emerald-500/15 border border-border/40 hover:border-emerald-500/40 text-muted-foreground hover:text-emerald-400 text-[10px] font-semibold whitespace-nowrap transition-all"
              >
                + {chip}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-border/40 bg-[#0A0D12]/80 flex items-center gap-2">
            <Input
              placeholder="Ask Coach Antigravity about overload, nutrition, or splits..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="h-10 text-xs bg-[#12161F] border-border/60 focus:border-emerald-400"
            />
            <Button
              onClick={() => handleSendMessage()}
              size="sm"
              variant="athletic"
              className="h-10 px-4 font-bold bg-emerald-500 hover:bg-emerald-400 text-black"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── RIGHT COLUMN (6 Cols ~ 50%) Program Architect & Biometric Recovery ── */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card 1: AI Workout Program Generator */}
          <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/80 backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Workout Program Generator</h3>
              </div>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                Deterministic Engine
              </Badge>
            </div>

            {/* Goal Selectors */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Primary Goal</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "MUSCLE_GAIN", label: "Hypertrophy" },
                  { id: "STRENGTH", label: "Strength" },
                  { id: "FAT_LOSS", label: "Fat Loss" },
                  { id: "GENERAL_FITNESS", label: "Fitness" },
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setGoal(g.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      goal === g.id
                        ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-sm"
                        : "bg-card/40 border-border/40 text-muted-foreground hover:text-white"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency Selectors */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Weekly Frequency</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { days: 3, label: "3-Day Full Body" },
                  { days: 4, label: "4-Day Upper/Lower" },
                  { days: 5, label: "5-Day PPL" },
                  { days: 6, label: "6-Day Arnold" },
                ].map((f) => (
                  <button
                    key={f.days}
                    onClick={() => setFrequency(f.days as any)}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                      frequency === f.days
                        ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-sm"
                        : "bg-card/40 border-border/40 text-muted-foreground hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Routine Structure Preview */}
            <div className="p-3.5 rounded-xl bg-[#0A0D12]/70 border border-border/40 space-y-2 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Generated {frequency}-Day Split Routine Preview:
              </p>
              <div className="space-y-1 text-muted-foreground">
                <p className="text-white font-medium">• Day 1: Push Hypertrophy (Chest, Shoulders, Triceps - 6 Exercises)</p>
                <p className="text-white font-medium">• Day 2: Pull Hypertrophy (Back, Rear Delts, Biceps - 6 Exercises)</p>
                <p className="text-white font-medium">• Day 3: Legs &amp; Core (Quads, Hamstrings, Calves - 6 Exercises)</p>
                {frequency >= 4 && <p className="text-white font-medium">• Day 4: Upper Power (Heavy Compound Pressing &amp; Rows)</p>}
                {frequency >= 5 && <p className="text-white font-medium">• Day 5: Lower Power (Heavy Squats &amp; Deadlifts)</p>}
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              variant="athletic"
              disabled={isPending}
              className="w-full h-11 font-bold text-black bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 text-sm"
            >
              {isPending ? (
                "Building Program in Database…"
              ) : generatedSuccess ? (
                <span className="flex items-center text-black font-bold">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Assigned to Schedule!
                </span>
              ) : (
                <span className="flex items-center">
                  <Zap className="mr-2 h-4 w-4 fill-current" /> Save &amp; Assign to My Schedule
                </span>
              )}
            </Button>
          </div>

          {/* Card 2: Biometric Recovery & Muscle Readiness Heatmap */}
          <div className="p-6 rounded-2xl border border-border/60 bg-[#12161F]/80 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Muscle Recovery &amp; Readiness</h3>
              </div>
              <span className="text-xs text-muted-foreground font-mono">24h Adaptive Model</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { name: "Chest", recovery: 90, status: "Ready to Train", color: "from-emerald-500 to-cyan-400" },
                { name: "Shoulders", recovery: 85, status: "Ready to Train", color: "from-emerald-500 to-cyan-400" },
                { name: "Back", recovery: 45, status: "Recovering (48h)", color: "from-amber-500 to-yellow-400" },
                { name: "Quads & Hamstrings", recovery: 30, status: "Fatigued (Heavy Leg Day)", color: "from-rose-500 to-orange-400" },
              ].map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white">{m.name}</span>
                    <span className="text-muted-foreground font-mono">{m.recovery}% ({m.status})</span>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${m.color} rounded-full transition-all duration-500`}
                      style={{ width: `${m.recovery}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-border/40">
              <span className="text-muted-foreground">Upper vs. Lower Volume Ratio:</span>
              <strong className="text-emerald-400 font-mono">{insights.muscleBalance.balanceRatio} (Optimal Symmetry)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
