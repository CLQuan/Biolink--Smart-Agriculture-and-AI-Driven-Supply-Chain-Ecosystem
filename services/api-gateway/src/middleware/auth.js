// JWT authentication + role-based access control (US004).
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev-secret";

// Verify the Bearer token and attach req.user = { sub, role }.
function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Missing token" } });
  }
  try {
    req.user = jwt.verify(token, SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: { code: "INVALID_TOKEN", message: "Invalid or expired token" } });
  }
}

// Restrict a route to one or more roles: requireRole("QC", "ADMIN").
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: { code: "UNAUTHENTICATED", message: "Login required" } });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: { code: "FORBIDDEN", message: "Insufficient role" } });
    }
    return next();
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });
}

module.exports = { authenticate, requireRole, signToken };
