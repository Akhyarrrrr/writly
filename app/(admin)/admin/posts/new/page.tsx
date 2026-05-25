import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PostEditor from '@/components/admin/PostEditor'

export default async function NewPostPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return <PostEditor categories={categories || []} userId={user.id} />
}
