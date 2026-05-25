import Link from 'next/link'
import { WritlyLogo } from './WritlyLogo'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 py-10 px-4 mt-auto">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <WritlyLogo size={22} showWordmark href="/" />
        <div className="flex items-center gap-6 text-xs text-zinc-600">
          <Link href="/#about" className="hover:text-zinc-400 transition cursor-pointer">
            About
          </Link>
          <Link href="/blog" className="hover:text-zinc-400 transition cursor-pointer">
            Blog
          </Link>
          <Link href="/login" className="hover:text-zinc-400 transition cursor-pointer">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
