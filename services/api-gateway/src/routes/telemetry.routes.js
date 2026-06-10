// Telemetry routes (US002 stream, US002a breach alerts).
const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// Simple breach check against a category threshold (default leafy = 12C).
function isBreach(temperatureC, maxC = 12) {
  return typeof temperatureC === "number" && temperatureC > maxC;
}

// POST /api/v1/telemetry/:shipmentId/readings  (DRIVER)
// TODO(BIOL-11): buffer readings in Redis, persist in batches, link to shipment.
router.post("/:shipmentId/readings", requireRole("DRIVER"), (req, res) => {
  const readings = Array.isArray(req.body?.readings) ? req.body.readings : [req.body];
  const alerts = readings.filter((r) => isBreach(r.temperatureC)).map((r) => ({
    shipmentId: req.params.shipmentId,
    temperatureC: r.temperatureC,
    breach: true,
  }));
  return res.status(202).json({ accepted: readings.length, alerts });
});

// GET /api/v1/telemetry/:shipmentId  (DRIVER, ADMIN)
router.get("/:shipmentId", requireRole("DRIVER", "ADMIN"), (req, res) =>
  res.json({ shipmentId: req.params.shipmentId, readings: [] })
);

// GET /api/v1/telemetry/:shipmentId/alerts  (DRIVER, ADMIN)
router.get("/:shipmentId/alerts", requireRole("DRIVER", "ADMIN"), (req, res) =>
  res.json({ shipmentId: req.params.shipmentId, alerts: [] })
);

module.exports = router;
module.exports.isBreach = isBreach;
