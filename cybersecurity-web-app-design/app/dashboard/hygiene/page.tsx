import CyberHygieneSection from '@/components/dashboard/cyber-hygiene-section'

export default function HygienePage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1.5 pb-6 border-b border-slate-800">
        <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
          Interactive Security Standards
        </span>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-white uppercase">
          Cyber Hygiene Reference
        </h1>
        <p className="text-xs text-slate-500 font-mono max-w-3xl">
          Explore structured security frameworks, risk catalogs, and device compliance checklists to harden your digital posture.
        </p>
      </div>

      <CyberHygieneSection />
    </div>
  )
}
