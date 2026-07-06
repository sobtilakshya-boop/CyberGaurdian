"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Building, Landmark, Factory, HeartPulse, ShieldAlert, Calendar } from 'lucide-react'
import type { SectorData } from '@/data/sectorsData'
import { SectorSidebar } from '@/components/dashboard/sectors/sector-sidebar'
import { VisualCallout } from '@/components/dashboard/sectors/visual-callout'
import { FlashCardGrid } from '@/components/dashboard/sectors/flashcard-grid'
import { ExpandableCaseStudy } from '@/components/dashboard/sectors/expandable-case-study'
import { IncidentTimeline } from '@/components/dashboard/sectors/incident-timeline'

const iconMap: Record<string, any> = {
  GraduationCap, Building, Landmark, Factory, HeartPulse, ShieldAlert,
}

export default function SectorInteractiveLayout({ sector }: { sector: SectorData }) {
  const [activeSection, setActiveSection] = useState<string>('introduction')
  const Icon = iconMap[sector.iconType] || Building

  const secData = sector.sections || {
    introduction: {
      whyItMatters: sector.shortDesc,
      callouts: [
        { label: "Difficulty", value: sector.difficulty || "Intermediate" },
        { label: "Est. Time", value: sector.estimatedTime || "60 mins" },
        { label: "Compliance Profile", value: sector.compliance[0]?.split(':')[0] || "Standard" }
      ],
      threatLandscape: sector.threatLandscape
    },
    bestPractices: sector.bestPractices.map(p => ({ title: "Key Practice", content: p })),
    caseStudies: [{
      background: "Disclaimer: Rich case study payload not generated.",
      rootCause: "N/A",
      impact: "N/A",
      prevention: "N/A"
    }],
    timeline: [
      { step: 1, title: "Threat Enumeration", description: "Attack vectors are analyzed." }
    ]
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Immersive Cinematic Hero Header */}
      <div 
        className="relative h-[250px] md:h-[300px] w-full overflow-hidden rounded-3xl border border-[var(--db-border)] flex flex-col justify-end p-8 md:p-12 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Dynamic Cover image blended via overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10 pointer-events-none transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${sector.heroImageUrl})` }}
        />
        
        {/* Glowing grid decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_25px_rgba(79,70,229,0.2)]">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-350 uppercase">
              Simulator Enclave
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mt-1">
              {sector.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Dual-Column Content Structure */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <SectorSidebar activeSection={activeSection} onChange={setActiveSection} />
        </div>

        {/* Dynamic Interactive Panel */}
        <div className="flex-1 w-full min-h-[450px]">
          <AnimatePresence mode="wait">
            {activeSection === 'introduction' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="text-2xl font-black text-[var(--db-text-primary)] tracking-tight mb-3">Why it Matters</h2>
                  <p className="text-[var(--db-text-secondary)] text-sm leading-relaxed font-sans font-medium">
                    {secData.introduction.whyItMatters}
                  </p>
                </div>

                <VisualCallout callouts={secData.introduction.callouts} />

                <div>
                  <h3 className="text-xl font-bold text-[var(--db-text-primary)] tracking-wide mb-4">Critical Threat Vector Profiles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {secData.introduction.threatLandscape.map((threat, idx) => (
                      <div 
                        key={idx} 
                        className="p-5 rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] flex gap-4 shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 shrink-0 flex items-center justify-center text-red-500">
                          <ShieldAlert className="h-4 w-4" />
                        </div>
                        <p className="text-[var(--db-text-secondary)] text-xs leading-relaxed font-medium">
                          {threat}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'practices' && (
              <motion.div
                key="practices"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div>
                  <h2 className="text-2xl font-black text-[var(--db-text-primary)] tracking-tight">Best Defense Practices</h2>
                  <p className="text-[var(--db-text-muted)] text-xs mt-1 leading-relaxed">
                    Interactive flip-cards demonstrating primary defense behaviors. Flip to view implementation checklists.
                  </p>
                </div>
                <FlashCardGrid items={secData.bestPractices} />
              </motion.div>
            )}

            {activeSection === 'caseStudies' && (
              <motion.div
                key="caseStudies"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div>
                  <h2 className="text-2xl font-black text-[var(--db-text-primary)] tracking-tight">Active Case Analysis</h2>
                  <p className="text-[var(--db-text-muted)] text-xs mt-1 leading-relaxed">
                    Dissection of a historical sector breach, tracing cause, system failure, and remedies.
                  </p>
                </div>
                <ExpandableCaseStudy caseStudies={secData.caseStudies} />
              </motion.div>
            )}

            {activeSection === 'timeline' && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4"
              >
                <div>
                  <h2 className="text-2xl font-black text-[var(--db-text-primary)] tracking-tight">Typical Attack Progression</h2>
                  <p className="text-[var(--db-text-muted)] text-xs mt-1 leading-relaxed">
                    Phase-by-phase chronological trace mapping how threat actors compromise these networks.
                  </p>
                </div>
                <IncidentTimeline steps={secData.timeline} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
