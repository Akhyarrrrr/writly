import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import PostEditor from '@/components/admin/PostEditor'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: post }, { data: categories }] = await Promise.all([
    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .eq('author_id', user.id)
      .single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!post) notFound()

  return (
    <PostEditor post={post} categories={categories || []} userId={user.id} />
  )
}
