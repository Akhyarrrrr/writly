import Link from 'next/link'

export default function BlogPostNotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-32 pb-24 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-3">
        404
      </p>
      <h1 className="font-display text-2xl font-semibold text-white tracking-tight mb-3">
        Post not found
      </h1>
      <p className="text-zinc-500 text-sm leading-relaxed mb-8">
        The URL may not match the post slug. Open your post from the admin list
        (globe icon) or check the slug in the editor sidebar — it is generated
        from the title (e.g. &quot;first pose&quot; →{' '}
        <code className="text-zinc-400">/blog/first-pose</code>).
      </p>
      <Link
        href="/blog"
        className="inline-flex px-5 py-2.5 bg-zinc-100 text-zinc-950 text-sm font-medium rounded-lg hover:bg-white transition cursor-pointer"
      >
        Back to blog
      </Link>
    </div>
  )
}
