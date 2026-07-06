import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { sectors } from '@/data/sectorsData'
import SectorInteractiveLayout from '@/components/dashboard/sector-interactive-layout'

// Generate static params so these pages can be statically rendered if desired
export async function generateStaticParams() {
  return sectors.map((sector) => ({
    sectorId: sector.id,
  }))
}

// Dynamic metadata based on the sector
export async function generateMetadata({ params }: { params: Promise<{ sectorId: string }> }): Promise<Metadata> {
  const p = await params
  const sector = sectors.find(s => s.id === p.sectorId)
  
  if (!sector) {
    return {
      title: 'Sector Not Found | CyberGuardian',
    }
  }

  return {
    title: `${sector.title} Cyber Hygiene | CyberGuardian`,
    description: sector.shortDesc,
  }
}

// Note: Using Promise for params as required by Next.js 15+ App Router
export default async function SectorDetailPage({ params }: { params: Promise<{ sectorId: string }> }) {
  const p = await params
  const sector = sectors.find(s => s.id === p.sectorId)

  if (!sector) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* 
        This Server Component handles routing and data fetching.
        It passes the data to the Client Component which handles all the interactive Framer Motion UI/UX.
      */}
      <SectorInteractiveLayout sector={sector} />
    </div>
  )
}
