'use client'

import { Stagger, StaggerItem } from '@/components/motion/FadeIn'

const stats = [
  { value: 'Rich', label: 'Tiptap editor' },
  { value: 'SEO', label: 'Ready metadata' },
  { value: 'RLS', label: 'Secure by default' },
  { value: '∞', label: 'Drafts & posts' },
]

export function LandingStats() {
  return (
    <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800/60 rounded-2xl overflow-hidden border border-zinc-800/80">
      {stats.map(({ value, label }) => (
        <StaggerItem key={label}>
          <div className="bg-zinc-950/90 px-6 py-8 text-center group hover:bg-zinc-900/50 transition duration-300">
            <p className="font-display text-2xl sm:text-3xl font-semibold text-white mb-1 tracking-tight group-hover:text-zinc-200 transition">
              {value}
            </p>
            <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{label}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
