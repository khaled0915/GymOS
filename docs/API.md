# GymOS — API Specification

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

## Profile

```text
GET    /api/profile
PATCH  /api/profile
DELETE /api/profile
```

## Exercises

```text
GET /api/exercises
GET /api/exercises/:id
POST /api/exercises
PATCH /api/exercises/:id
DELETE /api/exercises/:id
```

System exercises should have stricter permissions than user-created exercises.

## Programs

```text
GET    /api/programs
POST   /api/programs
GET    /api/programs/:id
PATCH  /api/programs/:id
DELETE /api/programs/:id
```

## Workout Days

```text
POST   /api/programs/:programId/days
PATCH  /api/workout-days/:id
DELETE /api/workout-days/:id
```

## Planned Exercises

```text
POST   /api/workout-days/:dayId/exercises
PATCH  /api/planned-exercises/:id
DELETE /api/planned-exercises/:id
```

## Workout Sessions

```text
POST /api/workouts
GET  /api/workouts
GET  /api/workouts/:id
PATCH /api/workouts/:id
```

## Set Logging

```text
POST   /api/workouts/:workoutId/exercises/:exerciseId/sets
PATCH  /api/sets/:id
DELETE /api/sets/:id
```

## Progress

```text
GET  /api/progress/weight
POST /api/progress/weight

GET  /api/progress/measurements
POST /api/progress/measurements

GET /api/progress/exercises/:exerciseId
GET /api/progress/prs
GET /api/progress/volume
```

## Dashboard

```text
GET /api/dashboard
```

The dashboard endpoint should return only the data required for the dashboard.

## Future AI

```text
POST /api/ai/workout-analysis
POST /api/ai/progress-summary
POST /api/ai/workout-recommendation
```

AI endpoints must be added only after the underlying fitness data model is stable.
