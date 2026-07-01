import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import Sidebar from '@/components/dashboard/sidebar'
import Topbar from '@/components/dashboard/topbar'
import { ProgressProvider } from '@/lib/progress-context'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <ProgressProvider userId={session.userId}>
      {/* Scoped light theme — wraps ONLY the dashboard */}
      <div data-theme="dashboard" className="flex min-h-screen overflow-hidden" style={{ background: 'var(--db-bg)', color: 'var(--db-text-primary)' }}>

        {/* Animated gradient mesh background */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Primary cyan orb */}
          <div
            className="db-mesh-a absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)' }}
          />
          {/* Secondary violet orb */}
          <div
            className="db-mesh-b absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }}
          />
          {/* Tertiary green orb */}
          <div
            className="db-mesh-c absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)' }}
          />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(14,165,233,0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(14,165,233,0.8) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Sidebar Navigation */}
        <Sidebar user={session} />

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar user={session} />
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProgressProvider>
  )
}
