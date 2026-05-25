'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

export const scrollViewport = { once: true, margin: '-80px' as const }
export const easeOut = [0.22, 1, 0.36, 1] as const

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
}

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
}

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOut },
  },
}

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -32 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
}

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 32 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: easeOut }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export function ScrollReveal({
  children,
  className,
  variants = fadeUpVariants,
  delay = 0,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  variants?: Variants
  delay?: number
  once?: boolean
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-80px' }}
      variants={variants}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  once?: boolean
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: '-60px' }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  variants = fadeUpVariants,
}: {
  children: React.ReactNode
  className?: string
  variants?: Variants
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  )
}

/** Hero-only: animates on mount, not scroll */
export function HeroReveal({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: easeOut }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
