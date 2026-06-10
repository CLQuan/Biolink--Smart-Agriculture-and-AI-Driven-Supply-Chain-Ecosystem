# Bio-Link — REST API Contracts

Base URL: `http://localhost:4000/api/v1`. All routes except `/auth/login` require a
`Bearer <JWT>`. Roles in parentheses are permitted by RBAC.

## Auth — `/auth`
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/auth/login` | public | Returns JWT + role. Locks account after 5 failures. |
| GET | `/auth/me` | any | Current user profile. |

## Harvest — `/harvest`  (US001, US005)
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/harvest` | FARMER | Submit a harvest batch (crop, qty, photos, cert). Idempotent via `client_ref`. |
| GET | `/harvest/mine` | FARMER | List my batches with status. |
| GET | `/harvest/:id` | FARMER, QC, ADMIN | Batch detail. |

## Telemetry — `/telemetry`  (US002, US002a)
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/telemetry/:shipmentId/readings` | DRIVER | Push a (batch of) reading(s); buffered in Redis. |
| GET | `/telemetry/:shipmentId` | DRIVER, ADMIN | Stream/history for a shipment. |
| GET | `/telemetry/:shipmentId/alerts` | DRIVER, ADMIN | Breach alerts. |

## Quality Control — `/qc`  (US003, US003a, US003b)
| Method | Path | Role | Description |
|---|---|---|---|
| POST | `/qc/:batchId/grade` | QC | Submit image; proxies to ML server; returns grade+confidence. |
| POST | `/qc/:batchId/decision` | QC | Approve/override; generates e-PoO on approval. |
| GET | `/qc/review-queue` | QC | Low-confidence (<75%) batches. |
| GET | `/qc/epoo/:id` | public | Resolve an e-PoO from a scanned QR. |

## Admin — `/admin`  (US006, US007, US008)
| Method | Path | Role | Description |
|---|---|---|---|
| GET/POST/PATCH | `/admin/users` | ADMIN | Manage users & roles. |
| GET/PUT | `/admin/thresholds` | ADMIN | Configure temperature thresholds. |
| GET | `/admin/reports/:type` | ADMIN | `harvest-summary` \| `rejection-rate` \| `avg-transit-temp`. |

## Conventions
- JSON bodies; ISO-8601 timestamps; UUID ids.
- Errors: `{ "error": { "code", "message" } }` with appropriate HTTP status.
- `401` unauthenticated, `403` wrong role, `409` idempotency conflict.
