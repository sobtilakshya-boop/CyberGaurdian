'use client';

import { cyberHygieneChapters } from '@/lib/courseData';
import { ChapterView } from '@/components/dashboard/ChapterView';
import { useGamification } from '@/contexts/GamificationContext';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ChapterPage() {
  const params = useParams();
  const { isChapterUnlocked } = useGamification();

  // Extract chapter ID from the dynamic route
  const chapterId = typeof params.chapterId === 'string' ? params.chapterId.replace('chapter-', '') : '';

  // Find the chapter
  const chapter = cyberHygieneChapters.find((ch) => ch.id === chapterId);

  // Check if chapter is unlocked
  const isUnlocked = isChapterUnlocked(chapterId);

  if (!chapter) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Chapter Not Found</h1>
          <p className="text-slate-400 mb-8">This chapter doesn&apos;t exist. Please check the course page.</p>
          <Link
            href="/dashboard/courses/cyber-hygiene"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Chapter Locked</h1>
          <p className="text-slate-400 mb-2">Complete Chapter {chapter.order - 1} to unlock this chapter.</p>
          <p className="text-slate-500 text-sm mb-8">Keep progressing through the course to access all chapters!</p>
          <Link
            href="/dashboard/courses/cyber-hygiene"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return <ChapterView chapter={chapter} />;
}
