"use client"

import Image from "next/image"
import { Shield, LockKeyhole, Radar, ScanEye } from "lucide-react"
import { Button } from "@/components/ui/button"

type LandingPageProps = {
  onAuth: (mode: "login" | "register") => void
}

export function LandingPage({ onAuth }: LandingPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex w-full items-center justify-end px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold tracking-tight text-foreground">
            CyberPeace
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/40 bg-white p-1">
            <Image
              src="/images/cyberpeace-logo.webp"
              alt="CyberPeace logo"
              width={44}
              height={44}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        {/* Animated defense logo */}
        <div className="relative mb-10 flex h-36 w-36 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
          <div className="absolute inset-2 rounded-full border border-primary/30" />
          <Radar
            className="absolute h-32 w-32 animate-spin text-primary/30"
            style={{ animationDuration: "6s" }}
            aria-hidden="true"
          />
          <Shield
            className="relative h-20 w-20 animate-pulse text-primary drop-shadow-[0_0_18px_var(--color-primary)]"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        <h1 className="font-mono text-5xl font-bold uppercase tracking-tight text-balance sm:text-6xl md:text-7xl">
          <span className="text-foreground">Cyber</span>
          <span className="text-primary drop-shadow-[0_0_22px_var(--color-primary)]">
            Guardian
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Next-generation cyber hygiene and digital defense. Stay protected,
          stay vigilant, stay at peace.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex w-full max-w-md flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="w-full font-mono text-base font-semibold shadow-[0_0_24px_-6px_var(--color-primary)] sm:w-auto sm:min-w-40"
            onClick={() => onAuth("login")}
          >
            <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            Login
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full border-accent/60 font-mono text-base font-semibold text-accent hover:bg-accent hover:text-accent-foreground sm:w-auto sm:min-w-40"
            onClick={() => onAuth("register")}
          >
            <ScanEye className="h-5 w-5" aria-hidden="true" />
            New User
          </Button>
        </div>
      </section>

      {/* About Us */}
      <section className="border-t border-border bg-card/40 px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-mono text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
            <span className="text-accent">{"// "}</span>About Us
          </h2>
          <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <p className="mt-6 leading-relaxed text-muted-foreground text-pretty">
            CyberPeace Foundation endeavors to make the internet a more secure,
            stable, trustworthy and inclusive place for all netizens across the
            globe. As a non-partisan collective, we unite expertise,
            experiences, capacity and intent across a broad spectrum of
            institutions, disciplines and cultures in order to combat the common
            threat of cybercrime.
          </p>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-6 text-center text-sm text-muted-foreground">
        <span className="font-mono">CyberPeace</span> &middot; CyberGuardian
      </footer>
    </div>
  )
}
