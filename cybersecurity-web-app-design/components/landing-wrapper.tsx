"use client"

import { useState } from "react"
import { LandingPage } from "@/components/landing-page"
import { useRouter } from "next/navigation"

export function LandingWrapper() {
  const router = useRouter()
  const [authMode] = useState<"login" | "register">("login")

  function goToAuth(mode: "login" | "register") {
    router.push(mode === "login" ? "/login" : "/register")
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
      <div className="relative animate-in fade-in zoom-in-95 duration-500">
        <LandingPage onAuth={goToAuth} />
      </div>
    </main>
  )
}
