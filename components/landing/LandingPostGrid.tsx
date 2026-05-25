'use client'

import PostCard from '@/components/blog/PostCard'
import { Stagger, StaggerItem, scaleInVariants } from '@/components/motion/FadeIn'
import type { PostCardData } from '@/components/blog/PostGrid'

function normalizePost(post: PostCardData) {
  return {
    ...post,
    profiles: Array.isArray(post.profiles) ? post.profiles[0] : post.profiles,
    categories: Array.isArray(post.categories)
      ? post.categories[0]
      : post.categories,
  }
}

export function LandingPostGrid({ posts }: { posts: PostCardData[] }) {
  return (
    <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.12}>
      {posts.map((post) => (
        <StaggerItem key={post.id} variants={scaleInVariants}>
          <PostCard post={normalizePost(post)} />
        </StaggerItem>
      ))}
    </Stagger>
  )
}
