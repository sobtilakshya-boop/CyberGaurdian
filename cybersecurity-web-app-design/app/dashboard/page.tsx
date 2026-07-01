import { getSession } from '@/lib/session'
import DashboardHomeContent from '@/components/dashboard/dashboard-home-content'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return <DashboardHomeContent user={session} />
}
