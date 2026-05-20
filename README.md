# Bio-Link Smart Agriculture and AI-Driven Supply Chain Ecosystem

Production-ready DevSecOps workflow for Zenxin Organic Food (Malaysia ↔ Singapore), connecting Cameron Highlands farmers to Johor and Singapore hubs.

## 1) End-to-End Automated Workflow Blueprint

### Global environments and control plane

| Layer | Development (Local/Sandbox) | Staging (Pre-Prod) | Production (Live) | Core Controls |
|---|---|---|---|---|
| Mobile (Supplier, Driver) | Emulator + test devices, mock BLE + mock CV model | Internal TestFlight/Play Internal, real BLE smoke tests | Public app rollout with phased release | Signed artifacts, model hash verification, feature flags |
| Web Dashboard (Admin, Supervisor) | Local React dev server | Staging web app behind auth | Production web app behind WAF/CDN | SAST, dependency scan, CSP, TLS |
| API + MQTT | Docker compose (API + MQTT + PostgreSQL + Redis) | Autoscaled staging API/MQTT | Autoscaled production API/MQTT | JWT RBAC, TLS mTLS (MQTT optional), rate-limit |
| Data + Storage | Local PostgreSQL/Redis + test S3 bucket | Staging RDS/Redis/S3 | Production RDS/Redis/S3 + backup policy | AES-256 at rest, KMS, audit logs |
| Infra | Terraform plan only | Terraform apply (staging workspace) | Terraform apply (prod workspace, approval gate) | IaC policy checks, drift detection |

---

### Phase A — Agile Backlog & SCM Synchronization

**Trigger**
- Sprint kickoff (2-week cadence) and every new issue intake.

**Inputs**
- Jira epics/stories, GitHub issues, acceptance criteria, risk labels (`security`, `iot`, `ml`, `offline-sync`).

**Automated tasks**
1. Sync Jira ↔ GitHub Project fields (status, sprint, assignee, priority).
2. Auto-create branches from `main` using GitFlow naming:
   - `feature/<ticket-id>-<short-name>`
   - `bugfix/<ticket-id>-<short-name>`
   - `release/<version>`
3. Enforce branch protections on `main`/`release/*`:
   - Required PR reviews (minimum 2 for backend/security-sensitive paths).
   - Required status checks (lint, unit tests, security scans).
   - Dismiss stale approvals on new commits.
   - Block force push + direct commits.

**Security/compliance gates**
- CODEOWNERS mandatory review for `infra/`, `security/`, `ml/` paths.
- Secret scanning and push protection enabled.

**Outputs**
- Sprint-ready board, protected branches, traceable work items linked to PRs.

---

### Phase B — AI/ML Dataset & Training Pipeline ("Brain")

**Trigger**
- New raw harvest images uploaded to S3 landing bucket (`s3://bio-link-ml-landing/raw/`).

**Inputs**
- New image batches (leafy vegetables), metadata (farm ID, timestamp, device), previous model baseline.

**Automated tasks**
1. **Ingestion & validation**
   - EventBridge + Lambda validates image format, checksum, metadata completeness.
2. **Annotation workflow**
   - LabelImg task queue issued for classes covering:
     - Color/yellowing,
     - Morphology (size/shape),
     - Texture/defects (abrasion, wilting).
   - Version dataset in DVC/S3 (`dataset_version`, annotation audit trail).
3. **Training pipeline**
   - Scheduled or on-approval training job (SageMaker/EC2 GPU).
   - Transfer learning from MobileNetV2 or VGG-16 in TensorFlow/Keras.
4. **Optimization pipeline**
   - Convert best model to `.tflite` with quantization (int8/float16 candidate builds).
5. **Validation gate**
   - Benchmark accuracy/precision/recall/F1 on holdout set.
   - Softmax confidence calibration check (target: Grade A confidence stability ≥ 92% for the validated leafy-vegetable benchmark classes; other crop classes use class-specific thresholds defined in the model card).
   - SHA-256 hash/signing of approved model artifact.

**Security/compliance gates**
- Signed model registry entries only.
- Immutable model manifest (`model_id`, hash, training dataset version, approver).

**Outputs**
- Approved and signed `.tflite` artifact published to model registry and mobile artifact channel.

---

### Phase C — Continuous Integration & Cross-Platform Compilation

#### C1. Mobile CI (Supplier + Driver apps)

**Trigger**
- PR/push to `mobile/` paths.

**Tasks**
- Lint + unit tests.
- Build Android + iOS in parallel.
- Bundle offline-first storage schema (SQLite) and latest signed `.tflite`.
- Run app integrity/signing checks.

**Outputs**
- Versioned mobile build artifacts + release notes.

#### C2. Web + Backend CI

**Trigger**
- PR/push to `web/`, `api/`, `mqtt/` paths.

**Tasks**
- Build React dashboard artifact.
- Build API/MQTT Docker images.
- Execute SAST/SCA + container vulnerability scans (e.g., SonarQube + Trivy/Grype).
- Publish SBOM and signed images.

**Outputs**
- Signed deployable images/artifacts with security reports.

---

### Phase D — Rigorous Testing Protocols & Validation Gates

**Mandatory pre-staging suites (all must pass):**

1. **AI grading accuracy regression**
   - Run benchmark image suite and compare against baseline drift thresholds.
2. **IoT telemetry + MQTT resilience tests**
   - Simulate temperature deviations (2–3°C spikes/drops), verify mobile BLE gateway capture and real-time cloud alert ingestion.
3. **Offline-first sync E2E tests**
   - Force disconnection, queue local records, restore 4G/5G, verify conflict-safe sync and idempotent writes.
4. **Supply chain digital passport + QR validation**
   - Validate unique serialized QR generation and tamper-proof e-PoO timeline retrieval end-to-end.

**Security/compliance gates**
- API authz tests for role boundaries (HQ Admin vs Supplier vs Supervisor vs Driver).
- TLS enforcement tests.
- Data minimization/anonymization checks for location metadata (PDPA alignment).

**Outputs**
- Staging promotion token only when all four suites + security gates pass.

---

### Phase E — Cloud Deployment & Infrastructure Management

**Trigger**
- Approved staging release candidate + change approval.

**IaC and deployment tasks**
1. Terraform plans and applies AWS stack:
   - EC2 workloads, S3 image storage, RDS PostgreSQL, Redis, ALB, CDN.
2. Rolling zero-downtime backend deployment:
   - Blue/green or rolling strategy with health-check based traffic shifting.
3. Data and transport security:
   - AES-256 encryption at rest (RDS/S3), TLS 1.2+ in transit.
   - JWT verification checkpoints by role.
4. Compliance enforcement:
   - PDPA-aware anonymization for route/location analytics.

**Outputs**
- Production release with no downtime, auditable deployment records, and policy compliance evidence.

---

### Phase F — Production Operations & Real-Time Alerting (Feedback Loop)

**Trigger**
- Live telemetry ingestion and warehouse scan events.

**Operational tasks**
1. Driver app BLE gateway streams crate telemetry to cloud.
2. Rule engine detects threshold breaches during the Cameron Highlands → Johor/Singapore route window (7–8 hours baseline from historical route telemetry; formalized as an SLA threshold with escalation if duration exceeds limit).
3. Alert fan-out:
   - Notify HQ Admin + Warehouse Supervisor + assigned driver channel.
4. Rejection automation at warehouse scan:
   - If crate QR status = `Rejected`, backend auto-generates:
     - rejection log report,
     - credit note document,
     - supplier status sync update.

**Outputs**
- Faster exception handling, projected paperwork reduction target (up to ~40%), and closed-loop supplier feedback; KPI measured by comparing manual rejection/credit-note document handling volume before vs. after automation over an agreed baseline window (for example, first 8–12 weeks of production).

---

## 2) Persona Interaction Block Diagram (Text Flow)

### Operational sequence (high level)

| Step | Supplier (Farmer) | Transporter (Driver) | Supervisor (Warehouse) | Admin (HQ) | Platform Services |
|---|---|---|---|---|---|
| 1 | Capture crop images, upload certification, receive AI grade offline/online |  |  |  | Mobile app + TFLite + SQLite |
| 2 | Prepare crates + QR tags | Start route, pair BLE sensors |  | Monitor route status | BLE gateway → MQTT/API → Redis |
| 3 |  | Receive threshold alert in app | Receive deviation alert | Receive escalation alert | Alert engine + notification service |
| 4 |  | Deliver to hub | Scan crate QR, validate e-PoO timeline | Review exceptions dashboard | QR service + PostgreSQL + S3 evidence |
| 5 | Receive acceptance/rejection + credit note update |  | If rejected, trigger rejection workflow | Audit SLA, contract, forecasting impact | Auto-doc generation + sync service |

### Control/data flow map

```text
Supplier App (offline-first + CV) ---> API Gateway ---> PostgreSQL (contracts/certs)
          |                                |-----> S3 (crop images/evidence)
          |                                |-----> Redis (live tracking cache)
          |                                |-----> MQTT Broker (telemetry stream)
Transporter App (BLE gateway) ------------/

Warehouse Dashboard <--- API/WebSocket ---> Ops Command Center (HQ Admin)
       |                                             |
       |---- QR/e-PoO validation --------------------|
       |---- Rejection -> Auto report + Credit note -|

ML Pipeline: S3 landing -> Annotation -> Training -> TFLite optimize -> Signed model registry -> Mobile CI bundle
```

---

## 3) Safe Transition Strategy: Local → Staging → Production

1. **Local development sandbox**
   - Developers work in feature branches with mocked BLE/MQTT and sample datasets.
   - Pre-commit checks run lint/unit tests and secret scanning.
2. **CI validation on PR**
   - Branch protections block merge unless all checks pass (build, tests, security, review).
   - Mobile and Web/API pipelines build in parallel; signed artifacts generated.
3. **Staging promotion**
   - Triggered only by successful Phase D test suites.
   - Deploy with Terraform staging workspace and production-like configs (masked secrets).
   - Execute smoke + canary tests for telemetry, offline sync, and QR passport paths.
4. **Production release**
   - Manual approval gate (Product Owner + DevSecOps).
   - Zero-downtime rollout with health-based rollback automation.
   - Real-time observability dashboards and alert thresholds enabled at cutover.
5. **Post-release feedback loop**
   - Monitor model drift, route deviations, sync failures, and rejection rates.
   - Feed operational insights back into backlog planning for next sprint.

---

## Suggested CI/CD Workflow Matrix (for implementation)

| Workflow | Trigger | Key Jobs |
|---|---|---|
| `agile-sync.yml` | issue/project updates | Jira-GitHub sync, branch policy checks |
| `ml-train-and-optimize.yml` | S3 image upload / manual dispatch | ingest, annotate-queue, train, quantize, hash-sign, publish |
| `mobile-ci.yml` | changes under `mobile/**` | lint, unit-test, android-build, ios-build, model-hash-verify |
| `web-backend-ci.yml` | changes under `web/**`, `api/**`, `mqtt/**` | lint-test, docker-build, security-scan, sign, push |
| `staging-gate.yml` | release candidate | AI regression, MQTT sim tests, offline-sync E2E, QR/e-PoO E2E |
| `deploy-infra-app.yml` | approved release | terraform-plan/apply, rolling deploy, smoke test |
| `ops-alerting.yml` | schedule + telemetry events | threshold detection, notification fan-out, incident metrics |
