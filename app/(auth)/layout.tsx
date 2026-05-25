import { WritlyLogo } from '@/components/shared/WritlyLogo'
import { AnimatedSection } from '@/components/motion/AnimatedSection'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(39 39 42 / 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(39 39 42 / 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
        aria-hidden
      />
      <div className="w-full max-w-sm relative z-10">
        <AnimatedSection className="text-center mb-8">
          <WritlyLogo size={36} showWordmark href="/" className="justify-center" />
        </AnimatedSection>
        <AnimatedSection delay={0.08}>{children}</AnimatedSection>
      </div>
    </div>
  )
}
