'use client'

import { FileEdit, Eye, Rocket, Share2 } from 'lucide-react'
import { Stagger, StaggerItem, slideLeftVariants } from '@/components/motion/FadeIn'

const steps = [
  {
    step: '01',
    icon: FileEdit,
    title: 'Write in the studio',
    desc: 'Draft with headings, code blocks, images, and live character count — all in one focused editor.',
  },
  {
    step: '02',
    icon: Eye,
    title: 'Preview & refine',
    desc: 'Polish excerpts, cover images, and categories before anything goes live.',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Publish instantly',
    desc: 'Flip status to published and your post appears on the public blog with full SEO metadata.',
  },
  {
    step: '04',
    icon: Share2,
    title: 'Share everywhere',
    desc: 'Open Graph tags, clean URLs, and a sitemap so readers and search engines find your work.',
  },
]

export function LandingWorkflow() {
  return (
    <Stagger className="grid md:grid-cols-2 gap-6">
      {steps.map(({ step, icon: Icon, title, desc }) => (
        <StaggerItem key={step} variants={slideLeftVariants}>
          <div className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-8 hover:border-zinc-700 hover:bg-zinc-900/40 transition duration-300 h-full">
            <div className="flex items-start gap-5">
              <div className="shrink-0 w-12 h-12 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-center group-hover:border-zinc-600 transition">
                <Icon size={20} className="text-zinc-400" strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-medium">
                  Step {step}
                </span>
                <h3 className="font-display font-medium text-white text-lg mt-1 mb-2 tracking-tight">
                  {title}
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
