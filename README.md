# Trade Log

Trade Log is a personal web app for recording and analyzing stock/options trades.
The project is built as a typed monorepo and follows a phase-gated delivery plan.

## Current status

Phase 1 bootstrap is complete at the repository level:

- Monorepo tooling (`pnpm` workspaces + `turborepo`) is configured.
- Required workspace layout is scaffolded (`apps/*`, `packages/*`).
- Shared strict TypeScript baseline is configured.
- Local infrastructure scaffold is available (`docker-compose.yml` with Postgres + Redis).
- Required environment variables are defined in `.env.example`.

Application features are not implemented yet. The current app/workspace scripts are placeholders while the first vertical slice (Trade CRUD + auth) is built.

## Product goals

1. Replace manual Google Sheets trade tracking.
2. Automate monthly performance analytics.
3. Add rule-based journal feedback.
4. Keep architecture AWS-ready for later deployment.

## Tech stack

| Layer | Technology |
|---|---|
| Monorepo | `pnpm` workspaces + `turborepo` |
| Frontend | `Next.js` + TypeScript + Tailwind + `shadcn/ui` |
| Backend | `NestJS` (REST, `/v1`) |
| Database | `PostgreSQL` + `Prisma` |
| Background jobs | `BullMQ` + `Redis` (Phase 4+) |
| Local infra | `Docker Compose` |
| Testing | `Jest` + `Supertest` |

## Project structure

```text
apps/
  web/        # Next.js app scaffold (Phase 1 implementation pending)
  api/        # NestJS app scaffold (Phase 1 implementation pending)
  worker/     # BullMQ worker scaffold (Phase 4+)
packages/
  shared/     # Shared domain types/constants
  config/     # Shared TypeScript configuration
  utils/      # Shared utility functions
```

## Prerequisites

- Node 24.13.1 (pinned in `.nvmrc`)
- pnpm 8 (pinned in root `package.json`)
- Docker + Docker Compose

## Getting started

1. Install dependencies:

```bash
pnpm install
```

2. Create local env file:

macOS/Linux:
```bash
cp .env.example .env
```

Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

3. Start local infrastructure:

```bash
docker compose up -d
```

4. Run workspace scripts:

```bash
pnpm dev
```

At this stage, app scripts confirm scaffold readiness. Feature endpoints/UI are not implemented yet.

## Environment variables

All required variables are declared in `.env.example`.

| Variable | Description | Required from |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Phase 1 |
| `REDIS_URL` | Redis connection string | Phase 4 |
| `API_PORT` | NestJS API port (default: 3001) | Phase 1 |
| `JWT_SECRET` | Secret for auth tokens | Phase 1 |
| `BROKER_API_KEY` | Broker API key | Phase 4 |
| `BROKER_API_SECRET` | Broker API secret | Phase 4 |
| `LOG_LEVEL` | Log level (`debug\|info\|warn\|error`) | Phase 1 |

Never commit `.env` or credentials.

## Development commands

```bash
pnpm test
pnpm lint
pnpm typecheck
```

Filter by workspace during development:

```bash
pnpm --filter @trade-log/api typecheck
pnpm --filter @trade-log/web dev
```

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Core CRUD + DB schema + basic UI + auth | Bootstrap complete, implementation pending |
| 2 | Monthly analytics dashboard | Pending |
| 3 | CSV import pipeline | Pending |
| 4 | Broker API sync + background jobs | Pending |
| 5 | AWS deployment hardening | Pending |

## Engineering rules

Daily engineering rules, API standards, migration policy, and phase boundaries are defined in [AGENTS.md](./AGENTS.md).

## License

MIT
