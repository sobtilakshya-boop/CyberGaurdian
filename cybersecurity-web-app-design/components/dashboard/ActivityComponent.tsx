'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface ActivityComponentProps {
  title?: string;
  items: string[];
  onComplete: () => void;
}

export function ActivityComponent({ title, items, onComplete }: ActivityComponentProps) {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const allCompleted = completed.size === items.length;

  const handleToggle = (index: number) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompleted(newCompleted);
  };

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}

      <p className="text-slate-300 mb-6">Complete the following tasks to demonstrate your understanding:</p>

      <div className="space-y-3 mb-6">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleToggle(idx)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              completed.has(idx)
                ? 'border-green-500 bg-green-500/10'
                : 'border-slate-600 bg-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  completed.has(idx) ? 'border-green-500 bg-green-500' : 'border-slate-500'
                }`}
              >
                {completed.has(idx) && <div className="text-white text-sm">✓</div>}
              </div>
              <span className="text-white font-medium flex-1">{item}</span>
              {completed.has(idx) && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onComplete}
        disabled={!allCompleted}
        className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {allCompleted ? '✓ All Tasks Complete' : `Complete ${completed.size}/${items.length} Tasks`}
      </button>
    </div>
  );
}
