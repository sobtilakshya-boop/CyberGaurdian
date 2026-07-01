"use client"

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Bell, User, LogOut, Loader, Search, Shield,
  Home, BookOpen, GraduationCap, Settings, ChevronRight
} from 'lucide-react'
import XpBadge from '@/components/dashboard/xp-badge'

interface UserSession {
  userId: string; name: string; email: string; phone: string
}

interface TopbarProps { user: UserSession }

const breadcrumbMap: Record<string, string[]> = {
  '/dashboard': ['Dashboard'],
  '/dashboard/course': ['Dashboard', 'My Learning'],
  '/dashboard/profile': ['Dashboard', 'Profile'],
  '/dashboard/settings': ['Dashboard', 'Settings'],
}

function getBreadcrumb(pathname: string): string[] {
  if (breadcrumbMap[pathname]) return breadcrumbMap[pathname]
  if (pathname.startsWith('/dashboard/course/')) return ['Dashboard', 'My Learning', 'Chapter']
  if (pathname.startsWith('/dashboard/learn/')) return ['Dashboard', 'My Learning', 'Chapter']
  return ['Dashboard']
}

export default function Topbar({ user }: TopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const breadcrumbs = getBreadcrumb(pathname)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) { router.push('/login'); router.refresh() }
    } catch (err) { console.error('Logout failed:', err) }
    finally { setLoggingOut(false); setMobileMenuOpen(false) }
  }

  const mobileNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Learning', href: '/dashboard/course', icon: GraduationCap },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <>
      <header
        className="flex w-full items-center justify-between px-6 py-3 z-20 sticky top-0"
        style={{
          background: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--db-border)',
          boxShadow: 'var(--db-shadow-sm)',
        }}
      >
        {/* Left: Mobile toggle + Breadcrumbs */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-xl transition-all cursor-pointer"
            style={{ color: 'var(--db-text-secondary)' }}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb path */}
          <nav className="hidden sm:flex items-center gap-1.5 text-sm font-medium">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5" style={{ color: 'var(--db-text-muted)' }} />}
                <span style={{ color: i === breadcrumbs.length - 1 ? 'var(--db-text-primary)' : 'var(--db-text-muted)' }}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>

          {/* Mobile brand */}
          <div className="flex items-center gap-2 md:hidden">
            <Shield className="h-5 w-5" style={{ color: 'var(--db-accent)' }} />
            <span className="font-bold text-sm" style={{ color: 'var(--db-text-primary)' }}>CyberGuardian</span>
          </div>
        </div>

        {/* Right: XP badge, notifications, profile */}
        <div className="flex items-center gap-3">
          <XpBadge />

          {/* Notifications */}
          <button
            className="relative p-2 rounded-xl transition-all cursor-pointer"
            style={{ background: 'var(--db-surface-2)', border: '1px solid var(--db-border)', color: 'var(--db-text-secondary)' }}
            aria-label="Notifications"
          >
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
            <Bell className="h-4 w-4" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 pl-3 cursor-pointer transition-all"
              style={{ borderLeft: '1px solid var(--db-border)' }}
            >
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-semibold" style={{ color: 'var(--db-text-primary)' }}>{user.name}</span>
                <span className="text-[9px] font-mono" style={{ color: 'var(--db-accent)' }}>Security Level 1</span>
              </div>
              <div
                className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold font-mono text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--db-accent), #8B5CF6)' }}
              >
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            </button>

            <AnimatePresence>
              {profileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 z-50 w-52 rounded-2xl p-2 flex flex-col gap-1 text-sm"
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--db-border)',
                      boxShadow: 'var(--db-shadow-lg)',
                    }}
                  >
                    <div className="px-3 py-2 mb-1" style={{ borderBottom: '1px solid var(--db-border)' }}>
                      <p className="font-semibold text-xs" style={{ color: 'var(--db-text-primary)' }}>{user.name}</p>
                      <p className="text-[10px] font-mono" style={{ color: 'var(--db-text-muted)' }}>{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
                      style={{ color: 'var(--db-text-secondary)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--db-accent-light)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={() => { setProfileMenuOpen(false); handleLogout() }}
                      disabled={loggingOut}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all text-left w-full cursor-pointer disabled:opacity-60"
                      style={{ color: 'var(--db-red)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {loggingOut ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <LogOut className="h-3.5 w-3.5" />}
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 md:hidden"
              style={{ background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col p-6 gap-6 md:hidden"
              style={{
                background: 'rgba(255,255,255,0.97)',
                borderRight: '1px solid var(--db-border)',
                boxShadow: 'var(--db-shadow-lg)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" style={{ color: 'var(--db-accent)' }} />
                  <span className="font-bold" style={{ color: 'var(--db-text-primary)' }}>CyberGuardian</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl cursor-pointer" style={{ color: 'var(--db-text-secondary)' }}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1">
                {mobileNavItems.map(item => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        color: isActive ? 'var(--db-accent)' : 'var(--db-text-secondary)',
                        background: isActive ? 'var(--db-accent-light)' : 'transparent',
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              <div className="pt-4" style={{ borderTop: '1px solid var(--db-border)' }}>
                <div className="mb-3">
                  <p className="text-sm font-semibold" style={{ color: 'var(--db-text-primary)' }}>{user.name}</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--db-text-muted)' }}>{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all"
                  style={{ background: 'rgba(239,68,68,0.08)', color: 'var(--db-red)', border: '1px solid rgba(239,68,68,0.15)' }}
                >
                  {loggingOut ? <Loader className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
