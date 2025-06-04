CREATE POLICY "Anyone can upload profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images'
);

CREATE POLICY "Anyone can read profile images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'profile-images'
);

-- Ensure RLS is enabled for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
