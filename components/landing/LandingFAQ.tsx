'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ScrollReveal } from '@/components/motion/FadeIn'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Is Writly free to use?',
    a: 'Writly is a portfolio project you can fork and deploy. Host it on Vercel with your own Supabase project at no extra platform cost beyond those services.',
  },
  {
    q: 'Do I need coding experience?',
    a: 'Readers only need a browser. Authors use the admin dashboard — write in the rich editor, set a cover image, and hit publish.',
  },
  {
    q: 'Can I customize the design?',
    a: 'Yes. The stack is Next.js, Tailwind CSS, and Framer Motion. Every component lives in the repo and is straightforward to extend.',
  },
  {
    q: 'How is my content stored?',
    a: 'Posts, profiles, and categories live in Supabase PostgreSQL with row-level security. Only authenticated admins can create or edit content.',
  },
]

export function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const reduce = useReducedMotion()

  return (
    <ScrollReveal className="max-w-2xl mx-auto space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        return (
          <motion.div
            key={faq.q}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="rounded-xl border border-zinc-800/80 bg-zinc-950 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-zinc-900/30 transition"
            >
              <span className="font-display font-medium text-white text-sm sm:text-base">
                {faq.q}
              </span>
              <ChevronDown
                size={18}
                className={cn(
                  'text-zinc-500 shrink-0 transition duration-300',
                  isOpen && 'rotate-180'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </ScrollReveal>
  )
}
