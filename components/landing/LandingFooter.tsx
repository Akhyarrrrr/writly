'use client'

import Link from 'next/link'
import { ScrollReveal } from '@/components/motion/FadeIn'
import { WritlyLogo } from '@/components/shared/WritlyLogo'

const links = [
  { label: 'About', href: '/#about' },
  { label: 'Features', href: '/#features' },
  { label: 'Workflow', href: '/#workflow' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Admin', href: '/login' },
]

export function LandingFooter() {
  return (
    <ScrollReveal>
      <footer className="border-t border-zinc-800/60 py-16 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
            <div>
              <WritlyLogo size={28} showWordmark href="/" />
              <p className="text-sm text-zinc-600 mt-3 max-w-xs leading-relaxed">
                A modern publishing platform for writers who care about craft.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-zinc-500 hover:text-white transition cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
            <p>© {new Date().getFullYear()} Writly · Portfolio project</p>
            <p>Built with Next.js, Supabase & Framer Motion</p>
          </div>
        </div>
      </footer>
    </ScrollReveal>
  )
}
