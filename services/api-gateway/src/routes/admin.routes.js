// Admin routes (US006 users, US007 thresholds, US008 reports).
const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate, requireRole("ADMIN"));

// US006 — manage users & roles.
router.get("/users", (_req, res) => res.json({ users: [] }));
router.post("/users", (req, res) => res.status(201).json({ id: "stub-user-id", ...req.body }));
router.patch("/users/:id", (req, res) => res.json({ id: req.params.id, ...req.body }));

// US007 — temperature thresholds.
router.get("/thresholds", (_req, res) =>
  res.json({ thresholds: [{ produceCategory: "leafy", maxTemperatureC: 12 }] })
);
router.put("/thresholds", (req, res) => res.json({ updated: true, thresholds: req.body?.thresholds || [] }));

// US008 — operational reports.
router.get("/reports/:type", (req, res) => {
  const allowed = ["harvest-summary", "rejection-rate", "avg-transit-temp"];
  if (!allowed.includes(req.params.type)) {
    return res.status(404).json({ error: { code: "NOT_FOUND", message: "Unknown report type" } });
  }
  return res.json({ type: req.params.type, range: req.query, rows: [] });
});

module.exports = router;
