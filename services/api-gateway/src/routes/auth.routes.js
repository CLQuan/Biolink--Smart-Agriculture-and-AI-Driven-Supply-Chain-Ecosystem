// Auth routes (US004): login with JWT issuance + account lockout, and /me.
const express = require("express");
const { authenticate, signToken } = require("../middleware/auth");

const router = express.Router();

// POST /api/v1/auth/login
// TODO(BIOL-7): look up user in Postgres, bcrypt-compare, increment failed_attempts,
// lock the account after ACCOUNT_LOCKOUT_THRESHOLD failures. Stubbed for scaffold.
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: { code: "BAD_REQUEST", message: "email and password required" } });
  }
  // Stub: accept seeded dev accounts only.
  const role = email.split("@")[0].toUpperCase();
  const validRoles = ["FARMER", "DRIVER", "QC", "ADMIN"];
  if (!validRoles.includes(role) || password !== "Password123!") {
    return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Invalid credentials" } });
  }
  const token = signToken({ id: `dev-${role.toLowerCase()}`, role });
  return res.json({ token, role });
});

// GET /api/v1/auth/me
router.get("/me", authenticate, (req, res) => res.json({ user: req.user }));

module.exports = router;
