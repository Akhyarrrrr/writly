import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

export function getDisplayName(
  profile: Profile | null | undefined,
  user: User
): string {
  const meta = user.user_metadata as { full_name?: string } | undefined
  return (
    profile?.full_name?.trim() ||
    meta?.full_name?.trim() ||
    profile?.username?.trim() ||
    user.email?.split('@')[0] ||
    'Writer'
  )
}
