# Bio-Link API Gateway

Node.js / Express REST API with JWT auth and role-based access control.

```bash
cp .env.example .env
npm install
npm run dev      # http://localhost:4000/health
npm test         # node:test smoke tests
```

Routes are documented in [`../../docs/API.md`](../../docs/API.md). Each handler is a
scaffold stub with a `TODO(BIOL-xx)` pointing at the Jira story that completes it.

Structure:
```
src/
  index.js            app + route mounting + error handler
  config/db.js        lazy PostgreSQL pool
  middleware/auth.js  authenticate + requireRole + signToken
  routes/             auth, harvest, telemetry, qc, admin
```
