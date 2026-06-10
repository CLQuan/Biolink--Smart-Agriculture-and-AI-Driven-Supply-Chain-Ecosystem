# Bio-Link — Developer Setup

## Prerequisites
- Docker + Docker Compose
- Node.js 20+
- Python 3.11+
- Flutter SDK (stable)

## 1. Data layer
```bash
docker-compose up -d        # PostgreSQL :5432, Redis :6379
```
Schema and seed data load automatically on first run from `database/`.

## 2. API Gateway
```bash
cd services/api-gateway
cp .env.example .env
npm install
npm run dev                 # http://localhost:4000/health
```

## 3. ML inference server
```bash
cd services/ml-inference
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload                        # http://localhost:8000/health
```

## 4. Web console
```bash
cd services/web-console
npm install
npm run dev                 # http://localhost:5173
```

## 5. Mobile app
```bash
cd apps/mobile
flutter pub get
flutter run
```

## Seeded test accounts
See `database/seed.sql`. Default password for all seeded users: `Password123!`
(development only — change before any shared deployment).

| Email | Role |
|---|---|
| farmer@biolink.test | FARMER |
| driver@biolink.test | DRIVER |
| qc@biolink.test | QC |
| admin@biolink.test | ADMIN |
