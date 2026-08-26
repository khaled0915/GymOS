# GymOS —

## Project

GymOS is a fitness tracking platform.

The primary product loop is:

Plan → Train → Log → Analyze → Improve.

The application must prioritize workout logging and progression.

## Engineering Principles

* Prefer simple, maintainable solutions.
* Do not introduce dependencies without a clear reason.
* Avoid premature abstraction.
* Keep business logic separate from UI.
* Validate all external input.
* Never trust client-side authorization.
* Never expose secrets.
* Write tests for important business logic.
* Run linting, type checking, and tests after meaningful changes.
* Do not silently modify unrelated code.

## Product Principles

* Workout logging is the highest-priority workflow.
* Mobile usability is critical.
* Users should see previous performance while logging a set.
* Progressive overload should initially use deterministic rules.
* AI must not be required for core functionality.
* Do not build social features before the MVP is stable.

## Architecture

Use a clear separation between:

UI
→ Application logic
→ Domain logic
→ Data access

Do not place complex business rules directly inside React components.

## Database

All persistent user data must belong to an authenticated user unless explicitly designed otherwise.

Never allow one user to read or modify another user's private records.

## API

Every API endpoint must:

1. Validate input.
2. Authenticate the request when required.
3. Authorize access to the requested resource.
4. Execute business logic.
5. Return a consistent response.

## Type Safety

Use TypeScript strictly.

Avoid:

* `any`
* unsafe casts
* duplicated types
* unvalidated external data

Use schema validation at boundaries.

## UI

Use a consistent design system.

Prefer reusable components.

Do not create large monolithic components.

The workout logger should minimize taps and typing.

## Error Handling

Never silently swallow errors.

User-facing errors should be understandable.

Developer errors should contain enough context for debugging without exposing secrets.

## Testing

Important business logic must have automated tests.

Prioritize tests for:

* Workout calculations
* Progressive overload
* Personal records
* Volume calculations
* Authorization
* Data validation

## Git

Use small, focused commits.

Do not mix unrelated features in one change.

Before completing a task:

* Run tests.
* Run lint.
* Run type checking.
* Review changed files.
* Report any remaining issues.

## Documentation

Read relevant files in `docs/` before implementing large features.

Update documentation when architecture or product behavior changes.

Do not put the entire project specification into this file.

This file is a map to the repository documentation.

## Implementation Behavior

When a task is ambiguous:

1. Inspect the repository.
2. Read relevant documentation.
3. Determine the smallest reasonable implementation.
4. Implement it.
5. Test it.
6. Report assumptions.

Do not invent major product requirements.

## Safety

Fitness recommendations are not medical advice.

Do not implement diagnosis or treatment functionality.

Do not make medical claims without appropriate evidence.

## Definition of Done

A feature is not complete merely because it compiles.

A feature is complete when:

* It works.
* It is tested appropriately.
* It follows architecture rules.
* It handles errors.
* It does not introduce obvious security issues.
* Relevant documentation is updated.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
