-- ============================================
-- FIX: Infinite recursion in RLS policies
-- Uses a SECURITY DEFINER function to get org_id
-- without triggering recursive RLS checks
-- ============================================

-- Step 1: Drop ALL existing policies to start clean
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
    )
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- Step 2: Create a SECURITY DEFINER function to get org_id
-- This bypasses RLS, preventing infinite recursion
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID AS $$
  SELECT org_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 3: Create clean RLS policies

-- ====================
-- Organizations
-- ====================
CREATE POLICY "orgs_select" ON organizations FOR SELECT USING (TRUE);

CREATE POLICY "orgs_update" ON organizations FOR UPDATE
  USING (id = public.get_user_org_id());

CREATE POLICY "orgs_insert" ON organizations FOR INSERT
  WITH CHECK (TRUE);

-- ====================
-- Users (NO self-referencing subqueries!)
-- ====================
CREATE POLICY "users_select" ON users FOR SELECT
  USING (id = auth.uid() OR org_id = public.get_user_org_id());

CREATE POLICY "users_insert" ON users FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "users_update" ON users FOR UPDATE
  USING (id = auth.uid());

-- ====================
-- Invitations
-- ====================
CREATE POLICY "invitations_select" ON invitations FOR SELECT
  USING (org_id = public.get_user_org_id());

CREATE POLICY "invitations_insert" ON invitations FOR INSERT
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "invitations_delete" ON invitations FOR DELETE
  USING (org_id = public.get_user_org_id());

-- ====================
-- Services
-- ====================
CREATE POLICY "services_select" ON services FOR SELECT
  USING (org_id = public.get_user_org_id() OR is_active = TRUE);

CREATE POLICY "services_insert" ON services FOR INSERT
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "services_update" ON services FOR UPDATE
  USING (org_id = public.get_user_org_id());

CREATE POLICY "services_delete" ON services FOR DELETE
  USING (org_id = public.get_user_org_id());

-- ====================
-- Availability
-- ====================
CREATE POLICY "availability_select" ON availability FOR SELECT
  USING (org_id = public.get_user_org_id() OR is_active = TRUE);

CREATE POLICY "availability_insert" ON availability FOR INSERT
  WITH CHECK (org_id = public.get_user_org_id());

CREATE POLICY "availability_update" ON availability FOR UPDATE
  USING (org_id = public.get_user_org_id());

CREATE POLICY "availability_delete" ON availability FOR DELETE
  USING (org_id = public.get_user_org_id());

-- ====================
-- Appointments
-- ====================
CREATE POLICY "appointments_select" ON appointments FOR SELECT
  USING (org_id = public.get_user_org_id() OR TRUE);

CREATE POLICY "appointments_insert" ON appointments FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "appointments_update" ON appointments FOR UPDATE
  USING (org_id = public.get_user_org_id());

CREATE POLICY "appointments_delete" ON appointments FOR DELETE
  USING (org_id = public.get_user_org_id());
