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

The Prisma schema, client, `PrismaService`/`PrismaModule`, and seed script are
all in place. The migration itself was NOT run because Docker isn't available
in the dev shell. Pick up here:

1. With Docker Desktop running, bring up Postgres and run the first migration:
   ```powershell
   docker compose up -d
   corepack pnpm --filter @trade-log/api prisma:migrate -- --name init_trade
   ```
   Then hand-edit the generated SQL in `apps/api/prisma/migrations/<ts>_init_trade/migration.sql` to add:
   - `ALTER TABLE "trades" ADD CONSTRAINT trades_fees_nonneg CHECK ("fees" >= 0);`
   - `ALTER TABLE "trades" ADD CONSTRAINT trades_exit_consistency CHECK (("exitAt" IS NULL) = ("exitPrice" IS NULL));`

   Re-run `prisma migrate dev` to apply the amended SQL.
2. Wire `PrismaModule` into `AppModule` (currently held back so e2e tests don't need a live DB at boot).
3. Seed: `corepack pnpm --filter @trade-log/api prisma:seed` (21 trades, idempotent).
4. Add trade calculation utilities in `packages/shared` (or `packages/utils`):
   - P&L including fees.
   - Win/loss derived from realized P&L after fees.
   - Unit tests covering long, short, and zero-fee edge cases (Phase 1 testing matrix).
5. Add `/v1/trades` create + read endpoints in `apps/api`:
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
