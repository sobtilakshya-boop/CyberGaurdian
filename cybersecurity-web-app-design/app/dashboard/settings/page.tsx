"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Eye, Palette, Target, Compass, Save, CheckCircle } from 'lucide-react'

const ACCENT_COLORS = [
  { name: 'Default Indigo', value: '#4F46E5' },
  { name: 'Cyber Cyan', value: '#06B6D4' },
  { name: 'Bio Emerald', value: '#10B981' },
  { name: 'Amber Alert', value: '#F59E0B' },
  { name: 'Crimson Rose', value: '#EF4444' },
]

export default function SettingsPage() {
  const [successMsg, setSuccessMsg] = useState(false)
  const [accentColor, setAccentColor] = useState('#4F46E5')
  const [settings, setSettings] = useState({
    reducedMotion: false,
    dailyXpGoal: '100',
    simulationMode: 'Guided'
  })

  // Load color settings on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('db-accent-color')
    const savedMotion = localStorage.getItem('db-reduced-motion') === 'true'
    const savedGoal = localStorage.getItem('db-daily-xp') || '100'
    const savedMode = localStorage.getItem('db-sim-mode') || 'Guided'

    if (savedColor) setAccentColor(savedColor)
    setSettings({
      reducedMotion: savedMotion,
      dailyXpGoal: savedGoal,
      simulationMode: savedMode
    })
  }, [])

  const handleToggle = (key: 'reducedMotion') => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSelect = (key: 'dailyXpGoal' | 'simulationMode', value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAccentChange = (colorHex: string) => {
    setAccentColor(colorHex)
    // Update css variables in real time so the user can immediately "see" it
    document.documentElement.style.setProperty('--db-accent', colorHex)
    document.documentElement.style.setProperty('--db-accent-light', colorHex + '14')
    document.documentElement.style.setProperty('--db-accent-mid', colorHex + '26')
  }

  const handleSave = () => {
    localStorage.setItem('db-accent-color', accentColor)
    localStorage.setItem('db-reduced-motion', String(settings.reducedMotion))
    localStorage.setItem('db-daily-xp', settings.dailyXpGoal)
    localStorage.setItem('db-sim-mode', settings.simulationMode)

    setSuccessMsg(true)
    setTimeout(() => setSuccessMsg(false), 3000)
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto px-4 md:px-8 py-6 font-sans">
      {/* Header */}
      <div className="border-b border-[var(--db-border)] pb-5 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--db-text-primary)] tracking-tight">
            Dashboard Configurations
          </h2>
          <p className="text-xs text-[var(--db-text-muted)] mt-1 font-medium">
            Personalize your workspace display, training pathways, and accessibility parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--db-accent)] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-md cursor-pointer"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-medium shadow-sm"
        >
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span>Workspace preferences saved successfully! Settings will persist across sessions.</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Accent Palette Customizer (Change & See) */}
        <div className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--db-border)]">
            <div className="p-2 rounded-lg bg-[var(--db-accent-light)] text-[var(--db-accent)]">
              <Palette className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--db-text-primary)]">Workspace Accent Theme</h3>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-bold text-[var(--db-text-primary)]">Select Color Accent</span>
            <p className="text-xs text-[var(--db-text-muted)] leading-relaxed">
              Change the primary visual accent color. All progress rings, active tags, and sidebar items will update instantly.
            </p>

            <div className="flex items-center gap-3.5 mt-2">
              {ACCENT_COLORS.map((color) => {
                const isSelected = accentColor.toLowerCase() === color.value.toLowerCase()
                return (
                  <button
                    key={color.name}
                    onClick={() => handleAccentChange(color.value)}
                    className="w-10 h-10 rounded-full relative cursor-pointer flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-slate-200"
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm border border-slate-300" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Accessibility & Visual Adjustments */}
        <div className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--db-border)]">
            <div className="p-2 rounded-lg bg-[var(--db-accent-light)] text-[var(--db-accent)]">
              <Eye className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--db-text-primary)]">Accessibility Settings</h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-[var(--db-text-primary)]">Reduced Motion Settings</span>
                <p className="text-xs text-[var(--db-text-muted)] leading-relaxed">
                  Disable heavy page transitions, 3D orbit offsets, and animations to ensure a smooth layout flow.
                </p>
              </div>
              <button
                onClick={() => handleToggle('reducedMotion')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.reducedMotion ? 'bg-[var(--db-accent)]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Learning Target Goal */}
        <div className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--db-border)]">
            <div className="p-2 rounded-lg bg-[var(--db-accent-light)] text-[var(--db-accent)]">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--db-text-primary)]">Operator Daily Target</h3>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-[var(--db-text-primary)]">Daily Study Target (XP)</span>
            <p className="text-xs text-[var(--db-text-muted)] leading-relaxed">
              Define your daily XP check-in target to maintain your dashboard study streak.
            </p>

            <div className="grid grid-cols-3 gap-2 mt-2">
              {['50', '100', '250'].map((val) => (
                <button
                  key={val}
                  onClick={() => handleSelect('dailyXpGoal', val)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                    settings.dailyXpGoal === val
                      ? 'border-[var(--db-accent)] bg-[var(--db-accent-light)] text-[var(--db-accent)]'
                      : 'border-[var(--db-border)] bg-transparent text-[var(--db-text-secondary)] hover:bg-[var(--db-surface-2)]/50'
                  }`}
                >
                  {val} XP
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Practice Mode Choices */}
        <div className="rounded-2xl border border-[var(--db-border)] bg-[var(--db-surface)] p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[var(--db-border)]">
            <div className="p-2 rounded-lg bg-[var(--db-accent-light)] text-[var(--db-accent)]">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-[var(--db-text-primary)]">Simulation Guidance</h3>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-bold text-[var(--db-text-primary)]">Simulator Practice Mode</span>
            <p className="text-xs text-[var(--db-text-muted)] leading-relaxed">
              Switching to sandbox locks guide indicators and helps verify raw response times.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {['Guided', 'Sandbox'].map((val) => (
                <button
                  key={val}
                  onClick={() => handleSelect('simulationMode', val)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                    settings.simulationMode === val
                      ? 'border-[var(--db-accent)] bg-[var(--db-accent-light)] text-[var(--db-accent)]'
                      : 'border-[var(--db-border)] bg-transparent text-[var(--db-text-secondary)] hover:bg-[var(--db-surface-2)]/50'
                  }`}
                >
                  {val} Mode
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
