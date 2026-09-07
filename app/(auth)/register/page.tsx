'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { inputClass, labelClass, panelClass } from '@/lib/ui'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationEmail, setConfirmationEmail] = useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/admin`,
      },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      if (!data.session) {
        setConfirmationEmail(email)
        toast.success('Check your email to confirm your account.')
      } else {
        toast.success('Account created! Welcome to Writly.')
        router.push('/admin')
        router.refresh()
      }
    }
  }

  async function resendConfirmation() {
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: confirmationEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/admin` },
    })
    if (error) toast.error(error.message)
    else toast.success('Confirmation email sent again.')
  }

  if (confirmationEmail) {
    return (
      <div className={panelClass('p-6')} role="status">
        <h1 className="font-display text-lg font-semibold text-white">Check your email</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          We sent a confirmation link to <strong className="text-zinc-200">{confirmationEmail}</strong>.
        </p>
        <Button type="button" variant="secondary" className="mt-5 w-full" onClick={resendConfirmation}>
          Resend confirmation
        </Button>
      </div>
    )
  }

  return (
    <div className={panelClass('p-6')}>
      <h1 className="font-display text-lg font-semibold text-white mb-1 tracking-tight">
        Create account
      </h1>
      <p className="text-sm text-zinc-500 mb-6">Start publishing on Writly</p>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label htmlFor="register-name" className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
            Full name
          </label>
          <input
            type="text"
            id="register-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="register-email" className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
            Email
          </label>
          <input
            type="email"
            id="register-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="register-password" className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
            Password
          </label>
          <input
            type="password"
            id="register-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Min. 6 characters"
            className={inputClass}
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
      <p className="text-center text-sm text-zinc-500 mt-4">
        Already have one?{' '}
        <Link
          href="/login"
          className="text-zinc-300 hover:text-white font-medium cursor-pointer"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
