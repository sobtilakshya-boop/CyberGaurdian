import { getSession } from '@/lib/session'
import { User, ShieldAlert, Calendar, ShieldCheck, Mail, Phone } from 'lucide-react'
import ProfileLogoutButton from './logout-button'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const session = await getSession()

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto px-4 md:px-8 py-6 font-sans">
      {/* Page Header */}
      <div className="border-b border-[var(--db-border)] pb-5">
        <h2 className="text-2xl font-black text-[var(--db-text-primary)] tracking-tight">
          Operator Profile
        </h2>
        <p className="text-xs text-[var(--db-text-muted)] mt-1 font-medium">
          Review your security clearances and database operator credentials.
        </p>
      </div>

      {/* Profile Card Container */}
      <div className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] p-6 shadow-sm flex flex-col gap-6">
        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-[var(--db-border)]">
          <div className="h-16 w-16 rounded-2xl bg-[var(--db-accent-light)] border border-[var(--db-accent-mid)] flex items-center justify-center text-[var(--db-accent)] font-sans text-2xl font-bold select-none shadow-sm">
            {session?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() ?? 'OP'}
          </div>
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-[var(--db-text-primary)] leading-tight">
              {session?.name ?? 'Secure Operator'}
            </h3>
            <span className="text-xs text-[var(--db-accent)] mt-1 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="h-4 w-4" />
              Clearance Status: LEVEL 1 (Operator)
            </span>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-2)]/50">
            <span className="text-[var(--db-text-muted)] uppercase tracking-wider text-[10px] font-bold">Email Address</span>
            <div className="flex items-center gap-2.5 text-[var(--db-text-primary)] font-medium">
              <Mail className="h-4 w-4 text-[var(--db-accent)]" />
              <span>{session?.email ?? 'N/A'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-2)]/50">
            <span className="text-[var(--db-text-muted)] uppercase tracking-wider text-[10px] font-bold">Verified Mobile</span>
            <div className="flex items-center gap-2.5 text-[var(--db-text-primary)] font-medium">
              <Phone className="h-4 w-4 text-[var(--db-accent)]" />
              <span>{session?.phone ?? 'N/A'}</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-2)]/50">
            <span className="text-[var(--db-text-muted)] uppercase tracking-wider text-[10px] font-bold">Operator Key ID</span>
            <div className="flex items-center gap-2.5 text-[var(--db-text-secondary)] font-mono text-xs select-all truncate">
              {session?.userId ?? 'N/A'}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-[var(--db-border)] bg-[var(--db-surface-2)]/50">
            <span className="text-[var(--db-text-muted)] uppercase tracking-wider text-[10px] font-bold">Session Mode</span>
            <div className="flex items-center gap-2.5 text-[var(--db-text-primary)] font-medium">
              <Calendar className="h-4 w-4 text-[var(--db-accent)]" />
              <span>Stateless JWT Session</span>
            </div>
          </div>
        </div>

        {/* Security Warning */}
        <div className="mt-2 p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-amber-800">Identity Security Advisory</span>
            <p className="text-xs text-slate-650 leading-relaxed font-medium">
              Your security session is cryptographically signed and stored in a secure HttpOnly cookie. To prevent memory exposure, log out immediately when leaving the platform console.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <ProfileLogoutButton />
      </div>
    </div>
  )
}
