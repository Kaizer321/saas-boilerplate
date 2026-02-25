-- ============================================
-- Database Functions & Triggers
-- ============================================

-- ====================
-- 1. JWT Hook: Inject org_id into access token
-- ====================
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
  claims JSONB;
  user_org_id UUID;
BEGIN
  SELECT org_id INTO user_org_id
  FROM public.users
  WHERE id = (event->>'user_id')::UUID;

  claims := event->'claims';

  IF user_org_id IS NOT NULL THEN
    claims := jsonb_set(claims, '{org_id}', to_jsonb(user_org_id));
  END IF;

  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;

-- ====================
-- 2. Auto-create Organization + User on Signup
-- ====================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_org_id UUID;
  org_slug TEXT;
  org_name TEXT;
BEGIN
  -- Get org name from metadata (falls back to email prefix)
  org_name := COALESCE(
    NEW.raw_user_meta_data->>'org_name',
    split_part(NEW.email, '@', 1)
  );

  -- Generate URL-safe slug
  org_slug := lower(regexp_replace(org_name, '[^a-zA-Z0-9]', '-', 'g'));

  -- Remove leading/trailing hyphens
  org_slug := trim(both '-' from org_slug);

  -- Ensure slug uniqueness by appending random suffix if needed
  IF EXISTS (SELECT 1 FROM public.organizations WHERE slug = org_slug) THEN
    org_slug := org_slug || '-' || substr(gen_random_uuid()::text, 1, 8);
  END IF;

  -- Create organization
  INSERT INTO public.organizations (name, slug)
  VALUES (org_name, org_slug)
  RETURNING id INTO new_org_id;

  -- Create user profile with owner role
  INSERT INTO public.users (id, org_id, full_name, role)
  VALUES (
    NEW.id,
    new_org_id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'owner'
  );

  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
