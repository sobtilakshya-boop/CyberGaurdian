import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { LandingWrapper } from '@/components/landing-wrapper'

export default async function Page() {
  const session = await getSession()

  // Authenticated users skip landing and go straight to dashboard
  if (session) {
    redirect('/dashboard')
  }

  return <LandingWrapper />
}
