'use client'

import { FadeIn, Stagger, StaggerItem } from './FadeIn'

/** Wraps a page section with scroll-triggered fade-up */
export function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <FadeIn className={className} delay={delay} y={28}>
      {children}
    </FadeIn>
  )
}

export function AnimatedGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <Stagger className={className}>
      {children}
    </Stagger>
  )
}

export { StaggerItem }
