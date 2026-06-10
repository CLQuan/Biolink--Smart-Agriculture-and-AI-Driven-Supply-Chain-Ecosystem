// Quality Control routes (US003 grade + e-PoO, US003a review queue, US003b QR).
const express = require("express");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();
const THRESHOLD = Number(process.env.AI_CONFIDENCE_THRESHOLD) || 0.75;

// POST /api/v1/qc/:batchId/grade  (QC) — proxy image to ML server.
// TODO(BIOL-13): forward image to ML_INFERENCE_URL /grade; persist assessment.
router.post("/:batchId/grade", authenticate, requireRole("QC"), (req, res) => {
  // Stubbed ML response.
  const ai = { grade: "A", confidence: 0.82 };
  const route = ai.confidence < THRESHOLD ? "REVIEW" : "READY";
  return res.json({ batchId: req.params.batchId, ...ai, route });
});

// POST /api/v1/qc/:batchId/decision  (QC) — approve/override -> e-PoO (US003).
router.post("/:batchId/decision", authenticate, requireRole("QC"), (req, res) => {
  const { decision, finalGrade } = req.body || {};
  if (!["APPROVED", "OVERRIDDEN"].includes(decision)) {
    return res.status(400).json({ error: { code: "BAD_REQUEST", message: "decision must be APPROVED or OVERRIDDEN" } });
  }
  // TODO(BIOL-13/15): persist decision, sign QR payload, render thermal label.
  return res.status(201).json({
    batchId: req.params.batchId,
    finalGrade: finalGrade || "A",
    epoo: { id: "stub-epoo-id", qrPayload: "signed.stub.token" },
  });
});

// GET /api/v1/qc/review-queue  (QC) — low-confidence cases (US003a).
router.get("/review-queue", authenticate, requireRole("QC"), (_req, res) =>
  res.json({ items: [] })
);

// GET /api/v1/qc/epoo/:id  (public) — resolve a scanned QR.
router.get("/epoo/:id", (req, res) => res.json({ id: req.params.id, valid: true }));

module.exports = router;
