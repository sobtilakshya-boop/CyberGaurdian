"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, RefreshCw, Globe, ExternalLink } from 'lucide-react'
import { chapters } from '@/data/courseData'

interface NewsItem {
  headline: string
  summary: string
  source: string
  date: string
  imageUrl: string
  link?: string
  category: string
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [liveNews, setLiveNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const extractImage = (item: any) => {
    if (item.thumbnail && !item.thumbnail.includes('feedburner')) return item.thumbnail
    if (item.enclosure?.link) return item.enclosure.link
    const imgRegex = /<img[^>]+src="([^">]+)"/
    const match = item.description?.match(imgRegex)
    if (match && match[1]) return match[1]
    return "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
  }

  const fetchLiveNews = async () => {
    setIsRefreshing(true)
    try {
      const sources = [
        { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', cat: 'Vulnerabilities' },
        { name: 'BleepingComputer', url: 'https://www.bleepingcomputer.com/feed/', cat: 'Cyber Crime' },
        { name: 'SecurityWeek', url: 'https://www.securityweek.com/feed/', cat: 'Threat Intel' }
      ]

      const fetchPromises = sources.map(source =>
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`)
          .then(res => res.json())
          .then(data => {
            if (!data.items) return []
            return data.items.map((item: any) => ({
              headline: item.title,
              summary: item.description.replace(/<[^>]+>/g, '').substring(0, 180) + '...',
              source: source.name,
              date: item.pubDate,
              imageUrl: extractImage(item),
              link: item.link,
              category: source.cat
            }))
          })
          .catch(err => {
            console.error(`Error fetching from ${source.name}:`, err)
            return []
          })
      )

      const results = await Promise.all(fetchPromises)
      const mergedNews = results.flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setLiveNews(mergedNews)
    } catch (error) {
      console.error("Failed to compile live news feeds:", error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchLiveNews()
  }, [])

  // Static course advisories translated into NewsItem format
  const staticNews: NewsItem[] = chapters.flatMap(chapter => 
    chapter.newsTips.map(tip => ({
      headline: tip.headline,
      summary: tip.summary,
      source: tip.source,
      date: new Date().toISOString(), // Mock current ingestion date
      imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600",
      category: 'Course Advisory'
    }))
  )

  const allNews = [...liveNews, ...staticNews]

  const filteredNews = allNews.filter(item => {
    const query = searchQuery.toLowerCase()
    return (
      item.headline.toLowerCase().includes(query) ||
      item.summary.toLowerCase().includes(query) ||
      item.source.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    )
  })

  const formatNewsDate = (dateString: string) => {
    try {
      const d = new Date(dateString)
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 md:px-8 py-6 font-sans">
      {/* Dynamic Header */}
      <div 
        className="relative rounded-3xl overflow-hidden p-8 md:p-12 border border-slate-700/50"
        style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)', backdropFilter: 'blur(20px)' }}
      >
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-3 max-w-3xl">
            <div className="flex items-center gap-3 text-cyan-400">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <Globe className="h-5 w-5" />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase">Live Threat Intelligence</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mt-1">
              Global Cyber Security Feed
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-slate-300 font-medium">
              Real-time ingestion of advisories, CVE briefs, and breach telemetries synchronized across primary digital security publications.
            </p>
          </div>

          <button
            onClick={fetchLiveNews}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer self-start md:self-center"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Sync News'}
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--db-text-muted)]" />
        <input
          type="text"
          placeholder="Filter live reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-[var(--db-border-strong)] bg-[var(--db-surface)] py-3.5 pl-12 pr-4 text-sm text-[var(--db-text-primary)] outline-none transition-all placeholder:text-[var(--db-text-muted)] focus:border-[var(--db-accent)] focus:bg-[var(--db-surface)] shadow-sm"
        />
      </div>

      {/* News Feed Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-mono text-cyan-400 tracking-widest uppercase">Connecting to security feeds...</span>
            </div>
          ) : filteredNews.length > 0 ? (
            filteredNews.map((item, idx) => (
              <motion.div
                key={`${item.source}-${idx}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                className="flex flex-col rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] hover:border-[var(--db-border-strong)] transition-all duration-300 overflow-hidden group hover:shadow-md"
              >
                {/* News Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden shrink-0 border-b border-[var(--db-border)]">
                  <img
                    src={item.imageUrl}
                    alt={item.headline}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
                    }}
                  />
                  <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border border-[var(--db-border)] bg-[var(--db-surface)]/90 text-[var(--db-accent)] uppercase">
                    {item.category}
                  </span>
                </div>

                {/* News Content */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--db-text-muted)]">
                      <span className="font-bold text-[var(--db-text-secondary)]">{item.source}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatNewsDate(item.date)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[var(--db-text-primary)] leading-snug group-hover:text-[var(--db-accent)] transition-colors">
                      {item.headline}
                    </h3>

                    <p className="text-xs text-[var(--db-text-secondary)] leading-relaxed font-medium mt-1">
                      {item.summary}
                    </p>
                  </div>

                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[var(--db-accent)] hover:underline transition-colors self-start mt-2 group/link"
                    >
                      Read Full Article
                      <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-3xl text-slate-500 font-mono text-sm">
              No matching threat reports found. Try modifying your filter request.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
