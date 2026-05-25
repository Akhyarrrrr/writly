import { createClient } from '@/lib/supabase/server'
import PostsTableClient from './PostsTableClient'

export default async function PostsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, categories(name, color)')
    .eq('author_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-1">Content</p>
      <h1 className="font-display text-2xl font-semibold text-white tracking-tight mb-2">All posts</h1>
      <p className="text-zinc-500 text-sm mb-8">
        {posts?.length || 0} total posts
      </p>
      <PostsTableClient initialPosts={posts || []} />
    </div>
  )
}
