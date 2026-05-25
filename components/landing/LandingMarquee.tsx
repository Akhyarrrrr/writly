'use client'

import { motion, useReducedMotion } from 'framer-motion'

const words = [
  'Essays',
  'Tutorials',
  'Stories',
  'Notes',
  'Reviews',
  'Guides',
  'Ideas',
  'Journals',
  'Essays',
  'Tutorials',
  'Stories',
  'Notes',
]

export function LandingMarquee() {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className="flex flex-wrap justify-center gap-4 py-6 px-4">
        {words.slice(0, 8).map((w) => (
          <span key={w} className="text-sm text-zinc-600 uppercase tracking-widest">
            {w}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden border-y border-zinc-800/60 py-5">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {[...words, ...words].map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="text-sm uppercase tracking-[0.25em] text-zinc-600 font-medium shrink-0"
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
