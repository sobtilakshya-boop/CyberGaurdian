"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Home,
  BookOpen,
  ClipboardCheck,
  FolderOpen,
  BarChart3,
  Settings,
  User,
  LogOut,
  Shield,
  Loader
} from 'lucide-react'
import { useState } from 'react'

interface UserSession {
  userId: string
  name: string
  email: string
  phone: string
}

interface SidebarProps {
  user: UserSession
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Learn', href: '/dashboard/learn', icon: BookOpen },
    { name: 'Assessments', href: '/dashboard/assessments', icon: ClipboardCheck },
    { name: 'Resources', href: '/dashboard/resources', icon: FolderOpen },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ]

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
    <aside className="hidden md:flex flex-col w-64 bg-slate-900/50 border-r border-cyan-500/10 backdrop-blur-xl shrink-0 p-5 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-4 mb-8">
        <Shield className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
        <span className="font-mono text-lg font-bold uppercase tracking-wider text-white">
          Cyber<span className="text-cyan-400">Guardian</span>
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center gap-3.5 px-4 py-3 rounded-xl font-mono text-sm font-medium tracking-wide transition-all ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Background Glow Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-cyan-500/5 rounded-xl border border-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.05)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Active Left Cyber Accent Bar */}
              {isActive && (
                <motion.div
                  layoutId="activeNavBorder"
                  className="absolute left-0 top-3 bottom-3 w-[3px] bg-cyan-500 rounded-r"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              <Icon className={`h-4 w-4 shrink-0 relative z-10 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="relative z-10">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-800/60 flex flex-col gap-3">
        <div className="flex flex-col px-2">
          <span className="text-xs font-mono font-semibold text-slate-200 truncate">{user.name}</span>
          <span className="text-[10px] font-mono text-slate-500 truncate">{user.email}</span>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-3.5 px-4 py-3 rounded-xl font-mono text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all cursor-pointer disabled:opacity-60"
        >
          {loggingOut ? (
            <Loader className="h-4 w-4 animate-spin shrink-0" />
          ) : (
            <LogOut className="h-4 w-4 shrink-0" />
          )}
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
