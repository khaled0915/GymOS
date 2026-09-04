"use client";

import * as React from "react";
import { TrendingUp, Dumbbell } from "lucide-react";
import { Label, Pie, PieChart, Sector } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export interface MuscleGroupPieProps {
  data: { muscle: string; volume: number }[];
  className?: string;
}

type PieSectorShapeProps = React.ComponentProps<typeof Sector> & {
  index?: number;
  outerRadius?: number;
};

const MUSCLE_COLORS: Record<string, string> = {
  CHEST: "#10B981",     // Emerald
  BACK: "#06B6D4",      // Cyan
  SHOULDERS: "#8B5CF6", // Violet
  LEGS: "#F59E0B",      // Amber
  TRICEPS: "#EC4899",   // Pink
  BICEPS: "#3B82F6",    // Blue
  GLUTES: "#F97316",    // Orange
  ABS: "#14B8A6",       // Teal
  CALVES: "#A855F7",    // Purple
  CARDIO: "#EF4444",    // Red
};

const FALLBACK_PALETTE = [
  "#10B981",
  "#06B6D4",
  "#8B5CF6",
  "#F59E0B",
  "#EC4899",
  "#3B82F6",
  "#F97316",
  "#14B8A6",
  "#A855F7",
  "#6366F1",
];

export function MuscleGroupPieClient({ data, className = "" }: MuscleGroupPieProps) {
  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const totalVolume = React.useMemo(
    () => data.reduce((sum, item) => sum + item.volume, 0),
    [data]
  );

  const chartData = React.useMemo(() => {
    return data.map((item, index) => {
      const muscleKey = item.muscle.toUpperCase();
      const slug = item.muscle.toLowerCase().replace(/\s+/g, "_");
      const color =
        MUSCLE_COLORS[muscleKey] || FALLBACK_PALETTE[index % FALLBACK_PALETTE.length];

      return {
        muscle: slug,
        displayName: item.muscle,
        volume: item.volume,
        fill: `var(--color-${slug})`,
        color,
      };
    });
  }, [data]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      volume: {
        label: "Volume",
      },
    };

    for (const item of chartData) {
      config[item.muscle] = {
        label: item.displayName,
        color: item.color,
      };
    }

    return config;
  }, [chartData]);

  if (!data || data.length === 0) {
    return null;
  }

  const activeItem = chartData[activeIndex] || chartData[0];
  const topItem = chartData[0];
  const topPercentage =
    totalVolume > 0 && topItem ? Math.round((topItem.volume / totalVolume) * 100) : 0;

  return (
    <Card
      className={`flex flex-col justify-between rounded-2xl border border-border/60 bg-[#12161F]/70 backdrop-blur-md p-6 ${className}`}
    >
      <CardHeader className="items-start p-0 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-emerald-400" />
          <CardTitle className="text-base font-bold text-white">
            Volume by Muscle Group
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-1">
          Interactive donut chart showing cumulative volume distribution
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 p-0 pt-4 pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[260px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="volume"
              nameKey="muscle"
              innerRadius={65}
              outerRadius={95}
              strokeWidth={3}
              stroke="#0A0D12"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              shape={({
                index,
                outerRadius = 0,
                ...props
              }: PieSectorShapeProps) =>
                index === activeIndex ? (
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 8}
                    className="transition-all duration-200 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  />
                ) : (
                  <Sector {...props} outerRadius={outerRadius} />
                )
              }
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const percent =
                      totalVolume > 0 && activeItem
                        ? Math.round((activeItem.volume / totalVolume) * 100)
                        : 0;

                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 5}
                          className="fill-white text-xl font-black tracking-tight"
                        >
                          {activeItem
                            ? `${activeItem.volume.toLocaleString()} kg`
                            : "0 kg"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 15}
                          className="fill-emerald-400 text-[10px] font-bold uppercase tracking-wider"
                        >
                          {activeItem
                            ? `${activeItem.displayName} (${percent}%)`
                            : "Total Volume"}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* Interactive Muscle Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-h-[72px] overflow-y-auto no-scrollbar">
          {chartData.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.muscle}
                type="button"
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  isActive
                    ? "bg-white/10 text-white border border-white/20 shadow-xs"
                    : "text-muted-foreground hover:text-white bg-[#0A0D12]/60 border border-border/40"
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.displayName}</span>
              </button>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-1.5 text-xs p-0 pt-3 border-t border-border/40">
        <div className="flex items-center gap-1.5 font-medium text-white">
          <span>Top driver:</span>
          <span className="text-emerald-400 font-bold">{topItem?.displayName}</span>
          <span className="text-muted-foreground">({topPercentage}% of total)</span>
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400 ml-0.5" />
        </div>
        <div className="text-[11px] text-muted-foreground">
          Cumulative tonnage:{" "}
          <strong className="text-white font-mono">{totalVolume.toLocaleString()} kg</strong> across{" "}
          {data.length} muscle groups
        </div>
      </CardFooter>
    </Card>
  );
}
