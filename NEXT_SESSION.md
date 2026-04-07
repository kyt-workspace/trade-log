# Next Session Plan

Date captured: 2026-04-07

## Current checkpoint

- Monorepo scaffold validated; root `typecheck`, `lint`, `test` all pass via `corepack pnpm`.
- CI workflow at `.github/workflows/ci.yml` is in place.
- `apps/api` is a real NestJS app:
  - `AppModule` -> `HealthModule` -> `HealthController` exposed at `GET /v1/health`.
  - Global `/v1` prefix, `ValidationPipe`, and `HttpExceptionFilter` (standard error shape from AGENTS.md) wired in `src/bootstrap.ts`.
  - Integration test `__tests__/health.e2e.spec.ts` covers the happy path and the 404 standard error envelope.
- Prisma is fully bootstrapped:
  - Migration `20260407143159_init_trade` applied to local Postgres, including hand-added CHECK constraints `trades_fees_nonneg` and `trades_exit_consistency`.
  - Database seeded with 21 trades via `prisma db seed` (idempotent on `idempotencyKey`).
  - `PrismaService` / `@Global` `PrismaModule` exist in `apps/api/src/prisma/` but are **not yet imported into `AppModule`** (held back so e2e tests don't need a live DB at boot).
- `apps/web`, `apps/worker`, `packages/shared`, and `packages/utils` still use placeholder lint/test scripts.

## Recommended first task next session

1. Wire `PrismaModule` into `AppModule`. Update e2e tests to either spin up a test DB or mock `PrismaService` at the module boundary.
2. Add trade calculation utilities in `packages/shared` (or `packages/utils`):
   - P&L including fees.
   - Win/loss derived from realized P&L after fees.
   - Unit tests covering long, short, and zero-fee edge cases (Phase 1 testing matrix).
3. Add `/v1/trades` create + read endpoints in `apps/api`:
   - DTOs with `class-validator`.
   - Integration tests for happy path AND a 400 validation failure (AGENTS API Standards).

## Backlog (Phase 1 remaining after the slice above)

- Single-user JWT auth using `JWT_SECRET`; guard `/v1/trades`.
- Minimal Next.js UI in `apps/web` (trade list + create form).
- Promote `apps/web`, `apps/worker`, `packages/shared`, `packages/utils` off placeholder lint/test scripts.
- Phase 1 closeout: README screenshot/GIF, trade-offs note, strip TODO placeholders (Portfolio Output Rule).

## Startup commands

```powershell
cd C:\CodeWithKYT\kyt-workspace\trade-log
corepack pnpm install
docker compose up -d
corepack pnpm typecheck
corepack pnpm lint
corepack pnpm test
```

For API-only iteration:

```powershell
corepack pnpm --filter @trade-log/api typecheck
corepack pnpm --filter @trade-log/api lint
corepack pnpm --filter @trade-log/api test
corepack pnpm --filter @trade-log/api build
corepack pnpm --filter @trade-log/api start
```

Prisma helpers (run from `apps/api`):

```powershell
corepack pnpm exec prisma migrate dev
corepack pnpm exec prisma studio
corepack pnpm prisma:seed
```

## Known environment caveats

- `.env` must exist at both repo root and `apps/api/.env` (Prisma CLI loads from the schema directory). Both are git-ignored; copy from `.env.example`.
- In this environment, direct `pnpm` can fail in PowerShell due to `pnpm.ps1` execution policy restrictions. Use `corepack pnpm ...` if direct `pnpm ...` is blocked.
- If `prisma migrate` ever times out acquiring the advisory lock after a killed run, restart the postgres container: `docker restart trade-log-postgres`.

## Optional one-time PowerShell fix

Run once in PowerShell to allow direct `pnpm` execution for your user profile:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
```
