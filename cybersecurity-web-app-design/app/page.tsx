"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { AuthPage } from "@/components/auth-page"

type View = "landing" | "auth"

export default function Page() {
  const [view, setView] = useState<View>("landing")
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  function goToAuth(mode: "login" | "register") {
    setAuthMode(mode)
    setView("auth")
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* subtle grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div
        key={view}
        className="relative animate-in fade-in zoom-in-95 duration-500"
      >
        {view === "landing" ? (
          <LandingPage onAuth={goToAuth} />
        ) : (
          <AuthPage initialMode={authMode} onBack={() => setView("landing")} />
        )}
      </div>
    </main>
  )
}
