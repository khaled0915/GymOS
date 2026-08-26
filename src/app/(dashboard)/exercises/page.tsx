import { auth } from "@/lib/auth";
import { ExerciseRepository } from "@/repositories/exercise.repository";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Dumbbell, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ExercisesPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; muscle?: string; equipment?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;
  const exercises = await ExerciseRepository.findMany({
    query: params.query,
    muscle: params.muscle as any,
    equipment: params.equipment as any,
    userId: session?.user?.id,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Exercise Library</h1>
          <p className="text-muted-foreground mt-1">Browse, filter, and inspect exercises</p>
        </div>
        <Button asChild variant="athletic">
          <Link href="/exercises/new">
            <Plus className="mr-1.5 h-4 w-4" /> New Exercise
          </Link>
        </Button>
      </div>

      {/* Search & Filter Form */}
      <form method="GET" className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="query"
            placeholder="Search exercises..."
            defaultValue={params.query || ""}
            className="pl-9"
          />
        </div>
        <select
          name="muscle"
          defaultValue={params.muscle || ""}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm"
        >
          <option value="">All Muscles</option>
          <option value="CHEST">Chest</option>
          <option value="BACK">Back</option>
          <option value="SHOULDERS">Shoulders</option>
          <option value="BICEPS">Biceps</option>
          <option value="TRICEPS">Triceps</option>
          <option value="LEGS">Legs</option>
          <option value="GLUTES">Glutes</option>
          <option value="ABS">Abs</option>
          <option value="CALVES">Calves</option>
          <option value="CARDIO">Cardio</option>
        </select>
        <button
          type="submit"
          className="h-9 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow hover:bg-primary/90"
        >
          Filter
        </button>
      </form>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercises.length === 0 ? (
          <div className="col-span-full text-center py-12 space-y-3">
            <Dumbbell className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">No exercises match your search criteria.</p>
          </div>
        ) : (
          exercises.map((exercise) => (
            <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
              <Card className="h-full hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-bold">{exercise.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">
                      {exercise.primaryMuscle}
                    </Badge>
                  </div>
                  {exercise.equipment && (
                    <CardDescription className="text-xs">
                      Equipment: {exercise.equipment}
                    </CardDescription>
                  )}
                </CardHeader>
                {exercise.instructions && (
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {exercise.instructions}
                    </p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
