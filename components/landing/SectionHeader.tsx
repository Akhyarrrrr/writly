'use client'

import { ScrollReveal } from '@/components/motion/FadeIn'
import { cn } from '@/lib/utils'

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <ScrollReveal className={cn('mb-14', align === 'center' && 'text-center', className)}>
      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-3 font-medium">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-zinc-400 text-base leading-relaxed max-w-2xl',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </ScrollReveal>
  )
}
