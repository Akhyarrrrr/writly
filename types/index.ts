export interface Profile {
  id: string
  username: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  website: string | null
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string
  created_at: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Post {
  id: string
  author_id: string
  category_id: string | null
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  status: 'draft' | 'published'
  featured: boolean
  read_time: number
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
  categories?: Category | { name: string; color: string }
  post_tags?: { tags: Tag }[]
}

export interface PostFormData {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image_url: string
  category_id: string
  status: 'draft' | 'published'
  featured: boolean
  tags: string[]
}
