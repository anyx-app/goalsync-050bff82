SET search_path TO proj_2a7a526a;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: profiles
CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- Matches auth.users.id (but no FK constraint)
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT CHECK (role IN ('admin', 'manager', 'employee')) DEFAULT 'employee',
    department TEXT,
    job_title TEXT,
    manager_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: review_cycles
CREATE TABLE review_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT CHECK (status IN ('upcoming', 'active', 'completed', 'archived')) DEFAULT 'upcoming',
    created_by UUID NOT NULL, 
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: goals
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    reviewer_id UUID REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('draft', 'in_progress', 'completed', 'blocked', 'cancelled')) DEFAULT 'draft',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    due_date DATE,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES review_cycles(id),
    subject_id UUID NOT NULL REFERENCES profiles(id),
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    status TEXT CHECK (status IN ('pending_self_review', 'pending_manager_review', 'completed', 'signed_off')) DEFAULT 'pending_self_review',
    self_review_content JSONB,
    manager_review_content JSONB,
    final_score NUMERIC,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: feedback_360
CREATE TABLE feedback_360 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES reviews(id),
    requester_id UUID NOT NULL REFERENCES profiles(id),
    provider_id UUID NOT NULL REFERENCES profiles(id),
    subject_id UUID NOT NULL REFERENCES profiles(id),
    status TEXT CHECK (status IN ('pending', 'submitted', 'declined')) DEFAULT 'pending',
    content JSONB,
    relationship TEXT CHECK (relationship IN ('peer', 'direct_report', 'manager', 'other')),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ
);

-- RLS & Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_360 ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);

-- Goals Policies
CREATE POLICY "Users view own goals" ON goals FOR SELECT USING (user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Reviewers view goals" ON goals FOR SELECT USING (reviewer_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Users update own goals" ON goals FOR UPDATE USING (user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Reviewers update goals" ON goals FOR UPDATE USING (reviewer_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Users insert own goals" ON goals FOR INSERT WITH CHECK (user_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);

-- Review Cycles Policies
CREATE POLICY "View cycles" ON review_cycles FOR SELECT USING (true);
CREATE POLICY "Create cycles" ON review_cycles FOR INSERT WITH CHECK (created_by = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);

-- Reviews Policies
CREATE POLICY "Subject view review" ON reviews FOR SELECT USING (subject_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Reviewer view review" ON reviews FOR SELECT USING (reviewer_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Subject update self review" ON reviews FOR UPDATE USING (subject_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Reviewer update manager review" ON reviews FOR UPDATE USING (reviewer_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);

-- Feedback 360 Policies
CREATE POLICY "Provider view requests" ON feedback_360 FOR SELECT USING (provider_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Subject view feedback" ON feedback_360 FOR SELECT USING (subject_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Provider update feedback" ON feedback_360 FOR UPDATE USING (provider_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
CREATE POLICY "Requester insert feedback" ON feedback_360 FOR INSERT WITH CHECK (requester_id = (current_setting('request.jwt.claims', true)::json->>'sub')::uuid);
