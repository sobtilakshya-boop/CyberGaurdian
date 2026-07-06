"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, AlertTriangle, ShieldCheck, HelpCircle, FileText } from 'lucide-react'

interface CaseStudyItem {
  background: string
  rootCause: string
  impact: string
  prevention: string
}

export function ExpandableCaseStudy({ caseStudies }: { caseStudies: CaseStudyItem[] }) {
  const [openSection, setOpenSection] = useState<'background' | 'rootCause' | 'impact' | 'prevention' | null>('background')

  if (!caseStudies || caseStudies.length === 0) return null
  const study = caseStudies[0] // currently showing single detailed case study

  const sections = [
    { id: 'background', title: 'Incident Background', content: study.background, icon: FileText, color: 'text-cyan-400' },
    { id: 'rootCause', title: 'Root Cause Analysis', content: study.rootCause, icon: AlertTriangle, color: 'text-red-400' },
    { id: 'impact', title: 'Business & Operational Impact', content: study.impact, icon: HelpCircle, color: 'text-purple-400' },
    { id: 'prevention', title: 'Preventative Strategy', content: study.prevention, icon: ShieldCheck, color: 'text-emerald-400' },
  ] as const

  return (
    <div className="flex flex-col gap-4 my-6">
      {sections.map((sec) => {
        const isOpen = openSection === sec.id
        const Icon = sec.icon

        return (
          <div
            key={sec.id}
            className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] overflow-hidden transition-all duration-300 shadow-sm"
          >
            <button
              onClick={() => setOpenSection(isOpen ? null : sec.id)}
              className="w-full flex items-center justify-between p-5 text-left text-[var(--db-text-primary)] font-mono font-bold tracking-wide outline-none cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${sec.color}`} />
                {sec.title}
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[var(--db-text-muted)]"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 pt-1 text-[var(--db-text-secondary)] text-sm leading-relaxed border-t border-[var(--db-border)] font-sans font-medium">
                    {sec.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
