'use client';

import Link from 'next/link';
import { Chapter } from '@/lib/courseData';
import { useGamification } from '@/contexts/GamificationContext';
import { ProgressRing } from './ProgressRing';
import { Lock } from 'lucide-react';

interface ChapterCardProps {
  chapter: Chapter;
  isCompleted: boolean;
}

export function ChapterCard({ chapter, isCompleted }: ChapterCardProps) {
  const { isChapterUnlocked } = useGamification();
  const isUnlocked = isChapterUnlocked(chapter.id);
  const completionPercentage = isCompleted ? 100 : 0;

  return (
    <div
      className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
        isUnlocked ? 'hover:shadow-lg cursor-pointer' : 'opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 border border-slate-700 h-full">
        {!isUnlocked && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Complete Chapter {chapter.order - 1} to unlock</p>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📚</span>
              <span className="text-xs font-semibold text-blue-400 uppercase">Chapter {chapter.order}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{chapter.title}</h3>
            <p className="text-sm text-slate-300 line-clamp-2">{chapter.description}</p>
          </div>

          <div className="ml-4">
            <ProgressRing percentage={completionPercentage} size={70} color="#3b82f6" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-700 mt-4">
          <div className="flex gap-4 text-xs text-slate-400">
            <span>⏱️ {chapter.estimatedTime} min</span>
            <span>⭐ {chapter.completionXp} XP</span>
          </div>

          {isUnlocked && (
            <Link
              href={`/dashboard/courses/cyber-hygiene/chapter-${chapter.id}`}
              className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Start
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
