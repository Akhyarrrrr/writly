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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      const {
        data: { user: newUser },
      } = await supabase.auth.getUser()
      if (newUser && fullName.trim()) {
        await supabase
          .from('profiles')
          .update({ full_name: fullName.trim() })
          .eq('id', newUser.id)
      }
      toast.success('Account created! Welcome to Writly.')
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className={panelClass('p-6')}>
      <h1 className="font-display text-lg font-semibold text-white mb-1 tracking-tight">
        Create account
      </h1>
      <p className="text-sm text-zinc-500 mb-6">Start publishing on Writly</p>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
            Full name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className={`${labelClass} normal-case tracking-normal text-zinc-400`}>
            Password
          </label>
          <input
            type="password"
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
