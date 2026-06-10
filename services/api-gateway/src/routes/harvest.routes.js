// Harvest routes (US001 submit, US005 status).
const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// POST /api/v1/harvest  (FARMER) — submit a harvest batch.
// TODO(BIOL-9): persist batch; honour client_ref for offline idempotency.
router.post("/", requireRole("FARMER"), (req, res) => {
  const { cropType, quantityKg } = req.body || {};
  if (!cropType || !quantityKg) {
    return res.status(400).json({ error: { code: "BAD_REQUEST", message: "cropType and quantityKg required" } });
  }
  return res.status(201).json({ id: "stub-batch-id", status: "SUBMITTED" });
});

// GET /api/v1/harvest/mine  (FARMER) — my batches with status (US005).
router.get("/mine", requireRole("FARMER"), (_req, res) => res.json({ batches: [] }));

// GET /api/v1/harvest/:id  (FARMER, QC, ADMIN)
router.get("/:id", requireRole("FARMER", "QC", "ADMIN"), (req, res) =>
  res.json({ id: req.params.id, status: "SUBMITTED" })
);

module.exports = router;
