import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Spotlight } from '@/components/ui/spotlight'
import { FlipWords } from '@/components/ui/flip-words'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import { MovingBorder } from '@/components/ui/moving-border'
import PostGrid from '@/components/blog/PostGrid'
import { FloatingNavbar } from '@/components/shared/FloatingNavbar'
import { WritlyLogo } from '@/components/shared/WritlyLogo'
import { LandingAbout } from '@/components/motion/LandingAbout'
import { AnimatedSection } from '@/components/motion/AnimatedSection'
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

  const { attachProfiles } = await import('@/lib/posts')
  const featuredPosts = rawFeatured
    ? await attachProfiles(supabase, rawFeatured)
    : []

  return (
    <div className="min-h-screen bg-zinc-950 relative">
      {/* Fine grid — editorial, not “AI glow” */}
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

      <section className="relative pt-36 pb-28 px-4 min-h-[88vh] flex items-center z-10">
        <Spotlight
          className="-top-40 left-1/2 -translate-x-1/2 md:left-[40%]"
          fill="#fafafa"
        />
        <div className="max-w-4xl mx-auto text-center w-full">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-8 font-medium">
            Publishing platform
          </p>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.25rem] font-semibold text-white tracking-tight leading-[1.08] pb-5">
            Write. Publish.
            <br />
            <FlipWords
              words={['Share your story.', 'Reach your readers.', 'Own your words.']}
              className="text-5xl sm:text-6xl lg:text-[4.25rem] font-semibold text-zinc-400"
            />
          </h1>

          <TextGenerateEffect
            words="A focused writing studio with a public blog, rich editor, and full control over every draft you ship."
            className="text-lg text-zinc-400 max-w-xl mx-auto mb-12"
          />

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
        </div>
      </section>

      <section
        id="about"
        className="py-24 px-4 border-t border-zinc-800/60 relative z-10"
      >
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 text-center mb-3">
            Capabilities
          </p>
          <h2 className="font-display text-3xl font-semibold text-white text-center mb-14 tracking-tight">
            Built for serious writing
          </h2>
          <LandingAbout />
        </div>
      </section>

      {featuredPosts && featuredPosts.length > 0 && (
        <AnimatedSection>
        <section className="py-24 px-4 border-t border-zinc-800/60 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-2">
                  From the blog
                </p>
                <h2 className="font-display text-2xl font-semibold text-white tracking-tight">
                  Featured
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <PostGrid posts={featuredPosts} />
          </div>
        </section>
        </AnimatedSection>
      )}

      <footer className="border-t border-zinc-800/60 py-12 px-4 relative z-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-600">
          <WritlyLogo size={24} showWordmark href="/" />
          <p>© {new Date().getFullYear()} · Portfolio project</p>
        </div>
      </footer>
    </div>
  )
}
