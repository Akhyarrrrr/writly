import { cn } from '@/lib/utils'

export const inputClass =
  'w-full px-3.5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 text-sm outline-none transition duration-200 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50 focus:ring-offset-0'

export const selectClass =
  'w-full px-3.5 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-lg text-zinc-100 text-sm outline-none transition duration-200 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-700/50 appearance-none cursor-pointer [color-scheme:dark]'

export const labelClass = 'block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wide'

export const cardClass =
  'bg-zinc-900/40 border border-zinc-800/80 rounded-xl backdrop-blur-sm'

export function panelClass(className?: string) {
  return cn(cardClass, 'p-5', className)
}
