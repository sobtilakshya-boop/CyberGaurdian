"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, ChevronRight, Trophy, RotateCcw } from 'lucide-react'
import type { QuizQuestion } from '@/data/courseData'
import confetti from 'canvas-confetti'

interface QuizEngineProps {
  questions: QuizQuestion[]
  onPass: (score: number) => void
  onFail?: (score: number) => void
  passMark?: number       // default 70
  title?: string
  shuffled?: boolean
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

export default function QuizEngine({
  questions,
  onPass,
  onFail,
  passMark = 70,
  title = 'Chapter Quiz',
  shuffled = true,
}: QuizEngineProps) {
  const [qs] = useState(() => shuffled ? shuffle(questions) : questions)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(qs.length).fill(null))

  const q = qs[currentIdx]
  const score = Math.round((correct / qs.length) * 100)
  const passed = score >= passMark

  function handleSelect(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const isCorrect = idx === q.correctIndex
    if (isCorrect) setCorrect(c => c + 1)
    setAnswers(prev => { const n = [...prev]; n[currentIdx] = idx; return n })
  }

  function handleNext() {
    if (currentIdx < qs.length - 1) {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setFinished(true)
      const finalScore = Math.round(((correct + (selected === q.correctIndex ? 0 : 0)) / qs.length) * 100)
      if (passed) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#06b6d4', '#818cf8', '#38bdf8'] })
        onPass(finalScore)
      } else {
        onFail?.(finalScore)
      }
    }
  }

  function handleRetry() {
    setCurrentIdx(0)
    setSelected(null)
    setAnswered(false)
    setCorrect(0)
    setFinished(false)
    setAnswers(Array(qs.length).fill(null))
  }

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 py-8 text-center"
      >
        <div className={`p-5 rounded-2xl border ${passed ? 'bg-green-500/10 border-green-500/25' : 'bg-red-500/10 border-red-500/25'}`}>
          {passed
            ? <Trophy className="h-12 w-12 text-yellow-400" />
            : <XCircle className="h-12 w-12 text-red-400" />
          }
        </div>
        <div>
          <h3 className={`font-mono text-2xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
            {passed ? 'Passed!' : 'Not Quite'}
          </h3>
          <p className="font-mono text-4xl font-extrabold text-white mt-1">{score}%</p>
          <p className="font-mono text-sm text-slate-400 mt-1">
            {correct} of {qs.length} correct · Pass mark: {passMark}%
          </p>
        </div>

        {!passed && (
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-sm font-bold transition-all cursor-pointer border border-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
        )}
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
        <span className="font-mono text-xs text-slate-400">{currentIdx + 1} / {qs.length}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
          animate={{ width: `${((currentIdx) / qs.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-5"
        >
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
            <p className="font-mono text-sm text-white leading-relaxed font-semibold">
              Q{currentIdx + 1}. {q.question}
            </p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            {q.options.map((opt, i) => {
              let state: 'idle' | 'correct' | 'wrong' | 'missed' = 'idle'
              if (answered) {
                if (i === q.correctIndex) state = 'correct'
                else if (i === selected && i !== q.correctIndex) state = 'wrong'
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border font-mono text-sm transition-all cursor-pointer ${
                    state === 'correct' ? 'bg-green-500/15 border-green-500/40 text-green-300' :
                    state === 'wrong'   ? 'bg-red-500/15 border-red-500/40 text-red-300' :
                    answered && i === selected ? '' :
                    selected === i ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' :
                    'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-cyan-500/30 hover:text-white'
                  }`}
                >
                  <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {state === 'correct' && <CheckCircle2 className="h-4 w-4 inline ml-2 text-green-400" />}
                  {state === 'wrong' && <XCircle className="h-4 w-4 inline ml-2 text-red-400" />}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-4"
              >
                <p className="font-mono text-xs text-slate-300 leading-relaxed">
                  <span className="text-cyan-400 font-bold">Explanation: </span>
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      {answered && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleNext}
          className="self-end flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-sm font-bold uppercase tracking-widest transition-all cursor-pointer"
        >
          {currentIdx < qs.length - 1 ? 'Next Question' : 'See Results'}
          <ChevronRight className="h-4 w-4" />
        </motion.button>
      )}
    </div>
  )
}
