'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ComicReaderProps {
  imageSrc: string;
  title?: string;
  onComplete: () => void;
}

export function ComicReader({ imageSrc, title, onComplete }: ComicReaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}

      <div className="bg-slate-700 rounded-lg overflow-hidden mb-6 min-h-96 flex items-center justify-center">
        {imageSrc ? (
          <div className="relative w-full h-96">
            <Image
              src={imageSrc}
              alt={title || 'Comic'}
              fill
              className="object-contain"
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        ) : (
          <div className="text-slate-400 text-center py-12">
            <p className="text-lg font-semibold mb-2">📚 Educational Comic</p>
            <p className="text-sm">A visual story to help you learn important concepts</p>
          </div>
        )}
      </div>

      <p className="text-slate-300 mb-4">Study the comic above to understand the security concept presented.</p>

      <button
        onClick={onComplete}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
      >
        ✓ Continue
      </button>
    </div>
  );
}
