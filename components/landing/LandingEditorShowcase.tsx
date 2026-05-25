'use client'

import { ScrollReveal, slideRightVariants, slideLeftVariants } from '@/components/motion/FadeIn'
import { motion, useReducedMotion } from 'framer-motion'

const lines = [
  { type: 'h1', text: 'The art of slow publishing' },
  { type: 'p', text: 'Great writing deserves a calm surface — no clutter, no distractions.' },
  { type: 'h2', text: 'Why focus matters' },
  { type: 'p', text: 'Every toolbar action stays within reach. Every draft autosaves to Supabase.' },
  { type: 'code', text: 'const publish = await post.save({ status: "published" })' },
]

export function LandingEditorShowcase() {
  const reduce = useReducedMotion()

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <ScrollReveal variants={slideLeftVariants}>
        <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-3 font-medium">
          Writing studio
        </p>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-5">
          A editor that stays out of your way
        </h2>
        <p className="text-zinc-400 leading-relaxed mb-8">
          Tiptap powers a distraction-free canvas. Format text, drop in code blocks,
          embed images, and track word count — then publish with one click from the
          admin dashboard.
        </p>
        <ul className="space-y-3">
          {['Markdown-friendly shortcuts', 'Syntax-highlighted code', 'Character & word count', 'Draft → Published workflow'].map(
            (item, i) => (
              <motion.li
                key={item}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                className="flex items-center gap-3 text-sm text-zinc-400"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                {item}
              </motion.li>
            )
          )}
        </ul>
      </ScrollReveal>

      <ScrollReveal variants={slideRightVariants}>
        <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 overflow-hidden shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800/80 bg-zinc-950/80">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="ml-3 text-[10px] text-zinc-600 font-mono">draft — writly</span>
          </div>
          <div className="p-6 sm:p-8 font-mono text-sm space-y-4 min-h-[280px]">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              >
                {line.type === 'h1' && (
                  <p className="text-xl font-display font-semibold text-white not-italic">
                    {line.text}
                  </p>
                )}
                {line.type === 'h2' && (
                  <p className="text-base font-display font-medium text-zinc-300 not-italic mt-4">
                    {line.text}
                  </p>
                )}
                {line.type === 'p' && (
                  <p className="text-zinc-500 leading-relaxed not-italic font-sans text-sm">
                    {line.text}
                  </p>
                )}
                {line.type === 'code' && (
                  <pre className="mt-4 p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-blue-400/90 text-xs overflow-x-auto">
                    {line.text}
                  </pre>
                )}
              </motion.div>
            ))}
            <motion.span
              animate={reduce ? {} : { opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block w-2 h-4 bg-zinc-400 ml-0.5 align-middle"
            />
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
