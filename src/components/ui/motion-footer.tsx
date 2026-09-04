"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import {
  Dumbbell,
  Zap,
  ArrowUp,
  Heart,
  ChevronRight,
} from "lucide-react";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  /* Dynamic Variables using standard shadcn/tailwind tokens */
  --pill-bg-1: color-mix(in srgb, hsl(var(--foreground)) 4%, transparent);
  --pill-bg-2: color-mix(in srgb, hsl(var(--foreground)) 1%, transparent);
  --pill-shadow: rgba(0, 0, 0, 0.5);
  --pill-highlight: color-mix(in srgb, hsl(var(--foreground)) 10%, transparent);
  --pill-inset-shadow: rgba(0, 0, 0, 0.8);
  --pill-border: color-mix(in srgb, hsl(var(--foreground)) 10%, transparent);
  
  --pill-bg-1-hover: color-mix(in srgb, hsl(var(--foreground)) 8%, transparent);
  --pill-bg-2-hover: color-mix(in srgb, hsl(var(--foreground)) 3%, transparent);
  --pill-border-hover: color-mix(in srgb, hsl(var(--primary, 142 76% 36%)) 45%, transparent);
  --pill-shadow-hover: rgba(0, 0, 0, 0.7);
  --pill-highlight-hover: color-mix(in srgb, hsl(var(--foreground)) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.9; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in srgb, hsl(var(--destructive)) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in srgb, hsl(var(--destructive)) 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, color-mix(in srgb, hsl(var(--foreground)) 4%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, hsl(var(--foreground)) 4%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow with GymOS Emerald Hue */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    color-mix(in srgb, hsl(var(--primary, 142 76% 36%)) 22%, transparent) 0%, 
    color-mix(in srgb, hsl(var(--secondary, 217 33% 18%)) 15%, transparent) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: hsl(var(--foreground));
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 24vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, hsl(var(--foreground)) 8%, transparent);
  background: linear-gradient(180deg, color-mix(in srgb, hsl(var(--foreground)) 12%, transparent) 0%, transparent 65%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, hsl(var(--foreground)) 0%, color-mix(in srgb, hsl(var(--foreground)) 50%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 25px color-mix(in srgb, hsl(var(--primary, 142 76% 36%)) 25%, transparent));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE (Zero Dependency, Strict TypeScript)
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", href, ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    // Internal Next.js navigation vs generic element
    if (href && (href.startsWith("/") || href.startsWith("#"))) {
      return (
        <Link
          ref={(node) => {
            localRef.current = node;
            if (typeof forwardedRef === "function") {
              forwardedRef(node);
            } else if (forwardedRef) {
              (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
            }
          }}
          href={href}
          className={cn("cursor-pointer select-none", className)}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
          } else if (forwardedRef) {
            (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        }}
        className={cn("cursor-pointer select-none", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. TYPES & PROPS
// -------------------------------------------------------------------------
export interface CinematicFooterAction {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface CinematicFooterLink {
  label: string;
  href: string;
}

export interface CinematicFooterProps {
  giantText?: string;
  heading?: string;
  marqueeItems?: string[];
  primaryActions?: CinematicFooterAction[];
  secondaryLinks?: CinematicFooterLink[];
  copyright?: string;
  craftedBy?: string;
  className?: string;
}

// -------------------------------------------------------------------------
// 4. MARQUEE ITEM
// -------------------------------------------------------------------------
const MarqueeList = ({ items }: { items: string[] }) => (
  <div className="flex items-center space-x-10 px-6">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <span>{item}</span>
        <span className="text-emerald-400 font-bold">✦</span>
      </React.Fragment>
    ))}
  </div>
);

// -------------------------------------------------------------------------
// 5. MAIN CINEMATIC FOOTER COMPONENT
// -------------------------------------------------------------------------
export function CinematicFooter({
  giantText = "GYMOS",
  heading = "Ready to Overload?",
  marqueeItems = [
    "Plan · Train · Log · Overload",
    "Deterministic Progressive Math",
    "0.0s Fast Logging Flow",
    "Hypertrophy Landmark Tracking",
    "1RM Multi-Formula Science",
    "100% Athlete Data Portability",
  ],
  primaryActions = [
    {
      label: "Open Athlete Dashboard",
      href: "/dashboard",
      icon: <Dumbbell className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />,
    },
    {
      label: "Launch Workout Logger",
      href: "/workouts",
      icon: <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />,
    },
  ],
  secondaryLinks = [
    { label: "Exercise Library", href: "/exercises" },
    { label: "1RM Calculator", href: "/calculator" },
    { label: "AI Coach", href: "/coach" },
    { label: "Nutrition & Fueling", href: "/nutrition" },
    { label: "Analytics & PRs", href: "/analytics" },
  ],
  copyright,
  craftedBy = "GymOS Core",
  className,
}: CinematicFooterProps) {
  const currentYear = new Date().getFullYear();
  const displayCopyright = copyright ?? ("\u00A9 " + currentYear + " GymOS. All rights reserved.");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    // React strict mode compatible GSAP context cleanup
    const ctx = gsap.context(() => {
      // Background Parallax
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      // Staggered Content Reveal
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* 
        The "Curtain Reveal" Wrapper:
        It sits in standard flow. Because it has clip-path, its contents
        are ONLY visible within its bounding box. 
      */}
      <div
        ref={wrapperRef}
        className={cn("relative min-h-[90vh] md:h-screen w-full", className)}
        style={{
          clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
          WebkitClipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
        }}
      >
        {/* The actual footer stays fixed to the viewport underneath everything */}
        <footer className="fixed bottom-0 left-0 flex min-h-[90vh] md:h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground cinematic-footer-wrapper">
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none tracking-tighter uppercase font-black"
          >
            {giantText}
          </div>

          {/* 1. Diagonal Sleek Marquee (Top of footer) */}
          <div className="absolute top-6 sm:top-10 md:top-12 left-0 w-full overflow-hidden border-y border-border/50 bg-background/70 backdrop-blur-md py-3 sm:py-4 z-10 -rotate-2 scale-105 sm:scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-[11px] sm:text-xs md:text-sm font-black tracking-[0.25em] text-muted-foreground uppercase">
              <MarqueeList items={marqueeItems} />
              <MarqueeList items={marqueeItems} />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 sm:px-6 mt-20 sm:mt-24 md:mt-20 w-full max-w-5xl mx-auto text-center">
            <h2
              ref={headingRef}
              className="text-4xl sm:text-6xl md:text-8xl font-black footer-text-glow tracking-tighter mb-8 sm:mb-12 text-center"
            >
              {heading}
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-4 sm:gap-6 w-full">
              {/* Primary Action Links */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
                {primaryActions.map((action, idx) => (
                  <MagneticButton
                    key={idx}
                    href={action.href}
                    className="footer-glass-pill px-6 sm:px-10 py-3.5 sm:py-5 rounded-full text-foreground font-black text-xs sm:text-sm md:text-base flex items-center gap-2.5 sm:gap-3 group border-emerald-500/20 hover:border-emerald-500/50"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </MagneticButton>
                ))}
              </div>

              {/* Secondary Navigation Links */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 w-full mt-2">
                {secondaryLinks.map((link, idx) => (
                  <MagneticButton
                    key={idx}
                    href={link.href}
                    className="footer-glass-pill px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-muted-foreground font-medium text-xs sm:text-sm hover:text-foreground hover:border-border/80"
                  >
                    {link.label}
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-6 sm:pb-8 px-4 sm:px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Copyright */}
            <div className="text-muted-foreground text-[10px] sm:text-xs font-semibold tracking-widest uppercase order-2 md:order-1 text-center md:text-left">
              {displayCopyright}
            </div>

            {/* Crafted for Performance Badge */}
            <div className="footer-glass-pill px-5 sm:px-6 py-2.5 sm:py-3 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-border/50">
              <span className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                Engineered with
              </span>
              <Heart className="w-3.5 h-3.5 text-emerald-400 animate-footer-heartbeat fill-emerald-400" />
              <span className="text-muted-foreground text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                by
              </span>
              <span className="text-foreground font-black text-xs sm:text-sm tracking-tight ml-0.5">
                {craftedBy}
              </span>
            </div>

            {/* Back to top button */}
            <MagneticButton
              onClick={scrollToTop}
              aria-label="Back to top"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground group order-3"
            >
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-y-1 transition-transform duration-300 text-emerald-400" />
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
