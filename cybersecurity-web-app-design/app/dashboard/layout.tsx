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
      <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar user={session} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Topbar user={session} />
          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProgressProvider>
  )
}
