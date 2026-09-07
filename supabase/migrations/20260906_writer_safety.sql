create table if not exists public.post_revisions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create index if not exists post_revisions_post_created_idx
  on public.post_revisions (post_id, created_at desc);

alter table public.post_revisions enable row level security;

create policy "Authors can view own revisions"
  on public.post_revisions for select to authenticated
  using (auth.uid() = author_id);

create policy "Authors can snapshot own posts"
  on public.post_revisions for insert to authenticated
  with check (
    auth.uid() = author_id and exists (
      select 1 from public.posts
      where posts.id = post_id and posts.author_id = auth.uid()
    )
  );
