'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface UnlockNotificationProps {
  isVisible: boolean;
  title: string;
  icon: string;
  xpReward: number;
  onClose?: () => void;
}

export function UnlockNotification({
  isVisible,
  title,
  icon,
  xpReward,
  onClose,
}: UnlockNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onClose?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && showConfetti && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white min-w-80">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">{icon}</div>
              <div>
                <h3 className="text-xl font-bold">Chapter Unlocked!</h3>
                <p className="text-blue-100">{title}</p>
              </div>
            </div>

            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-sm font-semibold">+{xpReward} XP</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
