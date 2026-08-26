# GymOS — Fitness Operating System

GymOS is a modern, modular fitness tracking and workout management platform designed for serious gym-goers and fitness enthusiasts.

## Architecture

GymOS is structured as a **modular monolith** using Next.js App Router, TypeScript, Tailwind CSS, Prisma ORM, and PostgreSQL.

```
UI (React Components / Layouts)
  ↓
Server Actions / API Handlers
  ↓
Application Services (Orchestration)
  ↓
Pure Domain Logic (Volume, 1RM, PR Detection, Progressive Overload)
  ↓
Repositories / Data Access
  ↓
PostgreSQL via Prisma ORM
```

## Getting Started

### Prerequisites

- Node.js 20+ (Node 22 recommended)
- PostgreSQL database instance

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update `DATABASE_URL` with your PostgreSQL connection string.

3. Generate Prisma client & sync database schema:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Testing & Quality

- **Unit Tests**: `npm run test` (Vitest unit tests for pure domain logic)
- **Type Checking**: `npm run typecheck` (TypeScript strict mode)
- **Linting**: `npm run lint` (ESLint)
- **Formatting**: `npm run format` (Prettier)
- **E2E Tests**: `npm run test:e2e` (Playwright tests)
- **Production Build**: `npm run build` (Next.js production build)

## Core Domains

- **Identity**: Authentication, User Sessions, User Profile
- **Exercise**: Exercise Library, Muscle Groups, Equipment, Difficulty
- **Training**: Workout Programs, Workout Days, Planned Exercises, Active Logging, Set Tracking
- **Progress**: Personal Records (PRs), Body Measurements, Weight History, 1RM Estimation
- **Intelligence**: Progressive Overload Engine (Deterministic rules in Phase 1)
