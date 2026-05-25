'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { WritlyLogo } from './WritlyLogo'

interface NavItem {
  label: string
  href: string
}

export function FloatingNavbar({
  items,
  isLoggedIn,
}: {
  items: NavItem[]
  isLoggedIn?: boolean
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setVisible(y < lastScrollY || y < 80)
      setLastScrollY(y)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <motion.nav
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={
        mounted
          ? { y: visible ? 0 : -96, opacity: visible ? 1 : 0 }
          : { y: 0, opacity: 1 }
      }
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-0.5 px-1.5 py-1.5 rounded-full',
        'border border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md shadow-lg shadow-black/20'
      )}
    >
      <WritlyLogo size={28} href="/" className="pl-2 pr-1" />
      {items.map((item, i) => {
        const active =
          item.href === '/'
            ? pathname === '/'
            : item.href.startsWith('/#')
              ? pathname === '/'
              : pathname.startsWith(item.href)
        return (
          <motion.div
            key={item.href}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.04, duration: 0.35 }}
          >
            <Link
              href={item.href}
              className={cn(
                'text-sm px-4 py-1.5 rounded-full transition duration-200 cursor-pointer',
                active
                  ? 'text-white bg-zinc-800'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              )}
            >
              {item.label}
            </Link>
          </motion.div>
        )
      })}
      {isLoggedIn ? (
        <Link
          href="/admin"
          className="text-sm px-4 py-1.5 ml-0.5 text-zinc-300 hover:text-white rounded-full border border-zinc-700 hover:border-zinc-600 transition duration-200 cursor-pointer"
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href="/login"
          className="text-sm px-4 py-1.5 ml-0.5 bg-zinc-100 text-zinc-950 rounded-full font-medium hover:bg-white transition duration-200 cursor-pointer"
        >
          Sign in
        </Link>
      )}
    </motion.nav>
  )
}
