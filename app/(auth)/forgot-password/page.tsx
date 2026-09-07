'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { inputClass, labelClass, panelClass } from '@/lib/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    setLoading(false)
    if (error) toast.error(error.message)
    else setSent(true)
  }

  return (
    <div className={panelClass('p-6')}>
      <h1 className="font-display text-lg font-semibold text-white">Reset password</h1>
      {sent ? (
        <p className="mt-3 text-sm leading-6 text-zinc-400" role="status">Check your email for the secure reset link.</p>
      ) : (
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label htmlFor="reset-email" className={labelClass}>Email</label>
          <input id="reset-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Sending...' : 'Send reset link'}</Button>
        </form>
      )}
      <Link href="/login" className="mt-5 inline-block text-sm text-zinc-400 hover:text-white">Back to sign in</Link>
    </div>
  )
}
