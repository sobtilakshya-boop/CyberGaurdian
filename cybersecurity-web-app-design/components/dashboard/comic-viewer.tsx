"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import type { ComicPanel } from '@/data/courseData'

interface ComicViewerProps {
  panels: ComicPanel[]
  onComplete: () => void
  isComplete: boolean
}

export default function ComicViewer({ panels, onComplete, isComplete }: ComicViewerProps) {
  const [index, setIndex] = useState(0)

  const isLast = index === panels.length - 1

  function handleNext() {
    if (isLast) {
      onComplete()
    } else {
      setIndex(prev => prev + 1)
    }
  }

  function handlePrev() {
    if (index > 0) {
      setIndex(prev => prev - 1)
    }
  }

  const panel = panels[index]

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Comic Book Window Frame */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl flex flex-col gap-4 min-h-[400px] justify-between">
        {/* Top bar indicators */}
        <div className="flex items-center justify-between font-mono text-xs text-slate-500 border-b border-slate-900 pb-3">
          <span className="uppercase tracking-widest text-cyan-400">Cyber Intelligence Strip</span>
          <span>Panel {index + 1} of {panels.length}</span>
        </div>

        {/* Panel View Area */}
        <div className="flex-1 flex flex-col justify-center items-center py-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center gap-6 w-full text-center"
            >
              {/* Illustration Placeholder */}
              <div className="relative w-full aspect-[4/3] max-w-sm rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col items-center justify-center overflow-hidden shadow-inner group">
                {panel.imageUrl ? (
                  <img
                    src={panel.imageUrl}
                    alt={panel.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-8 flex flex-col items-center gap-3 text-slate-500">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">🖼️</div>
                    <span className="font-mono text-xs text-slate-600 uppercase tracking-widest">[ Cyber Panel Asset ]</span>
                  </div>
                )}
                {/* Visual grid effect overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40" />
              </div>

              {/* Speech bubble or dialogue box */}
              <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 px-6 py-4 rounded-xl text-left before:content-[''] before:absolute before:top-[-8px] before:left-1/2 before:-translate-x-1/2 before:border-solid before:border-b-slate-800 before:border-b-8 before:border-x-8 before:border-x-transparent">
                <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1.5">{panel.title}</h4>
                <p className="font-mono text-xs text-slate-300 leading-relaxed">{panel.description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls navigation */}
        <div className="flex items-center justify-between border-t border-slate-900 pt-4">
          <button
            onClick={handlePrev}
            disabled={index === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-mono text-xs font-bold uppercase tracking-wider"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Prev</span>
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {panels.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-6 bg-cyan-400'
                    : i < index
                    ? 'w-1.5 bg-cyan-600/40'
                    : 'w-1.5 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              isLast
                ? isComplete
                  ? 'bg-green-500/10 border border-green-500/25 text-green-400'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {isLast ? (
              isComplete ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Completed</span>
                </>
              ) : (
                <span>Complete Strip</span>
              )
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
