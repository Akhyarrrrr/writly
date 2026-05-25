'use client'

import {
  PenLine,
  Globe,
  Shield,
  Search,
  Image,
  BarChart3,
  Tags,
  Zap,
} from 'lucide-react'
import { Stagger, StaggerItem, scaleInVariants } from '@/components/motion/FadeIn'

const features = [
  {
    icon: PenLine,
    title: 'Rich editor',
    desc: 'Headings, lists, blockquotes, code, and inline images without plugins.',
    span: 'md:col-span-2',
  },
  {
    icon: Globe,
    title: 'Public blog',
    desc: 'Beautiful post pages with typography tuned for long reads.',
    span: '',
  },
  {
    icon: Shield,
    title: 'Secure auth',
    desc: 'Supabase authentication with row-level security on every table.',
    span: '',
  },
  {
    icon: Search,
    title: 'SEO built-in',
    desc: 'Meta titles, descriptions, Open Graph, and automatic sitemap generation.',
    span: '',
  },
  {
    icon: Image,
    title: 'Cover images',
    desc: 'Upload hero images that appear on cards and social previews.',
    span: '',
  },
  {
    icon: BarChart3,
    title: 'View tracking',
    desc: 'See how many readers opened each published article.',
    span: '',
  },
  {
    icon: Tags,
    title: 'Categories',
    desc: 'Color-coded taxonomy to organize and filter your writing.',
    span: '',
  },
  {
    icon: Zap,
    title: 'Fast & modern',
    desc: 'Next.js App Router with server components for snappy page loads.',
    span: 'md:col-span-2',
  },
]

export function LandingFeatures() {
  return (
    <Stagger className="grid md:grid-cols-3 gap-4" stagger={0.07}>
      {features.map(({ icon: Icon, title, desc, span }) => (
        <StaggerItem key={title} variants={scaleInVariants} className={span}>
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950 p-7 hover:border-zinc-700 hover:bg-zinc-900/30 transition duration-300 h-full group">
            <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center mb-5 group-hover:border-zinc-600 transition">
              <Icon size={18} className="text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="font-display font-medium text-white mb-2 tracking-tight">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
