'use client'

import { cn } from '@/lib/utils'

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label?: string
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      {label && <span className="text-sm text-zinc-300">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative w-10 h-5 rounded-full transition duration-200 shrink-0',
          checked ? 'bg-zinc-200' : 'bg-zinc-700'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 w-4 h-4 rounded-full shadow transition duration-200',
            checked
              ? 'left-[22px] bg-zinc-950'
              : 'left-0.5 bg-zinc-400'
          )}
        />
      </button>
    </label>
  )
}
