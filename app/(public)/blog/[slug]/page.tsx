import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { fetchPublishedPostBySlug } from '@/lib/posts'
import { Clock, ArrowLeft } from 'lucide-react'
import CategoryBadge from '@/components/blog/CategoryBadge'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const post = await fetchPublishedPostBySlug(supabase, slug)
  if (!post) return { title: 'Post not found' }
  return {
    title: post.title as string,
    description: (post.excerpt as string) || undefined,
    openGraph: {
      title: post.title as string,
      description: (post.excerpt as string) || undefined,
      images: post.cover_image_url ? [post.cover_image_url as string] : [],
      type: 'article',
      publishedTime: (post.published_at as string) || undefined,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const post = await fetchPublishedPostBySlug(supabase, slug)
  if (!post) notFound()

  void supabase
    .from('posts')
    .update({ view_count: (post.view_count as number) + 1 })
    .eq('id', post.id as string)

  const cat = post.categories as {
    name: string
    slug: string
    color: string
  } | null
  const profile = post.profiles as {
    full_name?: string
    bio?: string
  } | null

  return (
    <article className="max-w-3xl mx-auto px-4 pt-28 pb-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition mb-10 cursor-pointer"
      >
        <ArrowLeft size={14} /> All posts
      </Link>

      <header className="mb-10">
        {cat && (
          <Link href={`/blog?category=${cat.slug}`} className="inline-block mb-4 cursor-pointer">
            <CategoryBadge name={cat.name} color={cat.color} />
          </Link>
        )}
        <h1 className="font-display text-4xl sm:text-[2.75rem] font-semibold text-white leading-[1.12] tracking-tight mb-5">
          {post.title as string}
        </h1>
        {post.excerpt && (
          <p className="text-xl text-zinc-400 leading-relaxed mb-6">
            {post.excerpt as string}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 pb-8 border-b border-zinc-800/80">
          {profile?.full_name && (
            <span className="text-zinc-300 font-medium">{profile.full_name}</span>
          )}
          <span>
            {formatDate((post.published_at || post.created_at) as string)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} /> {post.read_time as number} min read
          </span>
        </div>
      </header>

      {post.cover_image_url && (
        <div className="rounded-xl overflow-hidden mb-12 aspect-[2/1] border border-zinc-800/80">
          <img
            src={post.cover_image_url as string}
            alt={post.title as string}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content as string }}
      />

      {profile?.bio && (
        <aside className="mt-16 pt-8 border-t border-zinc-800/80">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-600 mb-4">
            About the author
          </p>
          <div className="flex gap-4">
            <div className="w-11 h-11 rounded-full bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center font-display font-semibold text-zinc-300 shrink-0">
              {(profile.full_name || 'A')[0]}
            </div>
            <div>
              <p className="font-medium text-white">{profile.full_name}</p>
              <p className="text-zinc-500 text-sm mt-1 leading-relaxed max-w-md">
                {profile.bio}
              </p>
            </div>
          </div>
        </aside>
      )}
    </article>
  )
}
