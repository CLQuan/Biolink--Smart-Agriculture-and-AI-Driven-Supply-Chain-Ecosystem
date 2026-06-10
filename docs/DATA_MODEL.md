# Bio-Link — Data Model

Six core entities (SDD) plus an `alert_threshold` configuration table.
Implemented in [`database/schema.sql`](../database/schema.sql).

## Entities

| Entity | Purpose | Key relationships |
|---|---|---|
| `users` | All actors; carries `role` (FARMER/DRIVER/QC/ADMIN) | 1 farmer → many harvest_batches |
| `harvest_batches` | A submitted harvest with crop, qty, photos, certification | belongs to a farmer; → 1 shipment; → 1 quality_assessment |
| `shipments` | A transport trip carrying batches | driver (user); → many telemetry_readings |
| `telemetry_readings` | GPS/temp/humidity at 60s intervals | belongs to a shipment |
| `quality_assessments` | AI grade + confidence + final decision | belongs to a harvest_batch; → 1 epoo |
| `epoo` | Electronic Proof-of-Origin + QR | belongs to a quality_assessment |
| `alert_thresholds` | Per-produce-category temperature limits (US007) | referenced by breach detection |

## HarvestBatch state machine (SRS §2.2)

```
SUBMITTED ──▶ IN_TRANSIT ──▶ RECEIVED ──▶ GRADED ──▶ ACCEPTED
     │                                         │
     └────────────────── REJECTED ◀────────────┘
```

## Notes

- `telemetry_readings` is the high-write table; it is buffered in Redis before batch
  persistence and is a candidate for time-based partitioning at scale.
- `epoo.qr_payload` is a signed token so the certificate is tamper-evident.
- Personal data in `users` is subject to PDPA 2010 (SRS design constraints).
