import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { formatDate } from '@/lib/utils'
import { attachProfiles } from '@/lib/posts'
import { Clock, ArrowUpRight } from 'lucide-react'
import CategoryBadge from '@/components/blog/CategoryBadge'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artikel, tutorial, dan catatan dari Writly.',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  let query = supabase
    .from('posts')
    .select('*, categories(name, slug, color)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (category) {
    const cat = categories?.find((c) => c.slug === category)
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data: rawPosts } = await query
  const posts = rawPosts ? await attachProfiles(supabase, rawPosts) : []

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

      <div className="flex flex-wrap gap-2 mb-12">
        <Link
          href="/blog"
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
            href={`/blog?category=${cat.slug}`}
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
                        {profile?.full_name && (
                          <span className="text-zinc-500">{profile.full_name}</span>
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
    </div>
  )
}
