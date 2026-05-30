-- =====================================================
-- Admin Support Migration
-- =====================================================

-- 1. Add role field to profiles
ALTER TABLE IF EXISTS profiles
ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager'));

-- 2. Create admin_requests table
CREATE TABLE IF NOT EXISTS admin_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    university TEXT,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_admin_requests_updated_at ON admin_requests;
CREATE TRIGGER update_admin_requests_updated_at
    BEFORE UPDATE ON admin_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_admin_requests_user_id ON admin_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_requests_status ON admin_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_requests_created_at ON admin_requests(created_at DESC);

-- 3. Create reported_listings table
CREATE TABLE IF NOT EXISTS reported_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL CHECK (reason IN ('inappropriate_content', 'fake_item', 'duplicate', 'spam', 'other')),
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_reported_listings_updated_at ON reported_listings;
CREATE TRIGGER update_reported_listings_updated_at
    BEFORE UPDATE ON reported_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_reported_listings_listing_id ON reported_listings(listing_id);
CREATE INDEX IF NOT EXISTS idx_reported_listings_reported_by ON reported_listings(reported_by);
CREATE INDEX IF NOT EXISTS idx_reported_listings_status ON reported_listings(status);
CREATE INDEX IF NOT EXISTS idx_reported_listings_created_at ON reported_listings(created_at DESC);

-- 4. Update RLS for admin tables
ALTER TABLE admin_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reported_listings ENABLE ROW LEVEL SECURITY;

-- Profiles: Allow admins to view all
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT 
    USING (auth.uid()::text IN (
        SELECT id::text FROM profiles WHERE role = 'admin' OR role = 'manager'
    ));

-- Admin requests: Only admins can view/manage
DROP POLICY IF EXISTS "Admins can manage admin_requests" ON admin_requests;
CREATE POLICY "Admins can manage admin_requests"
    ON admin_requests FOR ALL
    USING (auth.uid()::text IN (
        SELECT id::text FROM profiles WHERE role = 'admin' OR role = 'manager'
    ));

DROP POLICY IF EXISTS "Users can view own admin_request" ON admin_requests;
CREATE POLICY "Users can view own admin_request"
    ON admin_requests FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create admin_request" ON admin_requests;
CREATE POLICY "Users can create admin_request"
    ON admin_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Reported listings: Everyone can report, admins can manage
DROP POLICY IF EXISTS "Users can create report" ON reported_listings;
CREATE POLICY "Users can create report"
    ON reported_listings FOR INSERT
    WITH CHECK (auth.uid() = reported_by AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can manage reports" ON reported_listings;
CREATE POLICY "Admins can manage reports"
    ON reported_listings FOR ALL
    USING (auth.uid()::text IN (
        SELECT id::text FROM profiles WHERE role = 'admin' OR role = 'manager'
    ));

DROP POLICY IF EXISTS "Users can view own reports" ON reported_listings;
CREATE POLICY "Users can view own reports"
    ON reported_listings FOR SELECT
    USING (auth.uid() = reported_by);
