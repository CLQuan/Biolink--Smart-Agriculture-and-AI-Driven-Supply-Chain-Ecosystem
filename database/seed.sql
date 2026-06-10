-- Bio-Link development seed data.
-- NOTE: password_hash below is a bcrypt hash of 'Password123!' (dev only).

INSERT INTO users (email, password_hash, full_name, role) VALUES
  ('farmer@biolink.test', '$2b$10$Q9Qq8Yy6m1Zr8nVnY3oG.uJ9wEXAMPLEHASHforDevOnly00', 'Ahmad (Farmer)', 'FARMER'),
  ('driver@biolink.test', '$2b$10$Q9Qq8Yy6m1Zr8nVnY3oG.uJ9wEXAMPLEHASHforDevOnly00', 'Raju (Driver)', 'DRIVER'),
  ('qc@biolink.test',     '$2b$10$Q9Qq8Yy6m1Zr8nVnY3oG.uJ9wEXAMPLEHASHforDevOnly00', 'Emily (QC)', 'QC'),
  ('admin@biolink.test',  '$2b$10$Q9Qq8Yy6m1Zr8nVnY3oG.uJ9wEXAMPLEHASHforDevOnly00', 'System Admin', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Default temperature thresholds (US007). Leafy produce breaches above 12C.
INSERT INTO alert_thresholds (produce_category, max_temperature_c, min_temperature_c, max_humidity_pct) VALUES
  ('leafy',  12.00, 0.00, 95.00),
  ('root',   15.00, 0.00, 90.00),
  ('fruit',  10.00, 2.00, 90.00)
ON CONFLICT (produce_category) DO NOTHING;
