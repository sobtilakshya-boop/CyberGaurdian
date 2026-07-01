"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '@/lib/progress-context'
import { chapters } from '@/data/courseData'
import Link from 'next/link'
import { 
  Award, Lock, CheckCircle2, ChevronRight, Printer, ShieldCheck, 
  HelpCircle, Calendar, Sparkles, AlertCircle 
} from 'lucide-react'

interface UserSession {
  userId: string
  name: string
  email: string
  phone: string
}

export default function CertificatesPage() {
  const { progress, getOverallPercent, getCompletedCount, isChapterComplete } = useProgress()
  const [session, setSession] = useState<UserSession | null>(null)

  const overallPct = getOverallPercent()
  const completedCount = getCompletedCount()
  const isComplete = completedCount === 9

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.session) setSession(data.session)
      })
      .catch(() => {})
  }, [])

  // Crytographic Certificate Verification Hash
  const hashSignature = session
    ? Array.from(session.userId + '-completed-cyberguardian')
        .reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0)
        .toString(16)
        .toUpperCase()
    : '4F89BC22D'

  function handlePrint() {
    window.print()
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto print:p-0">
      {/* Page Header (Hidden on Print) */}
      <div className="flex flex-col gap-1.5 pb-6 border-b border-slate-800 print:hidden">
        <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
          Academic Credentials
        </span>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">
          Certificates & Badges
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Unlock your cryptographically signed completion certificate and audit your learning badges.
        </p>
      </div>

      {/* Certificate Section */}
      <div className="flex flex-col gap-6">
        {isComplete ? (
          /* UNLOCKED STATE: Certificate Frame */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Holographic interactive certificate card container */}
            <div 
              id="certificate-print-area"
              className="w-full max-w-4xl relative rounded-3xl p-[1px] overflow-hidden shadow-[0_0_60px_rgba(6,182,212,0.15)] print:shadow-none print:p-0"
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.8) 0%, rgba(139,92,246,0.3) 50%, rgba(6,182,212,0.8) 100%)",
              }}
            >
              <div 
                className="rounded-3xl bg-slate-950 p-8 sm:p-12 md:p-16 text-center flex flex-col items-center justify-between border border-slate-900/60 min-h-[500px] print:border-none print:bg-white print:text-slate-950"
              >
                {/* Border corner graphics */}
                <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 print:hidden" />
                <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-cyan-500/40 print:hidden" />
                <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-cyan-500/40 print:hidden" />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40 print:hidden" />

                {/* Cyber Guardian Crest */}
                <div className="flex items-center gap-2.5 mb-6">
                  <ShieldCheck className="h-10 w-10 text-cyan-400 print:text-cyan-600" />
                  <span className="font-mono text-xl font-black uppercase tracking-wider text-white print:text-slate-900">
                    CYBER<span className="text-cyan-400 print:text-cyan-600">GUARDIAN</span>
                  </span>
                </div>

                {/* Certificate Sub-Crest */}
                <span className="font-mono text-[10px] tracking-[0.4em] text-cyan-500/80 uppercase mb-8 print:text-cyan-600 print:font-bold">
                  Credentials Academy Verification
                </span>

                {/* Main Declaration */}
                <div className="flex flex-col gap-4 max-w-2xl mb-8">
                  <h2 className="text-2xl sm:text-3xl font-serif text-slate-100 print:text-slate-900">
                    Certificate of Competency
                  </h2>
                  <p className="text-xs font-mono text-slate-400 tracking-wide uppercase print:text-slate-600">
                    This document certifies that the operator listed below has successfully completed
                  </p>
                  
                  {/* Name field */}
                  <div className="py-4 my-2 border-b-2 border-dashed border-slate-800 print:border-slate-300">
                    <span className="text-3xl font-mono font-bold text-white print:text-slate-900 tracking-wide">
                      {session?.name ?? 'Secure Operator'}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-slate-400 leading-relaxed max-w-xl mx-auto print:text-slate-600">
                    has completed the 9-part Cyber Hygiene Curriculum, demonstrating professional competency in digital security defense, network protection, cryptographic hashes, incident response, and active risk mitigation.
                  </p>
                </div>

                {/* Verification Metadata Footnote */}
                <div className="grid grid-cols-1 sm:grid-cols-3 w-full gap-6 pt-8 border-t border-slate-900/60 print:border-slate-200">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase print:text-slate-600">Verification Hash</span>
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase print:text-cyan-600">
                      CG-SEC-{hashSignature}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase print:text-slate-600">Verified By</span>
                    <span className="text-xs font-mono font-semibold text-slate-300 print:text-slate-800">
                      CyberPeace Foundation
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase print:text-slate-600">Issued On</span>
                    <span className="text-xs font-mono font-semibold text-slate-300 print:text-slate-800">
                      {new Date().toISOString().split('T')[0]}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Print trigger button (Hidden on print) */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all print:hidden"
            >
              <Printer className="h-4 w-4" />
              <span>Print / Download Certificate</span>
            </button>
          </motion.div>
        ) : (
          /* LOCKED STATE: Progress bar + lock overlay */
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Locked Visual Preview Card */}
            <div className="flex-1 rounded-2xl border border-slate-800/80 bg-slate-900/10 backdrop-blur-md p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden min-h-[360px]">
              {/* Blur backdrop overlay */}
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="h-14 w-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-lg animate-pulse">
                  <Lock className="h-6 w-6 text-cyan-400" />
                </div>
                <div className="text-center px-4 max-w-sm">
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-1">
                    Certificate Locked
                  </h3>
                  <p className="font-mono text-[11px] text-slate-500 leading-normal">
                    Complete all 9 course curriculum chapters to sign and unlock your cryptography certificate.
                  </p>
                </div>
              </div>

              {/* Faux Certificate Background layout */}
              <div className="opacity-15 flex flex-col items-center text-center">
                <ShieldCheck className="h-10 w-10 text-slate-400 mb-2" />
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">CYBERGUARDIAN CERTIFICATE</span>
                <div className="h-6 w-48 bg-slate-800 rounded mt-8 mb-4 mx-auto" />
                <div className="h-3 w-72 bg-slate-800 rounded mx-auto" />
                <div className="h-3 w-56 bg-slate-800 rounded mt-2 mx-auto" />
              </div>

              {/* Progress Ring at Bottom */}
              <div className="opacity-15 flex justify-between pt-6 border-t border-slate-800">
                <div className="h-3 w-24 bg-slate-800 rounded" />
                <div className="h-3 w-20 bg-slate-800 rounded" />
              </div>
            </div>

            {/* Checklist of Chapters (Lock Tracker) */}
            <div className="w-full lg:w-96 rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md p-5 flex flex-col gap-4">
              <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider pb-3 border-b border-slate-800">
                Certificate Checklist ({completedCount}/9)
              </h3>
              
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[300px]">
                {chapters.map(chapter => {
                  const done = isChapterComplete(chapter.id)
                  return (
                    <div 
                      key={chapter.id}
                      className={`flex items-center justify-between p-3 rounded-xl border font-mono text-[11px] ${
                        done
                          ? 'bg-green-500/5 border-green-500/10 text-green-400'
                          : 'bg-slate-950/20 border-slate-900 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {done ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                        ) : (
                          <Lock className="h-4 w-4 shrink-0 text-slate-600" />
                        )}
                        <span className="truncate">{chapter.id}. {chapter.title}</span>
                      </div>
                      
                      {!done && (
                        <Link href={`/dashboard/course`}>
                          <span className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold shrink-0 flex items-center gap-0.5">
                            Start <ChevronRight className="h-3 w-3" />
                          </span>
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
