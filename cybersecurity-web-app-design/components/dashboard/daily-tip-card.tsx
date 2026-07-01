"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ChevronRight, ChevronLeft, Copy, Check, Tag } from 'lucide-react'

interface TipEntry {
  text: string
  category: string
  categoryColor: string
}

const ALL_TIPS: TipEntry[] = [
  { text: 'Use a unique, high-entropy passphrase (20+ chars) for every account. A password manager like Bitwarden or 1Password eliminates the cognitive load of remembering them.', category: 'Passwords', categoryColor: '#8B5CF6' },
  { text: 'Enable FIDO2/WebAuthn hardware keys (YubiKey) as your primary MFA factor. This is the only form of authentication proven resistant to real-time phishing attacks.', category: 'MFA', categoryColor: '#0EA5E9' },
  { text: 'Hover over every link before clicking. Check the entire domain -- attackers use homograph attacks like paypa1.com (digit one instead of letter l) to deceive.', category: 'Phishing', categoryColor: '#EF4444' },
  { text: 'Apply OS and app updates within 72 hours of release. Most ransomware exploits vulnerabilities that were patched 30+ days prior to the attack.', category: 'Patching', categoryColor: '#F59E0B' },
  { text: 'Follow the 3-2-1-1-0 backup rule: 3 copies, 2 different media types, 1 offsite, 1 offline (air-gapped), 0 errors verified. Test restores quarterly.', category: 'Backup', categoryColor: '#10B981' },
  { text: 'Use a VPN with a no-log policy (audited) when on public or untrusted Wi-Fi. Your ISP and the network operator can see all your unencrypted DNS and HTTP traffic.', category: 'Network', categoryColor: '#0EA5E9' },
  { text: 'Enable automatic screen lock after 60 seconds of inactivity on every device. Physical access to an unlocked device bypasses virtually every software control.', category: 'Physical', categoryColor: '#6366F1' },
  { text: 'Social engineers exploit authority, urgency, and fear. If a bank calls asking for your OTP, hang up and call the bank official number directly. Banks never ask for OTPs.', category: 'Social Engineering', categoryColor: '#EF4444' },
  { text: 'Monitor your bank and credit card statements weekly using transaction alert SMS/email. Early detection of unauthorized charges can prevent cascading account compromise.', category: 'Finance', categoryColor: '#10B981' },
  { text: 'Audit app permissions quarterly. Delete any app you have not used in 30 days. Every installed app is a potential attack surface with access to your data and sensors.', category: 'Privacy', categoryColor: '#8B5CF6' },
  { text: 'Use Signal for sensitive communications. It provides end-to-end encryption with open-source, audited cryptography and disappearing message controls.', category: 'Messaging', categoryColor: '#0EA5E9' },
  { text: 'Request a credit freeze (not just an alert) from all three bureaus: Equifax, Experian, and TransUnion. This is free and prevents new credit from being opened in your name.', category: 'Identity', categoryColor: '#6366F1' },
  { text: 'Be skeptical of urgency. Your account will be suspended in 24 hours is a classic pressure tactic to bypass rational threat assessment. Always verify through official channels.', category: 'Phishing', categoryColor: '#EF4444' },
  { text: 'Never share OTPs, PINs, or authentication codes with anyone -- even someone claiming to be tech support. Legitimate organizations never need them.', category: 'MFA', categoryColor: '#0EA5E9' },
  { text: 'Deploy an EDR (Endpoint Detection and Response) solution on every device, not just antivirus. EDR detects behavioral anomalies rather than just known malware signatures.', category: 'Defense', categoryColor: '#F59E0B' },
  { text: 'Use DNS-over-HTTPS (DoH) or DNS-over-TLS (DoT) to prevent your ISP from logging or manipulating your DNS queries. Cloudflare 1.1.1.1 and NextDNS support both.', category: 'Network', categoryColor: '#0EA5E9' },
  { text: 'Enable email authentication records: SPF, DKIM, and DMARC on your domain. This prevents attackers from spoofing emails that appear to come from your domain.', category: 'Email', categoryColor: '#6366F1' },
  { text: 'Check haveibeenpwned.com monthly to see if your email or credentials appear in data breaches. Immediately rotate passwords for any compromised accounts.', category: 'Passwords', categoryColor: '#8B5CF6' },
  { text: 'Disable Bluetooth and Wi-Fi when not in use. BlueBorne and KRACK attacks target always-on wireless radios even when not connected to any device or network.', category: 'Network', categoryColor: '#0EA5E9' },
  { text: 'Apply the principle of least privilege: every user, service, and process should have only the minimum access needed. Most breaches expand via over-privileged accounts.', category: 'Zero Trust', categoryColor: '#F59E0B' },
  { text: 'Encrypt your storage devices (BitLocker, FileVault, or LUKS). A stolen laptop without encryption gives attackers immediate access to all your data, bypassing your login password.', category: 'Encryption', categoryColor: '#10B981' },
  { text: 'Review OAuth app authorizations in your Google, GitHub, and Microsoft accounts. Revoke any third-party app you no longer use -- they retain access indefinitely if not revoked.', category: 'Privacy', categoryColor: '#8B5CF6' },
  { text: 'Use separate email aliases for different services (SimpleLogin, Apple Hide My Email). This prevents credential stuffing when one service is breached.', category: 'Email', categoryColor: '#6366F1' },
  { text: 'Enable Login Notifications on all critical accounts. Immediate alerting when a new device signs in is your fastest detection mechanism against account takeover.', category: 'MFA', categoryColor: '#0EA5E9' },
  { text: 'Configure your home router to use a guest VLAN for IoT devices. Smart TVs, cameras, and smart speakers should never share a network segment with your primary devices.', category: 'Network', categoryColor: '#0EA5E9' },
  { text: 'Review your browser extensions rigorously. Extensions have access to all your web traffic. Remove any extension you did not install intentionally or that has not been updated in 6+ months.', category: 'Privacy', categoryColor: '#8B5CF6' },
  { text: 'Use a dedicated, air-gapped device or a hardware wallet for high-value cryptocurrency. Software wallets on general-purpose devices are vulnerable to clipboard-hijacking malware.', category: 'Finance', categoryColor: '#10B981' },
  { text: 'Set up a personal emergency information document (encrypted) that your trusted family member can access in case of incapacitation. Digital preparedness is part of security.', category: 'Preparedness', categoryColor: '#6366F1' },
  { text: 'Implement a Zero Trust posture: never trust any device or identity by default, even inside your network perimeter. Verify every access request continuously.', category: 'Zero Trust', categoryColor: '#F59E0B' },
  { text: 'Log out of sessions on shared devices and revoke access tokens manually. JWT tokens do not expire until their TTL unless you explicitly invalidate them server-side.', category: 'Sessions', categoryColor: '#EF4444' },
]

function todayTip(): TipEntry {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000)
  return ALL_TIPS[dayOfYear % ALL_TIPS.length]
}

export default function DailyTipCard() {
  const [tip] = useState(todayTip)
  const [tipIndex, setTipIndex] = useState(() => ALL_TIPS.indexOf(todayTip()))
  const [copied, setCopied] = useState(false)

  const currentTip = ALL_TIPS[tipIndex]

  function prev() { setTipIndex(i => (i - 1 + ALL_TIPS.length) % ALL_TIPS.length) }
  function next() { setTipIndex(i => (i + 1) % ALL_TIPS.length) }

  function copyTip() {
    navigator.clipboard.writeText(currentTip.text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.90)',
        border: '1px solid var(--db-border)',
        boxShadow: 'var(--db-shadow-md)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: 'var(--db-accent-light)', borderBottom: '1px solid var(--db-border)' }}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4" style={{ color: 'var(--db-accent)' }} />
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--db-accent)' }}>
            Daily Cyber Hygiene Tip
          </span>
        </div>
        <span className="text-[10px] font-mono" style={{ color: 'var(--db-text-muted)' }}>
          {tipIndex + 1} / {ALL_TIPS.length}
        </span>
      </div>

      {/* Tip body */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Category badge */}
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider mb-3"
              style={{ background: `${currentTip.categoryColor}15`, color: currentTip.categoryColor, border: `1px solid ${currentTip.categoryColor}30` }}
            >
              <Tag className="h-2.5 w-2.5" />
              {currentTip.category}
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--db-text-secondary)' }}>
              {currentTip.text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: '1px solid var(--db-border)' }}
      >
        <div className="flex gap-1">
          <button
            onClick={prev}
            className="p-1.5 rounded-lg cursor-pointer transition-all"
            style={{ color: 'var(--db-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--db-accent-light)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="p-1.5 rounded-lg cursor-pointer transition-all"
            style={{ color: 'var(--db-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--db-accent-light)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={copyTip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
          style={{
            background: copied ? 'rgba(16,185,129,0.10)' : 'var(--db-accent-light)',
            color: copied ? 'var(--db-green)' : 'var(--db-accent)',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.25)' : 'var(--db-border-strong)'}`,
          }}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied!' : 'Copy tip'}
        </button>
      </div>
    </motion.div>
  )
}
