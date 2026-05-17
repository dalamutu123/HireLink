-- Run only if upgrading an existing database that used 'pending' status
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;
UPDATE applications SET status = 'applied' WHERE status = 'pending';
ALTER TABLE applications
  ADD CONSTRAINT applications_status_check
  CHECK (status IN ('applied', 'accepted', 'rejected'));
ALTER TABLE applications ALTER COLUMN status SET DEFAULT 'applied';
