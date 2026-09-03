"use client";

import React from "react";
import type { MuscleId } from "@/domain/muscles/muscle-types";
import { MuscleRegion } from "./MuscleRegion";

interface FrontBodyMapProps {
  intensities: Record<MuscleId, number>;
  hoveredMuscle: MuscleId | null;
  selectedMuscle: MuscleId | null;
  onHover: (muscleId: MuscleId | null, event?: React.MouseEvent) => void;
  onClick: (muscleId: MuscleId) => void;
}

export const FrontBodyMap: React.FC<FrontBodyMapProps> = ({
  intensities,
  hoveredMuscle,
  selectedMuscle,
  onHover,
  onClick,
}) => {
  const getInt = (m: MuscleId) => intensities[m] || 0;

  return (
    <svg
      viewBox="0 0 200 400"
      className="w-full h-auto max-h-[360px] select-none drop-shadow-md"
      aria-label="Anatomical Front Body Muscle Map"
    >
      {/* ── Neutral Base Silhouette / Contours ── */}
      <g className="fill-[#0D121B] stroke-[#1F293D] stroke-[1.2]" strokeLinejoin="round">
        {/* Head & Neck */}
        <circle cx="100" cy="22" r="14" />
        <path d="M92 34 L92 48 L108 48 L108 34 Z" />
        {/* Hands & Feet outlines */}
        <path d="M26 182 Q20 202 24 212 Q28 214 34 200 L36 182 Z" />
        <path d="M174 182 Q180 202 176 212 Q172 214 166 200 L164 182 Z" />
        <path d="M68 368 L66 384 Q65 390 76 390 Q85 390 84 384 L84 368 Z" />
        <path d="M132 368 L134 384 Q135 390 124 390 Q115 390 116 384 L116 368 Z" />
      </g>

      {/* ── Front Deltoids (Shoulders) ── */}
      {/* Left Front Delt */}
      <MuscleRegion
        muscleId="front_delts"
        label="Front Deltoids"
        intensity={getInt("front_delts")}
        d="M68 48 C56 50 46 60 46 72 C46 80 52 86 60 88 C64 80 66 65 70 52 Z"
        isHovered={hoveredMuscle === "front_delts"}
        isSelected={selectedMuscle === "front_delts"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Front Delt */}
      <MuscleRegion
        muscleId="front_delts"
        label="Front Deltoids"
        intensity={getInt("front_delts")}
        d="M132 48 C144 50 154 60 154 72 C154 80 148 86 140 88 C136 80 134 65 130 52 Z"
        isHovered={hoveredMuscle === "front_delts"}
        isSelected={selectedMuscle === "front_delts"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Chest (Pectorals) ── */}
      {/* Left Pec */}
      <MuscleRegion
        muscleId="chest"
        label="Chest (Pectorals)"
        intensity={getInt("chest")}
        d="M72 52 C84 50 96 52 98 55 L98 94 C88 95 72 94 65 84 C62 74 65 60 72 52 Z"
        isHovered={hoveredMuscle === "chest"}
        isSelected={selectedMuscle === "chest"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Pec */}
      <MuscleRegion
        muscleId="chest"
        label="Chest (Pectorals)"
        intensity={getInt("chest")}
        d="M128 52 C116 50 104 52 102 55 L102 94 C112 95 128 94 135 84 C138 74 135 60 128 52 Z"
        isHovered={hoveredMuscle === "chest"}
        isSelected={selectedMuscle === "chest"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Biceps ── */}
      {/* Left Bicep */}
      <MuscleRegion
        muscleId="biceps"
        label="Biceps"
        intensity={getInt("biceps")}
        d="M45 74 C40 86 38 108 42 124 C48 126 55 122 57 114 C59 100 58 86 56 74 Z"
        isHovered={hoveredMuscle === "biceps"}
        isSelected={selectedMuscle === "biceps"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Bicep */}
      <MuscleRegion
        muscleId="biceps"
        label="Biceps"
        intensity={getInt("biceps")}
        d="M155 74 C160 86 162 108 158 124 C152 126 145 122 143 114 C141 100 142 86 144 74 Z"
        isHovered={hoveredMuscle === "biceps"}
        isSelected={selectedMuscle === "biceps"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Forearms ── */}
      {/* Left Forearm */}
      <MuscleRegion
        muscleId="forearms"
        label="Forearms"
        intensity={getInt("forearms")}
        d="M40 128 C34 142 28 162 28 178 C34 182 44 180 48 170 C52 156 54 140 52 128 Z"
        isHovered={hoveredMuscle === "forearms"}
        isSelected={selectedMuscle === "forearms"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Forearm */}
      <MuscleRegion
        muscleId="forearms"
        label="Forearms"
        intensity={getInt("forearms")}
        d="M160 128 C166 142 172 162 172 178 C166 182 156 180 152 170 C148 156 146 140 148 128 Z"
        isHovered={hoveredMuscle === "forearms"}
        isSelected={selectedMuscle === "forearms"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Abdominals (Rectus Abdominis) ── */}
      <MuscleRegion
        muscleId="abs"
        label="Abdominals"
        intensity={getInt("abs")}
        d="M86 98 L114 98 C117 115 116 142 114 164 L86 164 C84 142 83 115 86 98 Z"
        isHovered={hoveredMuscle === "abs"}
        isSelected={selectedMuscle === "abs"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Obliques ── */}
      {/* Left Oblique */}
      <MuscleRegion
        muscleId="obliques"
        label="Obliques"
        intensity={getInt("obliques")}
        d="M68 96 C72 110 74 135 78 162 C82 164 85 164 85 158 C82 135 80 110 82 98 C76 96 72 96 68 96 Z"
        isHovered={hoveredMuscle === "obliques"}
        isSelected={selectedMuscle === "obliques"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Oblique */}
      <MuscleRegion
        muscleId="obliques"
        label="Obliques"
        intensity={getInt("obliques")}
        d="M132 96 C128 110 126 135 122 162 C118 164 115 164 115 158 C118 135 120 110 118 98 C124 96 128 96 132 96 Z"
        isHovered={hoveredMuscle === "obliques"}
        isSelected={selectedMuscle === "obliques"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Quadriceps ── */}
      {/* Left Quad */}
      <MuscleRegion
        muscleId="quads"
        label="Quadriceps"
        intensity={getInt("quads")}
        d="M65 174 C60 200 58 245 66 274 C75 278 88 276 92 268 C96 242 96 200 94 174 Z"
        isHovered={hoveredMuscle === "quads"}
        isSelected={selectedMuscle === "quads"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Quad */}
      <MuscleRegion
        muscleId="quads"
        label="Quadriceps"
        intensity={getInt("quads")}
        d="M135 174 C140 200 142 245 134 274 C125 278 112 276 108 268 C104 242 104 200 106 174 Z"
        isHovered={hoveredMuscle === "quads"}
        isSelected={selectedMuscle === "quads"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Calves (Anterior/Shin) ── */}
      {/* Left Calf */}
      <MuscleRegion
        muscleId="calves"
        label="Calves"
        intensity={getInt("calves")}
        d="M67 282 C64 305 65 338 72 364 C78 366 84 364 85 352 C87 330 86 305 84 282 Z"
        isHovered={hoveredMuscle === "calves"}
        isSelected={selectedMuscle === "calves"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Calf */}
      <MuscleRegion
        muscleId="calves"
        label="Calves"
        intensity={getInt("calves")}
        d="M133 282 C136 305 135 338 128 364 C122 366 116 364 115 352 C113 330 114 305 116 282 Z"
        isHovered={hoveredMuscle === "calves"}
        isSelected={selectedMuscle === "calves"}
        onHover={onHover}
        onClick={onClick}
      />
    </svg>
  );
};
