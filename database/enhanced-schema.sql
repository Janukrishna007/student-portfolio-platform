-- Enhanced Student Portfolio Platform Database Schema
-- Run this in your Supabase SQL Editor after the initial schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Faculty table
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table (extracted from certificates via AI)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  category TEXT CHECK (category IN ('technical', 'soft', 'domain')) NOT NULL,
  proficiency_level TEXT CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  source_certificate_id UUID REFERENCES public.certificates(id),
  ai_confidence DECIMAL(3,2), -- AI confidence score (0.00-1.00)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced portfolios table
CREATE TABLE IF NOT EXISTS public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  portfolio_url TEXT UNIQUE, -- public shareable link
  qr_code_url TEXT, -- for QR verification
  is_public BOOLEAN DEFAULT false,
  last_generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table (faculty certificate approvals + mentorship)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_id UUID REFERENCES public.certificates(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.faculty(id),
  status TEXT CHECK (status IN ('approved', 'rejected', 'needs_revision')) NOT NULL,
  feedback TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recommendations table (AI-generated career suggestions)
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('job', 'internship', 'course', 'skill')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  company_name TEXT,
  relevance_score DECIMAL(3,2), -- AI matching score
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table (for NAAC/NIRF reports)
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT CHECK (report_type IN ('naac', 'nirf', 'department', 'student_progress')) NOT NULL,
  data JSONB NOT NULL, -- flexible JSON storage for different report structures
  generated_by UUID REFERENCES public.users(id),
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for new tables
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Faculty policies
CREATE POLICY "Faculty can view own data" ON public.faculty 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Faculty can update own data" ON public.faculty 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admin can view all faculty" ON public.faculty 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Skills policies
CREATE POLICY "Students can view own skills" ON public.skills 
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can manage own skills" ON public.skills 
  FOR ALL USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can view all skills" ON public.skills 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role IN ('faculty', 'admin')
    )
  );

-- Portfolio policies
CREATE POLICY "Students can view own portfolios" ON public.portfolios 
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can manage own portfolios" ON public.portfolios 
  FOR ALL USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public portfolios are viewable" ON public.portfolios 
  FOR SELECT USING (is_public = true);

CREATE POLICY "Faculty can view all portfolios" ON public.portfolios 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role IN ('faculty', 'admin')
    )
  );

-- Reviews policies
CREATE POLICY "Faculty can view own reviews" ON public.reviews 
  FOR SELECT USING (
    faculty_id IN (
      SELECT id FROM public.faculty WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can manage own reviews" ON public.reviews 
  FOR ALL USING (
    faculty_id IN (
      SELECT id FROM public.faculty WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can view reviews of their certificates" ON public.reviews 
  FOR SELECT USING (
    certificate_id IN (
      SELECT c.id FROM public.certificates c
      JOIN public.students s ON c.student_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all reviews" ON public.reviews 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Recommendations policies
CREATE POLICY "Students can view own recommendations" ON public.recommendations 
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can update own recommendations" ON public.recommendations 
  FOR UPDATE USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert recommendations" ON public.recommendations 
  FOR INSERT WITH CHECK (true); -- Allow system/AI to create recommendations

CREATE POLICY "Faculty can view student recommendations" ON public.recommendations 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role IN ('faculty', 'admin')
    )
  );

-- Analytics policies
CREATE POLICY "Admin can manage analytics" ON public.analytics 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Faculty can view relevant analytics" ON public.analytics 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role IN ('faculty', 'admin')
    )
  );

-- Storage policies for avatars bucket
CREATE POLICY "Users can upload avatars" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view avatars" ON storage.objects 
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update own avatars" ON storage.objects 
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatars" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faculty_user_id ON public.faculty(user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_employee_id ON public.faculty(employee_id);
CREATE INDEX IF NOT EXISTS idx_faculty_department ON public.faculty(department);

CREATE INDEX IF NOT EXISTS idx_skills_student_id ON public.skills(student_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_skill_name ON public.skills(skill_name);

CREATE INDEX IF NOT EXISTS idx_portfolios_student_id ON public.portfolios(student_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_is_public ON public.portfolios(is_public);

CREATE INDEX IF NOT EXISTS idx_reviews_certificate_id ON public.reviews(certificate_id);
CREATE INDEX IF NOT EXISTS idx_reviews_faculty_id ON public.reviews(faculty_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON public.reviews(status);

CREATE INDEX IF NOT EXISTS idx_recommendations_student_id ON public.recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_type ON public.recommendations(type);
CREATE INDEX IF NOT EXISTS idx_recommendations_active ON public.recommendations(is_active);

CREATE INDEX IF NOT EXISTS idx_analytics_report_type ON public.analytics(report_type);
CREATE INDEX IF NOT EXISTS idx_analytics_generated_by ON public.analytics(generated_by);

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers where needed (portfolios doesn't have updated_at in this schema)
-- The original schema already has triggers for users, students, certificates

-- Sample data insertion function (optional - for testing)
CREATE OR REPLACE FUNCTION insert_sample_data()
RETURNS void AS $$
BEGIN
  -- Note: This requires actual auth user IDs
  -- Replace with real UUIDs from your Supabase auth.users table
  
  -- Sample faculty (uncomment and replace UUIDs when needed)
  /*
  INSERT INTO public.faculty (user_id, employee_id, name, department, designation) VALUES 
    ('faculty-user-uuid-here', 'FAC001', 'Dr. John Smith', 'Computer Science', 'Professor')
  ON CONFLICT (employee_id) DO NOTHING;
  */
  
  -- Sample skills (uncomment and replace student_id when needed)
  /*
  INSERT INTO public.skills (student_id, skill_name, category, proficiency_level) VALUES 
    ('student-uuid-here', 'JavaScript', 'technical', 'advanced'),
    ('student-uuid-here', 'React', 'technical', 'intermediate'),
    ('student-uuid-here', 'Communication', 'soft', 'good')
  ON CONFLICT DO NOTHING;
  */
  
END;
$$ LANGUAGE plpgsql;

COMMIT;
