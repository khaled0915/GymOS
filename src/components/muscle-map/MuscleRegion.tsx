"use client";

import React from "react";
import type { MuscleId } from "@/domain/muscles/muscle-types";
import { getIntensityColor } from "@/domain/muscles/muscle-stimulus";

interface MuscleRegionProps {
  muscleId: MuscleId;
  label: string;
  intensity: number;
  d: string;
  isHovered?: boolean;
  isSelected?: boolean;
  onHover?: (muscleId: MuscleId | null, event?: React.MouseEvent) => void;
  onClick?: (muscleId: MuscleId) => void;
}

export const MuscleRegion: React.FC<MuscleRegionProps> = ({
  muscleId,
  label,
  intensity,
  d,
  isHovered = false,
  isSelected = false,
  onHover,
  onClick,
}) => {
  const color = getIntensityColor(intensity);

  const fill = isHovered || isSelected ? "#34D399" : color.fill;
  const stroke = isHovered || isSelected ? "#A7F3D0" : color.stroke;
  const strokeWidth = isHovered || isSelected ? 1.75 : 1;

  return (
    <path
      d={d}
      data-muscle={muscleId}
      role="button"
      tabIndex={0}
      aria-label={`${label}: ${Math.round(intensity * 100)}% stimulus`}
      className="transition-all duration-200 cursor-pointer outline-none focus:stroke-emerald-400 focus:stroke-2"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      style={{
        filter: isHovered || intensity >= 0.75 ? `drop-shadow(0 0 4px ${color.glow || "rgba(52, 211, 153, 0.4)"})` : undefined,
      }}
      onMouseEnter={(e) => onHover?.(muscleId, e)}
      onMouseLeave={() => onHover?.(null)}
      onClick={() => onClick?.(muscleId)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(muscleId);
        }
      }}
    />
  );
};
