# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**BioLink** is a full-stack microservices platform connecting Cameron Highlands farmers to distribution hubs in Johor and Singapore. It handles AI-powered produce quality grading, real-time cold-chain telemetry monitoring, and supply chain traceability with digital proof-of-origin (e-PoO).

## Architecture

Five independently runnable components, all starting from the repo root:

```
services/api-gateway/   — Node.js/Express REST API (port 4000)
services/ml-inference/  — FastAPI CNN image grading service (port 8000)
web/                    — React 18 + Vite admin/QC dashboard (port 3000)
mobile/                 — Expo React Native supplier & driver apps
database/               — PostgreSQL schema + seed data (via Docker)
```

Data layer (PostgreSQL + Redis) is managed by `docker-compose.yml` at the repo root.

## Development Commands

### Start the data layer
```bash
docker-compose up -d   # PostgreSQL :5432, Redis :6379
```

### API Gateway (Node.js)
```bash
cd services/api-gateway
npm install
npm run dev     # watch mode
npm test        # node:test smoke tests
npm run lint    # ESLint
```

### ML Inference (Python/FastAPI)
```bash
cd services/ml-inference
pip install -r requirements.txt
uvicorn app.main:app --reload   # :8000
pytest -q                        # tests
```

### Web Dashboard (React/Vite)
```bash
cd web
npm install
npm run dev     # :3000
npm run build   # tsc + vite build (type-checks first)
```

### Mobile (Expo)
```bash
cd mobile
npm install
expo start          # interactive
expo start --android
expo start --ios
```

## Configuration

Copy `.env.example` to `.env` at the repo root and fill in values before starting any service. Key variables:
- `JWT_SECRET` — must be changed from default in production
- `ML_INFERENCE_URL` — API gateway proxies grading requests here
- `AI_CONFIDENCE_THRESHOLD` — default 0.75; predictions below this route to manual review queue
- `ACCOUNT_LOCKOUT_THRESHOLD` — default 5 failed login attempts

Test credentials (seeded by `database/seed.sql`, all use `Password123!`):
- `farmer@biolink.test`, `driver@biolink.test`, `qc@biolink.test`, `admin@biolink.test`

## API Structure

All endpoints are under `/api/v1` and require `Authorization: Bearer <JWT>` except `POST /auth/login`.

JWT payload contains `{ sub: userId, role: "FARMER|DRIVER|QC|ADMIN" }`. Route-level RBAC is enforced by `requireRole(...roles)` middleware in `services/api-gateway/src/middleware/auth.js`.

| Service | Routes file | Roles |
|---------|------------|-------|
| Auth | `routes/auth.js` | public (login), any (me) |
| Harvest batches | `routes/harvest.js` | FARMER, QC, ADMIN |
| Telemetry | `routes/telemetry.js` | DRIVER, ADMIN |
| QC & grading | `routes/qc.js` | QC, ADMIN |
| Admin | `routes/admin.js` | ADMIN only |

Error responses use `{ "error": { "code", "message" } }` with HTTP 401/403/409 where appropriate.

## Data Model & Key Patterns

Six entities in `database/schema.sql`. The central lifecycle is the `HarvestBatch` state machine:
```
SUBMITTED → IN_TRANSIT → RECEIVED → GRADED → {ACCEPTED | REJECTED}
```

**AI grading flow:** `POST /qc/:batchId/grade` proxies a multipart image to the ML service. If confidence ≥ threshold, it generates an e-PoO (tamper-evident QR token). If below threshold, the batch enters a manual review queue.

**Telemetry buffering:** Driver readings are buffered in Redis (60-second cadence) before PostgreSQL persistence. Temperature/humidity breaches trigger fan-out alerts to HQ, driver, and supervisor.

**Offline-first mobile:** Supplier and driver apps write to local SQLite cache and sync on reconnect. The `client_ref` unique constraint in the schema prevents duplicate submissions during replay.

## Git & Commit Conventions

- Branch naming: `feature/BIOL-<id>-<slug>` or `fix/BIOL-<id>-<slug>`
- Commit message: `BIOL-<id>: <imperative summary>`
- All PRs require green CI + ≥1 review; squash-merge on approval

## Implementation Status

Most route handlers are scaffolds with `TODO(BIOL-xx)` comments pointing to Jira stories. The auth middleware, database schema, and service structure are in place; business logic is intentionally stubbed for sprint-driven parallel development. The ML `/grade` endpoint accepts multipart image and returns `{ grade, confidence, route, threshold }` — swap in a real CNN without changing the contract.

## Documentation

- `docs/ARCHITECTURE.md` — component diagram and request flows
- `docs/API.md` — full REST contract with role matrix
- `docs/DATA_MODEL.md` — entity descriptions and state machine
- `docs/SETUP.md` — step-by-step local setup
- `CONTRIBUTING.md` — git workflow, branch protection, sprint mapping
