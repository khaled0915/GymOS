# GymOS — Testing Strategy

## 1. Testing Philosophy

Testing should focus on business-critical behavior rather than maximizing line coverage.

## 2. Unit Tests

Required for:

* Volume calculation
* Estimated 1RM
* Progressive overload
* PR detection
* Rep-range validation
* Calorie calculations
* Macro calculations

## 3. Integration Tests

Test:

* Authentication
* Workout creation
* Workout logging
* Workout history
* Authorization
* Database relationships

## 4. End-to-End Tests

Critical flows:

### New user

Register
→ onboarding
→ create program
→ create workout
→ log workout
→ finish workout
→ view history

### Returning user

Login
→ today's workout
→ previous performance
→ log sets
→ finish workout
→ view progress

## 5. Authorization Tests

Explicitly test:

User A cannot:

* Read User B's workout
* Modify User B's workout
* Read User B's measurements
* Modify User B's profile
* Read User B's nutrition records

## 6. Regression

Every bug that affects core business logic should receive a regression test.

## 7. CI

CI should run:

* Formatting check
* Lint
* Type checking
* Unit tests
* Integration tests where practical
* Build

## 8. Definition of Done

A feature is not considered complete if:

* Tests fail
* Type errors remain
* Authorization is incomplete
* Important errors are ignored
* The feature breaks existing core workflows
