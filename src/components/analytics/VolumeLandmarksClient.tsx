"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  evaluateMuscleVolumeLandmarks,
  type MuscleVolumeLandmark,
  type VolumeStatus,
} from "@/domain/volume-landmarks";
import { Layers, Activity, Info } from "lucide-react";

interface VolumeLandmarksProps {
  setsByMuscle: Record<string, number>;
}

const STATUS_BADGES: Record<VolumeStatus, { label: string; class: string }> = {
  OPTIMAL: { label: "Optimal Growth (10-20)", class: "bg-emerald-600 text-white" },
  UNDER_STIMULATED: { label: "Below Optimal (<10)", class: "bg-amber-500 text-white" },
  OVERREACHING: { label: "High Volume (20+)", class: "bg-purple-600 text-white" },
  MAINTENANCE: { label: "Maintenance (<6)", class: "bg-zinc-500 text-white" },
};

export function VolumeLandmarksClient({ setsByMuscle }: VolumeLandmarksProps) {
  const landmarks: MuscleVolumeLandmark[] = evaluateMuscleVolumeLandmarks(setsByMuscle);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-600" /> Weekly Hypertrophy Volume Landmarks
            </CardTitle>
            <CardDescription className="mt-0.5">
              Direct working sets completed over the past 7 days vs. scientific hypertrophy benchmarks
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            10–20 Sets/Wk Optimal
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {landmarks.map((m) => (
            <div
              key={m.muscleGroup}
              className="p-3.5 rounded-xl border bg-card/60 space-y-2 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{m.muscleGroup}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${STATUS_BADGES[m.status].class}`}>
                  {m.completedSets} sets
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                  <span>Target: {m.mavMin}–{m.mavMax} sets</span>
                  <span>{m.progressPct}% of peak MAV</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      m.status === "OPTIMAL"
                        ? "bg-emerald-500"
                        : m.status === "UNDER_STIMULATED"
                        ? "bg-amber-500"
                        : m.status === "OVERREACHING"
                        ? "bg-purple-500"
                        : "bg-zinc-400"
                    }`}
                    style={{ width: `${m.progressPct}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground leading-tight">
                {m.recommendation}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
