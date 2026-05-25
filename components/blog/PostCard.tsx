import Link from 'next/link'
import { Clock, Eye, ArrowUpRight } from 'lucide-react'
import CategoryBadge from './CategoryBadge'
import { formatDate } from '@/lib/utils'
import type { PostCardData } from './PostGrid'

interface PostCardProps {
  post: PostCardData & {
    profiles?: { full_name?: string | null } | null
    categories?: { name: string; slug: string; color: string } | null
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="flex flex-col h-full rounded-xl border border-zinc-800/80 bg-zinc-900/30 overflow-hidden hover:border-zinc-700 hover:bg-zinc-900/50 transition duration-300 cursor-pointer"
      >
        {post.cover_image_url && (
          <div className="h-44 overflow-hidden border-b border-zinc-800/80">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          {post.categories && (
            <div className="mb-3">
              <CategoryBadge
                name={post.categories.name}
                color={post.categories.color}
              />
            </div>
          )}
          <h3 className="font-display font-medium text-white text-lg mb-2 line-clamp-2 leading-snug group-hover:text-zinc-200 transition">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-zinc-500 text-sm line-clamp-2 mb-4 flex-1 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-zinc-600 mt-auto pt-2">
            <span>{post.profiles?.full_name}</span>
            <span className="flex items-center gap-3">
              <span>{formatDate(post.published_at || post.created_at)}</span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> {post.read_time}m
              </span>
            </span>
            <ArrowUpRight
              size={14}
              className="text-zinc-600 group-hover:text-zinc-400 transition shrink-0"
            />
          </div>
        </div>
      </Link>
    </article>
  )
}
