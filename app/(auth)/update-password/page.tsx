'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { inputClass, labelClass, panelClass } from '@/lib/ui'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    const { error } = await createClient().auth.updateUser({ password })
    setLoading(false)
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated.')
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div className={panelClass('p-6')}>
      <h1 className="font-display text-lg font-semibold text-white">Choose a new password</h1>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <label htmlFor="new-password" className={labelClass}>New password</label>
        <input id="new-password" type="password" minLength={8} required autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Updating...' : 'Update password'}</Button>
      </form>
    </div>
  )
}
