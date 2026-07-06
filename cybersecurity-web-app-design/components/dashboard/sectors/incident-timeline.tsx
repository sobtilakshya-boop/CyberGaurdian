"use client"

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

interface TimelineStep {
  step: number
  title: string
  description: string
}

export function IncidentTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="relative border-l border-[var(--db-border-strong)] ml-4 md:ml-6 my-8 flex flex-col gap-8">
      {steps.map((step, idx) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.15 }}
          className="relative pl-8 md:pl-10"
        >
          {/* Timeline Dot */}
          <div className="absolute -left-3 top-1.5 w-6 h-6 rounded-full bg-[var(--db-surface)] border-2 border-[var(--db-accent)] flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-mono font-bold text-[var(--db-accent)]">
              {step.step}
            </span>
          </div>

          <div className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-[var(--db-accent)]">
              <Calendar className="h-4 w-4" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider">
                Phase {step.step}
              </span>
            </div>
            <h4 className="text-base font-bold text-[var(--db-text-primary)] mb-2 tracking-wide font-sans">
              {step.title}
            </h4>
            <p className="text-xs text-[var(--db-text-secondary)] leading-relaxed font-sans font-medium">
              {step.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
