"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Users, AlertOctagon, Activity } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  suffix?: string
  subtext: string
  iconType: 'shield' | 'users' | 'alert' | 'activity'
  colorClass?: string
}

export default function StatCard({
  title,
  value,
  suffix = '',
  subtext,
  iconType,
  colorClass = 'text-cyan-400 border-cyan-500/20'
}: StatCardProps) {
  const [count, setCount] = useState(0)

  // Map icon strings to Lucide components
  const renderIcon = () => {
    const className = "h-4.5 w-4.5 text-cyan-400"
    switch (iconType) {
      case 'shield':
        return <ShieldCheck className={className} />
      case 'users':
        return <Users className={className} />
      case 'alert':
        return <AlertOctagon className={className} />
      case 'activity':
        return <Activity className={className} />
      default:
        return <ShieldCheck className={className} />
    }
  }

  // Smooth integer counter animation
  useEffect(() => {
    let start = 0
    const end = value
    if (end === 0) {
      setCount(0)
      return
    }

    const duration = 1.2 // 1.2 seconds animation
    const incrementTime = Math.max(Math.floor((duration * 1000) / end), 15)
    
    const timer = setInterval(() => {
      start += Math.ceil(end / 80)
      if (start >= end) {
        clearInterval(timer)
        setCount(end)
      } else {
        setCount(start)
      }
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl border bg-slate-900/60 p-6 backdrop-blur-xl transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] ${colorClass}`}
    >
      {/* Background glow orb */}
      <div 
        aria-hidden="true" 
        className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-10 bg-cyan-400"
      />

      <div className="flex items-center justify-between gap-4 mb-3">
        <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/40">
          {renderIcon()}
        </div>
      </div>

      <div className="flex items-baseline gap-1 mb-1.5">
        <span className="text-3xl font-bold font-mono tracking-tight text-white">
          {count.toLocaleString()}
        </span>
        {suffix && (
          <span className="text-lg font-mono font-bold text-cyan-400">
            {suffix}
          </span>
        )}
      </div>

      <p className="text-xs font-mono text-slate-500">
        {subtext}
      </p>
    </motion.div>
  )
}
