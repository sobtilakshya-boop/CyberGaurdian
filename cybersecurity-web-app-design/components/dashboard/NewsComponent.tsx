'use client';

import { useState } from 'react';
import { NewsItem } from '@/lib/courseData';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface NewsComponentProps {
  title?: string;
  newsItems: NewsItem[];
  onComplete: () => void;
}

export function NewsComponent({ title, newsItems, onComplete }: NewsComponentProps) {
  const [read, setRead] = useState<Set<number>>(new Set());

  const allRead = read.size === newsItems.length;

  const handleMarkRead = (index: number) => {
    const newRead = new Set(read);
    newRead.add(index);
    setRead(newRead);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-900/20 border-red-700 text-red-400';
      case 'high':
        return 'bg-orange-900/20 border-orange-700 text-orange-400';
      case 'medium':
        return 'bg-yellow-900/20 border-yellow-700 text-yellow-400';
      case 'low':
        return 'bg-green-900/20 border-green-700 text-green-400';
      default:
        return 'bg-slate-700 border-slate-600 text-slate-400';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'high':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div>
      {title && <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>}

      <p className="text-slate-300 mb-6">Stay updated with the latest cyber threats and security news:</p>

      <div className="space-y-4 mb-6">
        {newsItems.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-4 border-2 transition-all cursor-pointer ${
              read.has(idx)
                ? `${getSeverityColor(item.severity)}/50`
                : getSeverityColor(item.severity)
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">{getSeverityIcon(item.severity)}</div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                      item.severity === 'critical'
                        ? 'bg-red-600 text-white'
                        : item.severity === 'high'
                          ? 'bg-orange-600 text-white'
                          : item.severity === 'medium'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-green-600 text-white'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>

                <p className="text-sm mb-3 opacity-80">{item.summary}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs opacity-60">{new Date(item.date).toLocaleDateString()}</span>

                  {!read.has(idx) && (
                    <button
                      onClick={() => handleMarkRead(idx)}
                      className="text-xs px-2 py-1 rounded bg-current/20 hover:bg-current/30 transition-colors font-semibold"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        disabled={!allRead}
        className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {allRead ? '✓ All News Read' : `Read ${read.size}/${newsItems.length} News Items`}
      </button>
    </div>
  );
}
