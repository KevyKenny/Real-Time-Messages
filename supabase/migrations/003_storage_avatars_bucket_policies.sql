-- Avatar storage bucket + RLS policies for authenticated users.
-- This resolves: "new row violates row-level security policy" on upload.

-- 1) Ensure the avatars bucket exists
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Keep avatar URLs readable by public URL calls
update storage.buckets
set public = true
where id = 'avatars';

-- 2) RLS policies for storage.objects
-- Users can upload only into their own folder: <auth.uid()>/filename.ext
create policy "Avatar upload own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can update files in their own folder (needed when upsert = true)
create policy "Avatar update own folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can delete files in their own folder
create policy "Avatar delete own folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can read files in their own folder
create policy "Avatar select own folder"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

