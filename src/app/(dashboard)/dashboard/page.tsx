import { auth } from "@/lib/auth";
import { DashboardService } from "@/services/dashboard.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Dumbbell, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Play, 
  ArrowRight,
  Clock,
  Calendar,
  Sparkles
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const data = await DashboardService.getDashboardData(session.user.id);
  const firstName = session.user.name?.split(" ")[0] || "Athlete";
  const latestWeight = data.weightHistory.length > 0 ? data.weightHistory[data.weightHistory.length - 1] : null;

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Welcome back, {firstName}</h1>
          <p className="text-muted-foreground mt-1">Ready to dominate your session today?</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="lg">
            <Link href="/coach">
              <Sparkles className="mr-2 h-4 w-4 text-emerald-500" /> AI Coach
            </Link>
          </Button>
          <Button asChild variant="athletic" size="lg" className="shadow-md">
            <Link href="/workouts">
              <Play className="mr-2 h-5 w-5 fill-current" />
              {data.activeSession ? "Resume Workout" : "Start Workout"}
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.weeklyWorkoutCount}</div>
            <p className="text-xs text-muted-foreground mt-1">workouts completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Volume</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data.weeklyVolume).toLocaleString()} kg</div>
            <p className="text-xs text-muted-foreground mt-1">lifted this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total PRs</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.recentPrs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">records achieved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Latest Weight</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestWeight ? `${latestWeight.value} kg` : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {latestWeight ? "logged recently" : "no logs yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Workout Banner if any */}
      {data.activeSession && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <p className="font-semibold text-sm">Workout in Progress</p>
                <p className="text-xs text-muted-foreground">
                  Started at {new Date(data.activeSession.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="athletic">
              <Link href="/workouts">Resume</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Workouts</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/workouts/history" className="text-xs">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentWorkouts.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Dumbbell className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground">No workouts recorded yet.</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/workouts">Log your first workout</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentWorkouts.map((workout) => (
                  <div
                    key={workout.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-accent/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-sm">
                        {workout.workoutDay?.name || workout.program?.name || "Freestyle Workout"}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground gap-3">
                        <span>
                          {new Date(workout.completedAt || workout.startedAt).toLocaleDateString()}
                        </span>
                        {workout.durationSeconds && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {Math.round(workout.durationSeconds / 60)} min
                          </span>
                        )}
                        <span>{workout.exerciseSessions.length} exercises</span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {workout.exerciseSessions.reduce((acc, es) => acc + es.sets.length, 0)} sets
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent PRs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Personal Records</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/progress" className="text-xs">
                All records <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentPrs.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Trophy className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                <p className="text-sm text-muted-foreground">No records detected yet.</p>
                <p className="text-xs text-muted-foreground">Keep pushing your limits in your workouts!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentPrs.map((pr) => (
                  <div
                    key={pr.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                  >
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm">{pr.exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(pr.achievedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="success">
                      {pr.recordType === "WEIGHT_PR" && `${pr.value} kg (Weight PR)`}
                      {pr.recordType === "REP_PR" && `${pr.value} reps (Rep PR)`}
                      {pr.recordType === "VOLUME_PR" && `${pr.value} kg (Volume PR)`}
                      {pr.recordType === "E1RM_PR" && `${pr.value} kg (1RM PR)`}
                    </Badge>
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
