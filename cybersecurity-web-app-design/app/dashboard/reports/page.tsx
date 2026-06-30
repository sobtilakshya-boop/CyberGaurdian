import { BarChart3 } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
          Security & Compliance Reports
        </h2>
        <p className="text-xs font-mono text-slate-500">
          Historical log analysis and incident audits.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[350px] rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 backdrop-blur-xl text-center">
        <div className="p-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 animate-pulse">
          <BarChart3 className="h-8 w-8" />
        </div>
        <h3 className="font-mono text-base font-bold text-white mb-2 uppercase tracking-wide">
          Generating Analytics Reports
        </h3>
        <p className="max-w-md font-mono text-xs text-slate-500 leading-relaxed">
          Aggregating telemetry logs, active-host integrity status reports, and access logs from the secure PostgreSQL instance.
        </p>
      </div>
    </div>
  )
}
