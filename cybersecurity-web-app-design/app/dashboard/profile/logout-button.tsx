"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader } from 'lucide-react'

export default function ProfileLogoutButton() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loggingOut}
      className="mt-4 flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/15 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-mono text-xs font-bold transition-all cursor-pointer disabled:opacity-60 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
    >
      {loggingOut ? (
        <Loader className="h-4 w-4 animate-spin shrink-0" />
      ) : (
        <LogOut className="h-4 w-4 shrink-0" />
      )}
      <span>TERMINATE ACTIVE SESSION (LOGOUT)</span>
    </button>
  )
}
