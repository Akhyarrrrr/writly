'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { PlusCircle, Edit2, Trash2, Eye, Globe, FileText } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Post } from '@/types'

export default function PostsTableClient({
  initialPosts,
}: {
  initialPosts: Post[]
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  const filtered =
    filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const supabase = createClient()
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) {
      toast.error(
        error.message.includes('permission')
          ? 'Akses ditolak. Jalankan supabase/schema.sql di Supabase SQL Editor.'
          : 'Failed to delete post'
      )
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Post deleted')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-1 bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-1">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium capitalize transition duration-200 cursor-pointer',
                filter === f
                  ? 'bg-zinc-100 text-zinc-950'
                  : 'text-zinc-500 hover:text-zinc-200'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-950 text-sm font-medium rounded-lg hover:bg-white transition shrink-0 cursor-pointer"
        >
          <PlusCircle size={15} />
          New post
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
          <FileText size={28} className="text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500">No posts yet</p>
          <Link
            href="/admin/posts/new"
            className="text-sm text-zinc-400 hover:text-white mt-2 inline-block cursor-pointer"
          >
            Write your first post →
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800/80 rounded-xl overflow-hidden bg-zinc-900/20">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-900/40">
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3 uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3 hidden lg:table-cell uppercase tracking-wide">
                  Slug
                </th>
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3 hidden sm:table-cell uppercase tracking-wide">
                  Category
                </th>
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3 hidden md:table-cell uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3 uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-zinc-500 px-5 py-3 hidden md:table-cell uppercase tracking-wide">
                  Views
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((post) => {
                const cat = post.categories as
                  | { name: string; color: string }
                  | undefined
                return (
                  <tr
                    key={post.id}
                    className="hover:bg-zinc-800/20 transition group"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-sm font-medium text-zinc-200 hover:text-white line-clamp-1 cursor-pointer"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-xs font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer"
                      >
                        {post.slug}
                      </Link>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      {cat ? (
                        <span
                          className="text-xs px-2 py-1 rounded-md"
                          style={{
                            backgroundColor: `${cat.color}18`,
                            color: cat.color,
                          }}
                        >
                          {cat.name}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-zinc-500">
                        {formatDate(post.created_at)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex text-xs px-2.5 py-1 rounded-md font-medium capitalize',
                          post.status === 'published'
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                        )}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-zinc-500 flex items-center gap-1">
                        <Eye size={12} /> {post.view_count}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition">
                        {post.status === 'published' && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            aria-label={`View ${post.title}`}
                            className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition cursor-pointer"
                          >
                            <Globe size={14} />
                          </Link>
                        )}
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          aria-label={`Edit ${post.title}`}
                          className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          type="button"
                          aria-label={`Delete ${post.title}`}
                          onClick={() => handleDelete(post.id, post.title)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-950/40 rounded-md transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
