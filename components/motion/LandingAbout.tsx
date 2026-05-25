'use client'

import { PenLine, Globe, Shield } from 'lucide-react'
import { Stagger, StaggerItem } from './FadeIn'

const items = [
  {
    icon: PenLine,
    title: 'Rich editor',
    desc: 'Headings, code, images, and links — without leaving the page.',
  },
  {
    icon: Globe,
    title: 'Public blog',
    desc: 'SEO metadata, Open Graph, and a sitemap for every published post.',
  },
  {
    icon: Shield,
    title: 'Your data',
    desc: 'Supabase auth and row-level security. You own the content.',
  },
]

export function LandingAbout() {
  return (
    <Stagger className="grid md:grid-cols-3 gap-px bg-zinc-800/80 rounded-2xl overflow-hidden border border-zinc-800/80">
      {items.map(({ icon: Icon, title, desc }) => (
        <StaggerItem key={title}>
          <div className="bg-zinc-950 p-8 hover:bg-zinc-900/40 transition duration-300 h-full">
            <Icon size={20} className="text-zinc-400 mb-4" strokeWidth={1.5} />
            <h3 className="font-display font-medium text-white mb-2 tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
