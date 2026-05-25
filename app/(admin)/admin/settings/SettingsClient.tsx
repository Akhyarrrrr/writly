'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Save, User, AtSign, Link2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { inputClass, labelClass, panelClass } from '@/lib/ui'
import { getDisplayName } from '@/lib/display-name'
import type { Profile } from '@/types'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface Props {
  profile: Profile | null
  userId: string
  user: SupabaseUser
}

function profileToForm(profile: Profile | null, user: SupabaseUser) {
  const meta = user.user_metadata as { full_name?: string } | undefined
  const fallbackUsername = user.email?.split('@')[0] || ''
  return {
    full_name: profile?.full_name || meta?.full_name || '',
    username: profile?.username || fallbackUsername,
    bio: profile?.bio || '',
    website: profile?.website || '',
  }
}

export default function SettingsClient({ profile, userId, user }: Props) {
  const router = useRouter()
  const displayName = getDisplayName(profile, user)

  const [form, setForm] = useState(() => profileToForm(profile, user))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setForm(profileToForm(profile, user))
  }, [profile, user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.username.trim()) {
      toast.error('Username is required')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const fields = {
      username: form.username.trim(),
      full_name: form.full_name.trim() || null,
      bio: form.bio.trim() || null,
      website: form.website.trim() || null,
    }

    const { error } = profile
      ? await supabase.from('profiles').update(fields).eq('id', userId)
      : await supabase.from('profiles').insert({ id: userId, ...fields })

    if (error) {
      toast.error(
        error.message.includes('unique')
          ? 'Username already taken'
          : error.message.includes('permission')
            ? 'Akses ditolak. Jalankan supabase/schema.sql di Supabase SQL Editor.'
            : error.message
      )
    } else {
      toast.success('Profile updated')
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <div className="w-full space-y-6">
      <div className={panelClass('p-6 flex items-center gap-5')}>
        <div className="w-16 h-16 rounded-full bg-zinc-800 ring-1 ring-zinc-700 flex items-center justify-center font-display text-2xl font-semibold text-zinc-200 shrink-0">
          {displayName[0].toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-semibold text-white tracking-tight truncate">
            {displayName}
          </p>
          <p className="text-sm text-zinc-500 truncate">{user.email}</p>
          {form.username && (
            <p className="text-xs text-zinc-600 mt-0.5 font-mono">@{form.username}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <form onSubmit={handleSave} className={panelClass('p-6 space-y-5 h-full')}>
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-4">
            <User size={16} className="text-zinc-500" />
            <h2 className="font-display text-sm font-semibold text-white tracking-tight">
              Public profile
            </h2>
          </div>

          <div>
            <label className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
              <span className="inline-flex items-center gap-1.5">
                <User size={12} /> Full name
              </span>
            </label>
            <input
              value={form.full_name}
              onChange={(e) =>
                setForm((p) => ({ ...p, full_name: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
              <span className="inline-flex items-center gap-1.5">
                <AtSign size={12} /> Username
              </span>
            </label>
            <input
              value={form.username}
              onChange={(e) =>
                setForm((p) => ({ ...p, username: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              rows={4}
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>

          <div>
            <label className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
              <span className="inline-flex items-center gap-1.5">
                <Link2 size={12} /> Website
              </span>
            </label>
            <input
              value={form.website}
              onChange={(e) =>
                setForm((p) => ({ ...p, website: e.target.value }))
              }
              placeholder="https://yoursite.com"
              className={inputClass}
            />
          </div>

          <Button type="submit" disabled={saving}>
            <Save size={14} />
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>

        <div className={panelClass('p-6 h-full')}>
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-4 mb-5">
            <Mail size={16} className="text-zinc-500" />
            <h2 className="font-display text-sm font-semibold text-white tracking-tight">
              Account
            </h2>
          </div>
          <label className={labelClass}>Email</label>
          <input
            value={user.email || ''}
            disabled
            className={`${inputClass} opacity-60 cursor-not-allowed`}
          />
          <p className="text-xs text-zinc-600 mt-3 leading-relaxed">
            Email dikelola oleh Supabase Auth dan tidak dapat diubah dari sini.
          </p>
        </div>
      </div>
    </div>
  )
}
