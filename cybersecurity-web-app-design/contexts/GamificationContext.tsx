'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  chaptersCompleted: Set<string>;
  unlockedBadges: Badge[];
  totalTime: number;
}

interface GamificationContextType {
  state: GamificationState;
  addXp: (amount: number) => void;
  completeChapter: (chapterId: string) => void;
  isChapterUnlocked: (chapterId: string) => boolean;
  addBadge: (badge: Badge) => void;
  updateStreak: () => void;
  totalXpThisSession: number;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = 'cyberguardian_gamification';
const XP_PER_LEVEL = 500;
const MAX_LEVEL = 20;

const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-chapter',
    name: 'Chapter Starter',
    description: 'Complete your first chapter',
    icon: '🎓',
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Score 100% on 3 quizzes',
    icon: '🏆',
  },
  {
    id: 'streak-warrior',
    name: 'Streak Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
  },
  {
    id: 'security-expert',
    name: 'Security Expert',
    description: 'Complete all 9 chapters',
    icon: '🛡️',
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete 3 chapters in one day',
    icon: '⚡',
  },
];

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GamificationState>({
    xp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    chaptersCompleted: new Set(),
    unlockedBadges: [],
    totalTime: 0,
  });

  const [totalXpThisSession, setTotalXpThisSession] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          xp: parsed.xp || 0,
          level: parsed.level || 1,
          currentStreak: parsed.currentStreak || 0,
          longestStreak: parsed.longestStreak || 0,
          chaptersCompleted: new Set(parsed.chaptersCompleted || []),
          unlockedBadges: parsed.unlockedBadges || [],
          totalTime: parsed.totalTime || 0,
        }));
      } catch (e) {
        console.error('[v0] Failed to load gamification state:', e);
      }
    }
    setMounted(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (mounted) {
      const toSave = {
        xp: state.xp,
        level: state.level,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        chaptersCompleted: Array.from(state.chaptersCompleted),
        unlockedBadges: state.unlockedBadges,
        totalTime: state.totalTime,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  }, [state, mounted]);

  const calculateLevel = (xp: number) => {
    return Math.min(Math.floor(xp / XP_PER_LEVEL) + 1, MAX_LEVEL);
  };

  const addXp = (amount: number) => {
    setState((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
    });
    setTotalXpThisSession((prev) => prev + amount);
  };

  const completeChapter = (chapterId: string) => {
    setState((prev) => {
      const newCompleted = new Set(prev.chaptersCompleted);
      newCompleted.add(chapterId);
      return {
        ...prev,
        chaptersCompleted: newCompleted,
      };
    });
  };

  const isChapterUnlocked = (chapterId: string) => {
    // Chapter 1 is always unlocked
    if (chapterId === '1') return true;

    // Other chapters unlock when previous chapter is 100% complete
    const chapterNum = parseInt(chapterId);
    const previousChapterId = String(chapterNum - 1);

    return state.chaptersCompleted.has(previousChapterId);
  };

  const addBadge = (badge: Badge) => {
    setState((prev) => {
      // Check if badge already exists
      if (prev.unlockedBadges.some((b) => b.id === badge.id)) {
        return prev;
      }

      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, { ...badge, unlockedAt: new Date().toISOString() }],
      };
    });
  };

  const updateStreak = () => {
    setState((prev) => {
      const newStreak = prev.currentStreak + 1;
      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
      };
    });
  };

  return (
    <GamificationContext.Provider
      value={{
        state,
        addXp,
        completeChapter,
        isChapterUnlocked,
        addBadge,
        updateStreak,
        totalXpThisSession,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
}
