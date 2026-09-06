'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
  BookOpen,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { getDisplayName } from '@/lib/display-name'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import { WritlyLogo } from '@/components/shared/WritlyLogo'
import { AnimatedSection } from '@/components/motion/AnimatedSection'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  {
    href: '/admin/posts',
    label: 'All Posts',
    icon: FileText,
    postsList: true,
  },
  {
    href: '/admin/posts/new',
    label: 'New Post',
    icon: PlusCircle,
    exact: true,
  },
  { href: '/admin/settings', label: 'Settings', icon: Settings, exact: true },
]

interface Props {
  children: React.ReactNode
  profile: Profile | null
  user: User
}

interface SidebarProps {
  pathname: string
  displayName: string
  email?: string
  onNavigate: () => void
  onLogout: () => void
}

function isActive(pathname: string, href: string, opts?: { exact?: boolean; postsList?: boolean }) {
  if (opts?.exact) return pathname === href
  if (opts?.postsList) {
    return pathname === '/admin/posts' || /^\/admin\/posts\/[^/]+\/edit$/.test(pathname)
  }
  return pathname === href
}

function Sidebar({ pathname, displayName, email, onNavigate, onLogout }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <WritlyLogo
        size={28}
        showWordmark
        href="/admin"
        className="px-4 h-14 border-b border-zinc-800/80 shrink-0"
      />

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon, exact, postsList }) => {
          const active = isActive(pathname, href, { exact, postsList })
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition duration-200 cursor-pointer ${
                active
                  ? 'bg-zinc-800 text-white font-medium'
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.25 : 1.75} />
              {label}
            </Link>
          )
        })}
        <Link
          href="/blog"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 transition mt-3 cursor-pointer"
        >
          <BookOpen size={16} />
          View blog
          <span className="text-zinc-600 text-xs ml-auto">↗</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-200 font-display font-semibold text-sm shrink-0 ring-1 ring-zinc-700">
            {displayName[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-zinc-500 truncate">{email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition cursor-pointer"
        >
          <span>Sign out</span>
          <LogOut size={14} className="shrink-0" />
        </button>
      </div>
    </div>
  )
}

export default function AdminShell({ children, profile, user }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const displayName = getDisplayName(profile, user)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <div className="hidden md:flex flex-col w-60 border-r border-zinc-800/80 bg-zinc-950 shrink-0 fixed h-full">
        <Sidebar pathname={pathname} displayName={displayName} email={user.email} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            role="presentation"
          />
          <div className="relative w-60 bg-zinc-950 border-r border-zinc-800">
            <Sidebar pathname={pathname} displayName={displayName} email={user.email} onNavigate={() => setSidebarOpen(false)} onLogout={handleLogout} />
          </div>
        </div>
      )}

      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <div className="md:hidden flex items-center gap-3 px-4 h-14 border-b border-zinc-800/80 bg-zinc-950 sticky top-0 z-10">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition cursor-pointer"
          >
            <Menu size={18} />
          </button>
          <WritlyLogo size={24} href="/admin" />
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          <AnimatedSection>{children}</AnimatedSection>
        </main>
      </div>
    </div>
  )
}
