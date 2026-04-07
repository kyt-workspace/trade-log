# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-04-07

### Added
- Applied first Prisma migration `20260407143159_init_trade` against local Postgres, creating the `trades` table, `TradeSide` enum, and indexes on `symbol`/`entryAt`/`exitAt`.
- Hand-added two CHECK constraints to the migration SQL (Data Integrity Rule 6):
  - `trades_fees_nonneg`: `"fees" >= 0`
  - `trades_exit_consistency`: `("exitAt" IS NULL) = ("exitPrice" IS NULL)`
- Seeded local database with 21 trades via `prisma db seed` (idempotent on `idempotencyKey`).

### Changed
- Removed the custom `output` path from the Prisma generator in `apps/api/prisma/schema.prisma` so `@prisma/client` re-exports the generated `TradeSide` enum and `Prisma.Decimal` runtime — required for `prisma/seed.ts` to type-check and execute.

### Added
- Added Prisma to `apps/api` (`prisma@5.22.0`, `@prisma/client@5.22.0`, `ts-node@10.9.2`).
- Added `apps/api/prisma/schema.prisma` with the Phase 1 `Trade` model: `cuid` id, `symbol` (varchar 16), `TradeSide` enum (`LONG|SHORT`), `Decimal(18,6)` quantity/prices/fees, nullable `exitPrice`/`exitAt` for open positions, `rawPayload` JSON for audit (Data Integrity Rule 4), unique `idempotencyKey` (Rule 5), and indexes on `symbol`/`entryAt`/`exitAt` (Rule 7).
- Added `PrismaService` (`OnModuleInit`/`OnModuleDestroy`) and a `@Global` `PrismaModule` in `apps/api/src/prisma/`. Defined but **not yet imported into `AppModule`** so existing e2e tests do not require a live Postgres at boot — it will be wired in alongside the `/v1/trades` endpoints.
- Added `apps/api/prisma/seed.ts` seeding 21 realistic trades (long/short, win/loss, with fees, plus one open position) via `upsert` keyed on `idempotencyKey` so reseeding is safe.
- Added `apps/api` package scripts: `prisma:generate`, `prisma:migrate`, `prisma:studio`, `prisma:seed`, plus a `prisma` config block pointing `prisma db seed` at `prisma/seed.ts` via `ts-node`.


### Added
- Bootstrapped real NestJS application in `apps/api` with `AppModule`, `HealthModule`, and a `HealthController` mounted under the global `/v1` prefix.
- Added `createApp` factory in `src/bootstrap.ts` so HTTP integration tests can boot the full Nest app without binding a port.
- Added global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`, `transform`) and a global `HttpExceptionFilter` that emits the AGENTS standard error shape (`error`, `code`, `statusCode`).
- Added first `supertest` integration test (`__tests__/health.e2e.spec.ts`) covering the `/v1/health` happy path and the standard 404 error envelope.
- Added runtime dependencies in `apps/api`: `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `reflect-metadata`, `rxjs`, `class-validator`, `class-transformer`. Added dev dependencies: `supertest`, `@types/supertest`, `@types/express`.

### Changed
- Enabled `experimentalDecorators` and `emitDecoratorMetadata` in `apps/api/tsconfig.json` (and disabled `strictPropertyInitialization` locally) to support Nest decorator metadata while keeping the strict baseline elsewhere.
- Replaced the `apps/api` `dev` placeholder script with a real `pnpm build && node dist/main.js` runner and added a `start` script.

## [Unreleased] - 2026-02-25

### Added
- Bootstrapped monorepo foundation with `pnpm` workspaces and `turborepo`.
- Added root tooling files: `.nvmrc`, `.gitignore`, `package.json`, `pnpm-workspace.yaml`, `turbo.json`.
- Added required workspace structure: `apps/web`, `apps/api`, `apps/worker`, `packages/shared`, `packages/config`, `packages/utils`.
- Added environment and infra scaffolding: `.env.example` and `docker-compose.yml` (PostgreSQL + Redis).
- Added CI workflow at `.github/workflows/ci.yml` with install, typecheck, lint, and test gates.
- Added real API quality baseline in `apps/api` with ESLint config (`.eslintrc.cjs`), Jest + ts-jest config (`jest.config.cjs`, `tsconfig.spec.json`), and a first unit test (`__tests__/health.spec.ts`).

### Changed
- Updated project Node version standard to `24.13.1` in `.nvmrc`, `README.md`, and `AGENTS.md`.
- Updated root `devDependencies` to exact versions (`turbo@2.8.11`, `typescript@5.9.3`).
- Updated `apps/web/tsconfig.json` to include `.tsx` files.
- Updated `turbo.json` test task outputs to `[]` to remove placeholder test warnings.
