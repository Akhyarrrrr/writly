import PublicNavbar from '@/components/shared/PublicNavbar'
import Footer from '@/components/shared/Footer'
import { AnimatedSection } from '@/components/motion/AnimatedSection'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      <PublicNavbar />
      <main className="flex-1">
        <AnimatedSection>{children}</AnimatedSection>
      </main>
      <Footer />
    </div>
  )
}
