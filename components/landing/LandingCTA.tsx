'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ScrollReveal, scaleInVariants } from '@/components/motion/FadeIn'
import { MovingBorder } from '@/components/ui/moving-border'

export function LandingCTA() {
  return (
    <ScrollReveal variants={scaleInVariants}>
      <div className="relative rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 to-zinc-950 px-8 py-16 sm:px-16 sm:py-20 text-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgb(63 63 70 / 0.25), transparent)',
          }}
          aria-hidden
        />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 mb-6">
            <Sparkles size={12} />
            Start your publication today
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
            Ready to share your voice?
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto mb-10 leading-relaxed">
            Create an account, write your first draft, and publish to a blog your
            readers will love — all in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link href="/register" className="inline-block rounded-xl cursor-pointer">
              <MovingBorder className="px-8 py-3.5 gap-2 text-base">
                Get started free
                <ArrowRight size={16} />
              </MovingBorder>
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-xl transition duration-200 cursor-pointer"
            >
              Explore the blog
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}
