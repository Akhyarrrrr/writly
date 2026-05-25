'use client'

import { useEffect, useState } from 'react'
import { motion, stagger, useAnimate } from 'framer-motion'
import { cn } from '@/lib/utils'

export function TextGenerateEffect({
  words,
  className,
}: {
  words: string
  className?: string
}) {
  const [mounted, setMounted] = useState(false)
  const [scope, animate] = useAnimate()
  const wordArray = words.split(' ')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    animate(
      'span',
      { opacity: 1, filter: 'blur(0px)' },
      { duration: 0.4, delay: stagger(0.06) }
    )
  }, [mounted, animate])

  if (!mounted) {
    return (
      <p className={cn('font-normal leading-relaxed', className)}>{words}</p>
    )
  }

  return (
    <motion.p ref={scope} className={cn('font-normal leading-relaxed', className)}>
      {wordArray.map((word, idx) => (
        <motion.span
          key={`${word}-${idx}`}
          className="opacity-0 inline"
          style={{ filter: 'blur(8px)' }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </motion.p>
  )
}
