"use client";

import Image from "next/image";
import { Dumbbell, Sparkles } from "lucide-react";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

export interface AthleteExercise {
  title: string;
  muscle: string;
  muscleDetail: string;
  equipment: string;
  tag: string;
  image: string;
  metric: string;
  accentColor: string;
}

const ATHLETE_EXERCISES: AthleteExercise[] = [
  {
    title: "Barbell Back Squat",
    muscle: "LEGS",
    muscleDetail: "Quadriceps & Gluteal Complex",
    equipment: "Olympic Barbell",
    tag: "Compound Core",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop",
    metric: "Target: 6–8 Reps • RPE 8.0",
    accentColor: "emerald",
  },
  {
    title: "Competition Bench Press",
    muscle: "CHEST",
    muscleDetail: "Pectoralis Major & Triceps",
    equipment: "Olympic Barbell",
    tag: "Upper Push",
    image: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?q=80&w=800&auto=format&fit=crop",
    metric: "Overload: +2.5 kg Next Session",
    accentColor: "blue",
  },
  {
    title: "Conventional Deadlift",
    muscle: "POSTERIOR",
    muscleDetail: "Hamstrings, Erector & Lats",
    equipment: "Olympic Barbell",
    tag: "Posterior Chain",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
    metric: "E1RM Record: 185.0 kg",
    accentColor: "purple",
  },
  {
    title: "Standing Overhead Press",
    muscle: "SHOULDERS",
    muscleDetail: "Anterior Delts & Upper Traps",
    equipment: "Olympic Barbell",
    tag: "Vertical Push",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop",
    metric: "Micro-Load: +1.25 kg",
    accentColor: "cyan",
  },
  {
    title: "Weighted Pull-Up",
    muscle: "BACK",
    muscleDetail: "Latissimus Dorsi & Brachialis",
    equipment: "Belt & Plate",
    tag: "Vertical Pull",
    image: "https://images.unsplash.com/photo-1584863265045-f9d10ca7fa61?q=80&w=800&auto=format&fit=crop",
    metric: "Load: Bodyweight + 25 kg",
    accentColor: "emerald",
  },
  {
    title: "Incline Dumbbell Press",
    muscle: "CHEST",
    muscleDetail: "Clavicular Head & Front Delts",
    equipment: "Heavy Dumbbells",
    tag: "Hypertrophy Vector",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
    metric: "Optimal: 8–12 Reps @ RPE 8.5",
    accentColor: "amber",
  },
  {
    title: "Barbell Romanian Deadlift",
    muscle: "HAMSTRINGS",
    muscleDetail: "Hamstrings & Gluteus Max",
    equipment: "Olympic Barbell",
    tag: "Stretch Hypertrophy",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800&auto=format&fit=crop",
    metric: "Tempo: 3-0-1 Eccentric",
    accentColor: "rose",
  },
  {
    title: "Arm Hypertrophy & Curls",
    muscle: "ARMS",
    muscleDetail: "Biceps Brachii & Forearms",
    equipment: "Cambered Bar",
    tag: "Direct Isolation",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=800&auto=format&fit=crop",
    metric: "10–20 Set Hypertrophy Landmark",
    accentColor: "emerald",
  },
];

export function AthleteExerciseSlider() {
  return (
    <section className="py-20 border-t border-border/40 bg-[#080B0F] relative overflow-hidden space-y-10">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 text-center space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Dumbbell className="h-3.5 w-3.5" /> 300+ Calibrated Movements
        </div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Engineered For Every Movement Vector
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          From high-load compound power lifts to precision hypertrophy isolation, GymOS delivers deterministic progressive overload across every muscle group.
        </p>
      </div>

      {/* 21st.dev Infinite Slider Container */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Smooth Edge Fade Masks */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-36 z-20 bg-gradient-to-r from-[#080B0F] via-[#080B0F]/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-36 z-20 bg-gradient-to-l from-[#080B0F] via-[#080B0F]/80 to-transparent" />

        {/* Infinite Horizontal Slider */}
        <InfiniteSlider
          gap={24}
          duration={40}
          durationOnHover={90}
          direction="horizontal"
          className="py-4"
        >
          {ATHLETE_EXERCISES.map((item, idx) => (
            <div
              key={idx}
              className="relative w-[280px] sm:w-[320px] h-[380px] sm:h-[420px] rounded-3xl overflow-hidden group shrink-0 border border-border/70 hover:border-emerald-500/60 transition-all duration-500 shadow-2xl bg-[#12161F]"
            >
              {/* Background Athlete Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-[0.82] group-hover:brightness-95"
              />

              {/* Multi-layer Gradient Overlay for maximum readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />

              {/* Card Content Overlay */}
              <div className="relative z-20 h-full p-6 flex flex-col justify-between">
                {/* Top Row: Muscle & Movement Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-black tracking-wider text-emerald-300 uppercase">
                    {item.muscle}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-semibold text-slate-300">
                    {item.tag}
                  </span>
                </div>

                {/* Bottom Row: Exercise Details & Overload Target */}
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      {item.muscleDetail} &bull; {item.equipment}
                    </p>
                  </div>

                  {/* Overload Target Pill */}
                  <div className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-emerald-400" /> {item.metric}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}

export default AthleteExerciseSlider;
