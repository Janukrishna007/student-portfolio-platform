-- Storage Setup for Student Portfolio Platform
-- Run this in your Supabase SQL Editor to set up storage buckets and policies

-- Create certificates bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Students can upload certificates" ON storage.objects;
DROP POLICY IF EXISTS "Users can view certificates" ON storage.objects;
DROP POLICY IF EXISTS "Students can delete own certificates" ON storage.objects;
DROP POLICY IF EXISTS "Students can update own certificates" ON storage.objects;

DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;

-- Certificate storage policies
CREATE POLICY "Students can upload certificates" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'certificates' AND
    auth.uid()::text IN (
      SELECT s.user_id::text FROM public.students s 
      WHERE (storage.foldername(name))[1] = s.id::text
    )
  );

CREATE POLICY "Students can view own certificates" ON storage.objects 
  FOR SELECT USING (
    bucket_id = 'certificates' AND (
      auth.uid()::text IN (
        SELECT s.user_id::text FROM public.students s 
        WHERE (storage.foldername(name))[1] = s.id::text
      ) OR
      -- Allow faculty and admin to view all certificates
      EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() AND users.role IN ('faculty', 'admin')
      )
    )
  );

CREATE POLICY "Students can update own certificates" ON storage.objects 
  FOR UPDATE USING (
    bucket_id = 'certificates' AND
    auth.uid()::text IN (
      SELECT s.user_id::text FROM public.students s 
      WHERE (storage.foldername(name))[1] = s.id::text
    )
  );

CREATE POLICY "Students can delete own certificates" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'certificates' AND
    auth.uid()::text IN (
      SELECT s.user_id::text FROM public.students s 
      WHERE (storage.foldername(name))[1] = s.id::text
    )
  );

-- Public access for verified certificates (optional)
CREATE POLICY "Public can view public certificates" ON storage.objects 
  FOR SELECT USING (
    bucket_id = 'certificates' AND
    EXISTS (
      SELECT 1 FROM public.certificates c
      JOIN public.students s ON c.student_id = s.id
      WHERE c.status = 'verified' 
      AND name LIKE '%' || c.id::text || '%'
    )
  );

-- Avatar storage policies
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

-- Function to get certificate file path from certificate ID
CREATE OR REPLACE FUNCTION get_certificate_file_path(certificate_id UUID)
RETURNS TEXT AS $$
DECLARE
  student_id TEXT;
BEGIN
  SELECT s.id::text INTO student_id
  FROM public.certificates c
  JOIN public.students s ON c.student_id = s.id
  WHERE c.id = certificate_id;
  
  RETURN student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access certificate file
CREATE OR REPLACE FUNCTION can_access_certificate(certificate_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_owner BOOLEAN := FALSE;
  is_faculty_or_admin BOOLEAN := FALSE;
  cert_status TEXT;
BEGIN
  -- Check if user is the certificate owner
  SELECT EXISTS(
    SELECT 1 FROM public.certificates c
    JOIN public.students s ON c.student_id = s.id
    WHERE c.id = certificate_id AND s.user_id = user_id
  ) INTO is_owner;
  
  -- Check if user is faculty or admin
  SELECT EXISTS(
    SELECT 1 FROM public.users u
    WHERE u.id = user_id AND u.role IN ('faculty', 'admin')
  ) INTO is_faculty_or_admin;
  
  -- Check certificate status for public access
  SELECT status INTO cert_status FROM public.certificates WHERE id = certificate_id;
  
  RETURN is_owner OR is_faculty_or_admin OR (cert_status = 'verified');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance on storage queries
CREATE INDEX IF NOT EXISTS idx_certificates_status_student ON public.certificates(status, student_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id_id ON public.students(user_id, id);

COMMIT;
