"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  Laptop,
  Database,
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  HardDrive,
  FileCheck2,
  Lock,
  Wifi,
  MailWarning,
  Server,
  FileBadge
} from 'lucide-react'

// ─── Accordion Component ──────────────────────────────────────────────────────
function AccordionItem({ 
  title, 
  icon: Icon, 
  children, 
  isOpen, 
  onToggle 
}: { 
  title: string
  icon: any
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void 
}) {
  return (
    <div className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-900/30 backdrop-blur-md mb-3 transition-colors hover:border-cyan-500/20">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 font-mono text-sm font-semibold text-slate-200 hover:text-white cursor-pointer select-none text-left"
      >
        <div className="flex items-center gap-3.5">
          <Icon className="h-4.5 w-4.5 text-cyan-400" />
          <span>{title}</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-1 text-slate-400 font-mono text-xs leading-relaxed border-t border-slate-800/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function CyberHygieneSection() {
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'endpoint' | 'data' | 'culture'>('overview')
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ShieldCheck },
    { id: 'risks', name: 'Risks & Breaches', icon: AlertTriangle },
    { id: 'endpoint', name: 'Endpoint & Network', icon: Laptop },
    { id: 'data', name: 'Data & Integrity', icon: Database },
    { id: 'culture', name: 'Governance & Culture', icon: Users },
  ] as const

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80 scrollbar-none select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setOpenAccordion(null)
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs font-semibold tracking-wide whitespace-nowrap border transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                  : 'bg-slate-900/30 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          )
        })}
      </div>

      {/* Content Render Grid */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6"
          >
            {/* ─── TAB 1: OVERVIEW ─── */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-5">
                  <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    <span className="text-cyan-400">{"// "}</span>Understanding Cyber Hygiene
                  </h2>
                  <p className="text-sm font-mono text-slate-400 leading-relaxed">
                    Just like physical hygiene is critical to health, Cyber Hygiene represents the routine practices, security postures, and proactive behaviors required to maintain endpoint health and digital network integrity. Developing these practices builds a robust shield against system decay, security drift, and unauthorized host intrusion.
                  </p>
                  
                  {/* Key Benefits boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md">
                      <h3 className="font-mono text-sm font-bold text-white mb-2">For Individuals</h3>
                      <p className="font-mono text-xs text-slate-500 leading-relaxed">
                        Protects PII (Personally Identifiable Information), credentials, local files, and personal devices from malware, keystroke logging, and credential stuffing attacks.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md">
                      <h3 className="font-mono text-sm font-bold text-white mb-2">For Organizations</h3>
                      <p className="font-mono text-xs text-slate-500 leading-relaxed">
                        Strengthens defense boundaries, ensures regulatory compliance (GDPR, NIST, ISO), protects proprietary source code, and mitigates enterprise-wide supply chain breaches.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cyber Hygiene Checklist Summary */}
                <div className="p-6 rounded-2xl border border-cyan-500/10 bg-slate-900/40 backdrop-blur-xl flex flex-col gap-4">
                  <h3 className="font-mono text-xs font-bold tracking-widest text-cyan-400 uppercase">
                    THE CYBER SHIELD CORE
                  </h3>
                  <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
                    <div className="flex gap-2.5 items-start">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>Zero-Trust Endpoint Configuration</span>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>Continuous Patch Management</span>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>Cryptographic Integrity Verification</span>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <div className="h-2 w-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>Proactive Forensic Preparedness</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB 2: RISKS ─── */}
            {activeTab === 'risks' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    <span className="text-cyan-400">{"// "}</span>Common Security Vectors & Risks
                  </h2>
                  <p className="text-sm font-mono text-slate-400 leading-relaxed">
                    Understanding adversary methodologies is the first step in digital protection. Threat actors exploit configuration errors, unpatched software vulnerabilities, and user fatigue to compromise systems.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Phishing / Social Engineering */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex flex-col gap-3">
                    <div className="p-2 w-fit rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                      <MailWarning className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white">Social Engineering</h3>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">
                      Phishing campaigns impersonating domain registries, financial institutions, or administrative staff to extract raw credential payload inputs or trigger malware downloads.
                    </p>
                  </div>

                  {/* Weak Credentials */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex flex-col gap-3">
                    <div className="p-2 w-fit rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                      <KeyRound className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white">Weak Credentials</h3>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">
                      Reusing passwords across database consoles or administrative portals, making hosts highly vulnerable to rapid automation scripts like credential stuffing.
                    </p>
                  </div>

                  {/* Software Decay */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex flex-col gap-3">
                    <div className="p-2 w-fit rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="font-mono text-sm font-bold text-white">Software Decay</h3>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">
                      Leaving system software, device kernels, or packages unpatched, allowing adversaries to execute known Zero-Day exploits or privilege escalation scripts.
                    </p>
                  </div>
                </div>

                {/* Password / MFA Deep Dive Accordions */}
                <div className="mt-2">
                  <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
                    DEFENSIVE IMPLEMENTATION CONCEPTS
                  </h3>
                  
                  <AccordionItem
                    title="Entropy & Password Security Architecture"
                    icon={KeyRound}
                    isOpen={openAccordion === 'entropy'}
                    onToggle={() => toggleAccordion('entropy')}
                  >
                    <p className="mb-3">
                      Password entropy measures the unpredictable nature of a secret key or phrase. To defend against automated dictionary and offline brute-force attacks, security schemas must enforce a minimum length of 12 characters combining uppercase, lowercase, digits, and special characters. This exponential growth in combination space increases the mathematical effort required to compute matching hash hashes.
                    </p>
                    <p>
                      <strong>Recommendation:</strong> Use salt values combined with cryptographic hashing algorithms (e.g. SHA-256 or bcrypt) to ensure identical passwords generate unique stored keys, neutralizing pre-computed table attacks.
                    </p>
                  </AccordionItem>

                  <AccordionItem
                    title="Multi-Factor Authentication (MFA) Mechanics"
                    icon={Lock}
                    isOpen={openAccordion === 'mfa'}
                    onToggle={() => toggleAccordion('mfa')}
                  >
                    <p className="mb-3">
                      MFA requires verification across three key factors: knowledge (something you know), possession (something you have), and inherence (something you are). This dashboard implements SMS-based OTP through Twilio Verify, verifying the ownership factor of a mobile SIM before allowing user generation.
                    </p>
                    <p>
                      <strong>Best Practice:</strong> Standardize on FIDO2 hardware tokens (WebAuthn) or TOTP (Time-based One-time Password) apps where possible, as they are cryptographically bound to origin URLs, preventing adversary-in-the-middle phishing intercepts.
                    </p>
                  </AccordionItem>
                </div>
              </div>
            )}

            {/* ─── TAB 3: ENDPOINT ─── */}
            {activeTab === 'endpoint' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    <span className="text-cyan-400">{"// "}</span>Endpoint Security & Network Integrity
                  </h2>
                  <p className="text-sm font-mono text-slate-400 leading-relaxed">
                    Endpoints represent the gateway of any system architecture. Securing devices and network interfaces prevents propagation, intercepts lateral traversal, and maintains clean working states.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Secure Networks */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex gap-4">
                    <div className="p-3.5 h-fit rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                      <Wifi className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-mono text-sm font-bold text-white">Secure Network Controls</h3>
                      <p className="font-mono text-xs text-slate-500 leading-relaxed">
                        Never access system resources over unencrypted open Wi-Fi. Always tunnel traffic through secure VPNs using modern protocols like WireGuard or OpenVPN. Enforce WPA3 network protocols locally.
                      </p>
                    </div>
                  </div>

                  {/* Device Configuration */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex gap-4">
                    <div className="p-3.5 h-fit rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                      <Laptop className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="font-mono text-sm font-bold text-white">Zero-Trust Endpoint Standards</h3>
                      <p className="font-mono text-xs text-slate-500 leading-relaxed">
                        Disable local admin accounts for regular use. Enforce full disk encryption (BitLocker or FileVault) to protect local storage keys. Configure host firewalls to deny inbound requests by default.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Advanced: Forensic Readiness & RAM Acquisition */}
                <div className="mt-2">
                  <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
                    ADVANCED FORENSIC STANCE
                  </h3>

                  <AccordionItem
                    title="Forensic Readiness & Pristine Environments"
                    icon={Fingerprint}
                    isOpen={openAccordion === 'forensics'}
                    onToggle={() => toggleAccordion('forensics')}
                  >
                    <p className="mb-3">
                      Forensic readiness is the organizational capacity to collect, preserve, and analyze digital evidence with minimal disruption. Maintaining a pristine digital environment ensures that if an intrusion occurs, investigators can acquire accurate data from volatile storage (RAM) without contamination.
                    </p>
                    <p className="mb-3">
                      <strong>Volatile Memory (RAM) Acquisition:</strong> When a device is compromised, volatile memory contains active process trees, network sockets, unencrypted storage keys, and temporary commands that disappear if the machine is powered down.
                    </p>
                    <p>
                      <strong>Impact of Poor Hygiene:</strong> A contaminated environment containing unauthorized third-party tools, legacy logs, or unmonitored scripts corrupts the memory image during RAM dump acquisition. Standardizing system configurations keeps the system trace minimal, allowing investigators to quickly isolate suspicious active processes.
                    </p>
                  </AccordionItem>
                </div>
              </div>
            )}

            {/* ─── TAB 4: DATA & INTEGRITY ─── */}
            {activeTab === 'data' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    <span className="text-cyan-400">{"// "}</span>Data Integrity & Resilient Backups
                  </h2>
                  <p className="text-sm font-mono text-slate-400 leading-relaxed">
                    Protecting data requires regular backups, access controls, and mathematical verification schemas. A system is only as secure as its recovery strategy.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Backup Strategies */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex flex-col gap-3">
                    <HardDrive className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-mono text-sm font-bold text-white">The 3-2-1 Backup Framework</h3>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">
                      Maintain at least <strong>3</strong> copies of critical system data, stored across <strong>2</strong> different types of media, with at least <strong>1</strong> copy located off-site or in an immutable cloud repository.
                    </p>
                  </div>

                  {/* Data Privacy */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex flex-col gap-3">
                    <Database className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-mono text-sm font-bold text-white">Database & At-Rest Encryption</h3>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">
                      Encrypt backups using AES-256 standard encryption keys. Enforce Column-Level encryption for highly sensitive fields (e.g. phone, passwords, personal addresses) inside the active PostgreSQL client.
                    </p>
                  </div>
                </div>

                {/* Advanced: Backup Verification & Hashing */}
                <div className="mt-2">
                  <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
                    INTEGRITY VERIFICATION CONCEPTS
                  </h3>

                  <AccordionItem
                    title="Cryptographic Hashing for Backup Verification"
                    icon={FileCheck2}
                    isOpen={openAccordion === 'hashing'}
                    onToggle={() => toggleAccordion('hashing')}
                  >
                    <p className="mb-3">
                      Creating backups is not enough; you must verify that the backup has not been modified or corrupted during transfer or storage. Cryptographic hashing algorithms (such as <strong>SHA-256</strong> or <strong>MD5</strong>) generate a unique, fixed-size mathematical signature from the file payload.
                    </p>
                    <p className="mb-3">
                      <strong>How Integrity Verification Works:</strong>
                      <ol className="list-decimal list-inside space-y-1 mt-2">
                        <li>Calculate the SHA-256 hash of the archive immediately after creation (the "known good" hash).</li>
                        <li>After transferring to off-site storage or before initiating a restore, recalculate the file's hash.</li>
                        <li>Compare both hashes. If a single bit in the backup file is changed or corrupted, the resulting hash signature will completely change (known as the avalanche effect).</li>
                      </ol>
                    </p>
                    <p>
                      <strong>Recommendation:</strong> Schedule automated hash verification tasks on backup repositories every 30 days to check for silent data corruption (bit rot) on storage devices.
                    </p>
                  </AccordionItem>
                </div>
              </div>
            )}

            {/* ─── TAB 5: CULTURE ─── */}
            {activeTab === 'culture' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
                    <span className="text-cyan-400">{"// "}</span>Organizational Governance & Incident Management
                  </h2>
                  <p className="text-sm font-mono text-slate-400 leading-relaxed">
                    Security is not just a technical challenge; it is an organizational habit. Governance frameworks, user education, and structured response systems are vital for compliance.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Awareness */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex flex-col gap-3">
                    <Users className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-mono text-sm font-bold text-white">Employee Awareness</h3>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">
                      Frequent training sessions and phishing simulation tests to reduce user compromise rates, helping establish a strong security perimeter across the organization.
                    </p>
                  </div>

                  {/* NIST Compliance */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex flex-col gap-3">
                    <FileBadge className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-mono text-sm font-bold text-white">NIST & ISO Standards</h3>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">
                      Mapping organizational processes directly to the NIST Cybersecurity Framework (Identify, Protect, Detect, Respond, Recover) or implementing ISO 27001 ISMS.
                    </p>
                  </div>

                  {/* Incident reporting */}
                  <div className="p-5 rounded-xl border border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex flex-col gap-3">
                    <Server className="h-5 w-5 text-cyan-400" />
                    <h3 className="font-mono text-sm font-bold text-white">Incident Response</h3>
                    <p className="font-mono text-xs text-slate-500 leading-relaxed">
                      A clear escalation structure to ensure security incidents are detected, analyzed, and mitigated immediately before lateral movement across system assets occurs.
                    </p>
                  </div>
                </div>

                {/* Advanced: Incident Escalation & Forensics */}
                <div className="mt-2">
                  <h3 className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-widest mb-4">
                    INCIDENT WORKFLOWS & COMPLIANCE
                  </h3>

                  <AccordionItem
                    title="Forensic Preservation in Incident Response"
                    icon={ShieldCheck}
                    isOpen={openAccordion === 'incident-preservation'}
                    onToggle={() => toggleAccordion('incident-preservation')}
                  >
                    <p className="mb-3">
                      When a system breach is detected, response plans must prioritize volatile evidence preservation over immediate remediation. Actions like power-cycling a host, running cleanup scripts, or updating files destroy critical traces in system logs and memory.
                    </p>
                    <p className="mb-3">
                      <strong>The Escalation Protocol:</strong>
                      <ol className="list-decimal list-inside space-y-1.5 mt-2">
                        <li><strong>Containment:</strong> Isolate the compromised host at the network layer (VLAN isolation or firewall block) instead of unplugging the power supply.</li>
                        <li><strong>Preservation:</strong> Execute RAM acquisition and save storage images to write-once-read-many (WORM) storage.</li>
                        <li><strong>Analysis:</strong> Cross-reference event logs, network socket history, and hash values of newly added executables to determine scope.</li>
                      </ol>
                    </p>
                    <p>
                      <strong>Compliance Note:</strong> Proper evidence preservation is key to proving data breach limitations to compliance bodies (GDPR/HIPAA), potentially saving organizations from heavy legal fines.
                    </p>
                  </AccordionItem>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
