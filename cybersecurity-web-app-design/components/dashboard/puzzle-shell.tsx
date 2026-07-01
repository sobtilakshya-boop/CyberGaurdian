"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, HelpCircle, Check } from 'lucide-react'

interface PuzzleShellProps {
  words: string[]
  onComplete: () => void
  isComplete: boolean
}

// Generate a random letter grid with the hidden words embedded
const GRID_SIZE = 12

function generateGrid(words: string[]): string[][] {
  const grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''))
  
  // Embed words
  words.forEach(word => {
    const len = word.length
    let placed = false
    let attempts = 0
    
    while (!placed && attempts < 100) {
      attempts++
      const direction = Math.random() > 0.5 ? 'H' : 'V' // Horizontal or Vertical
      const startX = Math.floor(Math.random() * (direction === 'H' ? GRID_SIZE - len : GRID_SIZE))
      const startY = Math.floor(Math.random() * (direction === 'V' ? GRID_SIZE - len : GRID_SIZE))
      
      // Check collision
      let fits = true
      for (let i = 0; i < len; i++) {
        const x = startX + (direction === 'H' ? i : 0)
        const y = startY + (direction === 'V' ? i : 0)
        if (grid[y][x] !== '' && grid[y][x] !== word[i]) {
          fits = false
          break
        }
      }
      
      if (fits) {
        for (let i = 0; i < len; i++) {
          const x = startX + (direction === 'H' ? i : 0)
          const y = startY + (direction === 'V' ? i : 0)
          grid[y][x] = word[i]
        }
        placed = true
      }
    }
  })
  
  // Fill remaining spaces with random security-like characters or standard alphabets
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)]
      }
    }
  }
  
  return grid
}

export default function PuzzleShell({ words, onComplete, isComplete }: PuzzleShellProps) {
  const [grid] = useState(() => generateGrid(words))
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [selectedCoords, setSelectedCoords] = useState<{ r: number; c: number }[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)

  function handleCellClick(r: number, c: number) {
    const isAlreadySelected = selectedCoords.some(coord => coord.r === r && coord.c === c)
    let newCoords = [...selectedCoords]
    if (isAlreadySelected) {
      newCoords = newCoords.filter(coord => !(coord.r === r && coord.c === c))
    } else {
      newCoords.push({ r, c })
    }
    setSelectedCoords(newCoords)

    // Build the string from coordinates
    const selectedString = newCoords.map(coord => grid[coord.r][coord.c]).join('')
    const reversedString = selectedString.split('').reverse().join('')
    
    // Check if the current combination matches any target word
    const matchingWord = words.find(w => w === selectedString || w === reversedString)
    if (matchingWord && !foundWords.includes(matchingWord)) {
      const newFound = [...foundWords, matchingWord]
      setFoundWords(newFound)
      setSelectedCoords([])
      setFeedback(`Found word: ${matchingWord}!`)
      
      if (newFound.length === words.length) {
        setFeedback('Security Word Search complete!')
        onComplete()
      }
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Instructions */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/30 font-mono text-xs text-slate-400">
        <HelpCircle className="h-5 w-5 text-cyan-400 shrink-0" />
        <p>
          Find all the security-related vocabulary hidden in the matrix below. Click letters in sequence to highlight them. Found words will automatically unlock in your checklist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* The Matrix Board */}
        <div className="md:col-span-2 flex justify-center items-center">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="grid grid-cols-12 gap-1 md:gap-1.5 select-none max-w-md w-full">
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isSelected = selectedCoords.some(coord => coord.r === r && coord.c === c)
                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      className={`aspect-square w-7 md:w-9 rounded flex items-center justify-center font-mono text-xs md:text-sm font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      {cell}
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>

        {/* Target Words & Complete Stance */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/30 flex flex-col gap-5 justify-between">
          <div>
            <h4 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-2 mb-3">
              Target Vocabulary
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {words.map(word => {
                const isFound = foundWords.includes(word)
                return (
                  <span
                    key={word}
                    className={`px-3 py-1.5 rounded-lg border font-mono text-[10px] font-bold uppercase tracking-wider transition-all ${
                      isFound
                        ? 'border-green-500/30 bg-green-500/10 text-green-400'
                        : 'border-slate-800 bg-slate-950 text-slate-500'
                    }`}
                  >
                    {word} {isFound && '✓'}
                  </span>
                )}
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {feedback && (
              <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 font-mono text-[10px] text-center text-cyan-400 uppercase tracking-wider animate-pulse">
                {feedback}
              </div>
            )}

            {isComplete && (
              <div className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-xs font-bold uppercase tracking-widest text-center shadow-lg">
                <Trophy className="h-4.5 w-4.5 text-yellow-400" />
                <span>Puzzle Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
