'use client'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto max-w-xl px-4 py-32 text-center"><h1 className="text-3xl font-semibold text-white">This page could not load</h1><p className="mt-3 text-zinc-400">Your work has not been deleted. Check the connection and try again.</p><button type="button" onClick={reset} className="mt-6 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950">Try again</button></main>
}
