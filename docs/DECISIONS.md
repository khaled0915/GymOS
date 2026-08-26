# GymOS — Architecture Decisions

## ADR-001: Modular Monolith

### Decision

Start with a modular monolith.

### Reason

The initial product will be developed and operated by one developer.

Microservices would increase operational complexity without providing meaningful benefits at MVP scale.

### Future

Services may be extracted when there is a demonstrated scaling or organizational reason.

---

## ADR-002: PostgreSQL

### Decision

Use PostgreSQL as the primary database.

### Reason

The application contains highly relational data:

User
→ Program
→ Workout
→ Exercise
→ Set

PostgreSQL provides strong relational integrity and mature indexing.

---

## ADR-003: Deterministic Progressive Overload

### Decision

Progressive overload recommendations initially use deterministic business rules.

### Reason

The recommendation system should be explainable and testable.

AI can later provide additional context.

---

## ADR-004: AI After Core Product

### Decision

Do not make AI a dependency of the MVP.

### Reason

The product must first collect high-quality structured fitness data.

Without useful workout history, AI recommendations will mostly be generic.

---

## ADR-005: Mobile-First Workout Interface

### Decision

Prioritize mobile UX.

### Reason

Users are most likely to log workouts while physically inside a gym, usually from a phone.

---

## ADR-006: No Social Features in MVP

### Decision

Do not build social functionality initially.

### Reason

Social features add significant complexity but do not validate whether the core workout product is useful.

---

## ADR-007: Fitness Data Is User-Owned

### Decision

Private fitness data belongs to the individual user and must remain private unless explicitly shared.

### Reason

Workout history, body measurements, and nutrition information can be sensitive personal data.
