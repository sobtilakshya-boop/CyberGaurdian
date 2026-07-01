'use client';

import { useState } from 'react';
import { Lightbulb } from 'lucide-react';

interface PuzzleGridProps {
  title?: string;
  items: string[];
  onComplete: () => void;
}

export function PuzzleGrid({ title, items, onComplete }: PuzzleGridProps) {
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [hints, setHints] = useState<Set<number>>(new Set());

  const allSolved = solved.size === items.length;

  const handleSolve = (index: number) => {
    const newSolved = new Set(solved);
    newSolved.add(index);
    setSolved(newSolved);
  };

  const handleShowHint = (index: number) => {
    const newHints = new Set(hints);
    newHints.add(index);
    setHints(newHints);
  };

  const hints_data: { [key: string]: string } = {
    'Identify phishing emails in real-world scenarios': 'Look for suspicious sender addresses and urgent language',
    'Learn from common attack patterns': 'Study how attackers impersonate legitimate companies',
    'Practice your phishing detection skills': 'Check for spelling errors and mismatched links',
  };

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}

      <p className="text-slate-300 mb-6">Solve these security puzzles to test your knowledge:</p>

      <div className="space-y-4 mb-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
            <div className="flex items-start justify-between mb-3">
              <span className="text-white font-medium flex-1">{item}</span>
              <div className="flex gap-2 ml-3">
                <button
                  onClick={() => handleShowHint(idx)}
                  className="p-2 rounded-lg bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 transition-colors"
                  title="Get a hint"
                >
                  <Lightbulb className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSolve(idx)}
                  disabled={solved.has(idx)}
                  className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:bg-green-700/50 disabled:cursor-default transition-colors"
                >
                  {solved.has(idx) ? '✓ Solved' : 'Solve'}
                </button>
              </div>
            </div>

            {hints.has(idx) && (
              <div className="bg-amber-600/20 border border-amber-600/50 rounded p-3">
                <p className="text-sm text-amber-200">
                  <strong>Hint:</strong> {hints_data[item] || 'Think about what you learned in this chapter.'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        disabled={!allSolved}
        className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {allSolved ? '✓ All Puzzles Solved' : `Solve ${solved.size}/${items.length} Puzzles`}
      </button>
    </div>
  );
}
