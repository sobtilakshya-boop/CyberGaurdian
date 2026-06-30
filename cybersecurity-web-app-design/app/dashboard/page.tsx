import { getSession } from '@/lib/session'
import StatCard from '@/components/dashboard/stat-card'
import CyberHygieneSection from '@/components/dashboard/cyber-hygiene-section'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getSession()
  const userName = session?.name ?? 'SecOps Operator'

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
            Welcome back, <span className="text-cyan-400">{userName}</span>
          </h2>
          <p className="text-xs font-mono text-slate-500">
            System Status: Nominal | All endpoints reporting security telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0 font-mono text-[10px] uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Security Clearance Level 1 Verified</span>
        </div>
      </div>

      {/* Statistics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Security Score"
          value={98}
          suffix="%"
          subtext="Integrity score of system devices"
          iconType="shield"
        />
        <StatCard
          title="Verified Users"
          value={398}
          subtext="Total authenticated operators"
          iconType="users"
        />
        <StatCard
          title="Active Threat Vectors"
          value={0}
          subtext="Threat intrusions identified"
          iconType="alert"
          colorClass="text-green-400 border-green-500/20"
        />
        <StatCard
          title="System Logs Parsed"
          value={1249}
          subtext="Real-time security logs processed"
          iconType="activity"
        />
      </div>

      {/* Cyber Hygiene Module Section */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-md">
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">
            Cyber Academy: Cyber Hygiene Core
          </h3>
          <p className="text-xs font-mono text-slate-500">
            Explore interactive educational resources to implement zero-trust guidelines and digital environment hygiene.
          </p>
        </div>

        <CyberHygieneSection />
      </div>
    </div>
  )
}
