import Link from 'next/link'

export default function AuthorNotFound() {
  return <main className="mx-auto max-w-xl px-4 py-32 text-center"><h1 className="text-3xl font-semibold text-white">Author not found</h1><p className="mt-3 text-zinc-500">This profile may have moved or is not public.</p><Link href="/blog" className="mt-6 inline-block text-zinc-300 underline">Browse articles</Link></main>
}
