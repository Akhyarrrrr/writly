import { createClient } from '@/lib/supabase/server'
import { FileText, Eye, BookOpen, FilePen, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { panelClass } from '@/lib/ui'
import { cn } from '@/lib/utils'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [
    { count: totalPosts },
    { count: published },
    { count: drafts },
    { data: recentPosts },
    { data: topPosts },
    { data: viewRows },
  ] = await Promise.all([
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user!.id),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user!.id)
      .eq('status', 'published'),
    supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user!.id)
      .eq('status', 'draft'),
    supabase
      .from('posts')
      .select('id, title, slug, status, created_at, view_count')
      .eq('author_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('posts')
      .select('id, title, slug, view_count')
      .eq('author_id', user!.id)
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(5),
    supabase.from('posts').select('view_count').eq('author_id', user!.id),
  ])

  const totalViews = viewRows?.reduce((total, post) => total + (post.view_count || 0), 0) || 0

  const stats = [
    { label: 'Total posts', value: totalPosts || 0, icon: FileText },
    { label: 'Published', value: published || 0, icon: BookOpen },
    { label: 'Drafts', value: drafts || 0, icon: FilePen },
    { label: 'Views', value: totalViews, icon: Eye },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800/80 pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-1">
            Overview
          </p>
          <h1 className="font-display text-2xl font-semibold text-white tracking-tight">
            Dashboard
          </h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-950 text-sm font-medium rounded-lg hover:bg-white transition cursor-pointer"
        >
          <PlusCircle size={15} />
          New post
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className={panelClass('p-4')}>
            <Icon size={16} className="text-zinc-500 mb-3" strokeWidth={1.5} />
            <p className="font-display text-2xl font-semibold text-white tracking-tight">
              {value.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={panelClass('p-5')}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-medium text-white">
              Recent posts
            </h2>
            <Link
              href="/admin/posts"
              className="text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              View all
            </Link>
          </div>
          <div className="space-y-1">
            {recentPosts?.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between hover:bg-zinc-800/40 rounded-lg px-2 py-2 -mx-2 transition group cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-sm text-zinc-300 group-hover:text-white truncate">
                    {post.title}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {formatDate(post.created_at)}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 ml-3 text-xs px-2 py-0.5 rounded-md capitalize',
                    post.status === 'published'
                      ? 'bg-zinc-800 text-zinc-300'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  )}
                >
                  {post.status}
                </span>
              </Link>
            ))}
            {!recentPosts?.length && (
              <p className="text-sm text-zinc-600 text-center py-6">
                No posts yet.{' '}
                <Link
                  href="/admin/posts/new"
                  className="text-zinc-300 hover:text-white cursor-pointer"
                >
                  Write one →
                </Link>
              </p>
            )}
          </div>
        </div>

        <div className={panelClass('p-5')}>
          <h2 className="font-display text-sm font-medium text-white mb-4">
            Top by views
          </h2>
          <div className="space-y-1">
            {topPosts?.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                target="_blank"
                className="flex items-center gap-3 hover:bg-zinc-800/40 rounded-lg px-2 py-2 -mx-2 transition cursor-pointer"
              >
                <span className="text-xs font-mono text-zinc-600 w-4 shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm text-zinc-300 flex-1 truncate">
                  {post.title}
                </p>
                <span className="text-xs text-zinc-500 flex items-center gap-1 shrink-0">
                  <Eye size={11} /> {post.view_count}
                </span>
              </Link>
            ))}
            {!topPosts?.length && (
              <p className="text-sm text-zinc-600 text-center py-6">
                Publish posts to see stats
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
