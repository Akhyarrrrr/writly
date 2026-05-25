import { cn } from '@/lib/utils'

export function Badge({
  children,
  className,
  color,
}: {
  children: React.ReactNode
  className?: string
  color?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-md',
        className
      )}
      style={
        color
          ? {
              backgroundColor: `${color}18`,
              color,
              border: `1px solid ${color}30`,
            }
          : undefined
      }
    >
      {children}
    </span>
  )
}
