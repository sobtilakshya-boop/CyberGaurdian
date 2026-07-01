'use client';

import { useState } from 'react';
import { Chapter, ContentBlock } from '@/lib/courseData';
import { useGamification } from '@/contexts/GamificationContext';
import { UnlockNotification } from './UnlockNotification';
import { QuizComponent } from './QuizComponent';
import { VideoGrid } from './VideoGrid';
import { ComicReader } from './ComicReader';
import { ActivityComponent } from './ActivityComponent';
import { PuzzleGrid } from './PuzzleGrid';
import { NewsComponent } from './NewsComponent';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface ChapterViewProps {
  chapter: Chapter;
}

export function ChapterView({ chapter }: ChapterViewProps) {
  const { state, completeChapter, addXp, addBadge } = useGamification();
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [showUnlock, setShowUnlock] = useState(false);
  const [nextChapterTitle, setNextChapterTitle] = useState('');
  const [completedContent, setCompletedContent] = useState<Set<number>>(new Set());

  const isCompleted = state.chaptersCompleted.has(chapter.id);
  const currentBlock = chapter.content[currentBlockIndex];
  const isLastBlock = currentBlockIndex === chapter.content.length - 1;
  const allContentCompleted = completedContent.size === chapter.content.length;

  const handleCompleteBlock = () => {
    const newCompleted = new Set(completedContent);
    newCompleted.add(currentBlockIndex);
    setCompletedContent(newCompleted);

    if (newCompleted.size === chapter.content.length) {
      // All content completed
      completeChapter(chapter.id);
      addXp(chapter.completionXp);

      // Add achievement badge
      if (chapter.id === '1') {
        addBadge({
          id: 'first-chapter',
          name: 'Chapter Starter',
          description: 'Complete your first chapter',
          icon: '🎓',
        });
      }

      if (chapter.order < chapter.order + 1) {
        setNextChapterTitle(`Chapter ${chapter.order + 1}`);
        setShowUnlock(true);
      }
    }
  };

  const handleNext = () => {
    if (!isLastBlock) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex(currentBlockIndex - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <UnlockNotification
        isVisible={showUnlock}
        title={nextChapterTitle}
        icon="🎉"
        xpReward={chapter.completionXp}
        onClose={() => setShowUnlock(false)}
      />

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard/courses/cyber-hygiene" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to Course</span>
          </Link>

          {isCompleted && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Completed</span>
            </div>
          )}
        </div>

        {/* Chapter Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📚</span>
            <div>
              <p className="text-sm text-blue-400 font-semibold uppercase">Chapter {chapter.order}</p>
              <h1 className="text-3xl font-bold text-white">{chapter.title}</h1>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${((currentBlockIndex + 1) / chapter.content.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-300">
              {currentBlockIndex + 1} / {chapter.content.length}
            </span>
          </div>

          {/* Estimated Time & XP */}
          <div className="flex gap-4 text-sm text-slate-400">
            <span>⏱️ {chapter.estimatedTime} min</span>
            <span>⭐ {chapter.completionXp} XP</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 mb-8">
          {currentBlock && (
            <ContentRenderer
              block={currentBlock}
              onComplete={handleCompleteBlock}
              isCompleted={completedContent.has(currentBlockIndex)}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentBlockIndex === 0}
            className="px-6 py-2 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <div className="text-sm text-slate-400">
            {currentBlockIndex + 1} of {chapter.content.length}
          </div>

          {!isLastBlock ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              Next →
            </button>
          ) : allContentCompleted ? (
            <Link
              href="/dashboard/courses/cyber-hygiene"
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Back to Course
            </Link>
          ) : (
            <button
              onClick={handleCompleteBlock}
              className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              Complete Chapter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ContentRendererProps {
  block: ContentBlock;
  onComplete: () => void;
  isCompleted: boolean;
}

function ContentRenderer({ block, onComplete, isCompleted }: ContentRendererProps) {
  switch (block.type) {
    case 'text':
      return (
        <div>
          {block.title && <h2 className="text-2xl font-bold text-white mb-4">{block.title}</h2>}
          <div className="prose prose-invert max-w-none mb-6">
            <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{block.content}</p>
          </div>
          <button
            onClick={onComplete}
            disabled={isCompleted}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-green-600 disabled:cursor-default transition-colors"
          >
            {isCompleted ? '✓ Completed' : 'Mark as Read'}
          </button>
        </div>
      );

    case 'video':
      return <VideoGrid videoUrl={block.videoUrl || ''} title={block.title} onComplete={onComplete} />;

    case 'comic':
      return <ComicReader imageSrc={block.imageSrc || ''} title={block.title} onComplete={onComplete} />;

    case 'quiz':
      return (
        <QuizComponent
          title={block.title}
          questions={block.questions || []}
          onComplete={onComplete}
          isCompleted={isCompleted}
        />
      );

    case 'activity':
      return <ActivityComponent title={block.title} items={block.items || []} onComplete={onComplete} />;

    case 'puzzle':
      return <PuzzleGrid title={block.title} items={block.items || []} onComplete={onComplete} />;

    case 'news':
      return <NewsComponent title={block.title} newsItems={block.newsItems || []} onComplete={onComplete} />;

    default:
      return <div>Unknown content type</div>;
  }
}
