# Next Session Plan

Date captured: 2026-02-25

## Current checkpoint

- Monorepo scaffold is in place and validated.
- Root quality commands pass via `corepack pnpm` (`typecheck`, `lint`, `test`).
- CI workflow exists at `.github/workflows/ci.yml`.
- `apps/api` has real ESLint + Jest + one passing unit test (`health.spec.ts`).
- `apps/web`, `apps/worker`, `packages/shared`, and `packages/utils` still use placeholder lint/test scripts.

## Recommended first task next session

- Bootstrap real NestJS app structure in `apps/api` (module/controller/main).
- Add first `/v1` endpoint integration test with `supertest`.
- Keep scope Phase 1 only.

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
```

## Known environment caveats

- In this environment, direct `pnpm` can fail in PowerShell due `pnpm.ps1` execution policy restrictions.
- Use `corepack pnpm ...` if direct `pnpm ...` is blocked.
- A forced reinstall may occasionally require elevated permissions if Windows file locks cause `EPERM`.

## Optional one-time PowerShell fix

Run once in PowerShell to allow direct `pnpm` execution for your user profile:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force
```
