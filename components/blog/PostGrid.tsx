import PostCard from './PostCard'

export type PostCardData = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  cover_image_url?: string | null
  published_at?: string | null
  created_at: string
  read_time: number
  view_count: number
  profiles?: { full_name?: string | null } | { full_name?: string | null }[] | null
  categories?:
    | { name: string; slug: string; color: string }
    | { name: string; slug: string; color: string }[]
    | null
}

function normalizePost(post: PostCardData) {
  return {
    ...post,
    profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles,
    categories: Array.isArray(post.categories)
      ? post.categories[0]
      : post.categories,
  }
}

export default function PostGrid({ posts }: { posts: PostCardData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={normalizePost(post)} />
      ))}
    </div>
  )
}
