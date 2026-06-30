"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Shield, User, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

type AuthPageProps = {
  initialMode: "login" | "register"
  onBack: () => void
}

export function AuthPage({ initialMode, onBack }: AuthPageProps) {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </button>

        <div className="rounded-2xl border border-primary/25 bg-card p-7 shadow-[0_0_40px_-12px_var(--color-primary)] sm:p-8">
          <div className="mb-7 flex flex-col items-center text-center">
            <Shield
              className="h-12 w-12 animate-pulse text-primary drop-shadow-[0_0_14px_var(--color-primary)]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h1 className="mt-4 font-mono text-2xl font-bold uppercase tracking-tight text-foreground">
              {initialMode === "login" ? "Secure Login" : "Create Account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {initialMode === "login"
                ? "Access your CyberGuardian dashboard"
                : "Join the CyberGuardian network"}
            </p>
          </div>

          {submitted ? (
            <div
              role="status"
              className="rounded-lg border border-accent/40 bg-accent/10 p-5 text-center"
            >
              <p className="font-mono text-accent">Access granted.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your details were received successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Field
                id="name"
                label="Name"
                type="text"
                placeholder="Jane Doe"
                icon={<User className="h-4 w-4" aria-hidden="true" />}
                autoComplete="name"
              />
              <Field
                id="gmail"
                label="Gmail"
                type="email"
                placeholder="you@gmail.com"
                icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                autoComplete="email"
              />
              <Field
                id="phone"
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                icon={<Phone className="h-4 w-4" aria-hidden="true" />}
                autoComplete="tel"
              />

              <Button
                type="submit"
                size="lg"
                className="mt-2 w-full font-mono font-semibold shadow-[0_0_24px_-6px_var(--color-primary)]"
              >
                {initialMode === "login" ? "Login" : "Register"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  type: string
  placeholder: string
  icon: React.ReactNode
  autoComplete?: string
}

function Field({ id, label, type, placeholder, icon, autoComplete }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="w-full rounded-lg border border-input bg-background/60 py-2.5 pl-10 pr-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
    </div>
  )
}
