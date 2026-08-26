"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

interface MuscleGroupPieProps {
  data: { muscle: string; volume: number }[];
}

const COLORS = [
  "hsl(160, 60%, 45%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(340, 65%, 50%)",
  "hsl(40, 80%, 50%)",
  "hsl(20, 70%, 50%)",
  "hsl(120, 50%, 45%)",
  "hsl(260, 50%, 60%)",
  "hsl(0, 60%, 55%)",
  "hsl(180, 55%, 45%)",
];

export function MuscleGroupPieClient({ data }: MuscleGroupPieProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            dataKey="volume"
            nameKey="muscle"
            paddingAngle={2}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [`${Number(value).toLocaleString()} kg`, "Volume"]}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
