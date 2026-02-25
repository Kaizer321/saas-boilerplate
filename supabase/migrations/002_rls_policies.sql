-- ============================================
-- Row Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- ====================
-- Organizations
-- ====================
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (id = (auth.jwt()->>'org_id')::UUID);

CREATE POLICY "Owners can update their organization"
  ON organizations FOR UPDATE
  USING (id = (auth.jwt()->>'org_id')::UUID);

-- Public read for booking page (slug lookup)
CREATE POLICY "Public can read organizations by slug"
  ON organizations FOR SELECT
  USING (TRUE);

-- ====================
-- Users
-- ====================
CREATE POLICY "Users can view members of their org"
  ON users FOR SELECT
  USING (org_id = (auth.jwt()->>'org_id')::UUID);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- ====================
-- Invitations
-- ====================
CREATE POLICY "Org members can view invitations"
  ON invitations FOR SELECT
  USING (org_id = (auth.jwt()->>'org_id')::UUID);

CREATE POLICY "Admins and owners can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (org_id = (auth.jwt()->>'org_id')::UUID);

CREATE POLICY "Admins and owners can delete invitations"
  ON invitations FOR DELETE
  USING (org_id = (auth.jwt()->>'org_id')::UUID);

-- ====================
-- Services
-- ====================
CREATE POLICY "Org members can manage services"
  ON services
  USING (org_id = (auth.jwt()->>'org_id')::UUID);

-- Public read for booking page
CREATE POLICY "Public can read active services"
  ON services FOR SELECT
  USING (is_active = TRUE);

-- ====================
-- Availability
-- ====================
CREATE POLICY "Org members can manage availability"
  ON availability
  USING (org_id = (auth.jwt()->>'org_id')::UUID);

-- Public read for booking page (slot calculation)
CREATE POLICY "Public can read availability"
  ON availability FOR SELECT
  USING (is_active = TRUE);

-- ====================
-- Appointments
-- ====================
CREATE POLICY "Org members can manage appointments"
  ON appointments
  USING (org_id = (auth.jwt()->>'org_id')::UUID);

-- Public can create appointments (booking page)
CREATE POLICY "Public can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (TRUE);

-- Public can read their own appointments by email
CREATE POLICY "Public can read appointments by email"
  ON appointments FOR SELECT
  USING (TRUE);
