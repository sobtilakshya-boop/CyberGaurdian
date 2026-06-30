import { getSession } from '@/lib/session'
import { User, ShieldAlert, Calendar, ShieldCheck, Mail, Phone } from 'lucide-react'
import ProfileLogoutButton from './logout-button'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getSession()

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
          User Profile
        </h2>
        <p className="text-xs font-mono text-slate-500">
          Your security clearances and credential details.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-md flex flex-col gap-6">
        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-850">
          <div className="h-16 w-16 rounded-2xl border-2 border-cyan-500/20 bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-mono text-2xl font-bold select-none shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            {session?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? 'U'}
          </div>
          <div className="flex flex-col">
            <h3 className="font-mono text-lg font-bold text-white leading-tight">{session?.name ?? 'Secure Operator'}</h3>
            <span className="text-xs font-mono text-cyan-500 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Security Clearance: LEVEL 1
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-800/50 bg-slate-900/10">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Email Address</span>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Mail className="h-4 w-4 text-cyan-500/80" />
              <span>{session?.email ?? 'N/A'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-800/50 bg-slate-900/10">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Verified Mobile</span>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Phone className="h-4 w-4 text-cyan-500/80" />
              <span>{session?.phone ?? 'N/A'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-800/50 bg-slate-900/10">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Operator Key ID</span>
            <div className="flex items-center gap-2.5 text-slate-300 select-all font-mono text-[11px] truncate">
              {session?.userId ?? 'N/A'}
            </div>
          </div>

          <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-800/50 bg-slate-900/10">
            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Key Type</span>
            <div className="flex items-center gap-2.5 text-slate-200">
              <Calendar className="h-4 w-4 text-cyan-500/80" />
              <span>Stateless JWT Session</span>
            </div>
          </div>
        </div>

        {/* Warning Indicator */}
        <div className="mt-2 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs font-bold text-amber-300">Identity Security Advisory</span>
            <p className="font-mono text-[11px] text-slate-500 leading-relaxed">
              Your security clearance session is cryptographically signed and stored in a secure HTTP-Only client cookie. Log out immediately when leaving this workspace console to clear active memory.
            </p>
          </div>
        </div>

        {/* Client-side Logout Button */}
        <ProfileLogoutButton />
      </div>
    </div>
  )
}
