'use client'

import { cn } from '@/lib/utils'

/** Decorative border wrapper — wrap with Next.js `<Link>` for navigation. */
export function MovingBorder({
  children,
  className,
  containerClassName,
  borderClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  borderClassName?: string
}) {
  return (
    <span
      className={cn(
        'relative inline-flex overflow-hidden rounded-xl p-[1px]',
        containerClassName
      )}
    >
      <span
        className={cn(
          'absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#09090b_0%,#3b82f6_40%,#09090b_100%)]',
          borderClassName
        )}
        aria-hidden
      />
      <span
        className={cn(
          'relative inline-flex h-full w-full items-center justify-center gap-2 rounded-[11px] bg-zinc-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-900',
          className
        )}
      >
        {children}
      </span>
    </span>
  )
}
