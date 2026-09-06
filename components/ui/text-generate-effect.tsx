'use client'

import { useEffect } from 'react'
import { motion, stagger, useAnimate } from 'framer-motion'
import { cn } from '@/lib/utils'

export function TextGenerateEffect({
  words,
  className,
}: {
  words: string
  className?: string
}) {
  const [scope, animate] = useAnimate()
  const wordArray = words.split(' ')

  useEffect(() => {
    animate(
      'span',
      { opacity: 1, filter: 'blur(0px)' },
      { duration: 0.4, delay: stagger(0.06) }
    )
  }, [animate])

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
