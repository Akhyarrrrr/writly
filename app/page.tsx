import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Spotlight } from '@/components/ui/spotlight'
import { LandingPostGrid } from '@/components/landing/LandingPostGrid'
import { FloatingNavbar } from '@/components/shared/FloatingNavbar'
import { LandingAbout } from '@/components/motion/LandingAbout'
import { AnimatedSection } from '@/components/motion/AnimatedSection'
import { LandingHero } from '@/components/landing/LandingHero'
import { LandingStats } from '@/components/landing/LandingStats'
import { LandingWorkflow } from '@/components/landing/LandingWorkflow'
import { LandingFeatures } from '@/components/landing/LandingFeatures'
import { LandingEditorShowcase } from '@/components/landing/LandingEditorShowcase'
import { LandingMarquee } from '@/components/landing/LandingMarquee'
import { LandingFAQ } from '@/components/landing/LandingFAQ'
import { LandingCTA } from '@/components/landing/LandingCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { SectionHeader } from '@/components/landing/SectionHeader'
import { NAV_LINKS } from '@/lib/constants'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: rawFeatured } = await supabase
    .from('posts')
    .select(
      'id, title, slug, excerpt, cover_image_url, published_at, read_time, view_count, created_at, author_id, categories(name, slug, color)'
    )
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(3)

  const { data: rawLatest } = await supabase
    .from('posts')
    .select(
      'id, title, slug, excerpt, cover_image_url, published_at, read_time, view_count, created_at, author_id, categories(name, slug, color)'
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  const { attachProfiles } = await import('@/lib/posts')
  const featuredPosts = rawFeatured
    ? await attachProfiles(supabase, rawFeatured)
    : []
  const latestPosts = rawLatest ? await attachProfiles(supabase, rawLatest) : []

  const showLatest =
    latestPosts.length > 0 &&
    (featuredPosts.length === 0 ||
      latestPosts.some((p) => !featuredPosts.find((f) => f.id === p.id)))

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(39 39 42 / 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(39 39 42 / 0.35) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)',
        }}
        aria-hidden
      />

      <FloatingNavbar items={NAV_LINKS} isLoggedIn={!!user} />

      {/* Hero */}
      <section className="relative pt-36 pb-20 px-4 min-h-[88vh] flex items-center z-10">
        <Spotlight
          className="-top-40 left-1/2 -translate-x-1/2 md:left-[40%]"
          fill="#fafafa"
        />
        <LandingHero />
      </section>

      <LandingMarquee />

      {/* Stats */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <LandingStats />
        </div>
      </section>

      {/* About / Capabilities */}
      <section
        id="about"
        className="py-24 px-4 border-t border-zinc-800/60 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Capabilities"
            title="Built for serious writing"
            description="Everything you need to draft, polish, and ship — without switching tools."
          />
          <LandingAbout />
        </div>
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        className="py-24 px-4 border-t border-zinc-800/60 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="How it works"
            title="From blank page to published post"
            description="A clear path from first keystroke to readers on your blog."
          />
          <LandingWorkflow />
        </div>
      </section>

      {/* Editor showcase */}
      <section className="py-24 px-4 border-t border-zinc-800/60 relative z-10">
        <div className="max-w-5xl mx-auto">
          <LandingEditorShowcase />
        </div>
      </section>

      {/* Features bento */}
      <section
        id="features"
        className="py-24 px-4 border-t border-zinc-800/60 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="Features"
            title="Everything in one platform"
            description="Editor, blog, admin dashboard, and security — no patchwork of plugins."
          />
          <LandingFeatures />
        </div>
      </section>

      {/* Featured posts */}
      {featuredPosts && featuredPosts.length > 0 && (
        <AnimatedSection>
          <section
            id="featured"
            className="py-24 px-4 border-t border-zinc-800/60 relative z-10"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-2">
                    From the blog
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                    Featured stories
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>
              <LandingPostGrid posts={featuredPosts} />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Latest posts */}
      {showLatest && (
        <AnimatedSection delay={0.05}>
          <section className="py-24 px-4 border-t border-zinc-800/60 relative z-10">
            <div className="max-w-6xl mx-auto">
              <SectionHeader
                eyebrow="Fresh reads"
                title="Latest from the blog"
                description="Recently published — dive in and see what writers are sharing."
                align="left"
                className="mb-10"
              />
              <LandingPostGrid posts={latestPosts} />
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* FAQ */}
      <section
        id="faq"
        className="py-24 px-4 border-t border-zinc-800/60 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            eyebrow="FAQ"
            title="Common questions"
            description="Quick answers before you start writing."
          />
          <LandingFAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 border-t border-zinc-800/60 relative z-10">
        <div className="max-w-3xl mx-auto">
          <LandingCTA />
        </div>
      </section>

      <LandingFooter />
    </div>
  )
}
