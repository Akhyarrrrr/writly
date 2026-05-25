'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HeroReveal } from '@/components/motion/FadeIn'
import { FlipWords } from '@/components/ui/flip-words'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { MovingBorder } from '@/components/ui/moving-border'

export function LandingHero() {
  return (
    <div className="max-w-4xl mx-auto text-center w-full">
      <HeroReveal delay={0}>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-8 font-medium">
          Publishing platform
        </p>
      </HeroReveal>

      <HeroReveal delay={0.08}>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.25rem] font-semibold text-white tracking-tight leading-[1.08] pb-5">
          Write. Publish.
          <br />
          <FlipWords
            words={['Share your story.', 'Reach your readers.', 'Own your words.']}
            className="text-5xl sm:text-6xl lg:text-[4.25rem] font-semibold text-zinc-400 pb-5"
          />
        </h1>
      </HeroReveal>

      <HeroReveal delay={0.16}>
        <TextGenerateEffect
          words="A focused writing studio with a public blog, rich editor, and full control over every draft you ship."
          className="text-lg text-zinc-400 max-w-xl mx-auto mb-12"
        />
      </HeroReveal>

      <HeroReveal delay={0.24}>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link href="/register" className="inline-block rounded-xl cursor-pointer">
            <MovingBorder className="px-7 py-3 gap-2">
              Start writing
              <ArrowRight size={16} />
            </MovingBorder>
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-7 py-3 text-sm text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-xl transition duration-200 cursor-pointer"
          >
            Read the blog
          </Link>
        </div>
      </HeroReveal>
    </div>
  )
}
