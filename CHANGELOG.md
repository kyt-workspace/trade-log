# Changelog

All notable changes to this project will be documented in this file.

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
