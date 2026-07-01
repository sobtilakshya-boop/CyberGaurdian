"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, BookOpen } from 'lucide-react'
import type { VideoItem } from '@/data/courseData'

interface VideoGridProps {
  videos: VideoItem[]
  onAllWatched?: () => void
}

const levelColors: Record<VideoItem['level'], string> = {
  Beginner:  'bg-green-500/15 border-green-500/25 text-green-400',
  Expert:    'bg-red-500/15 border-red-500/25 text-red-400',
  Practical: 'bg-blue-500/15 border-blue-500/25 text-blue-400',
}

export default function VideoGrid({ videos, onAllWatched }: VideoGridProps) {
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set())
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)

  const levels: VideoItem['level'][] = ['Beginner', 'Expert', 'Practical']

  function handleWatch(video: VideoItem) {
    setActiveVideo(video)
    const newWatched = new Set(watchedIds).add(video.id)
    setWatchedIds(newWatched)
    if (newWatched.size >= videos.length && onAllWatched) {
      onAllWatched()
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Active player */}
      {activeVideo && (
        <motion.div
          key={activeVideo.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900"
        >
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-full border font-mono text-[10px] font-semibold uppercase tracking-wider ${levelColors[activeVideo.level]}`}>
                {activeVideo.level}
              </span>
              <span className="font-mono text-sm text-white font-semibold">{activeVideo.title}</span>
              <span className="font-mono text-xs text-slate-500 ml-auto">{activeVideo.duration}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Video list by level */}
      {levels.map(level => {
        const levelVideos = videos.filter(v => v.level === level)
        if (levelVideos.length === 0) return null
        return (
          <div key={level}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full border font-mono text-xs font-semibold uppercase tracking-wider ${levelColors[level]}`}>
                {level}
              </span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {levelVideos.map((video, i) => {
                const isWatched = watchedIds.has(video.id)
                const isActive = activeVideo?.id === video.id
                return (
                  <motion.button
                    key={video.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => handleWatch(video)}
                    className={`group flex items-center gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-cyan-500/40 bg-cyan-500/8'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    {/* Thumbnail placeholder with play button */}
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-800 shrink-0 flex items-center justify-center">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                      <div className={`relative z-10 p-1.5 rounded-full ${isWatched ? 'bg-green-500/80' : 'bg-slate-900/80 group-hover:bg-cyan-500/80'} transition-colors`}>
                        <Play className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-white font-semibold leading-tight line-clamp-2 mb-1">
                        {video.title}
                      </p>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
                        <span>{video.duration}</span>
                        {isWatched && <span className="text-green-400">✓ Watched</span>}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Progress indicator */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-800/60 bg-slate-900/30">
        <BookOpen className="h-4 w-4 text-cyan-400 shrink-0" />
        <p className="font-mono text-xs text-slate-400">
          {watchedIds.size} of {videos.length} videos watched.
          {watchedIds.size < videos.length ? ' Watch all videos to earn XP.' : ' All watched — XP earned! ⚡'}
        </p>
      </div>
    </div>
  )
}
