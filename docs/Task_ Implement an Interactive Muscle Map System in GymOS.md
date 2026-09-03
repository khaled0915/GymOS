# Task: Implement an Interactive Muscle Map System in GymOS

You are working inside the existing **GymOS** repository.

Before writing any code:

1. Read `AGENTS.md`.
2. Read `docs/PRD.md`.
3. Read `docs/ARCHITECTURE.md`.
4. Read `docs/DATABASE.md`.
5. Read `docs/DESIGN.md`.
6. Read `docs/product-specs/exercise-library.md`.
7. Read `docs/product-specs/workout-system.md`.
8. Read `docs/product-specs/analytics.md` if it exists.
9. Inspect the current repository structure, database schema, exercise model, workout logging model, component system, styling system, API structure, and current dependencies.

Do not redesign unrelated parts of the application.

Do not replace existing technologies unless there is a strong technical reason.

If the repository differs from the assumptions in this specification, adapt the implementation to the existing architecture.

---

# 1. Feature Goal

Implement a reusable **interactive anatomical muscle map** for GymOS.

The muscle map should allow users to visually understand:

- Which muscles an exercise primarily targets
- Which muscles an exercise secondarily targets
- Which muscle groups were trained during a workout
- Which muscle groups received the most training volume
- Which muscles are undertrained or heavily trained over a selected period

The muscle map must not be implemented as a static image.

It should be an interactive system connected to GymOS workout and exercise data.

---

# 2. Main Use Cases

The muscle map should eventually support four major contexts.

## A. Exercise Library

When viewing an exercise such as:

`Bench Press`

the map should highlight:

Primary muscles:

- Chest / Pectorals

Secondary muscles:

- Front deltoids
- Triceps

---

## B. Workout Builder

When users add exercises to a workout, allow them to see which muscles the workout targets.

Example:

Push Day:

- Bench Press
- Incline Dumbbell Press
- Shoulder Press
- Lateral Raise
- Triceps Pushdown

The combined muscle map should visually indicate the muscles targeted by the workout.

---

## C. Completed Workout Summary

After completing a workout, show a muscle map representing the muscles trained during that session.

The intensity should reflect estimated training stimulus or training volume.

Example:

Chest: high

Triceps: medium

Front delts: medium

Back: none

---

## D. Analytics

Allow users to view muscle training distribution over:

- Current workout
- Last 7 days
- Last 30 days
- Custom date range

Example:

```text
Training Distribution — Last 7 Days

Chest             High
Back              High
Front Delts       Medium
Side Delts        Low
Biceps            Medium
Triceps           Medium
Quads             High
Hamstrings        Low
Calves            Very Low
```

Display this visually through the muscle map.

---

# 3. Muscle Map UI

Create both:

- Front body view
- Back body view

Prefer scalable vector graphics (SVG).

Do not use a raster PNG/JPEG body image as the core implementation.

The SVG should allow individual anatomical regions to be controlled independently.

Example structure:

```tsx
<MuscleMap>
  <FrontBody />
  <BackBody />
</MuscleMap>
```

Individual muscle regions should be reusable components or SVG paths.

Example:

```tsx
<MuscleRegion
  muscle="chest"
  intensity={0.8}
/>
```

---

# 4. Required Muscle Groups

At minimum support the following muscle groups.

## Front

### Chest

- Pectoralis major / chest

### Shoulders

- Front deltoid
- Side deltoid

### Arms

- Biceps
- Forearms

### Core

- Abdominals
- Obliques

### Legs

- Quadriceps
- Hip flexor/adductor region where appropriate
- Tibialis/anterior lower leg where appropriate

---

## Back

### Shoulders

- Rear deltoids

### Back

- Trapezius
- Upper back
- Latissimus dorsi
- Lower back / erector spinae

### Arms

- Triceps
- Forearms

### Legs

- Glutes
- Hamstrings
- Calves

---

# 5. Canonical Muscle IDs

Do not allow arbitrary muscle names throughout the codebase.

Create one canonical muscle taxonomy.

Example:

```ts
export const MUSCLE_GROUPS = {
  CHEST: "chest",

  FRONT_DELTS: "front_delts",
  SIDE_DELTS: "side_delts",
  REAR_DELTS: "rear_delts",

  BICEPS: "biceps",
  TRICEPS: "triceps",
  FOREARMS: "forearms",

  LATS: "lats",
  TRAPS: "traps",
  UPPER_BACK: "upper_back",
  LOWER_BACK: "lower_back",

  ABS: "abs",
  OBLIQUES: "obliques",

  GLUTES: "glutes",
  QUADS: "quads",
  HAMSTRINGS: "hamstrings",
  CALVES: "calves",

  ADDUCTORS: "adductors",
} as const;
```

Adapt naming to existing GymOS conventions if a muscle taxonomy already exists.

There must be one source of truth.

Do not duplicate values across components.

---

# 6. Data Model

Inspect the current Exercise model first.

Each exercise must support:

- Primary muscle groups
- Secondary muscle groups

Preferred conceptual structure:

```ts
Exercise {
  id
  name

  primaryMuscles[]
  secondaryMuscles[]
}
```

Do not store muscles as uncontrolled free-text strings if avoidable.

Use enums, validated IDs, relational data, or another type-safe structure appropriate to the existing architecture.

Example:

```ts
type ExerciseMuscle = {
  muscle: MuscleGroup;
  role: "PRIMARY" | "SECONDARY";
};
```

If the current database schema already has:

`primaryMuscle`

and:

`secondaryMuscles`

migrate carefully rather than unnecessarily redesigning the entire database.

---

# 7. Exercise-to-Muscle Mapping

Populate or support mappings such as:

```text
Bench Press
Primary:
- chest

Secondary:
- front_delts
- triceps
```

```text
Incline Dumbbell Press
Primary:
- chest

Secondary:
- front_delts
- triceps
```

```text
Lat Pulldown
Primary:
- lats

Secondary:
- biceps
- upper_back
```

```text
Barbell Row
Primary:
- upper_back
- lats

Secondary:
- rear_delts
- biceps
```

```text
Shoulder Press
Primary:
- front_delts
- side_delts

Secondary:
- triceps
```

```text
Lateral Raise
Primary:
- side_delts
```

```text
Barbell Curl
Primary:
- biceps

Secondary:
- forearms
```

```text
Triceps Pushdown
Primary:
- triceps
```

```text
Squat
Primary:
- quads
- glutes

Secondary:
- hamstrings
- lower_back
```

```text
Romanian Deadlift
Primary:
- hamstrings
- glutes

Secondary:
- lower_back
```

```text
Deadlift
Primary:
- glutes
- hamstrings
- lower_back

Secondary:
- traps
- upper_back
- forearms
```

```text
Calf Raise
Primary:
- calves
```

These mappings should belong to the exercise data/domain layer rather than being hardcoded inside UI components.

---

# 8. Muscle Map Component API

Create a reusable interface.

Conceptually:

```ts
type MuscleIntensity = {
  muscle: MuscleGroup;
  intensity: number;
};

type MuscleMapProps = {
  muscles: MuscleIntensity[];
  view?: "front" | "back" | "both";
  interactive?: boolean;
  showLegend?: boolean;
  showLabels?: boolean;
  onMuscleClick?: (muscle: MuscleGroup) => void;
};
```

Intensity should preferably use normalized values:

```text
0.0 → not trained
0.25 → low
0.50 → moderate
0.75 → high
1.0 → very high
```

Keep the visualization independent from the algorithm that calculates intensity.

Example:

```text
Workout data
     ↓
Muscle analytics service
     ↓
Normalized muscle intensity
     ↓
MuscleMap component
```

Do NOT calculate workout analytics directly inside the SVG component.

---

# 9. Primary vs Secondary Muscle Visualization

For individual exercises:

Primary muscles should appear more strongly highlighted.

Secondary muscles should appear less strongly highlighted.

Example conceptual weighting:

```text
Primary muscle = 1.0
Secondary muscle = 0.45
```

Put these values in a configurable domain constant rather than scattering magic numbers across the application.

Example:

```ts
const MUSCLE_ROLE_WEIGHT = {
  PRIMARY: 1,
  SECONDARY: 0.45,
};
```

The exact values can be adjusted later.

---

# 10. Workout Muscle Calculation

Create domain logic that calculates muscle involvement for a workout.

Inputs may include:

- Exercise
- Sets
- Repetitions
- Weight
- Primary muscles
- Secondary muscles

Start with a simple deterministic method.

Do not use AI for this calculation.

---

# 11. MVP Calculation

For MVP, calculate training contribution using completed working sets.

Example:

```text
muscle contribution =
completed sets × muscle role weight
```

Example:

Bench Press:

4 working sets.

Chest:

```text
4 × 1.0 = 4
```

Triceps:

```text
4 × 0.45 = 1.8
```

Front delts:

```text
4 × 0.45 = 1.8
```

---

# 12. Optional Volume-Aware Calculation

Design the service so it can later support:

```text
Volume = sets × reps × weight
```

and calculate muscle contribution:

```text
muscle volume =
exercise volume × muscle involvement weight
```

However:

Do not overcomplicate the MVP.

Sets-based stimulus is acceptable initially.

Keep the calculation strategy replaceable.

For example:

```ts
interface MuscleStimulusCalculator {
  calculate(workout: WorkoutSession): MuscleStimulus[];
}
```

---

# 13. Normalize Intensity

The muscle map should receive normalized intensity from 0 to 1.

Example:

```ts
[
  {
    muscle: "chest",
    intensity: 1
  },
  {
    muscle: "triceps",
    intensity: 0.65
  },
  {
    muscle: "front_delts",
    intensity: 0.55
  }
]
```

Normalization should occur outside the UI.

Avoid values that make every trained muscle look equally intense.

---

# 14. Interactive Behavior

When hovering over a muscle on desktop:

Show tooltip:

```text
Chest

12 working sets
Highest contributing exercise:
Bench Press
```

For exercise pages:

```text
Chest

Primary muscle
```

On mobile:

Use tap instead of relying on hover.

When a muscle is selected, optionally show:

```text
Chest

Exercises:
Bench Press
Incline DB Press
Cable Fly

Weekly working sets:
14
```

---

# 15. Exercise Library Integration

Update the Exercise Detail page.

Add a section:

```text
Muscles Worked

[ FRONT BODY ]   [ BACK BODY ]
```

Below or beside the map:

```text
Primary
Chest

Secondary
Front Deltoids
Triceps
```

Users should immediately understand which muscles the exercise targets.

---

# 16. Exercise Search Integration

Allow users to optionally filter exercises by muscle.

Example:

```text
Exercises

Muscle:
[ Chest ▼ ]

Equipment:
[ Dumbbell ▼ ]
```

Clicking a muscle in the map may eventually apply the same filter.

Design the component to support this future behavior.

---

# 17. Workout Builder Integration

When creating a workout, display a small optional section:

```text
Workout Muscle Coverage
```

As exercises are added or removed, update the map.

Example:

User adds:

Bench Press

Map:

Chest → high

Triceps → moderate

Front delts → moderate

Then user adds:

Lateral Raise

Map updates:

Side delts → high
```

The calculation should occur from the workout's planned exercises.

---

# 18. Active Workout

Do not let the muscle map distract from logging sets.

The muscle map should NOT dominate the active workout screen.

If included there, use a collapsible:

```text
Muscles Targeted
```

or omit it from the active workout MVP.

Workout logging speed remains more important.

---

# 19. Workout Completion Screen

After clicking:

`Finish Workout`

show:

```text
Workout Complete

Push Day
Duration: 58 min
Total Sets: 19
Total Volume: 8,940 kg
PRs: 2

Muscles Trained
[interactive muscle map]
```

Below:

```text
Chest       High
Shoulders   High
Triceps     Medium
```

---

# 20. Analytics Integration

Create a muscle distribution section under Progress/Analytics.

Example page:

```text
Training Analytics

Period:
[ Last 7 Days ▼ ]

Muscle Distribution

       FRONT        BACK
       [map]        [map]

Training Breakdown

Chest            14 sets
Back             16 sets
Side Delts        8 sets
Front Delts       6 sets
Rear Delts        4 sets
Biceps            8 sets
Triceps           9 sets
Quads            12 sets
Hamstrings         6 sets
Calves             3 sets
```

---

# 21. Heatmap Modes

Design the component so it can support different visualization modes.

Possible future modes:

```ts
type MuscleMapMode =
  | "exercise"
  | "workout"
  | "weekly-volume"
  | "monthly-volume"
  | "recovery";
```

MVP only needs:

- exercise
- workout
- weekly analytics

Do not implement unnecessary future functionality now.

---

# 22. Color / Intensity System

Use the existing GymOS design tokens.

Do not hardcode random colors directly into components.

Create semantic states conceptually equivalent to:

```text
Inactive
Low
Moderate
High
Very High
```

For example:

```ts
getMuscleIntensityClass(intensity)
```

Do not rely exclusively on color to communicate meaning.

Provide:

- tooltip
- labels
- legend
- text description

for accessibility.

---

# 23. SVG Requirements

The SVG implementation must:

- Scale responsively
- Preserve aspect ratio
- Work on mobile
- Work on desktop
- Have independently selectable muscle paths
- Avoid inline duplicated styling
- Support dark mode
- Support hover
- Support tap
- Support selected states

Use semantic IDs or data attributes.

Example:

```svg
<path
  data-muscle="chest"
  ...
/>
```

Avoid brittle selectors like:

```text
path:nth-child(17)
```

---

# 24. Anatomy Accuracy

The map should be anatomically understandable but does not need medical-school-level detail.

Prioritize fitness-relevant muscle groups.

Do not over-segment muscles unless GymOS has a reason to track them separately.

For example, MVP does not need separate:

- clavicular pectoralis fibers
- sternal pectoralis fibers
- individual quadriceps heads

unless the exercise model later requires that level of detail.

---

# 25. Desktop Layout

Example:

```text
┌───────────────────────────────────────────────┐
│ Muscle Distribution                           │
│                                               │
│      FRONT                BACK                │
│                                               │
│      [SVG]                [SVG]               │
│                                               │
│ Very Low ░  Low ▒  Medium ▓  High █          │
└───────────────────────────────────────────────┘
```

---

# 26. Mobile Layout

Example:

```text
Muscles Trained

[ Front | Back ]

        SVG

Chest
14 working sets

Shoulders
9 working sets

Triceps
8 working sets
```

Use either tabs or another compact responsive layout.

Do not force two tiny body maps side-by-side on small phones if readability suffers.

---

# 27. Accessibility

Each muscle region must have accessible metadata.

Example:

```tsx
aria-label="Chest: high training volume"
```

Keyboard users should be able to interact with selectable muscle regions where applicable.

Support:

- keyboard focus
- visible focus indicator
- screen readers
- reduced motion
- sufficient contrast

Do not rely only on hover.

---

# 28. Domain Logic

Create dedicated muscle-domain utilities/services.

Possible structure:

```text
src/
  domain/
    muscles/
      muscle-types.ts
      muscle-config.ts
      muscle-stimulus.ts
      normalize-muscle-intensity.ts
```

Adapt the exact folder structure to the existing architecture.

Do not create this structure blindly if the repository already has another domain organization.

---

# 29. Component Structure

Conceptual structure:

```text
components/
  muscle-map/
    MuscleMap.tsx
    FrontMuscleMap.tsx
    BackMuscleMap.tsx
    MuscleRegion.tsx
    MuscleTooltip.tsx
    MuscleLegend.tsx
```

Again, follow existing repository conventions.

---

# 30. Reusability

Do not create separate unrelated muscle map implementations for:

- Exercise page
- Workout summary
- Analytics

There should be ONE core visualization system receiving different data.

Example:

```tsx
<MuscleMap
  muscles={exerciseMuscles}
  mode="exercise"
/>
```

```tsx
<MuscleMap
  muscles={workoutMuscles}
  mode="workout"
/>
```

```tsx
<MuscleMap
  muscles={weeklyMuscles}
  mode="weekly-volume"
/>
```

---

# 31. Data Queries

Create efficient queries for analytics.

Avoid loading every historical workout into the client and calculating everything there.

Where appropriate:

```text
Database
   ↓
Server/domain analytics
   ↓
aggregated muscle statistics
   ↓
client
   ↓
MuscleMap
```

Do not prematurely optimize, but avoid obvious N+1 query patterns.

---

# 32. Caching

Do not add complex caching specifically for this feature unless existing GymOS architecture already uses it.

The feature should first be correct.

Optimize only after measuring performance.

---

# 33. Empty States

If an exercise does not have muscle data:

```text
Muscle information is not available for this exercise yet.
```

Do not render misleading highlights.

If the user has no workouts:

```text
Complete your first workout to see muscle training analytics.
```

---

# 34. Error Handling

The UI must not crash if:

- Muscle data is missing
- Unknown muscle ID appears
- Workout contains deleted/deactivated exercises
- Exercise has no secondary muscle
- Analytics response is empty

Unknown muscle IDs should be safely ignored or logged depending on existing application conventions.

---

# 35. Historical Integrity

If an exercise's muscle mapping changes later, consider whether historical workout analytics should use:

A. current exercise mapping

or

B. the mapping that existed when the workout occurred.

For MVP, using the current exercise mapping is acceptable if this matches the existing architecture.

Document this decision.

Do not add complex exercise-versioning only for this feature unless required.

---

# 36. Testing

Add unit tests for muscle-domain calculations.

Required examples:

## Test 1

Bench Press:

```text
4 sets
Primary: chest
Secondary:
- front_delts
- triceps
```

Expected raw contributions:

```text
chest = 4
front_delts = 1.8
triceps = 1.8
```

assuming secondary weighting = 0.45.

---

## Test 2

Combined workout:

Bench Press:

3 sets

Lateral Raise:

3 sets

Triceps Pushdown:

3 sets

Verify correct combined muscle contributions.

---

## Test 3

Only completed working sets contribute.

Skipped/uncompleted sets should not contribute.

---

## Test 4

Unknown or missing muscles do not crash calculations.

---

## Test 5

Intensity normalization returns values between:

```text
0
and
1
```

---

# 37. Component Tests

Test:

- Primary muscles render as highlighted
- Secondary muscles render differently
- Tooltip appears
- Muscle selection works
- Front/back switching works
- Empty state works

---

# 38. Integration Tests

Test:

```text
Exercise
→ muscle mapping
→ Exercise Detail page
→ muscle map
```

and:

```text
Completed workout
→ set logs
→ muscle calculations
→ workout summary
→ muscle map
```

---

# 39. Responsive Testing

Check at minimum:

- Small mobile
- Standard mobile
- Tablet
- Desktop

Ensure SVG does not overflow or become unreadable.

---

# 40. Performance

Avoid unnecessarily rerendering every SVG path during unrelated state changes.

Memoization may be used where justified.

Do not prematurely add complex optimization.

---

# 41. Security

The muscle map itself contains no sensitive logic, but workout analytics are user-specific.

All workout/analytics API access must follow existing server-side authorization rules.

Never expose another user's private workout data.

---

# 42. File Organization

Before creating files, inspect existing conventions.

Do not blindly create duplicate folders.

At the end, provide a list of:

- Files created
- Files modified
- Database changes
- API changes
- Tests added

---

# 43. Implementation Sequence

Implement in this order.

## Phase 1 — Domain

1. Canonical muscle taxonomy
2. Exercise muscle mapping type
3. Muscle contribution calculator
4. Normalization logic
5. Unit tests

Do not build UI until domain logic passes tests.

---

## Phase 2 — Visualization

6. Front SVG map
7. Back SVG map
8. MuscleRegion abstraction
9. Intensity rendering
10. Tooltips
11. Legend
12. Responsive behavior
13. Accessibility

---

## Phase 3 — Exercise Library

14. Connect Exercise model to muscles
15. Display map in Exercise Detail
16. Display Primary/Secondary list
17. Add muscle filtering where appropriate

---

## Phase 4 — Workout Integration

18. Calculate planned workout coverage
19. Add optional coverage to Workout Builder
20. Calculate completed workout muscle distribution
21. Add map to Workout Completion summary

---

## Phase 5 — Analytics

22. Aggregate muscle training data
23. Add 7-day muscle analytics
24. Add 30-day muscle analytics
25. Connect analytics to MuscleMap

---

# 44. Do Not Implement Yet

Do NOT implement these unless they already exist and require only trivial integration:

- AI-generated muscle analysis
- Injury diagnosis
- Recovery predictions
- Medical recommendations
- Muscle growth predictions
- Computer vision body scanning
- 3D anatomy
- WebGL anatomy
- Per-muscle recovery scores
- Wearable integration

Keep MVP focused.

---

# 45. UX Quality Requirements

The muscle map should feel like a native part of GymOS.

Avoid:

- giant anatomy illustration dominating pages
- excessive animation
- tiny labels everywhere
- visually confusing muscle segmentation
- unexplained colors
- cluttered workout logging screen

Prioritize clarity.

---

# 46. Example Exercise Page

Target experience:

```text
Bench Press

Barbell • Intermediate

Muscles Worked

        FRONT
      [ Muscle Map ]

Primary

Chest

Secondary

Front Deltoids
Triceps

Instructions
...
```

---

# 47. Example Workout Summary

```text
Push Day Complete

58 min
19 Sets
8,940 kg Volume
2 PRs

Muscles Trained

    FRONT       BACK
    [map]       [map]

Chest            High
Front Delts      Medium
Side Delts       High
Triceps          Medium
```

---

# 48. Example Analytics

```text
Muscle Distribution

Last 7 Days ▼

     FRONT        BACK

     [map]        [map]

Working Sets

Back             16
Chest            14
Quads            12
Triceps           9
Biceps            8
Side Delts        8
Hamstrings        6
Calves            3
```

---

# 49. Documentation

After implementation:

Update relevant documentation.

At minimum review:

```text
docs/DATABASE.md
docs/ARCHITECTURE.md
docs/product-specs/exercise-library.md
docs/product-specs/workout-system.md
docs/product-specs/analytics.md
```

If a dedicated specification would improve clarity, create:

```text
docs/product-specs/muscle-map.md
```

That document should become the source of truth for future muscle-map behavior.

---

# 50. Definition of Done

This feature is complete only when:

- Front muscle map works
- Back muscle map works
- Muscle IDs are type-safe
- Primary/secondary muscles are supported
- Exercise Detail integration works
- Workout muscle calculation works
- Workout Summary integration works
- Weekly analytics integration works
- Mobile layout works
- Dark mode works if GymOS supports dark mode
- Accessibility requirements are met
- Unit tests pass
- Integration tests pass
- Lint passes
- Type checking passes
- Production build passes
- No unrelated functionality is broken
- Documentation is updated

---

# 51. Final Validation

Before finishing the task:

Run the repository's appropriate commands for:

```text
format
lint
typecheck
test
build
```

Fix issues introduced by this implementation.

Then provide:

## Implementation Summary

Describe what was implemented.

## Architecture

Explain where muscle-domain logic lives.

## Database Changes

List any schema/migration changes.

## UI Changes

List pages/components changed.

## Tests

List tests created and their result.

## Assumptions

List any assumptions made because documentation was incomplete.

## Remaining Work

List anything intentionally deferred.

Do not claim the feature is complete if tests or build fail.