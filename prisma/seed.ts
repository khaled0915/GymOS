import { PrismaClient, MuscleGroup, Equipment, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

const exercises = [
  // CHEST
  {
    name: "Barbell Bench Press",
    slug: "barbell-bench-press",
    primaryMuscle: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS],
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Lie flat on the bench, grip the bar slightly wider than shoulder-width. Lower bar to mid-chest, press back up.",
    isSystemExercise: true,
  },
  {
    name: "Incline Dumbbell Press",
    slug: "incline-dumbbell-press",
    primaryMuscle: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Set bench to 30-45 degrees. Press dumbbells upwards over upper chest, lower under control.",
    isSystemExercise: true,
  },
  {
    name: "Cable Chest Fly",
    slug: "cable-chest-fly",
    primaryMuscle: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.SHOULDERS],
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Bring cable handles together in front with slight elbow bend, squeeze pecs, control eccentric.",
    isSystemExercise: true,
  },
  {
    name: "Push-Up",
    slug: "push-up",
    primaryMuscle: MuscleGroup.CHEST,
    secondaryMuscles: [MuscleGroup.TRICEPS, MuscleGroup.ABS],
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.BEGINNER,
    instructions: "Standard push-up position, lower chest to floor keeping body rigid, press up.",
    isSystemExercise: true,
  },

  // BACK
  {
    name: "Barbell Deadlift",
    slug: "barbell-deadlift",
    primaryMuscle: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.LEGS, MuscleGroup.GLUTES],
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.ADVANCED,
    instructions: "Stand hip-width, grip bar outside knees. Keep spine neutral, hinge hips, push the floor away.",
    isSystemExercise: true,
  },
  {
    name: "Lat Pulldown",
    slug: "lat-pulldown",
    primaryMuscle: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.BICEPS],
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Grip wide bar, pull down to upper chest while depressing shoulder blades, control return.",
    isSystemExercise: true,
  },
  {
    name: "Barbell Bent-Over Row",
    slug: "barbell-bent-over-row",
    primaryMuscle: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.BICEPS, MuscleGroup.SHOULDERS],
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Hinge at hips to 45 degrees, pull barbell towards lower ribcage, squeeze shoulder blades.",
    isSystemExercise: true,
  },
  {
    name: "Pull-Up",
    slug: "pull-up",
    primaryMuscle: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.BICEPS],
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Overhand grip, pull body up until chin clears the bar, lower with control.",
    isSystemExercise: true,
  },
  {
    name: "Seated Cable Row",
    slug: "seated-cable-row",
    primaryMuscle: MuscleGroup.BACK,
    secondaryMuscles: [MuscleGroup.BICEPS],
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Sit upright, pull handle to abdomen keeping back straight, extend arms fully.",
    isSystemExercise: true,
  },

  // SHOULDERS
  {
    name: "Overhead Barbell Press",
    slug: "overhead-barbell-press",
    primaryMuscle: MuscleGroup.SHOULDERS,
    secondaryMuscles: [MuscleGroup.TRICEPS, MuscleGroup.CHEST],
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Standing tall, press bar overhead from clavicle to full lockout, head through at top.",
    isSystemExercise: true,
  },
  {
    name: "Dumbbell Lateral Raise",
    slug: "dumbbell-lateral-raise",
    primaryMuscle: MuscleGroup.SHOULDERS,
    secondaryMuscles: [],
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER,
    instructions: "Raise dumbbells laterally until parallel to floor, lead with elbows, lower slowly.",
    isSystemExercise: true,
  },
  {
    name: "Face Pull",
    slug: "face-pull",
    primaryMuscle: MuscleGroup.SHOULDERS,
    secondaryMuscles: [MuscleGroup.BACK],
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Set rope at eye level, pull towards face while externally rotating shoulders.",
    isSystemExercise: true,
  },

  // BICEPS
  {
    name: "Barbell Bicep Curl",
    slug: "barbell-bicep-curl",
    primaryMuscle: MuscleGroup.BICEPS,
    secondaryMuscles: [],
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.BEGINNER,
    instructions: "Standing, curl barbell with elbows pinned at sides, squeeze biceps at peak contraction.",
    isSystemExercise: true,
  },
  {
    name: "Dumbbell Hammer Curl",
    slug: "dumbbell-hammer-curl",
    primaryMuscle: MuscleGroup.BICEPS,
    secondaryMuscles: [],
    equipment: Equipment.DUMBBELL,
    difficulty: Difficulty.BEGINNER,
    instructions: "Palms facing each other (neutral grip), curl dumbbells upward.",
    isSystemExercise: true,
  },

  // TRICEPS
  {
    name: "Tricep Rope Pushdown",
    slug: "tricep-rope-pushdown",
    primaryMuscle: MuscleGroup.TRICEPS,
    secondaryMuscles: [],
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Pin elbows at sides, push rope down and spread ends apart at bottom.",
    isSystemExercise: true,
  },
  {
    name: "Skull Crusher",
    slug: "skull-crusher",
    primaryMuscle: MuscleGroup.TRICEPS,
    secondaryMuscles: [],
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Lie on bench with EZ bar, bend elbows lowering bar to forehead, extend arms back up.",
    isSystemExercise: true,
  },

  // LEGS / QUADS / HAMSTRINGS
  {
    name: "Barbell Back Squat",
    slug: "barbell-back-squat",
    primaryMuscle: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.GLUTES, MuscleGroup.CALVES],
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Bar on upper traps, squat until thighs parallel or below, drive up through mid-foot.",
    isSystemExercise: true,
  },
  {
    name: "Leg Press",
    slug: "leg-press",
    primaryMuscle: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.GLUTES],
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Place feet shoulder-width on sled, lower weight until knees at 90 degrees, press up.",
    isSystemExercise: true,
  },
  {
    name: "Romanian Deadlift",
    slug: "romanian-deadlift",
    primaryMuscle: MuscleGroup.LEGS,
    secondaryMuscles: [MuscleGroup.GLUTES, MuscleGroup.BACK],
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Hinge at hips with slight knee bend, push hips back until hamstring stretch, stand tall.",
    isSystemExercise: true,
  },
  {
    name: "Leg Extension",
    slug: "leg-extension",
    primaryMuscle: MuscleGroup.LEGS,
    secondaryMuscles: [],
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Sit on machine, extend legs to full knee lockout, pause, lower with control.",
    isSystemExercise: true,
  },
  {
    name: "Seated Leg Curl",
    slug: "seated-leg-curl",
    primaryMuscle: MuscleGroup.LEGS,
    secondaryMuscles: [],
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Sit on machine with pad behind ankles, curl legs downward, control the return.",
    isSystemExercise: true,
  },

  // GLUTES
  {
    name: "Barbell Hip Thrust",
    slug: "barbell-hip-thrust",
    primaryMuscle: MuscleGroup.GLUTES,
    secondaryMuscles: [MuscleGroup.LEGS],
    equipment: Equipment.BARBELL,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Upper back on bench, barbell over hips, drive hips up to full extension, squeeze glutes.",
    isSystemExercise: true,
  },

  // CALVES
  {
    name: "Standing Calf Raise",
    slug: "standing-calf-raise",
    primaryMuscle: MuscleGroup.CALVES,
    secondaryMuscles: [],
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Balls of feet on platform, lower heels for deep stretch, press up onto toes.",
    isSystemExercise: true,
  },

  // ABS
  {
    name: "Hanging Leg Raise",
    slug: "hanging-leg-raise",
    primaryMuscle: MuscleGroup.ABS,
    secondaryMuscles: [],
    equipment: Equipment.BODYWEIGHT,
    difficulty: Difficulty.INTERMEDIATE,
    instructions: "Hang from bar, raise legs straight or bent knees up to chest without swinging.",
    isSystemExercise: true,
  },
  {
    name: "Cable Crunch",
    slug: "cable-crunch",
    primaryMuscle: MuscleGroup.ABS,
    secondaryMuscles: [],
    equipment: Equipment.CABLE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Kneel with rope behind head, flex spine to pull elbows toward knees, control return.",
    isSystemExercise: true,
  },

  // CARDIO
  {
    name: "Treadmill Running",
    slug: "treadmill-running",
    primaryMuscle: MuscleGroup.CARDIO,
    secondaryMuscles: [MuscleGroup.LEGS, MuscleGroup.CALVES],
    equipment: Equipment.MACHINE,
    difficulty: Difficulty.BEGINNER,
    instructions: "Run at steady or interval pace.",
    isSystemExercise: true,
  },
];

async function main() {
  console.log("Seeding exercises...");

  for (const ex of exercises) {
    await prisma.exercise.upsert({
      where: { slug: ex.slug },
      update: {},
      create: ex,
    });
  }

  console.log(`Seeded ${exercises.length} system exercises.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
