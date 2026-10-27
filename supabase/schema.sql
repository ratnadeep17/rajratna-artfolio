-- Run this whole file once in Supabase: SQL Editor -> New query -> Run

-- 1. Artworks table ---------------------------------------------------------
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  medium text,
  image_url text not null,
  image_path text not null,          -- path inside the storage bucket (for deletes)
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.artworks enable row level security;

-- Everyone can view the gallery
create policy "Public can read artworks"
  on public.artworks for select
  using (true);

-- Only logged-in users (your brother) can add / edit / delete
create policy "Admin can insert artworks"
  on public.artworks for insert
  to authenticated
  with check (true);

create policy "Admin can update artworks"
  on public.artworks for update
  to authenticated
  using (true) with check (true);

create policy "Admin can delete artworks"
  on public.artworks for delete
  to authenticated
  using (true);

-- 2. Likes via functions (visitors never write to the table directly) --------
create or replace function public.like_artwork(p_id uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.artworks
     set likes = likes + 1
   where id = p_id
  returning likes;
$$;

create or replace function public.unlike_artwork(p_id uuid)
returns integer
language sql
security definer
set search_path = public
as $$
  update public.artworks
     set likes = greatest(likes - 1, 0)
   where id = p_id
  returning likes;
$$;

grant execute on function public.like_artwork(uuid) to anon, authenticated;
grant execute on function public.unlike_artwork(uuid) to anon, authenticated;

-- 3. Storage bucket for images ------------------------------------------------
insert into storage.buckets (id, name, public)
values ('art', 'art', true)
on conflict (id) do nothing;

create policy "Public can view art images"
  on storage.objects for select
  using (bucket_id = 'art');

create policy "Admin can upload art images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'art');

create policy "Admin can update art images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'art');

create policy "Admin can delete art images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'art');

-- 4. IMPORTANT, do this in the dashboard after creating your brother's user:
--    Authentication -> Sign In / Providers -> turn OFF "Allow new users to sign up"
--    Otherwise anyone could register and get "authenticated" access.
