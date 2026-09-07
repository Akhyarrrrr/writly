-- Writly database schema — run in Supabase SQL Editor

create extension if not exists "uuid-ossp";

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  full_name text,
  bio text,
  avatar_url text,
  website text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    split_part(new.email, '@', 1),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  color text default '#6366f1',
  created_at timestamptz default now() not null
);

alter table public.categories enable row level security;

create policy "Categories viewable by everyone"
  on public.categories for select using (true);

create policy "Authenticated users can insert categories"
  on public.categories for insert to authenticated with check (true);

create policy "Authenticated users can update categories"
  on public.categories for update to authenticated using (true);

create policy "Authenticated users can delete categories"
  on public.categories for delete to authenticated using (true);

insert into public.categories (name, slug, description, color) values
  ('Web Development', 'web-development', 'Articles about frontend, backend, and fullstack development', '#6366f1'),
  ('Tutorial', 'tutorial', 'Step-by-step guides and how-tos', '#10b981'),
  ('Career', 'career', 'Career advice, job hunting, and professional growth', '#f59e0b'),
  ('Opinion', 'opinion', 'Thoughts and perspectives on tech and life', '#ec4899'),
  ('Project', 'project', 'Project breakdowns and case studies', '#3b82f6');

create table public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references auth.users on delete cascade not null,
  category_id uuid references public.categories on delete set null,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  status text default 'draft' check (status in ('draft', 'published')),
  featured boolean default false,
  read_time integer default 1,
  view_count integer default 0,
  published_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.posts enable row level security;

create policy "Published posts viewable by everyone"
  on public.posts for select
  using (status = 'published' or auth.uid() = author_id);

create policy "Authors can insert own posts"
  on public.posts for insert to authenticated
  with check (auth.uid() = author_id);

create policy "Authors can update own posts"
  on public.posts for update to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "Authors can delete own posts"
  on public.posts for delete to authenticated
  using (auth.uid() = author_id);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on public.posts
  for each row execute function update_updated_at();

create table public.post_revisions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create index post_revisions_post_created_idx
  on public.post_revisions (post_id, created_at desc);

alter table public.post_revisions enable row level security;
create policy "Authors can view own revisions" on public.post_revisions
  for select to authenticated using (auth.uid() = author_id);
create policy "Authors can snapshot own posts" on public.post_revisions
  for insert to authenticated with check (
    auth.uid() = author_id and exists (
      select 1 from public.posts where posts.id = post_id and posts.author_id = auth.uid()
    )
  );

create table public.tags (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

alter table public.tags enable row level security;
create policy "Tags viewable by everyone" on public.tags for select using (true);
create policy "Authenticated users manage tags" on public.tags for all using (auth.role() = 'authenticated');

create table public.post_tags (
  post_id uuid references public.posts on delete cascade,
  tag_id uuid references public.tags on delete cascade,
  primary key (post_id, tag_id)
);

alter table public.post_tags enable row level security;
create policy "Post tags viewable by everyone" on public.post_tags for select using (true);
create policy "Authors manage own post tags" on public.post_tags for all
  using (exists (select 1 from public.posts where posts.id = post_id and posts.author_id = auth.uid()));

insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

create policy "Blog images are publicly accessible"
  on storage.objects for select using (bucket_id = 'blog-images');

create policy "Authenticated users can upload images"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and auth.role() = 'authenticated');

create policy "Users can delete own images"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and auth.uid() = owner);

-- Grants & profile insert (production)
grant usage on schema public to postgres, anon, authenticated, service_role;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant all on public.posts to authenticated;
grant all on public.categories to authenticated;
grant select, insert, update on public.profiles to authenticated;

create policy "Users can insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

alter table public.posts
  add constraint posts_author_profile_fkey
  foreign key (author_id) references public.profiles(id);
