import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { attachProfiles } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export default async function AuthorPage({ params, searchParams }: { params: Promise<{ username: string }>; searchParams: Promise<{ page?: string }> }) {
  const [{ username }, { page: pageParam = '1' }] = await Promise.all([params, searchParams])
  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1)
  const pageSize = 10
  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle()
  if (!profile) notFound()

  const { data, count } = await supabase
    .from('posts')
    .select('*, categories(name, slug, color)', { count: 'exact' })
    .eq('author_id', profile.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)
  const posts = data ? await attachProfiles(supabase, data) : []
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize))

  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-28">
      <header className="border-b border-zinc-800 pb-8">
        <p className="text-sm text-zinc-500">Author</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-white">{profile.full_name || profile.username}</h1>
        {profile.bio && <p className="mt-3 max-w-2xl text-zinc-400">{profile.bio}</p>}
        {profile.website && <a href={profile.website} rel="me noreferrer" className="mt-3 inline-block text-sm text-zinc-300 underline">Website</a>}
      </header>
      <section className="divide-y divide-zinc-800">
        {posts.map((post) => (
          <article key={post.id as string} className="py-8">
            <Link href={`/blog/${post.slug}`}><h2 className="font-display text-2xl text-white hover:text-zinc-300">{post.title as string}</h2></Link>
            <p className="mt-2 text-sm text-zinc-500">{formatDate((post.published_at || post.created_at) as string)}</p>
            {post.excerpt && <p className="mt-3 text-zinc-400">{post.excerpt as string}</p>}
          </article>
        ))}
        {!posts.length && <p className="py-16 text-zinc-500">No published articles yet.</p>}
      </section>
      {totalPages > 1 && <nav aria-label="Author articles pagination" className="flex justify-between border-t border-zinc-800 pt-6 text-sm">
        {page > 1 ? <Link href={`/authors/${username}?page=${page - 1}`}>Previous</Link> : <span />}
        <span className="text-zinc-500">Page {page} of {totalPages}</span>
        {page < totalPages ? <Link href={`/authors/${username}?page=${page + 1}`}>Next</Link> : <span />}
      </nav>}
    </main>
  )
}
