import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { FloatingNavbar } from './FloatingNavbar'
import { NAV_LINKS } from '@/lib/constants'

export default async function PublicNavbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <FloatingNavbar items={NAV_LINKS} isLoggedIn={!!user} />
}
