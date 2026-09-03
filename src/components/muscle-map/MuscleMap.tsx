"use client";

import React, { useState, useMemo } from "react";
import type { MuscleId, MuscleIntensity } from "@/domain/muscles/muscle-types";
import { MUSCLE_LABELS } from "@/domain/muscles/muscle-types";
import { FrontBodyMap } from "./FrontBodyMap";
import { BackBodyMap } from "./BackBodyMap";
import { Badge } from "@/components/ui/badge";

export interface MuscleMapProps {
  muscles: MuscleIntensity[];
  view?: "front" | "back" | "both";
  interactive?: boolean;
  showLegend?: boolean;
  onMuscleClick?: (muscleId: MuscleId) => void;
  className?: string;
}

export const MuscleMap: React.FC<MuscleMapProps> = ({
  muscles,
  view = "both",
  interactive = true,
  showLegend = true,
  onMuscleClick,
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<"front" | "back">("front");
  const [hoveredMuscle, setHoveredMuscle] = useState<MuscleId | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleId | null>(null);

  // Fast O(1) intensity and metadata lookup
  const intensityMap = useMemo(() => {
    const map: Record<MuscleId, number> = {} as any;
    for (const m of muscles) {
      map[m.muscle] = m.intensity;
    }
    return map;
  }, [muscles]);

  const muscleMetaMap = useMemo(() => {
    const map = new Map<MuscleId, MuscleIntensity>();
    for (const m of muscles) {
      map.set(m.muscle, m);
    }
    return map;
  }, [muscles]);

  const activeHoverMeta = hoveredMuscle ? muscleMetaMap.get(hoveredMuscle) : null;
  const activeSelectedMeta = selectedMuscle ? muscleMetaMap.get(selectedMuscle) : null;
  const activeDisplayMeta = activeHoverMeta || activeSelectedMeta;

  const handleHover = (muscleId: MuscleId | null) => {
    if (!interactive) return;
    setHoveredMuscle(muscleId);
  };

  const handleClick = (muscleId: MuscleId) => {
    if (!interactive) return;
    setSelectedMuscle((prev) => (prev === muscleId ? null : muscleId));
    onMuscleClick?.(muscleId);
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* ── View switcher tabs (visible on mobile or when view is 'both') ── */}
      {view === "both" && (
        <div className="flex sm:hidden items-center p-1 rounded-xl bg-[#0A0D12] border border-border/50 mb-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("front")}
            className={`px-4 py-1 rounded-lg font-bold transition-all ${
              activeTab === "front"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Anterior (Front)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("back")}
            className={`px-4 py-1 rounded-lg font-bold transition-all ${
              activeTab === "back"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            Posterior (Back)
          </button>
        </div>
      )}

      {/* ── Visualizer Maps Container ── */}
      <div className="w-full flex items-center justify-center gap-6 relative">
        {/* Desktop Side-by-Side or Selected Single View */}
        {(view === "both" || view === "front") && (
          <div
            className={`flex-1 max-w-[170px] sm:max-w-[200px] flex flex-col items-center ${
              view === "both" ? (activeTab === "front" ? "flex" : "hidden sm:flex") : "flex"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Front View
            </span>
            <FrontBodyMap
              intensities={intensityMap}
              hoveredMuscle={hoveredMuscle}
              selectedMuscle={selectedMuscle}
              onHover={handleHover}
              onClick={handleClick}
            />
          </div>
        )}

        {(view === "both" || view === "back") && (
          <div
            className={`flex-1 max-w-[170px] sm:max-w-[200px] flex flex-col items-center ${
              view === "both" ? (activeTab === "back" ? "flex" : "hidden sm:flex") : "flex"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Back View
            </span>
            <BackBodyMap
              intensities={intensityMap}
              hoveredMuscle={hoveredMuscle}
              selectedMuscle={selectedMuscle}
              onHover={handleHover}
              onClick={handleClick}
            />
          </div>
        )}
      </div>

      {/* ── Active Target Info Tooltip / Banner ── */}
      <div className="min-h-[38px] mt-2 flex items-center justify-center text-center">
        {activeDisplayMeta ? (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#0D121B] border border-emerald-500/30 text-xs shadow-lg animate-in fade-in zoom-in-95 duration-150">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">
              {MUSCLE_LABELS[activeDisplayMeta.muscle] || activeDisplayMeta.muscle}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] h-4 px-1.5 border-emerald-500/40 text-emerald-400 font-bold"
            >
              {activeDisplayMeta.role
                ? `${activeDisplayMeta.role} TARGET`
                : `${Math.round(activeDisplayMeta.intensity * 100)}% Stimulus`}
            </Badge>
            {activeDisplayMeta.sets !== undefined && activeDisplayMeta.sets > 0 && (
              <span className="text-[10px] text-muted-foreground">
                ({activeDisplayMeta.sets} sets)
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-muted-foreground/60 italic">
            {interactive ? "Tap or hover over any muscle region to inspect stimulus" : ""}
          </span>
        )}
      </div>

      {/* ── Intensity Legend ── */}
      {showLegend && (
        <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border/30 pt-2.5">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-[#1A2230] border border-[#2A364F]" />
            <span>Untrained</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-emerald-500/30 border border-emerald-500/50" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-emerald-500/70 border border-emerald-500/80" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-emerald-500 border border-emerald-400 shadow-xs shadow-emerald-500" />
            <span>High</span>
          </div>
        </div>
      )}
    </div>
  );
};
