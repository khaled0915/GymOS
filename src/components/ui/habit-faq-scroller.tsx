"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqRow {
  id: string;
  speed?: string;
  direction?: "left" | "right";
  faqItems: FaqItem[];
}

export interface FaqData {
  mainTitle: string;
  mainSubtitle: string;
  rows: FaqRow[];
}

export interface FaqCardProps {
  question: string;
  answer: string;
  className?: string;
}

export interface HorizontalScrollerProps {
  children: React.ReactNode;
  speed?: string;
  direction?: "left" | "right";
  className?: string;
}

export interface FaqSectionProps {
  data: FaqData;
  className?: string;
}

/**
 * FaqCard
 * Reusable card for a single FAQ item.
 */
export const FaqCard: React.FC<FaqCardProps> = ({ question, answer, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3.5 p-6 bg-[#12161F]/90 backdrop-blur-md border border-border/60 rounded-2xl shadow-xl w-80 sm:w-96 flex-shrink-0 hover:border-emerald-500/40 transition-all group/card faq-card",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
        <h3 className="text-base sm:text-lg font-bold text-white group-hover/card:text-emerald-300 transition-colors line-clamp-2 faq-title">
          {question}
        </h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal line-clamp-4 faq-answer">
        {answer}
      </p>
    </div>
  );
};

/**
 * HorizontalScroller
 * Wraps children and creates a seamless horizontal looping animation.
 */
export const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  children,
  speed = "40s",
  direction = "left",
  className,
}) => {
  const animationClass =
    direction === "right"
      ? "animate-scroll-horizontal-reverse"
      : "animate-scroll-horizontal";

  // Inline style to set the CSS custom property for scroll duration.
  const style = { "--scroll-duration": speed } as React.CSSProperties;

  return (
    <div className={cn("w-full overflow-hidden group relative scroller-mask", className)}>
      <div
        className={cn("flex group-hover:[animation-play-state:paused]", animationClass)}
        style={style}
      >
        <div className="flex items-stretch justify-center flex-shrink-0 gap-6 sm:gap-8 px-4">
          {children}
        </div>
        {/* duplicate for seamless loop */}
        <div
          className="flex items-stretch justify-center flex-shrink-0 gap-6 sm:gap-8 px-4"
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * FaqSection
 * Assembles title, subtitle, and multiple horizontal rows.
 */
export const FaqSection: React.FC<FaqSectionProps> = ({ data, className }) => {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-10 sm:gap-12 py-12 sm:py-16 w-full max-w-7xl mx-auto overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col items-center gap-3 text-center z-10 max-w-2xl px-6">
        <h2
          className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight"
          
        >
          {data.mainTitle}
        </h2>
        <p
          className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal"
          
        >
          {data.mainSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 z-10 w-full">
        {data.rows.map((row) => (
          <HorizontalScroller key={row.id} speed={row.speed} direction={row.direction}>
            {row.faqItems.map((item) => (
              <FaqCard key={item.id} question={item.question} answer={item.answer} />
            ))}
          </HorizontalScroller>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
