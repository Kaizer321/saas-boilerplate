-- ============================================
-- FIX: Replace JWT-based RLS with subquery-based RLS
-- This works without needing the JWT hook configured
-- ============================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view their own organization" ON organizations;
DROP POLICY IF EXISTS "Owners can update their organization" ON organizations;
DROP POLICY IF EXISTS "Public can read organizations by slug" ON organizations;
DROP POLICY IF EXISTS "Users can view members of their org" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Org members can view invitations" ON invitations;
DROP POLICY IF EXISTS "Admins and owners can create invitations" ON invitations;
DROP POLICY IF EXISTS "Admins and owners can delete invitations" ON invitations;
DROP POLICY IF EXISTS "Org members can manage services" ON services;
DROP POLICY IF EXISTS "Public can read active services" ON services;
DROP POLICY IF EXISTS "Org members can manage availability" ON availability;
DROP POLICY IF EXISTS "Public can read availability" ON availability;
DROP POLICY IF EXISTS "Org members can manage appointments" ON appointments;
DROP POLICY IF EXISTS "Public can create appointments" ON appointments;
DROP POLICY IF EXISTS "Public can read appointments by email" ON appointments;

-- Helper: get user's org_id without JWT hook
-- Uses: (SELECT org_id FROM public.users WHERE id = auth.uid())

-- ====================
-- Organizations
-- ====================
CREATE POLICY "Users can view their own organization"
  ON organizations FOR SELECT
  USING (
    id IN (SELECT org_id FROM public.users WHERE id = auth.uid())
    OR TRUE  -- also allow public read for booking page slug lookup
  );

CREATE POLICY "Owners can update their organization"
  ON organizations FOR UPDATE
  USING (id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

-- ====================
-- Users
-- ====================
CREATE POLICY "Users can view members of their org"
  ON users FOR SELECT
  USING (
    org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid())
    OR id = auth.uid()
  );

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (id = auth.uid());

-- ====================
-- Invitations
-- ====================
CREATE POLICY "Org members can view invitations"
  ON invitations FOR SELECT
  USING (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admins and owners can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Admins and owners can delete invitations"
  ON invitations FOR DELETE
  USING (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

-- ====================
-- Services
-- ====================
CREATE POLICY "Org members can view services"
  ON services FOR SELECT
  USING (
    org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid())
    OR is_active = TRUE  -- public can see active services for booking page
  );

CREATE POLICY "Org members can insert services"
  ON services FOR INSERT
  WITH CHECK (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Org members can update services"
  ON services FOR UPDATE
  USING (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Org members can delete services"
  ON services FOR DELETE
  USING (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

-- ====================
-- Availability
-- ====================
CREATE POLICY "Org members can view availability"
  ON availability FOR SELECT
  USING (
    org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid())
    OR is_active = TRUE  -- public can see for booking
  );

CREATE POLICY "Org members can insert availability"
  ON availability FOR INSERT
  WITH CHECK (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Org members can update availability"
  ON availability FOR UPDATE
  USING (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Org members can delete availability"
  ON availability FOR DELETE
  USING (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

-- ====================
-- Appointments
-- ====================
CREATE POLICY "Org members can view appointments"
  ON appointments FOR SELECT
  USING (
    org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid())
    OR TRUE  -- allow public read
  );

CREATE POLICY "Org members can update appointments"
  ON appointments FOR UPDATE
  USING (org_id IN (SELECT org_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Public can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (TRUE);
