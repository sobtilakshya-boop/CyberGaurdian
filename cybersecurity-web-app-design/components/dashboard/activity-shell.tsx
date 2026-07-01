"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertOctagon, HelpCircle, RefreshCw } from 'lucide-react'

interface DragAndDropProps {
  title: string
  description: string
  items: string[]
  categories: string[]
}

interface MatchFollowingProps {
  title: string
  pairs: { term: string; definition: string }[]
}

interface ScenarioProps {
  title: string
  situation: string
  choices: { text: string; isCorrect: boolean; feedback: string }[]
}

interface ActivityShellProps {
  dragAndDrop: DragAndDropProps
  matchFollowing: MatchFollowingProps
  scenario: ScenarioProps
  onComplete: () => void
}

export default function ActivityShell({ dragAndDrop, matchFollowing, scenario, onComplete }: ActivityShellProps) {
  const [activeTab, setActiveTab] = useState<'drag' | 'match' | 'scenario'>('drag')
  
  // States for Drag and Drop
  const [dragItems, setDragItems] = useState(() => dragAndDrop.items.map(text => ({ text, category: '' })))
  const [dragFeedback, setDragFeedback] = useState<string | null>(null)

  // States for Match the Following
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({})
  const [matchFeedback, setMatchFeedback] = useState<string | null>(null)

  // States for Scenario
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [scenarioComplete, setScenarioComplete] = useState(false)

  // Drag and drop sorting logic
  function handleAssign(itemText: string, category: string) {
    setDragItems(prev => prev.map(item => item.text === itemText ? { ...item, category } : item))
  }

  function checkDragAndDrop() {
    // Simple correctness checks based on standard threat model sorting
    let correct = true
    dragItems.forEach(item => {
      if (dragAndDrop.categories[0] === 'Social Engineering' && item.category) {
        const isSE = ["Clicking a phishing link", "Fake IT support call", "USB dropped in parking lot"].includes(item.text)
        const isTech = ["Unpatched software", "SQL injection"].includes(item.text)
        const isPhys = ["USB dropped in parking lot"].includes(item.text)
        if (item.category === 'Social Engineering' && !isSE) correct = false
        if (item.category === 'Technical Vulnerability' && !isTech) correct = false
        if (item.category === 'Physical Attack' && !isPhys) correct = false
      }
    })

    const allSorted = dragItems.every(i => i.category !== '')
    if (!allSorted) {
      setDragFeedback('Please categorize all items before checking.')
      return
    }

    if (correct) {
      setDragFeedback('Correct! Outstanding threat assessment capability.')
      // If we finished all three or want to mark chapter progress
      onComplete()
    } else {
      setDragFeedback('Some items are misclassified. Review threat vectors and try again.')
    }
  }

  // Matching logic
  function handleMatchSelect(term: string) {
    setSelectedTerm(term)
  }

  function handleDefinitionSelect(definition: string) {
    if (!selectedTerm) return
    setMatchedPairs(prev => ({ ...prev, [selectedTerm]: definition }))
    setSelectedTerm(null)
    
    // Check if fully matched
    const newMatches = { ...matchedPairs, [selectedTerm]: definition }
    if (Object.keys(newMatches).length === matchFollowing.pairs.length) {
      let allCorrect = true
      matchFollowing.pairs.forEach(p => {
        if (newMatches[p.term] !== p.definition) allCorrect = false
      })
      if (allCorrect) {
        setMatchFeedback('Perfect match! Security concepts aligned.')
        onComplete()
      } else {
        setMatchFeedback('Incorrect pairings identified. Try resetting the board.')
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Activity Mode tabs */}
      <div className="flex border-b border-slate-800 gap-1 select-none">
        {(['drag', 'match', 'scenario'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab === 'drag' ? 'Threat Sorting' : tab === 'match' ? 'Security Match' : 'Situation Room'}
          </button>
        ))}
      </div>

      <div className="min-h-[350px]">
        {/* DRAG & DROP SHELL */}
        {activeTab === 'drag' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
            <div className="font-mono text-xs text-slate-400">
              <p className="font-bold mb-1">{dragAndDrop.title}</p>
              <p>{dragAndDrop.description}</p>
            </div>

            {/* Unclassified Items */}
            <div className="flex flex-wrap gap-2.5 p-4 rounded-xl border border-slate-800 bg-slate-950 min-h-[60px]">
              {dragItems.filter(i => !i.category).map(item => (
                <div
                  key={item.text}
                  className="px-3.5 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-200 font-mono text-xs flex items-center gap-2 select-none shadow-sm"
                >
                  <span>{item.text}</span>
                  <div className="flex gap-1">
                    {dragAndDrop.categories.map((cat, idx) => (
                      <button
                        key={cat}
                        onClick={() => handleAssign(item.text, cat)}
                        className="px-1.5 py-0.5 rounded text-[8px] bg-slate-800 border border-slate-700 hover:bg-cyan-900/50 hover:text-cyan-400 cursor-pointer"
                        title={cat}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dragAndDrop.categories.map(cat => (
                <div key={cat} className="p-4 rounded-xl border border-slate-800 bg-slate-900/20 flex flex-col gap-3 min-h-[160px]">
                  <h4 className="font-mono text-xs font-bold text-cyan-400 border-b border-slate-800 pb-2 uppercase tracking-wide">
                    {cat}
                  </h4>
                  <div className="flex flex-col gap-2 flex-1">
                    {dragItems.filter(i => i.category === cat).map(item => (
                      <div
                        key={item.text}
                        onClick={() => handleAssign(item.text, '')}
                        className="px-3 py-2 rounded-lg border border-cyan-500/10 bg-cyan-500/5 text-slate-200 font-mono text-xs flex justify-between items-center cursor-pointer hover:bg-cyan-500/10 transition-colors"
                      >
                        <span>{item.text}</span>
                        <span className="text-[10px] text-slate-500 font-bold">×</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {dragFeedback && (
              <div className={`p-4 rounded-xl border font-mono text-xs ${
                dragFeedback.startsWith('Correct') ? 'bg-green-500/10 border-green-500/25 text-green-400' : 'bg-slate-900 border-slate-800 text-yellow-400'
              }`}>
                {dragFeedback}
              </div>
            )}

            <button
              onClick={checkDragAndDrop}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-widest self-end cursor-pointer transition-all"
            >
              Verify Classifications
            </button>
          </motion.div>
        )}

        {/* MATCH THE FOLLOWING SHELL */}
        {activeTab === 'match' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
            <h3 className="font-mono text-xs font-bold text-slate-400">{matchFollowing.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Terms Column */}
              <div className="flex flex-col gap-3">
                {matchFollowing.pairs.map(p => {
                  const isSelected = selectedTerm === p.term
                  const isMatched = !!matchedPairs[p.term]
                  return (
                    <button
                      key={p.term}
                      onClick={() => !isMatched && handleMatchSelect(p.term)}
                      disabled={isMatched}
                      className={`w-full text-left px-4 py-3 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
                        isMatched
                          ? 'border-green-500/30 bg-green-500/5 text-slate-500 cursor-default'
                          : isSelected
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                          : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-cyan-500/20'
                      }`}
                    >
                      {p.term} {isMatched && ' ✓'}
                    </button>
                  )
                })}
              </div>

              {/* Definitions Column */}
              <div className="flex flex-col gap-3">
                {matchFollowing.pairs.map(p => p.definition).sort().map(def => {
                  const matchingTerm = Object.keys(matchedPairs).find(k => matchedPairs[k] === def)
                  const isMatched = !!matchingTerm
                  return (
                    <button
                      key={def}
                      onClick={() => !isMatched && handleDefinitionSelect(def)}
                      disabled={isMatched || !selectedTerm}
                      className={`w-full text-left px-4 py-3 rounded-xl border font-mono text-xs transition-all cursor-pointer ${
                        isMatched
                          ? 'border-green-500/30 bg-green-500/5 text-slate-500 cursor-default'
                          : selectedTerm
                          ? 'border-cyan-500/20 bg-slate-900/60 text-slate-300 hover:border-cyan-400 hover:text-white'
                          : 'border-slate-800 bg-slate-900/20 text-slate-500 cursor-default'
                      }`}
                    >
                      {matchingTerm ? `[${matchingTerm}] ` : ''}{def}
                    </button>
                  )
                })}
              </div>
            </div>

            {matchFeedback && (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-center text-cyan-400">
                {matchFeedback}
              </div>
            )}

            <button
              onClick={() => {
                setMatchedPairs({})
                setMatchFeedback(null)
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all font-mono text-xs font-bold uppercase tracking-wider self-end cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Board
            </button>
          </motion.div>
        )}

        {/* SITUATION ROOM / SCENARIOS */}
        {activeTab === 'scenario' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <HelpCircle className="h-4 w-4" />
              <span>{scenario.title}</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-xl">
              <p className="font-mono text-xs text-slate-300 leading-relaxed">
                {scenario.situation}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {scenario.choices.map((choice, i) => {
                const isSelected = selectedChoice === i
                let cardStyle = 'border-slate-800 bg-slate-900/30 text-slate-300 hover:border-cyan-500/20 hover:text-white'
                if (scenarioComplete) {
                  if (choice.isCorrect) cardStyle = 'border-green-500/40 bg-green-500/10 text-green-300'
                  else if (isSelected) cardStyle = 'border-red-500/40 bg-red-500/10 text-red-300'
                } else if (isSelected) {
                  cardStyle = 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
                }

                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (scenarioComplete) return
                      setSelectedChoice(i)
                      setScenarioComplete(true)
                      if (choice.isCorrect) {
                        onComplete()
                      }
                    }}
                    className={`w-full text-left px-5 py-4 rounded-xl border font-mono text-xs leading-relaxed transition-all cursor-pointer ${cardStyle}`}
                  >
                    <div className="font-bold uppercase tracking-wider text-[9px] text-slate-500 mb-1">Choice {i + 1}</div>
                    {choice.text}
                  </button>
                )
              })}
            </div>

            {scenarioComplete && selectedChoice !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border font-mono text-xs ${
                  scenario.choices[selectedChoice].isCorrect
                    ? 'bg-green-500/10 border-green-500/25 text-green-400'
                    : 'bg-red-500/10 border-red-500/25 text-red-400'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {scenario.choices[selectedChoice].isCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>RECOMMENDED RESOLUTION</span>
                    </>
                  ) : (
                    <>
                      <AlertOctagon className="h-4 w-4" />
                      <span>SECURITY INTRUSION WARNING</span>
                    </>
                  )}
                </div>
                <p>{scenario.choices[selectedChoice].feedback}</p>
                {!scenario.choices[selectedChoice].isCorrect && (
                  <button
                    onClick={() => {
                      setScenarioComplete(false)
                      setSelectedChoice(null)
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Retry Scenario
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
