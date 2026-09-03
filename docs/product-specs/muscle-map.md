# GymOS Product Specification: Interactive Anatomical Muscle Map

## Overview

The **Interactive Muscle Map** provides an anatomical visualization of muscle targets, workout training distribution, and multi-week hypertrophy stimulus.

Instead of static PNG/JPEG illustrations, the muscle map is a scalable, accessible SVG system driven by deterministic domain calculations.

---

## 1. Core Architecture

The system maintains strict architectural separation:

```
Exercise / Workout / Analytics Data
               ↓
src/domain/muscles/muscle-stimulus.ts
(Deterministic working sets × muscle role weights)
               ↓
src/domain/muscles/muscle-types.ts
(Normalized intensity: 0.0 to 1.0)
               ↓
src/components/muscle-map/MuscleMap.tsx
(FrontBodyMap / BackBodyMap / MuscleRegion / Tooltips)
```

---

## 2. Canonical Muscle Taxonomy

Anatomical identifiers are defined in [`src/domain/muscles/muscle-types.ts`](file:///e:/GymOS/src/domain/muscles/muscle-types.ts):

| Region | Muscle ID | Display Label |
|---|---|---|
| **Pectorals** | `chest` | Chest (Pectorals) |
| **Deltoids** | `front_delts`, `side_delts`, `rear_delts` | Front, Side, and Rear Deltoids |
| **Arms** | `biceps`, `triceps`, `forearms` | Biceps, Triceps, Forearms |
| **Back** | `lats`, `traps`, `upper_back`, `lower_back` | Lats, Trapezius, Upper Back, Lower Back |
| **Core** | `abs`, `obliques` | Abdominals, Obliques |
| **Lower Body** | `glutes`, `quads`, `hamstrings`, `calves` | Glutes, Quadriceps, Hamstrings, Calves |

### Prisma Enum Mapping
Prisma's `MuscleGroup` enums are mapped deterministically:
- `CHEST` → `["chest"]`
- `BACK` → `["lats", "upper_back", "traps", "lower_back"]`
- `SHOULDERS` → `["front_delts", "side_delts", "rear_delts"]`
- `LEGS` → `["quads", "hamstrings"]`
- `GLUTES` → `["glutes"]`
- `BICEPS` → `["biceps"]`
- `TRICEPS` → `["triceps"]`
- `ABS` → `["abs", "obliques"]`
- `CALVES` → `["calves"]`

---

## 3. Deterministic Stimulus Engine

Stimulus is calculated from completed working sets:

$$\text{Stimulus} = \text{Completed Working Sets} \times \text{Role Weight}$$

Where:
- **Primary Muscle**: $1.0$
- **Secondary Muscle**: $0.45$

### Normalization
Raw cumulative stimulus values across a session or timeframe are normalized from $0.0$ to $1.0$:

$$\text{Normalized Intensity} = \frac{\text{Raw Stimulus}}{\max(\text{Raw Stimulus})}$$

### Semantic Color Tokens
- `INACTIVE` ($0.0$): Slate `#1A2230` border `#2A364F`
- `LOW` ($> 0.0$ to $< 0.3$): Emerald $20\%$ (`rgba(16, 185, 129, 0.22)`)
- `MODERATE` ($0.3$ to $< 0.6$): Emerald $45\%$ (`rgba(16, 185, 129, 0.45)`)
- `HIGH` ($0.6$ to $< 0.85$): Emerald $75\%$ (`rgba(16, 185, 129, 0.75)`)
- `VERY_HIGH` ($\ge 0.85$): Emerald solid `#10B981` with glow `rgba(16, 185, 129, 0.45)`

---

## 4. UI Integrations

1. **Exercise Library (`/exercises/[id]`)**:
   - Renders Front and Back body maps highlighting Primary and Secondary drivers.
   - Includes interactive hover/tap tooltips.

2. **Workout Logger Completion Summary (`/workouts`)**:
   - When finishing a workout, renders an interactive summary modal displaying session duration, total sets, volume tonnage, and the **Muscles Stimulated Today** heatmap.

3. **Analytics Deep-Dive (`/analytics`)**:
   - Renders a multi-timeframe (`Last 7 Days`, `Last 30 Days`, `All Time`) interactive heatmap with an anatomical stimulus breakdown list.

---

## 5. Accessibility & Mobile

- **Mobile View**: Switches between Anterior (Front) and Posterior (Back) views using pill buttons to preserve readability on small screens.
- **Desktop View**: Shows Front and Back views side-by-side.
- **Accessibility**: Keyboard navigable (`tabIndex={0}`, `role="button"`), visible focus outlines, and `aria-label` describing muscle name and stimulus percentage.
