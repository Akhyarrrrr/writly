import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PostReviewActions from '@/components/admin/PostReviewActions'
import type { Post } from '@/types'

export default async function ReviewPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase.from('posts').select('*').eq('id', id).eq('author_id', user.id).maybeSingle()
  if (!data) notFound()
  const post = data as Post

  return (
    <article className="mx-auto max-w-3xl">
      <header className="mb-8 border-b border-zinc-800 pb-6">
        <p className="text-sm font-medium text-amber-300">Review before publishing</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-white">{post.title}</h1>
        {post.excerpt && <p className="mt-3 text-zinc-400">{post.excerpt}</p>}
      </header>
      {post.cover_image_url && <img src={post.cover_image_url} alt="" className="mb-8 aspect-video w-full rounded-xl object-cover" />}
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      <footer className="mt-10 border-t border-zinc-800 pt-6"><PostReviewActions post={post} /></footer>
    </article>
  )
}
