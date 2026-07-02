import CyberHygieneSection from '@/components/dashboard/cyber-hygiene-section'

export default function HygienePage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header Container */}
      <div className="flex flex-col gap-1.5 pb-6 border-b border-[var(--db-border-strong)]">
        <div className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 h-1.5 w-24 rounded-full mb-2" />
        <span className="font-mono text-[10px] text-[var(--db-accent)] uppercase tracking-widest font-bold">
          Interactive Security Standards
        </span>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--db-text-primary)] uppercase">
          Cyber Hygiene Reference
        </h1>
        <p className="text-xs text-[var(--db-text-secondary)] font-mono max-w-3xl leading-relaxed">
          Explore structured security frameworks, risk catalogs, and device compliance checklists to harden your digital posture.
        </p>
      </div>

      <CyberHygieneSection />
    </div>
  )
}
