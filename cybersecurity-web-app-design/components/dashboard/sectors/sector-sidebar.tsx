"use client"

import { motion } from 'framer-motion'
import { Shield, BookOpen, FileWarning, HelpCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SidebarSection {
  id: string
  label: string
  icon: any
}

interface SectorSidebarProps {
  activeSection: string
  onChange: (id: string) => void
}

export function SectorSidebar({ activeSection, onChange }: SectorSidebarProps) {
  const sections: SidebarSection[] = [
    { id: 'introduction', label: 'Introduction', icon: BookOpen },
    { id: 'practices', label: 'Best Practices', icon: Shield },
    { id: 'caseStudies', label: 'Case Studies', icon: FileWarning },
    { id: 'timeline', label: 'Attack Timeline', icon: HelpCircle },
  ]

  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-24">
      {/* Return link */}
      <Link
        href="/dashboard/sectors"
        className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--db-text-muted)] hover:text-[var(--db-accent)] transition-colors w-fit group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Simulators
      </Link>

      {/* Navigation Menu */}
      <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 p-1.5 rounded-2xl bg-[var(--db-surface)] border border-[var(--db-border)] shadow-sm scrollbar-none">
        {sections.map((sec) => {
          const isActive = activeSection === sec.id
          const Icon = sec.icon

          return (
            <button
              key={sec.id}
              onClick={() => onChange(sec.id)}
              className={`relative flex items-center gap-3 px-5 py-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-colors shrink-0 outline-none select-none text-left w-full cursor-pointer ${
                isActive ? 'text-[var(--db-accent)]' : 'text-[var(--db-text-secondary)] hover:text-[var(--db-text-primary)] hover:bg-[var(--db-surface-2)]/50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-sidebar-tab"
                  className="absolute inset-0 rounded-xl bg-[var(--db-accent-light)] border border-[var(--db-accent-mid)]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                {sec.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
