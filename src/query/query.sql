-- Sample data for Device table
-- Note: UUIDs are generated automatically, so we don't specify the 'id' field
-- Timestamps (createdAt, updatedAt) are also handled automatically by Sequelize

-- Active PiBook devices with various sync histories
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER TABLE devices
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

INSERT INTO devices (device_id, device_type, last_seen, total_sync_attempts, total_failed_syncs, consecutive_failures, is_active) VALUES
('PIBOOK-001-A7B9C', 'PiBook', '2025-06-01 10:30:00', 45, 2, 0, true),
('PIBOOK-002-X8Y2Z', 'PiBook', '2025-06-01 09:15:00', 32, 0, 0, true),
('PIBOOK-003-M5N4P', 'PiBook', '2025-05-31 23:45:00', 78, 5, 1, true),
('PIBOOK-004-Q1W2E', 'PiBook', '2025-06-01 08:22:00', 123, 8, 0, true),
('PIBOOK-005-R3T4Y', 'PiBook', '2025-05-30 16:30:00', 89, 12, 3, true);

-- Active PiBox devices
INSERT INTO devices (device_id, device_type, last_seen, total_sync_attempts, total_failed_syncs, consecutive_failures, is_active) VALUES
('PIBOX-001-K7L8M', 'PiBox', '2025-06-01 11:00:00', 67, 3, 0, true),
('PIBOX-002-N9O0P', 'PiBox', '2025-06-01 07:45:00', 54, 1, 0, true),
('PIBOX-003-S5T6U', 'PiBox', '2025-05-29 20:15:00', 145, 15, 2, true),
('PIBOX-004-V7W8X', 'PiBox', '2025-06-01 06:30:00', 201, 7, 0, true);

-- Inactive devices (decommissioned or offline)
INSERT INTO devices (device_id, device_type, last_seen, total_sync_attempts, total_failed_syncs, consecutive_failures, is_active) VALUES
('PIBOOK-OLD-001', 'PiBook', '2025-05-15 14:20:00', 234, 45, 10, false),
('PIBOX-OLD-001', 'PiBox', '2025-04-28 09:30:00', 156, 23, 8, false);

-- Devices with high failure rates (problematic devices)
INSERT INTO devices (device_id, device_type, last_seen, total_sync_attempts, total_failed_syncs, consecutive_failures, is_active) VALUES
('PIBOOK-PROB-001', 'PiBook', '2025-05-28 12:00:00', 95, 25, 5, true),
('PIBOX-PROB-001', 'PiBox', '2025-05-27 18:45:00', 112, 35, 7, true);

-- Recently registered devices (minimal sync history)
INSERT INTO devices (device_id, device_type, last_seen, total_sync_attempts, total_failed_syncs, consecutive_failures, is_active) VALUES
('PIBOOK-NEW-001', 'PiBook', '2025-06-01 12:00:00', 3, 0, 0, true),
('PIBOX-NEW-001', 'PiBox', '2025-06-01 11:30:00', 1, 0, 0, true),
('PIBOOK-NEW-002', 'PiBook', '2025-05-31 20:15:00', 8, 1, 0, true);

-- Devices without specified type (NULL device_type)
INSERT INTO devices (device_id, device_type, last_seen, total_sync_attempts, total_failed_syncs, consecutive_failures, is_active) VALUES
('UNKNOWN-001-ABC', NULL, '2025-05-30 14:22:00', 15, 3, 1, true),
('UNKNOWN-002-DEF', NULL, '2025-05-29 16:45:00', 22, 0, 0, true);

-- Device that hasn't been seen recently (NULL last_seen)
INSERT INTO devices (device_id, device_type, last_seen, total_sync_attempts, total_failed_syncs, consecutive_failures, is_active) VALUES
('PIBOOK-UNSEEN-001', 'PiBook', NULL, 0, 0, 0, true);