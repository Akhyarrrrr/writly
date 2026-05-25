import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ensureProfile } from '@/lib/ensure-profile'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await ensureProfile(supabase, user)

  return (
    <div className="w-full">
      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-1">
        Account
      </p>
      <h1 className="font-display text-2xl font-semibold text-white tracking-tight mb-2">
        Settings
      </h1>
      <p className="text-zinc-500 text-sm mb-8">
        How readers see you on the public blog.
      </p>
      <SettingsClient profile={profile} userId={user.id} user={user} />
    </div>
  )
}
