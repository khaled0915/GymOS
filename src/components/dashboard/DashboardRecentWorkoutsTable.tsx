"use client";

import React from "react";
import Link from "next/link";
import { Dumbbell, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardRecentWorkoutsTableProps {
  recentWorkouts: any[];
}

export function DashboardRecentWorkoutsTable({
  recentWorkouts,
}: DashboardRecentWorkoutsTableProps) {
  if (!recentWorkouts || recentWorkouts.length === 0) {
    return (
      <Card className="rounded-2xl border-border/60 bg-[#12161F]/70 backdrop-blur-md p-6">
        <CardHeader className="p-0 pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-emerald-400" />
              <CardTitle className="text-base font-bold text-white">
                Recent Training Sessions
              </CardTitle>
            </div>
            <Button asChild variant="outline" size="sm" className="h-7 text-xs border-border/60">
              <Link href="/workouts/history">View All</Link>
            </Button>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Activity logs and load records across your training cycle
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center space-y-2">
          <Dumbbell className="h-8 w-8 text-muted-foreground/40 mx-auto" />
          <p className="text-xs text-muted-foreground">
            No completed workouts logged yet. Start a session to see your training records here.
          </p>
          <Button asChild variant="athletic" size="sm" className="bg-emerald-500 text-black font-bold mt-2">
            <Link href="/workouts">Log First Workout</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border/60 bg-[#12161F]/70 backdrop-blur-md p-6 space-y-4">
      <CardHeader className="flex flex-row items-center justify-between p-0 pb-3 border-b border-border/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-emerald-400" />
            <CardTitle className="text-base font-bold text-white">
              Recent Training Sessions
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Activity logs and load records across your training cycle
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground hover:text-white">
          <Link href="/workouts/history" className="flex items-center gap-1">
            Full History <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead>Routine / Session</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tonnage</TableHead>
              <TableHead>Sets / Exercises</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentWorkouts.slice(0, 5).map((workout) => {
              const date = workout.completedAt
                ? new Date(workout.completedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Active";

              const totalSets =
                workout.exerciseSessions?.reduce(
                  (acc: number, es: any) => acc + (es.sets?.length || 0),
                  0
                ) || 0;

              const totalVol =
                workout.exerciseSessions?.reduce((acc: number, es: any) => {
                  return (
                    acc +
                    (es.sets?.reduce(
                      (sAcc: number, s: any) =>
                        sAcc + (s.completed ? (s.weight || 0) * (s.repetitions || 0) : 0),
                      0
                    ) || 0)
                  );
                }, 0) || 0;

              const exerciseCount = workout.exerciseSessions?.length || 0;

              return (
                <TableRow key={workout.id} className="border-border/30 hover:bg-white/5">
                  <TableCell className="font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>{workout.workoutDay?.name || workout.program?.name || "Freestyle Training"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {date}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-white">
                    {totalVol > 0 ? `${totalVol.toLocaleString()} kg` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="text-white font-medium">{totalSets} sets</span>{" "}
                    <span className="text-[11px]">({exerciseCount} exercises)</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
                      <Link href={`/workouts/history/${workout.id}`}>
                        View <ArrowUpRight className="h-3 w-3 ml-0.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
