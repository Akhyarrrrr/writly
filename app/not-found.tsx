import Link from 'next/link'

export default function NotFound() {
  return <main className="mx-auto max-w-xl px-4 py-32 text-center"><h1 className="text-3xl font-semibold text-white">Page not found</h1><p className="mt-3 text-zinc-500">The page may have moved or is no longer available.</p><Link href="/" className="mt-6 inline-block text-zinc-300 underline">Go home</Link></main>
}
