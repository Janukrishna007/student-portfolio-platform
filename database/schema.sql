-- Student Portfolio Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('student', 'faculty', 'admin')) NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table  
CREATE TABLE IF NOT EXISTS public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  department TEXT NOT NULL,
  year INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  cgpa DECIMAL(3,2),
  profile_image TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE NOT NULL,
  certificate_url TEXT,
  category TEXT CHECK (category IN ('academic', 'professional', 'skill', 'achievement')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'verified', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for certificates
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Students can view own data" ON public.students;
DROP POLICY IF EXISTS "Students can update own data" ON public.students;
DROP POLICY IF EXISTS "Students can view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Students can manage own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Faculty can view all certificates" ON public.certificates;
DROP POLICY IF EXISTS "Faculty can update certificate status" ON public.certificates;
DROP POLICY IF EXISTS "Admin can view all data" ON public.users;
DROP POLICY IF EXISTS "Admin can view all students" ON public.students;
DROP POLICY IF EXISTS "Admin can view all certificates" ON public.certificates;

-- User policies
CREATE POLICY "Users can view own profile" ON public.users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id);

-- Student policies
CREATE POLICY "Students can view own data" ON public.students 
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Students can update own data" ON public.students 
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admin can view all students" ON public.students 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Faculty can view students" ON public.students 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role IN ('faculty', 'admin')
    )
  );

-- Certificate policies
CREATE POLICY "Students can view own certificates" ON public.certificates 
  FOR SELECT USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Students can manage own certificates" ON public.certificates 
  FOR ALL USING (
    student_id IN (
      SELECT id FROM public.students WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can view all certificates" ON public.certificates 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role IN ('faculty', 'admin')
    )
  );

CREATE POLICY "Faculty can update certificate status" ON public.certificates 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role IN ('faculty', 'admin')
    )
  );

-- Admin policies (can access everything)
CREATE POLICY "Admin can view all data" ON public.users 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Storage policies for certificates bucket
CREATE POLICY "Students can upload certificates" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'certificates' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view certificates" ON storage.objects 
  FOR SELECT USING (bucket_id = 'certificates');

CREATE POLICY "Students can delete own certificates" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'certificates' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_student_id ON public.students(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON public.certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates(status);
CREATE INDEX IF NOT EXISTS idx_certificates_category ON public.certificates(category);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at 
  BEFORE UPDATE ON public.students 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_certificates_updated_at ON public.certificates;
CREATE TRIGGER update_certificates_updated_at 
  BEFORE UPDATE ON public.certificates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- Note: You'll need to create auth users first through Supabase auth

-- Sample admin user (replace with actual auth user ID)
-- INSERT INTO public.users (id, email, role) VALUES 
--   ('00000000-0000-0000-0000-000000000001', 'admin@university.edu', 'admin');

-- Sample faculty user (replace with actual auth user ID)
-- INSERT INTO public.users (id, email, role) VALUES 
--   ('00000000-0000-0000-0000-000000000002', 'prof.smith@university.edu', 'faculty');

-- Sample student user (replace with actual auth user ID)
-- INSERT INTO public.users (id, email, role) VALUES 
--   ('00000000-0000-0000-0000-000000000003', 'john.doe@university.edu', 'student');

-- Sample student profile (uncomment after creating auth users)
-- INSERT INTO public.students (user_id, student_id, first_name, last_name, department, year, semester, cgpa) VALUES 
--   ('00000000-0000-0000-0000-000000000003', 'CS2021001', 'John', 'Doe', 'Computer Science', 3, 5, 8.5);

COMMIT;
