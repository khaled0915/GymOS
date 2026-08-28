"use client";

import { useState } from "react";
import { Variants, motion } from "motion/react";
import { Button } from "@/components/originkit/ui/hero-13/button";
import FocusReveal from "@/components/originkit/ui/hero-13/focus-reveal";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

type HeroContentProps = {
  isLoggedIn?: boolean;
};

const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const FADE_UP_ITEM: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1],
    },
  },
};

export const HeroContent = ({ isLoggedIn = false }: HeroContentProps) => {
  const [headingComplete, setHeadingComplete] = useState(false);

  return (
    <div className="relative z-20 flex w-full items-center justify-center py-4">
      <div className="relative z-10 flex w-full flex-col items-center gap-6 px-4 text-center">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="h-3.5 w-3.5" /> The Athlete&apos;s Operating System
          </div>

          <FocusReveal
            as="h1"
            text="Track. Progress. Overload."
            className="w-full font-black text-[44px] leading-[1.05] tracking-[-1.5px] text-white text-balance sm:text-[68px] sm:leading-[72px] sm:tracking-[-2px] drop-shadow-md"
            staggerFrom="start"
            blur={20}
            transition={{
              type: "tween",
              duration: 0.4,
              staggerChildren: 0.04,
              ease: "easeOut",
            }}
            onComplete={() => setHeadingComplete(true)}
          />

          <motion.div
            className="flex w-full flex-col items-center gap-6"
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate={headingComplete ? "visible" : "hidden"}
          >
            <motion.p
              variants={FADE_UP_ITEM}
              className="w-full max-w-[500px] font-medium text-[16px] leading-[1.6] tracking-[-0.32px] text-white text-pretty sm:text-[18px] drop-shadow"
            >
              Intelligent workout tracking with live PR detection, progressive overload targets, automated warm-up ramp calculations, and nutrition fueling.
            </motion.p>

            <motion.div
              variants={FADE_UP_ITEM}
              className="flex w-auto flex-row items-center gap-3 pt-2"
            >
              {isLoggedIn ? (
                <Link href="/dashboard">
                  <Button variant="primary" className="font-bold px-6 bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20">
                    Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button variant="primary" className="font-bold px-6 bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20">
                      Start Training Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="secondary" className="font-bold px-5 text-white border-white/20 hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
