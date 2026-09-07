'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { inputClass, labelClass, panelClass } from '@/lib/ui'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Welcome back!')
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className={panelClass('p-6')}>
      <h1 className="font-display text-lg font-semibold text-white mb-1 tracking-tight">
        Sign in
      </h1>
      <p className="text-sm text-zinc-500 mb-6">Continue to your dashboard</p>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="login-email" className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
            Email
          </label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="login-password" className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
            Password
          </label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className={inputClass}
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link href="/forgot-password" className="text-zinc-400 hover:text-white">Forgot password?</Link>
      </p>
      <p className="text-center text-sm text-zinc-500 mt-4">
        No account?{' '}
        <Link
          href="/register"
          className="text-zinc-300 hover:text-white font-medium cursor-pointer"
        >
          Register
        </Link>
      </p>
    </div>
  )
}
