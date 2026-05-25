import type { SupabaseClient } from '@supabase/supabase-js'

type PostRow = Record<string, unknown> & {
  author_id: string
  categories?: unknown
}

export async function attachProfiles<T extends PostRow>(
  supabase: SupabaseClient,
  posts: T[]
): Promise<(T & { profiles: { full_name?: string | null; username?: string; avatar_url?: string | null; bio?: string | null } | null })[]> {
  if (!posts.length) return []

  const authorIds = [...new Set(posts.map((p) => p.author_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, username, avatar_url, bio')
    .in('id', authorIds)

  const byId = Object.fromEntries((profiles || []).map((p) => [p.id, p]))

  return posts.map((post) => ({
    ...post,
    profiles: byId[post.author_id] || null,
  }))
}

export async function fetchPublishedPostBySlug(
  supabase: SupabaseClient,
  slug: string
) {
  const { data: post, error } = await supabase
    .from('posts')
    .select('*, categories(name, slug, color)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !post) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, username, bio, avatar_url')
    .eq('id', post.author_id)
    .maybeSingle()

  return { ...post, profiles: profile }
}
