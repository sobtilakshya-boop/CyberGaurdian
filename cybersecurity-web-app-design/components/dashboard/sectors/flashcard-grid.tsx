"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, HelpCircle } from 'lucide-react'

interface PracticeItem {
  title: string
  content: string
}

export function FlashCardGrid({ items }: { items: PracticeItem[] }) {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      {items.map((item, idx) => {
        const isFlipped = flippedIndex === idx

        return (
          <div
            key={item.title}
            className="h-56 cursor-pointer relative perspective-1000"
            onClick={() => setFlippedIndex(isFlipped ? null : idx)}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-full h-full relative preserve-3d"
            >
              {/* Front side */}
              <div 
                className="absolute inset-0 backface-hidden rounded-2xl p-6 border border-[var(--db-border)] bg-[var(--db-surface)] flex flex-col justify-between shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--db-accent-light)] border border-[var(--db-accent-mid)] flex items-center justify-center text-[var(--db-accent)]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[var(--db-text-primary)] mb-1 tracking-wide">{item.title}</h4>
                  <p className="text-[10px] font-mono text-[var(--db-accent)] flex items-center gap-1">
                    <HelpCircle className="h-3.5 w-3.5" /> Click to reveal details
                  </p>
                </div>
              </div>

              {/* Back side */}
              <div 
                className="absolute inset-0 backface-hidden rounded-2xl p-6 border border-[var(--db-accent-mid)] bg-[var(--db-surface-2)] flex flex-col justify-center rotate-y-180 shadow-md"
              >
                <h4 className="text-sm font-bold text-[var(--db-accent)] mb-2 font-mono uppercase tracking-wider">{item.title}</h4>
                <p className="text-xs text-[var(--db-text-secondary)] leading-relaxed font-sans font-medium">
                  {item.content}
                </p>
              </div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
