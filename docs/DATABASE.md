# GymOS — Database Design

## 1. Database

Primary database:

PostgreSQL.

ORM:

Prisma or another strongly typed ORM selected during implementation.

## 2. Core Entities

### User

```text
User
- id
- email
- name
- password/auth provider data
- createdAt
- updatedAt
```

### Profile

```text
Profile
- id
- userId
- dateOfBirth
- height
- currentWeight
- fitnessGoal
- experienceLevel
- preferredUnit
- createdAt
- updatedAt
```

### Exercise

```text
Exercise
- id
- name
- slug
- primaryMuscle
- secondaryMuscles
- equipment
- difficulty
- instructions
- mediaUrl
- isSystemExercise
- createdAt
- updatedAt
```

### Program

```text
Program
- id
- userId
- name
- description
- isActive
- createdAt
- updatedAt
```

### WorkoutDay

```text
WorkoutDay
- id
- programId
- name
- order
```

### PlannedExercise

```text
PlannedExercise
- id
- workoutDayId
- exerciseId
- order
- targetSets
- minReps
- maxReps
- targetRpe
- restSeconds
- notes
```

### WorkoutSession

```text
WorkoutSession
- id
- userId
- programId
- workoutDayId
- startedAt
- completedAt
- durationSeconds
- notes
```

### ExerciseSession

```text
ExerciseSession
- id
- workoutSessionId
- exerciseId
- order
```

### SetLog

```text
SetLog
- id
- exerciseSessionId
- setNumber
- weight
- repetitions
- rpe
- completed
- notes
```

### BodyMeasurement

```text
BodyMeasurement
- id
- userId
- measurementType
- value
- unit
- measuredAt
```

### PersonalRecord

```text
PersonalRecord
- id
- userId
- exerciseId
- recordType
- value
- achievedAt
- sourceSetId
```

## 3. Important Relationships

```text
User
 ├── Profile
 ├── Program
 │    └── WorkoutDay
 │         └── PlannedExercise
 │              └── Exercise
 │
 ├── WorkoutSession
 │    └── ExerciseSession
 │         └── SetLog
 │
 ├── BodyMeasurement
 └── PersonalRecord
```

## 4. Data Ownership

Every user-specific record must be traceable to a User.

Authorization queries must always scope private records to the authenticated user.

## 5. Indexing

Add indexes for frequently queried fields such as:

* userId
* exerciseId
* workoutSessionId
* programId
* createdAt
* achievedAt

Do not add indexes without considering query patterns.

## 6. Data Integrity

Use database constraints where appropriate.

Examples:

* Positive weight
* Positive repetitions
* Valid set numbers
* Valid foreign keys
* Unique user email
* Valid program relationships

## 7. Deletion

User deletion must define behavior for dependent records.

Use cascading deletion only where appropriate.

Important user data should not become orphaned.

## 8. Units

The system should support:

* Kilograms
* Pounds

Internally choose a consistent representation and convert at the presentation boundary.

## 9. Auditability

Important historical workout records should be immutable where practical.

Do not rewrite completed workout history simply because a new program changes.
