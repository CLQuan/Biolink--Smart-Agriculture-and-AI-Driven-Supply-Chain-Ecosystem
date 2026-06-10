# Bio-Link — Architecture

Derived from the Software Design Documentation (SDD v1.0). Bio-Link uses a
microservice-oriented, layered architecture optimised for intermittent rural
connectivity (offline-first clients).

## Components

| # | Component | Tech | Responsibility |
|---|---|---|---|
| 1 | Mobile app | Flutter | Farmer & Driver portals; offline-first capture of harvest data and cold-chain telemetry |
| 2 | Web console | React.js | QC grading + Admin management/reporting |
| 3 | API Gateway | Node.js / Express | Auth (JWT + RBAC), REST API, orchestration, business rules |
| 4 | ML inference server | FastAPI / PyTorch | CNN produce grading, confidence thresholding, fallback routing |
| 5 | Data layer | PostgreSQL + Redis | Durable store + cache / telemetry buffer |

## Request flow (AI grading — US003)

```
QC console ──image──▶ API Gateway ──▶ ML server (/grade)
                          │                  │
                          │            grade + confidence
                          ▼                  │
                  confidence ≥ 0.75? ◀───────┘
                    │             │
                  yes            no ──▶ manual review queue (US003a)
                    ▼
        generate e-PoO + QR ──▶ thermal label (US003b)
```

## Cross-cutting concerns

- **Authentication & RBAC** — JWT issued at login; every gateway route enforces
  the role matrix (FARMER, DRIVER, QC, ADMIN). Account lockout after N failed attempts.
- **Offline-first** — mobile clients write to a local cache and reconcile on
  reconnect; telemetry buffers locally when the network drops.
- **Caching / buffering** — Redis fronts hot reads and absorbs high-frequency
  (60s) telemetry before it is persisted to PostgreSQL.

## Non-functional targets (SRS §2.5)

- Telemetry ingest cadence: 1 reading / 60s / active trip.
- Breach alert latency: seconds from reading to driver notification.
- Security: OWASP API best practices; PDPA 2010 compliance for personal data.
