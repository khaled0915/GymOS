"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface WeightChartProps {
  data: { date: string; weight: number }[];
}

export function WeightChartClient({ data }: WeightChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 11 }}
            className="text-muted-foreground"
            domain={["dataMin - 2", "dataMax + 2"]}
            unit=" kg"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="hsl(160, 60%, 45%)"
            strokeWidth={2}
            dot={{ r: 4, fill: "hsl(160, 60%, 45%)" }}
            activeDot={{ r: 6, fill: "hsl(160, 60%, 45%)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
