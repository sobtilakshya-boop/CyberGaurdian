"use client"

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Menu,
  X,
  Shield,
  User,
  LogOut,
  Bell,
  Home,
  BookOpen,
  ClipboardCheck,
  FolderOpen,
  BarChart3,
  Settings,
  Loader
} from 'lucide-react'

interface UserSession {
  userId: string
  name: string
  email: string
  phone: string
}

interface TopbarProps {
  user: UserSession
}

export default function Topbar({ user }: TopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  // Map route paths to screen titles
  const getScreenTitle = () => {
    if (pathname === '/dashboard') return 'Home / Overview'
    if (pathname.startsWith('/dashboard/learn')) return 'Cyber Academy'
    if (pathname.startsWith('/dashboard/assessments')) return 'Assessments'
    if (pathname.startsWith('/dashboard/resources')) return 'Cyber Resources'
    if (pathname.startsWith('/dashboard/reports')) return 'Security Reports'
    if (pathname.startsWith('/dashboard/settings')) return 'System Settings'
    if (pathname.startsWith('/dashboard/profile')) return 'User Profile'
    return 'Dashboard'
  }

  const mobileNavItems = [
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
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      <header className="flex w-full items-center justify-between border-b border-cyan-500/10 bg-slate-900/40 backdrop-blur-xl px-6 py-4">
        {/* Screen Title & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <h1 className="font-mono text-base md:text-lg font-bold tracking-wide text-white capitalize hidden sm:block">
            <span className="text-cyan-400">{"// "}</span>{getScreenTitle()}
          </h1>
          
          {/* Mobile Brand Name */}
          <div className="flex items-center gap-2 md:hidden sm:hidden">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="font-mono text-sm font-bold uppercase tracking-wider text-white">CG</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Notification Alert (Subtle) */}
          <button
            className="relative p-2 rounded-xl border border-slate-800 bg-slate-900/30 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer hover:shadow-[0_0_8px_rgba(6,182,212,0.1)]"
            aria-label="Alerts"
          >
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <Bell className="h-4 w-4" />
          </button>

          {/* User Badge with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-3 pl-3 border-l border-slate-800/80 cursor-pointer hover:opacity-80 transition-all text-left focus:outline-none"
              aria-label="User profile menu"
            >
              <div className="flex flex-col text-right hidden md:flex">
                <span className="text-xs font-mono font-semibold text-slate-200">{user.name}</span>
                <span className="text-[9px] font-mono text-cyan-500">Security Clearance Level 1</span>
              </div>
              <div className="h-9 w-9 rounded-xl border border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-mono text-sm font-bold select-none shadow-[0_0_8px_rgba(6,182,212,0.05)]">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 z-50 w-56 rounded-xl border border-slate-800/90 bg-slate-950/95 backdrop-blur-xl p-2 shadow-2xl flex flex-col gap-1 font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-slate-900/60 flex flex-col gap-0.5 select-none">
                    <span className="font-semibold text-slate-200 truncate">{user.name}</span>
                    <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
                  </div>
                  
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 transition-all"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>My Profile</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false)
                      handleLogout()
                    }}
                    disabled={loggingOut}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-left w-full cursor-pointer disabled:opacity-60"
                  >
                    {loggingOut ? (
                      <Loader className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <LogOut className="h-3.5 w-3.5" />
                    )}
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile Navigation Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-cyan-500/15 shadow-[5px_0_30px_rgba(0,0,0,0.5)] p-6 flex flex-col gap-6 md:hidden transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-cyan-400" />
            <span className="font-mono text-base font-bold uppercase tracking-wider text-white">
              Cyber<span className="text-cyan-400">Guardian</span>
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile Nav Links */}
        <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-mono text-sm font-medium transition-all ${
                  isActive 
                    ? 'text-cyan-400 bg-cyan-500/5 border border-cyan-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Mobile Nav Footer */}
        <div className="pt-4 border-t border-slate-850 flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-mono font-semibold text-slate-200">{user.name}</span>
            <span className="text-[11px] font-mono text-slate-500">{user.email}</span>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/15 text-red-400 font-mono text-sm font-semibold hover:bg-red-500/15 transition-all cursor-pointer disabled:opacity-60"
          >
            {loggingOut ? (
              <Loader className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}
