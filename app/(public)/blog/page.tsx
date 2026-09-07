import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { formatDate } from '@/lib/utils'
import { attachProfiles } from '@/lib/posts'
import { Clock, ArrowUpRight, Search } from 'lucide-react'
import CategoryBadge from '@/components/blog/CategoryBadge'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artikel, tutorial, dan catatan dari Writly.',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>
}) {
  const { category, q = '', page: pageParam = '1' } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1)
  const pageSize = 10
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  let query = supabase
    .from('posts')
    .select('*, categories(name, slug, color)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (category) {
    const cat = categories?.find((c) => c.slug === category)
    if (cat) query = query.eq('category_id', cat.id)
  }
  if (q.trim()) query = query.ilike('title', `%${q.trim().replace(/[%_]/g, '\\$&')}%`)

  const { data: rawPosts, count } = await query.range((page - 1) * pageSize, page * pageSize - 1)
  const posts = rawPosts ? await attachProfiles(supabase, rawPosts) : []
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize))

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-24">
      <header className="mb-14 border-b border-zinc-800/80 pb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
          Writly
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-3">
          Blog
        </h1>
        <p className="text-zinc-500 text-lg leading-relaxed max-w-lg">
          Essays and notes on building software, writing, and publishing online.
        </p>
      </header>

      <form action="/blog" className="mb-6 flex gap-2" role="search">
        <label htmlFor="blog-search" className="sr-only">Search articles</label>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input id="blog-search" name="q" defaultValue={q} placeholder="Search articles" className="h-11 w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-10 pr-3 text-sm text-white placeholder:text-zinc-500" />
        </div>
        {category && <input type="hidden" name="category" value={category} />}
        <button className="rounded-lg bg-zinc-100 px-4 text-sm font-medium text-zinc-950">Search</button>
      </form>

      <div className="flex flex-wrap gap-2 mb-12">
        <Link
          href={q ? `/blog?q=${encodeURIComponent(q)}` : '/blog'}
          className={`text-sm px-3.5 py-1.5 rounded-full transition duration-200 cursor-pointer border ${
            !category
              ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
              : 'text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600'
          }`}
        >
          All
        </Link>
        {categories?.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog?category=${cat.slug}${q ? `&q=${encodeURIComponent(q)}` : ''}`}
            className={`text-sm px-3.5 py-1.5 rounded-full transition duration-200 border cursor-pointer ${
              category === cat.slug
                ? 'bg-zinc-800 text-white border-zinc-600'
                : 'text-zinc-500 border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {!posts.length ? (
        <div className="text-center py-24 border border-dashed border-zinc-800 rounded-xl">
          <p className="text-zinc-500">No posts published yet.</p>
          <Link
            href="/"
            className="text-sm text-zinc-400 hover:text-white mt-3 inline-block cursor-pointer"
          >
            Back to home
          </Link>
        </div>
      ) : (
        <ul className="space-y-0">
          {posts.map((post, index) => {
            const cat = post.categories as {
              name: string
              slug: string
              color: string
            } | null
            const profile = post.profiles
            return (
              <li
                key={post.id as string}
                className={index > 0 ? 'border-t border-zinc-800/60' : ''}
              >
                <article className="py-10 group">
                  <div className="flex flex-col sm:flex-row gap-6">
                    {post.cover_image_url && (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="shrink-0 sm:w-40 sm:h-28 w-full h-40 rounded-lg overflow-hidden border border-zinc-800/80 cursor-pointer"
                      >
                        <img
                          src={post.cover_image_url as string}
                          alt=""
                          className="w-full h-full object-cover transition duration-500 group-hover:opacity-90"
                        />
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        {cat ? (
                          <Link
                            href={`/blog?category=${cat.slug}`}
                            className="cursor-pointer"
                          >
                            <CategoryBadge name={cat.name} color={cat.color} />
                          </Link>
                        ) : (
                          <span />
                        )}
                        <ArrowUpRight
                          size={16}
                          className="text-zinc-700 group-hover:text-zinc-400 transition shrink-0 mt-1"
                        />
                      </div>
                      <Link href={`/blog/${post.slug}`} className="cursor-pointer">
                        <h2 className="font-display text-xl font-medium text-white group-hover:text-zinc-300 transition tracking-tight leading-snug mb-1">
                          {post.title as string}
                        </h2>
                        <p className="text-xs text-zinc-600 font-mono mb-2">
                          /blog/{post.slug as string}
                        </p>
                      </Link>
                      {post.excerpt && (
                        <p className="text-zinc-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {post.excerpt as string}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600">
                        {profile?.full_name && profile.username && (
                          <Link href={`/authors/${profile.username}`} className="text-zinc-400 hover:text-white">{profile.full_name}</Link>
                        )}
                        <span>
                          {formatDate(
                            (post.published_at || post.created_at) as string
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {post.read_time as number} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="Blog pagination" className="mt-10 flex items-center justify-between border-t border-zinc-800 pt-6 text-sm">
          {page > 1 ? <Link href={`/blog?page=${page - 1}${category ? `&category=${category}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="text-zinc-300 hover:text-white">Previous</Link> : <span />}
          <span className="text-zinc-500">Page {page} of {totalPages}</span>
          {page < totalPages ? <Link href={`/blog?page=${page + 1}${category ? `&category=${category}` : ''}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="text-zinc-300 hover:text-white">Next</Link> : <span />}
        </nav>
      )}
    </div>
  )
}
