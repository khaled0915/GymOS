import { auth } from "@/lib/auth";
import { AnalyticsService } from "@/services/analytics.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart3,
  Dumbbell,
  Clock,
  Trophy,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import { VolumeChartClient } from "@/components/analytics/VolumeChartClient";
import { MuscleGroupPieClient } from "@/components/analytics/MuscleGroupPieClient";
import { ExerciseProgressionClient } from "@/components/analytics/ExerciseProgressionClient";
import { WorkoutFrequencyClient } from "@/components/analytics/WorkoutFrequencyClient";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await AnalyticsService.getAnalyticsData(session.user.id);

  // Serialize dates for client components
  const serializedWorkouts = data.analyticsWorkouts.map((w) => ({
    ...w,
    completedAt: new Date(w.completedAt),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Deep insights into your training performance
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Workouts
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalWorkouts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sets
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalSets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.avgDuration} min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personal Records
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalPrs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Volume by Week */}
      {data.volumeByWeek.length >= 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" /> Weekly
              Training Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VolumeChartClient data={data.volumeByWeek} />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Muscle Group Distribution */}
        {data.volumeByMuscle.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-purple-500" /> Volume by
                Muscle Group
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MuscleGroupPieClient data={data.volumeByMuscle} />
            </CardContent>
          </Card>
        )}

        {/* Workout Frequency */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-500" /> Training
              Frequency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WorkoutFrequencyClient data={data.frequencyByDay} />
          </CardContent>
        </Card>
      </div>

      {/* Exercise Progression */}
      {data.uniqueExercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" /> Exercise
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseProgressionClient
              exercises={data.uniqueExercises}
              workouts={serializedWorkouts}
            />
          </CardContent>
        </Card>
      )}

      {data.totalWorkouts === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center space-y-3">
            <BarChart3 className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">
              Complete some workouts to see your analytics here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
