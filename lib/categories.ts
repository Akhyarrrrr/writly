import type { SupabaseClient } from '@supabase/supabase-js'
import { generateSlug } from '@/lib/utils'

const CATEGORY_COLORS = [
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#3b82f6',
  '#8b5cf6',
  '#ef4444',
  '#14b8a6',
]

function colorForName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length]
}

export async function findOrCreateCategory(
  supabase: SupabaseClient,
  name: string
): Promise<{ id: string } | { error: string }> {
  const trimmed = name.trim()
  if (!trimmed) return { error: 'Category name is required' }

  const slug = generateSlug(trimmed)

  const { data: bySlug } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (bySlug) return { id: bySlug.id }

  const { data: byName } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', trimmed)
    .maybeSingle()

  if (byName) return { id: byName.id }

  const { data: created, error } = await supabase
    .from('categories')
    .insert({
      name: trimmed,
      slug,
      color: colorForName(trimmed),
    })
    .select('id')
    .single()

  if (error) {
    if (error.message.includes('unique')) {
      const { data: retry } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      if (retry) return { id: retry.id }
    }
    return { error: error.message }
  }

  return { id: created.id }
}
