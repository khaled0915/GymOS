"use client";

import React from "react";
import type { MuscleId } from "@/domain/muscles/muscle-types";
import { MuscleRegion } from "./MuscleRegion";

interface BackBodyMapProps {
  intensities: Record<MuscleId, number>;
  hoveredMuscle: MuscleId | null;
  selectedMuscle: MuscleId | null;
  onHover: (muscleId: MuscleId | null, event?: React.MouseEvent) => void;
  onClick: (muscleId: MuscleId) => void;
}

export const BackBodyMap: React.FC<BackBodyMapProps> = ({
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
      aria-label="Anatomical Back Body Muscle Map"
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

      {/* ── Trapezius ── */}
      <MuscleRegion
        muscleId="traps"
        label="Trapezius"
        intensity={getInt("traps")}
        d="M92 46 L82 52 C74 54 70 56 68 58 L78 68 C88 78 100 84 100 84 C100 84 112 78 122 68 L132 58 C130 56 126 54 118 52 L108 46 Z"
        isHovered={hoveredMuscle === "traps"}
        isSelected={selectedMuscle === "traps"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Rear Deltoids ── */}
      {/* Left Rear Delt */}
      <MuscleRegion
        muscleId="rear_delts"
        label="Rear Deltoids"
        intensity={getInt("rear_delts")}
        d="M66 56 C54 58 45 68 45 78 C45 84 50 88 58 88 C62 82 66 72 68 62 Z"
        isHovered={hoveredMuscle === "rear_delts"}
        isSelected={selectedMuscle === "rear_delts"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Rear Delt */}
      <MuscleRegion
        muscleId="rear_delts"
        label="Rear Deltoids"
        intensity={getInt("rear_delts")}
        d="M134 56 C146 58 155 68 155 78 C155 84 150 88 142 88 C138 82 134 72 132 62 Z"
        isHovered={hoveredMuscle === "rear_delts"}
        isSelected={selectedMuscle === "rear_delts"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Upper Back / Rhomboids ── */}
      <MuscleRegion
        muscleId="upper_back"
        label="Upper Back & Rhomboids"
        intensity={getInt("upper_back")}
        d="M78 70 C88 80 100 84 100 84 C100 84 112 80 122 70 L124 105 C116 112 100 115 100 115 C100 115 84 112 76 105 Z"
        isHovered={hoveredMuscle === "upper_back"}
        isSelected={selectedMuscle === "upper_back"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Latissimus Dorsi (Lats) ── */}
      {/* Left Lat */}
      <MuscleRegion
        muscleId="lats"
        label="Latissimus Dorsi"
        intensity={getInt("lats")}
        d="M68 88 C64 102 62 126 66 148 C76 150 84 144 86 138 C86 118 84 100 78 88 Z"
        isHovered={hoveredMuscle === "lats"}
        isSelected={selectedMuscle === "lats"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Lat */}
      <MuscleRegion
        muscleId="lats"
        label="Latissimus Dorsi"
        intensity={getInt("lats")}
        d="M132 88 C136 102 138 126 134 148 C124 150 116 144 114 138 C114 118 116 100 122 88 Z"
        isHovered={hoveredMuscle === "lats"}
        isSelected={selectedMuscle === "lats"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Triceps ── */}
      {/* Left Tricep */}
      <MuscleRegion
        muscleId="triceps"
        label="Triceps"
        intensity={getInt("triceps")}
        d="M44 80 C38 92 36 112 40 126 C46 128 53 124 55 116 C57 104 56 90 54 80 Z"
        isHovered={hoveredMuscle === "triceps"}
        isSelected={selectedMuscle === "triceps"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Tricep */}
      <MuscleRegion
        muscleId="triceps"
        label="Triceps"
        intensity={getInt("triceps")}
        d="M156 80 C162 92 164 112 160 126 C154 128 147 124 145 116 C143 104 144 90 146 80 Z"
        isHovered={hoveredMuscle === "triceps"}
        isSelected={selectedMuscle === "triceps"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Forearms ── */}
      {/* Left Forearm */}
      <MuscleRegion
        muscleId="forearms"
        label="Forearms"
        intensity={getInt("forearms")}
        d="M38 130 C32 144 26 164 26 180 C32 184 42 182 46 172 C50 158 52 142 50 130 Z"
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
        d="M162 130 C168 144 174 164 174 180 C168 184 158 182 154 172 C150 158 148 142 150 130 Z"
        isHovered={hoveredMuscle === "forearms"}
        isSelected={selectedMuscle === "forearms"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Lower Back (Erectors) ── */}
      <MuscleRegion
        muscleId="lower_back"
        label="Lower Back (Erectors)"
        intensity={getInt("lower_back")}
        d="M84 115 L116 115 C118 134 116 156 114 174 L86 174 C84 156 82 134 84 115 Z"
        isHovered={hoveredMuscle === "lower_back"}
        isSelected={selectedMuscle === "lower_back"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Glutes ── */}
      {/* Left Glute */}
      <MuscleRegion
        muscleId="glutes"
        label="Glutes"
        intensity={getInt("glutes")}
        d="M62 178 C60 200 68 226 98 228 L98 178 Z"
        isHovered={hoveredMuscle === "glutes"}
        isSelected={selectedMuscle === "glutes"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Glute */}
      <MuscleRegion
        muscleId="glutes"
        label="Glutes"
        intensity={getInt("glutes")}
        d="M138 178 C140 200 132 226 102 228 L102 178 Z"
        isHovered={hoveredMuscle === "glutes"}
        isSelected={selectedMuscle === "glutes"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Hamstrings ── */}
      {/* Left Hamstring */}
      <MuscleRegion
        muscleId="hamstrings"
        label="Hamstrings"
        intensity={getInt("hamstrings")}
        d="M64 232 C62 255 64 275 70 288 C80 290 92 288 96 280 C98 260 98 245 96 232 Z"
        isHovered={hoveredMuscle === "hamstrings"}
        isSelected={selectedMuscle === "hamstrings"}
        onHover={onHover}
        onClick={onClick}
      />
      {/* Right Hamstring */}
      <MuscleRegion
        muscleId="hamstrings"
        label="Hamstrings"
        intensity={getInt("hamstrings")}
        d="M136 232 C138 255 136 275 130 288 C120 290 108 288 104 280 C102 260 102 245 104 232 Z"
        isHovered={hoveredMuscle === "hamstrings"}
        isSelected={selectedMuscle === "hamstrings"}
        onHover={onHover}
        onClick={onClick}
      />

      {/* ── Calves (Gastrocnemius) ── */}
      {/* Left Calf */}
      <MuscleRegion
        muscleId="calves"
        label="Calves"
        intensity={getInt("calves")}
        d="M66 295 C62 315 64 342 72 364 C78 366 84 364 88 350 C90 330 88 310 86 295 Z"
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
        d="M134 295 C138 315 136 342 128 364 C122 366 116 364 112 350 C110 330 112 310 114 295 Z"
        isHovered={hoveredMuscle === "calves"}
        isSelected={selectedMuscle === "calves"}
        onHover={onHover}
        onClick={onClick}
      />
    </svg>
  );
};
