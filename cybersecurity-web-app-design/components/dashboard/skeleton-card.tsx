"use client"

export default function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-md">
      {/* Shimmer overlay */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-800/20 to-transparent animate-shimmer"
      />
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.8s infinite;
        }
      `}</style>

      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="h-4 w-28 bg-slate-800 rounded-md" />
        <div className="h-9 w-9 bg-slate-800 rounded-xl" />
      </div>

      <div className="h-8 w-20 bg-slate-800 rounded-md mb-2.5" />
      <div className="h-3.5 w-36 bg-slate-850 rounded-md" />
    </div>
  )
}
