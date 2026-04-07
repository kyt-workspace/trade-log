# Next Session Plan

Date captured: 2026-04-07

## Current checkpoint

- Monorepo scaffold validated; root `typecheck`, `lint`, `test` all pass via `corepack pnpm`.
- CI workflow at `.github/workflows/ci.yml` is in place.
- `apps/api` is now a real NestJS app:
  - `AppModule` -> `HealthModule` -> `HealthController` exposed at `GET /v1/health`.
  - Global `/v1` prefix, `ValidationPipe`, and `HttpExceptionFilter` (standard error shape from AGENTS.md) wired in `src/bootstrap.ts`.
  - Integration test `__tests__/health.e2e.spec.ts` covers the happy path and the 404 standard error envelope using `supertest`.
  - Original `health.spec.ts` unit test still passes.
- `apps/web`, `apps/worker`, `packages/shared`, and `packages/utils` still use placeholder lint/test scripts.

## Recommended first task next session

Begin the Trade vertical slice (Phase 1, DB -> API -> UI):

1. Add Prisma to `apps/api`:
   - `schema.prisma` with a `Trade` model honoring Data Integrity Rules (`LONG|SHORT` enum, fees >= 0 check, entry/exit timestamps, raw payload JSON, idempotency key unique).
   - First migration against the local Postgres from `docker-compose.yml`.
   - `PrismaModule` + `PrismaService` injected into Nest.
   - `prisma db seed` script seeding >= 20 realistic trades (mix of win/loss, long/short, with fees).
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

## Known environment caveats

- In this environment, direct `pnpm` can fail in PowerShell due to `pnpm.ps1` execution policy restrictions.
- Use `corepack pnpm ...` if direct `pnpm ...` is blocked.
- A forced reinstall may occasionally require elevated permissions if Windows file locks cause `EPERM`.

## Optional one-time PowerShell fix

Run once in PowerShell to allow direct `pnpm` execution for your user profile:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
```
