-- Pastel Clone Database Schema Migration
-- Run this SQL in Supabase SQL Editor
-- Make sure to run the ENTIRE script at once

-- ===== CREATE USERS TABLE =====
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== UPDATE PROJECTS TABLE =====
-- Add owner_id column if it doesn't exist
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE;

-- Add title column (optional)
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS title TEXT;

-- ===== UPDATE COMMENTS TABLE =====
-- Add user columns
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS user_name TEXT DEFAULT 'Anonymous';

-- ===== CREATE REPLIES TABLE =====
CREATE TABLE IF NOT EXISTS public.replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL DEFAULT 'Anonymous',
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== CREATE INDEXES FOR PERFORMANCE =====
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_comments_project ON public.comments(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_replies_comment ON public.replies(comment_id);
CREATE INDEX IF NOT EXISTS idx_replies_user ON public.replies(user_id);

-- ===== ADD TABLE COMMENTS =====
COMMENT ON TABLE public.users IS 'User accounts for project owners and commenters';
COMMENT ON TABLE public.projects IS 'Annotation projects with website URLs';
COMMENT ON TABLE public.comments IS 'Visual comments placed on websites';
COMMENT ON TABLE public.replies IS 'Threaded replies to comments';

-- ===== SUCCESS MESSAGE =====
DO $$
BEGIN
    RAISE NOTICE '✅ Migration completed successfully!';
    RAISE NOTICE 'Tables created: users, updated projects/comments, created replies';
    RAISE NOTICE 'You can now restart your server and sign up for an account';
END $$;
