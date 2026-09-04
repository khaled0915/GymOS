// author: Khoa Phan <https://www.pldkhoa.dev>
// Adapted from https://21st.dev/@danielpetho/components/stacking-cards
"use client";

import {
  createContext,
  useContext,
  useRef,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type UseScrollOptions,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface StackingCardsProps
  extends PropsWithChildren,
    HTMLAttributes<HTMLDivElement> {
  scrollOptions?: UseScrollOptions;
  scaleMultiplier?: number;
  totalCards: number;
}

export interface StackingCardItemProps
  extends HTMLAttributes<HTMLDivElement>,
    PropsWithChildren {
  index: number
  topPosition?: string
}

interface StackingCardsContextValue {
  progress: MotionValue<number>;
  scaleMultiplier?: number;
  totalCards: number;
}

const StackingCardsContext = createContext<StackingCardsContextValue | null>(null);

export const useStackingCardsContext = () => {
  const context = useContext(StackingCardsContext);
  if (!context) {
    throw new Error("StackingCardItem must be used within StackingCards");
  }
  return context;
};

export default function StackingCards({
  children,
  className,
  scrollOptions,
  scaleMultiplier = 0.035,
  totalCards,
  ...props
}: StackingCardsProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    offset: ["start start", "end end"],
    ...scrollOptions,
    target: targetRef,
  });

  return (
    <StackingCardsContext.Provider
      value={{ progress: scrollYProgress, scaleMultiplier, totalCards }}
    >
      <div className={cn("relative w-full", className)} ref={targetRef} {...props}>
        {children}
      </div>
    </StackingCardsContext.Provider>
  );
}

export const StackingCardItem = ({
  index,
  topPosition,
  className,
  children,
  ...props
}: StackingCardItemProps) => {
  const { progress, scaleMultiplier, totalCards } = useStackingCardsContext();
  const safeTotal = totalCards > 0 ? totalCards : 1;
  const safeMultiplier = scaleMultiplier ?? 0.035;
  const scaleTo = 1 - (safeTotal - index) * safeMultiplier;
  const rangeScale = [index * (1 / safeTotal), 1];
  const scale = useTransform(progress, rangeScale, [1, scaleTo]);
  const top = topPosition ?? `calc(clamp(60px, 9vh, 90px) + ${index * 24}px)`;

  return (
    <div className={cn("sticky top-0 w-full", className)} {...props}>
      <motion.div
        className="origin-top relative w-full h-full transform-gpu"
        style={{ top, scale }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export { StackingCards };
