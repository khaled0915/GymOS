# GymOS — Architecture

## 1. Architecture Goal

Build a modular application that can start as a single-user project but scale into a multi-user SaaS.

Avoid premature microservices.

The initial system should be a modular monolith.

## 2. High-Level Architecture

```text
                    Browser / Mobile Web
                           |
                           v
                    Next.js Application
                           |
              ┌────────────┴────────────┐
              |                         |
              v                         v
        Server Actions / API       Authentication
              |
              v
        Application Services
              |
              v
          Domain Logic
              |
              v
        Repository / ORM
              |
              v
         PostgreSQL
```

## 3. Core Domains

### Identity

Responsible for:

* Users
* Authentication
* Sessions
* Profiles

### Exercise

Responsible for:

* Exercise library
* Muscle groups
* Equipment
* Exercise alternatives

### Training

Responsible for:

* Programs
* Workout days
* Planned exercises
* Workout sessions
* Sets
* Workout completion

### Progress

Responsible for:

* Personal records
* Body measurements
* Weight history
* Exercise progression
* Training volume

### Nutrition

Phase 2.

Responsible for:

* Foods
* Meals
* Calories
* Macros
* Nutrition goals

### Intelligence

Phase 3.

Responsible for:

* Progressive overload
* Training insights
* AI Coach

## 4. Domain Relationships

```text
User
 |
 ├── Profile
 ├── Programs
 │     └── Workout Days
 │           └── Planned Exercises
 │
 ├── Workout Sessions
 │     └── Exercise Logs
 │           └── Sets
 │
 ├── Body Measurements
 ├── Personal Records
 └── Nutrition Records
```

## 5. Architectural Rules

UI components should not directly implement complex fitness calculations.

Example:

Bad:

React component calculates PR, volume, and progression.

Good:

Workout UI
→ Training service
→ Progression domain logic

## 6. Progressive Overload

Keep recommendation logic independent of the UI.

Example interface:

```text
getNextExerciseRecommendation(
    exerciseHistory,
    targetRepRange,
    progressionRules
)
```

The implementation can initially be deterministic.

AI can later consume the same domain data without replacing the core logic.

## 7. API Boundaries

External input must be validated.

Use schemas for:

* Authentication input
* Workout creation
* Set logging
* Body measurements
* Nutrition records

## 8. Scaling Strategy

Start with:

* One application
* One PostgreSQL database
* Object storage
* Background jobs only when necessary

Scale later using:

* Caching
* Database indexing
* Queues
* Background workers
* CDN
* Read replicas

Do not introduce these prematurely.

## 9. Observability

Eventually include:

* Structured logging
* Error tracking
* Request metrics
* Database performance monitoring
* Health endpoint

## 10. Security Boundaries

Private resources must always be scoped to the authenticated user.

Never rely only on frontend checks.

Server-side authorization is mandatory.

## 11. Deployment

Initial deployment should use a simple managed deployment architecture.

Containerization should remain supported so the application can later be deployed to AWS or another cloud provider.

## 12. Architectural Decision

The application should remain a modular monolith until there is a demonstrated reason to split services.
