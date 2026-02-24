# Trade Log

A personal web app for recording, analyzing, and journaling stock and options trades. Built to replace a manual Google Sheets workflow with automated analytics and rule-based feedback.

> Currently in active development - Phase 1 in progress.

## Why this project

- **Real problem, real data** - I was tracking trades manually in Google Sheets; the workflow broke down as trade volume grew and cross-month analysis became painful to maintain.
- **Deliberate stack choices** - built as a typed monorepo with a separated API, background job layer, and shared domain types to practice the kind of architecture decisions that matter at scale, not just the ones that matter at MVP.
- **Learning outcomes** - hands-on with Prisma migration discipline, BullMQ job design, structured observability, and CI-gated delivery as a solo developer.

---

## Current capabilities

> What is actually working today.

- Trade entry and editing (long/short, stock/options)
- Realized P&L calculation with fees
- Win/Loss derivation from P&L after fees
- Basic auth (single-user protection)
- PostgreSQL persistence via Prisma

---

## Screenshots

<!-- TODO: Add a screenshot or GIF of the current UI here. -->
<!-- Example: ![Trade list view](./docs/screenshots/trade-list.png) -->

*Screenshots will be added at the end of Phase 1.*

---

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
| CI | GitHub Actions |

---

## Project structure

```
apps/
  web/        # Next.js frontend
  api/        # NestJS REST API
  worker/     # BullMQ background jobs (Phase 4+)
packages/
  shared/     # Domain types, DTOs, constants
  config/     # Shared ESLint + TypeScript config
  utils/      # Shared utilities
```

---

## Getting started

### Prerequisites

- Node 20 (see `.nvmrc`)
- pnpm 8 (see `packageManager` in `package.json`)
- Docker + Docker Compose

### Setup

**1. Clone the repo**

```bash
# TODO: Replace with your real repository URL before publishing
git clone https://github.com/your-username/trade-log.git
cd trade-log
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Copy environment variables**

macOS/Linux:
```bash
cp .env.example .env
```

Windows (PowerShell):
```powershell
Copy-Item .env.example .env
```

Then open `.env` and fill in the required values for Phase 1 (`DATABASE_URL`, `API_PORT`, `JWT_SECRET`, `LOG_LEVEL`).

**4. Start local infrastructure**

```bash
# Starts PostgreSQL (required for Phase 1)
# Redis is included but not required until Phase 4 - safe to leave running
docker compose up -d
```

**5. Run migrations and seed**

```bash
pnpm --filter api prisma migrate dev
pnpm --filter api prisma db seed
```

The seed includes 20+ realistic trades covering win/loss, long/short, and fee scenarios.

**6. Start all apps**

```bash
pnpm dev
```

- Frontend: `http://localhost:3000`
- API: `http://localhost:3001/v1`

---

## Environment variables

All required variables are declared in `.env.example`. Never commit `.env` or credentials.

| Variable | Description | Required from |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Phase 1 |
| `REDIS_URL` | Redis connection string | Phase 4 |
| `API_PORT` | NestJS API port (default: 3001) | Phase 1 |
| `JWT_SECRET` | Secret for auth tokens | Phase 1 |
| `BROKER_API_KEY` | Broker API key | Phase 4 |
| `BROKER_API_SECRET` | Broker API secret | Phase 4 |
| `LOG_LEVEL` | Log verbosity (`debug\|info\|warn\|error`) | Phase 1 |

---

## API example

All routes are prefixed with `/v1`. Errors follow a consistent shape:

> **Note:** Example payload below is illustrative; exact fields may change during Phase 1.

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "statusCode": 400
}
```

**Create a trade**

```http
POST /v1/trades
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "symbol": "AAPL",
  "side": "LONG",
  "quantity": 10,
  "entryPrice": 175.50,
  "exitPrice": 182.00,
  "fees": 1.50,
  "entryDate": "2024-01-15T09:30:00Z",
  "exitDate": "2024-01-22T14:45:00Z"
}
```

```json
{
  "id": "clx1a2b3c0000abc123",
  "symbol": "AAPL",
  "side": "LONG",
  "quantity": 10,
  "entryPrice": 175.50,
  "exitPrice": 182.00,
  "fees": 1.50,
  "pnl": 63.50,
  "result": "WIN",
  "entryDate": "2024-01-15T09:30:00Z",
  "exitDate": "2024-01-22T14:45:00Z",
  "createdAt": "2024-01-22T15:00:00Z"
}
```

<!-- TODO: Update this example once the real schema is finalised in Phase 1. -->

---

## Development

```bash
# Run all tests
pnpm test

# Lint
pnpm lint

# Typecheck
pnpm typecheck

# Target a specific app during development
pnpm --filter api test
pnpm --filter web dev
```

Run the full gate before merging:

```bash
pnpm test && pnpm lint && pnpm typecheck
```

CI runs this gate automatically on every push and PR via GitHub Actions.

---

## Roadmap

| Phase | Scope | Status |
|---|---|---|
| 1 | Core CRUD + DB schema + basic UI + auth | In progress |
| 2 | Monthly analytics dashboard | Pending |
| 3 | CSV import pipeline | Pending |
| 4 | Broker API sync + background jobs | Pending |
| 5 | AWS deployment hardening | Pending |

---

## Contributing

This is a personal portfolio project and not open to external contributions at this stage. The codebase follows [Conventional Commits](https://www.conventionalcommits.org/) and all changes go through CI before merging to `main`.

See [AGENTS.md](./AGENTS.md) for full engineering conventions, phase rules, and the definition of done.

---

## License

MIT
