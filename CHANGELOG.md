# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-04-07

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
