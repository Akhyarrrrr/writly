export const SITE_NAME = 'Writly'
export const SITE_TAGLINE = 'Tulis. Terbitkan. Bagikan ceritamu.'
export const SITE_DESCRIPTION =
  'Writly adalah platform blog modern untuk menulis, menerbitkan, dan berbagi artikel — editor kaya teks, blog publik SEO-ready, dan dashboard admin yang rapi.'
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://writly.vercel.app'

export const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Features', href: '/#features' },
  { label: 'Blog', href: '/blog' },
]

export const PRIORITY_COLORS = {
  draft: {
    label: 'Draft',
    bg: 'bg-zinc-800',
    text: 'text-zinc-500',
    border: 'border-zinc-700',
  },
  published: {
    label: 'Published',
    bg: 'bg-zinc-800',
    text: 'text-zinc-300',
    border: 'border-zinc-600',
  },
}
