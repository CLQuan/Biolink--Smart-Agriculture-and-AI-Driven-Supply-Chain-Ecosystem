// Bio-Link API Gateway entry point.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth.routes");
const harvestRoutes = require("./routes/harvest.routes");
const telemetryRoutes = require("./routes/telemetry.routes");
const qcRoutes = require("./routes/qc.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Health check (used by CI / docker healthchecks)
app.get("/health", (_req, res) => res.json({ status: "ok", service: "api-gateway" }));

const base = "/api/v1";
app.use(`${base}/auth`, authRoutes);
app.use(`${base}/harvest`, harvestRoutes);
app.use(`${base}/telemetry`, telemetryRoutes);
app.use(`${base}/qc`, qcRoutes);
app.use(`${base}/admin`, adminRoutes);

// Centralised error handler
app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({
    error: { code: err.code || "INTERNAL", message: err.message || "Server error" },
  });
});

const port = process.env.API_PORT || 4000;
if (require.main === module) {
  app.listen(port, () => console.log(`Bio-Link API gateway on :${port}`));
}

module.exports = app;
