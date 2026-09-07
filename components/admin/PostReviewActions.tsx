'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import type { Post } from '@/types'

export default function PostReviewActions({ post }: { post: Post }) {
  const router = useRouter()
  const [publishing, setPublishing] = useState(false)

  async function publish() {
    setPublishing(true)
    const supabase = createClient()
    const { error: revisionError } = await supabase.from('post_revisions').insert({
      post_id: post.id,
      author_id: post.author_id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image_url: post.cover_image_url,
    })
    if (revisionError) {
      toast.error('Could not create a revision snapshot. Publishing was cancelled.')
      setPublishing(false)
      return
    }

    const { error } = await supabase
      .from('posts')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', post.id)
      .eq('author_id', post.author_id)

    setPublishing(false)
    if (error) toast.error('Publishing failed. Your draft is still safe.')
    else {
      toast.success('Post published.')
      router.push(`/blog/${post.slug}`)
      router.refresh()
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" onClick={() => router.push(`/admin/posts/${post.id}/edit`)}>Back to editor</Button>
      <Button onClick={publish} disabled={publishing}>{publishing ? 'Publishing...' : 'Confirm publish'}</Button>
    </div>
  )
}
