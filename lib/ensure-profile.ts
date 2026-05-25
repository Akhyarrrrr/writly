import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'

export async function ensureProfile(
  supabase: SupabaseClient,
  user: User
): Promise<Profile | null> {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (existing) return existing

  const meta = user.user_metadata as { full_name?: string } | undefined
  const username =
    user.email?.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '') || 'user'

  const { data: created, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username,
      full_name: meta?.full_name || username,
    })
    .select()
    .single()

  if (error) {
    console.error('ensureProfile:', error.message)
    return null
  }

  return created
}
