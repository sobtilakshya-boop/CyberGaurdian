'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoGridProps {
  videoUrl: string;
  title?: string;
  onComplete: () => void;
}

export function VideoGrid({ videoUrl, title, onComplete }: VideoGridProps) {
  const [watched, setWatched] = useState(false);

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}

      <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 mb-6 relative group">
        <iframe
          width="100%"
          height="100%"
          src={videoUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onPlay={() => setWatched(true)}
        />
      </div>

      <p className="text-slate-300 mb-4">Watch the video above to learn about this topic.</p>

      <button
        onClick={() => {
          onComplete();
        }}
        disabled={!watched}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {watched ? '✓ Watched' : '▶ Watch Video'} & Continue
      </button>
    </div>
  );
}
