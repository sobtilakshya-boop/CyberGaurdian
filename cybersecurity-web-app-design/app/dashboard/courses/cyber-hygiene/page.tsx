'use client';

import { useGamification } from '@/contexts/GamificationContext';
import { ChapterCard } from '@/components/dashboard/ChapterCard';
import { cyberHygieneChapters } from '@/lib/courseData';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CyberHygienePage() {
  const { state } = useGamification();

  const totalChapters = cyberHygieneChapters.length;
  const completedChapters = state.chaptersCompleted.size;
  const completionPercentage = (completedChapters / totalChapters) * 100;
  const totalXpPossible = cyberHygieneChapters.reduce((sum, ch) => sum + ch.completionXp, 0);
  const completedXp = cyberHygieneChapters
    .filter((ch) => state.chaptersCompleted.has(ch.id))
    .reduce((sum, ch) => sum + ch.completionXp, 0);

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/courses" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to Courses</span>
          </Link>

          <h1 className="text-4xl font-bold text-white mb-4">Cyber Hygiene Fundamentals</h1>
          <p className="text-slate-300 text-lg mb-6">
            Master essential cybersecurity practices through 9 comprehensive chapters covering everything from password security to building lasting security habits.
          </p>

          {/* Progress Bar */}
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Overall Progress</p>
                  <p className="text-2xl font-bold text-white">{completedChapters} of 9 chapters completed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 mb-1">Course XP</p>
                <p className="text-2xl font-bold text-blue-400">
                  {completedXp} / {totalXpPossible} XP
                </p>
              </div>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 mt-3">{Math.round(completionPercentage)}% complete</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Current Level</p>
              <p className="text-3xl font-bold text-blue-400">{state.level}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Current Streak</p>
              <p className="text-3xl font-bold text-orange-400">🔥 {state.currentStreak}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Total XP</p>
              <p className="text-3xl font-bold text-purple-400">{state.xp}</p>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Course Chapters</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cyberHygieneChapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                isCompleted={state.chaptersCompleted.has(chapter.id)}
              />
            ))}
          </div>
        </div>

        {/* Completion Message */}
        {completedChapters === totalChapters && (
          <div className="mt-12 bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl p-8 border border-green-700 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-3xl font-bold text-white mb-2">Course Complete!</h3>
            <p className="text-green-100 mb-6">
              Congratulations! You&apos;ve mastered the Cyber Hygiene Fundamentals. You&apos;ve earned {completedXp} XP and become a security expert!
            </p>
            <p className="text-sm text-green-200">Check back soon for more advanced courses.</p>
          </div>
        )}
      </div>
    </div>
  );
}
