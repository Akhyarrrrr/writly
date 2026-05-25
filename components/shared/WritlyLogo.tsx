import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function WritlyLogo({
  size = 28,
  showWordmark = false,
  className,
  href = '/',
}: {
  size?: number
  showWordmark?: boolean
  className?: string
  href?: string
}) {
  const inner = (
    <>
      <Image
        src="/logo.png"
        alt="Writly"
        width={size}
        height={size}
        className="rounded-lg shrink-0"
        priority
      />
      {showWordmark && (
        <span className="font-display font-semibold text-white tracking-tight">
          Writly
        </span>
      )}
    </>
  )

  const classes = cn('flex items-center gap-2.5', className)

  if (href) {
    return (
      <Link href={href} className={cn(classes, 'cursor-pointer')}>
        {inner}
      </Link>
    )
  }

  return <div className={classes}>{inner}</div>
}
