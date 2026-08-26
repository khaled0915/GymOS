import { auth } from "@/lib/auth";
import { ProgressRepository } from "@/repositories/progress.repository";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Scale } from "lucide-react";
import { WeightLogFormClient } from "@/components/progress/WeightLogFormClient";
import { WeightChartClient } from "@/components/progress/WeightChartClient";

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [prs, weightLogs] = await Promise.all([
    ProgressRepository.getPersonalRecords(session.user.id),
    ProgressRepository.getMeasurements(session.user.id, "WEIGHT"),
  ]);

  const chartData = weightLogs.map((log) => ({
    date: new Date(log.measuredAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    weight: log.value,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Progress & Analytics</h1>
        <p className="text-muted-foreground mt-1">Track body weight, personal records, and strength gains</p>
      </div>

      {/* Weight Logging Form */}
      <WeightLogFormClient />

      {/* Weight Chart */}
      {chartData.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-500" /> Body Weight Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WeightChartClient data={chartData} />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Records */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" /> Personal Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {prs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No PRs detected yet.</p>
            ) : (
              <div className="space-y-3">
                {prs.map((pr) => (
                  <div key={pr.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{pr.exercise.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(pr.achievedAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="success">
                      {pr.recordType === "WEIGHT_PR" && `${pr.value} kg`}
                      {pr.recordType === "REP_PR" && `${pr.value} reps`}
                      {pr.recordType === "VOLUME_PR" && `${pr.value} kg vol`}
                      {pr.recordType === "E1RM_PR" && `${pr.value} kg e1RM`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weight History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-500" /> Body Weight History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weightLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No body weight entries logged yet.</p>
            ) : (
              <div className="space-y-2">
                {weightLogs.slice().reverse().slice(0, 15).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 text-sm">
                    <span>{new Date(log.measuredAt).toLocaleDateString()}</span>
                    <span className="font-bold">{log.value} {log.unit}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
