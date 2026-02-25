# AGENTS.md

## Purpose
Trade Log is a web app for recording and analyzing personal stock/option trades.
This guide keeps delivery fast for a solo developer while preserving portfolio-quality standards.

## Product Goals
1. Replace manual Google Sheets workflow.
2. Automate monthly performance analytics.
3. Add rule-based journal feedback (mistakes/plan adherence).
4. Keep architecture AWS-ready for later deployment.

## Delivery Strategy (Phase-Gated)
Implement in order. Do not silently absorb future-phase scope into current work unless it directly unblocks current delivery.

1. Phase 1: Core CRUD + DB schema + basic UI (includes basic auth - single-user protection)
2. Phase 2: Monthly analytics dashboard
3. Phase 3: CSV import pipeline
4. Phase 4: Broker API sync + background jobs
5. Phase 5: AWS deployment hardening

If a task spans phases, split it. If not possible, document the phase exception in the commit message.

## Locked Tech Stack
- Monorepo: `pnpm` workspaces + `turborepo`
- Frontend: `Next.js` + TypeScript + Tailwind + `shadcn/ui`
- Backend: `NestJS` (REST)
- DB: `PostgreSQL` + `Prisma`
- Jobs: `BullMQ` + `Redis` (Phase 4+)
- Local infra: `Docker Compose`
- Testing: `Jest` + `Supertest`

Major new dependencies are allowed only when they materially reduce complexity or delivery risk. Document the rationale in commit/PR notes.

## Repository Conventions
Expected structure:
- `apps/web` -> Next.js app
- `apps/api` -> NestJS API
- `apps/worker` -> BullMQ workers (Phase 4+)
- `packages/shared` -> domain types, constants, DTOs, job name constants
- `packages/config` -> shared TS/ESLint config
- `packages/utils` -> shared utilities

Rules:
1. TypeScript strict mode on everywhere.
2. No `any` unless explicitly justified inline.
3. Changes in `packages/shared` require cross-app validation (`web`, `api`, `worker` where applicable).
4. Tests live in `__tests__/` near source or in top-level `tests/` for cross-app integration.

## API Standards
1. Prefix all routes with `/v1` (example: `GET /v1/trades`).
2. While private and early v1, response refinements are allowed if documented in changelog/commit notes. Refinements must remain backward-compatible within v1.
3. Once external users/clients depend on the API, breaking changes require `/v2`.
4. Standard error response shape:

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "statusCode": 400
}
```

5. Never expose stack traces or raw exception objects.
6. Add integration tests for validation failures (400) for each new endpoint group.

## Environment & Secrets

All required variables must be declared in root `.env.example`.

| Variable | Description | Required from |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Phase 1 |
| `REDIS_URL` | Redis connection string | Phase 4 |
| `API_PORT` | NestJS API port (default: 3001) | Phase 1 |
| `JWT_SECRET` | Secret for auth tokens | Phase 1 |
| `BROKER_API_KEY` | Broker API key | Phase 4 |
| `BROKER_API_SECRET` | Broker API secret | Phase 4 |
| `LOG_LEVEL` | Log level (`debug\|info\|warn\|error`) | Phase 1 |

Rules:
1. Never commit `.env` or credentials.
2. Never log tokens, secrets, raw credentials, or broker auth payloads.

## Engineering Rules
1. Prefer small vertical slices (DB -> API -> UI).
2. Every feature must include:
   - Input validation
   - Structured error handling
   - At least one meaningful test
3. No silent data transformations.
4. Log import/parse decisions with enough context to reproduce/debug.
5. Avoid refactoring unrelated code unless it blocks current work.

## Data Integrity Rules (v1)
1. P&L includes fees.
2. Win/Loss derives from realized P&L after fees.
3. Support long and short trades.
4. Preserve raw import payload for audit/debug.
5. Prevent duplicate imports via idempotency key.
6. Enforce DB constraints where practical:
   - Non-negative fees
   - Valid side enum (`LONG|SHORT`)
   - Required timestamps for realized trades
7. Add DB indexes for common filters (`symbol`, `entry_date`, `exit_date`) by end of Phase 2.

## Prisma & Migration Policy
1. Never edit or delete applied migrations.
2. Every schema change requires a new migration.
3. Migration PRs must include:
   - Schema diff explanation
   - Backward-compatibility note
   - Rollback/mitigation note (if risky)
4. Validate migrations against non-empty/dev-like data before merge.
5. Maintain a seed path for local onboarding (`prisma db seed`). Seed must include at least 20 realistic trades covering win/loss, long/short, and fees.

## Worker Rules (Phase 4+)
1. Each job defines:
   - Job name constant (from `packages/shared`)
   - Typed input
   - Retry policy
   - Failure handler
2. Default retry policy: 3 attempts with exponential backoff.
3. Permanent failures are recorded in DB dead-letter records with payload + error metadata.
4. Avoid public HTTP calls from worker to API in production paths.

## Observability Baseline
1. Use structured logs.
2. Include request/job correlation ID where possible.
3. Control verbosity with `LOG_LEVEL`.
4. Never include sensitive values in logs.

## CI Pipeline
GitHub Actions runs the full quality gate on every push and PR:
```yaml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 24.13.1
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
```
Pin these versions in `.nvmrc` (Node 24.13.1) and the `packageManager` field in root `package.json` (pnpm 8) so local dev matches CI exactly.

Keep CI green on `main` at all times. A failing gate blocks merge. Enable branch protection on `main` with this workflow set as a required status check.

## Testing & Quality Gates

Core commands:
```bash
pnpm test
pnpm lint
pnpm typecheck
```

Use `--filter` for app-specific runs during development (e.g. `pnpm --filter api test`).

Minimum expectations by phase:

| Phase | Required tests |
|---|---|
| Phase 1 | Trade calculation unit tests + create/read API integration test |
| Phase 2 | Analytics correctness integration test |
| Phase 3 | Duplicate-import protection test |
| Phase 4+ | Worker/job behavior tests |

Run the full gate (`pnpm test && pnpm lint && pnpm typecheck`) before merging to main or tagging a release.

## Definition of Done
A task is done only when:
1. Code is implemented and typed.
2. Relevant tests pass locally.
3. Lint and typecheck pass for touched scope (full run before merge/release).
4. README updated if setup/runtime behavior changed materially.
5. Commit message clearly states intent and scope (Conventional Commits).

## Git Workflow (Solo)
1. Conventional Commits required: `feat:`, `fix:`, `chore:`.
2. Branches optional; recommended for risky or multi-file changes.
3. Keep commits focused and reviewable.
4. `main` should remain deployable; avoid direct risky refactors on main.

## Breaking Change Checklist
Before merging API/shared-type changes:
1. List impacted apps/packages.
2. Confirm whether a migration is required.
3. Update/extend tests.
4. Add a changelog note to `CHANGELOG.md` at the repo root.
5. Confirm backward compatibility or document intentional break.

## Explicit Non-Goals (until Phase 5+)
1. Multi-tenant architecture
2. Billing/subscriptions
3. Complex RBAC
4. Premature microservices split

## Portfolio Output Rule
At the end of each phase, add:
1. README update (what was built, how to run)
2. Screenshot or short GIF
3. Brief note on trade-offs and lessons learned
4. Remove any placeholder TODO comments in README (screenshots, API examples, URLs) so the README looks fully complete before the phase is tagged.

## Ambiguity Protocol
If ambiguity affects architecture, contracts, or phase boundaries:
1. State what is unclear.
2. Provide 2-3 options with trade-offs.
3. Recommend one default.
4. Confirm before proceeding.
