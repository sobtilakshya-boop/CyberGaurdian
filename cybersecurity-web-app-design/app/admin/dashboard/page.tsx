"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Shield,
  Users,
  UserCheck,
  Clock,
  CalendarPlus,
  Search,
  ChevronDown,
  ArrowUpDown,
  Download,
  Trash2,
  XCircle,
  Loader,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: string
  full_name: string
  email: string
  phone: string
  created_at: string
  is_verified: boolean
}

interface Stats {
  total: number
  verified: number
  pending: number
  today: number
}

type SortOrder = "newest" | "oldest"
type StatusFilter = "all" | "verified" | "pending"

// ─── Admin Gate Modal ─────────────────────────────────────────────────────────
function AdminGate({ onAuthenticate }: { onAuthenticate: (key: string) => void }) {
  const [key, setKey] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!key.trim()) {
      setError("Admin key is required.")
      return
    }
    onAuthenticate(key.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-4">
      {/* grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="relative w-full max-w-sm rounded-2xl p-[1px] overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.1) 50%, rgba(6,182,212,0.4) 100%)",
          boxShadow: "0 0 40px rgba(6,182,212,0.25)",
        }}
      >
        <div className="rounded-2xl bg-slate-900/95 backdrop-blur-xl p-8">
          <div className="flex flex-col items-center mb-7">
            <Shield
              className="h-12 w-12 text-cyan-400 mb-3"
              strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 0 12px rgba(6,182,212,0.8))" }}
            />
            <h1 className="font-mono text-xl font-bold tracking-wider text-white uppercase">
              Admin Access
            </h1>
            <p className="mt-1 text-sm text-slate-400 font-mono text-center">
              CyberGuardian Control Panel
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                id="admin-key-input"
                type={show ? "text" : "password"}
                value={key}
                onChange={(e) => { setKey(e.target.value); setError("") }}
                placeholder="Enter admin secret key"
                autoComplete="off"
                className="w-full rounded-xl border-2 border-slate-600 bg-slate-800/80 px-4 py-3 pr-11 font-mono text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                aria-label={show ? "Hide key" : "Show key"}
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-400 font-mono flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" /> {error}
              </p>
            )}
            <button
              id="admin-login-btn"
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-mono font-semibold text-sm uppercase tracking-widest transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
            >
              Authenticate
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: React.ElementType
  color: string
}) {
  return (
    <div
      className="relative rounded-xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm p-5 overflow-hidden transition-all duration-300 hover:border-slate-600"
      style={{ boxShadow: "0 0 20px rgba(0,0,0,0.4)" }}
    >
      <div
        className="absolute inset-0 opacity-5 rounded-xl"
        style={{ background: color }}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <p
            className="text-3xl font-mono font-bold tabular-nums"
            style={{ color, textShadow: `0 0 20px ${color}40` }}
          >
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className="p-2.5 rounded-lg shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
function DeleteModal({
  user,
  onConfirm,
  onCancel,
  loading,
}: {
  user: User
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm px-4">
      <div
        className="w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-900/95 backdrop-blur-xl p-7"
        style={{ boxShadow: "0 0 40px rgba(239,68,68,0.2)" }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30">
            <Trash2 className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="font-mono font-bold text-white text-base">Confirm Deletion</h2>
            <p className="text-xs text-slate-400 font-mono">This action cannot be undone</p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/60 border border-slate-700/60 p-4 mb-6 space-y-1.5">
          <p className="text-sm text-slate-300 font-mono">
            <span className="text-slate-500">Name:</span> {user.full_name}
          </p>
          <p className="text-sm text-slate-300 font-mono">
            <span className="text-slate-500">Email:</span> {user.email}
          </p>
          <p className="text-sm text-slate-300 font-mono">
            <span className="text-slate-500">ID:</span>{" "}
            <span className="text-xs text-slate-500">{user.id}</span>
          </p>
        </div>

        <div className="flex gap-3">
          <button
            id="cancel-delete-btn"
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-600 bg-slate-800/60 text-slate-300 font-mono text-sm hover:bg-slate-700/60 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-semibold text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            {loading ? (
              <>
                <Loader className="h-3.5 w-3.5 animate-spin" /> Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" /> Delete User
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState<string | null>(null)
  const [authError, setAuthError] = useState("")

  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0, pending: 0, today: 0 })
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  // ─── Fetch users ─────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (key: string, s: string, status: StatusFilter, sort: SortOrder) => {
    setLoading(true)
    setFetchError("")
    try {
      const params = new URLSearchParams()
      if (s) params.set("search", s)
      if (status !== "all") params.set("status", status)
      params.set("sort", sort)

      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${key}` },
      })
      const data = await res.json()

      if (res.status === 401) {
        setAdminKey(null)
        setAuthError("Invalid admin key. Please try again.")
        return
      }

      if (!data.success) {
        setFetchError(data.error ?? "Failed to load users.")
        return
      }

      setUsers(data.users ?? [])
      setStats(data.stats ?? { total: 0, verified: 0, pending: 0, today: 0 })
    } catch {
      setFetchError("Network error. Could not fetch user data.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Authenticate
  const handleAuthenticate = (key: string) => {
    setAuthError("")
    setAdminKey(key)
    fetchUsers(key, search, statusFilter, sortOrder)
  }

  // Refetch when filters change
  useEffect(() => {
    if (!adminKey) return
    const timer = setTimeout(() => {
      fetchUsers(adminKey, search, statusFilter, sortOrder)
    }, 300)
    return () => clearTimeout(timer)
  }, [adminKey, search, statusFilter, sortOrder, fetchUsers])

  // ─── Export CSV ───────────────────────────────────────────────────────────────
  const handleExport = () => {
    const headers = ["ID", "Full Name", "Email", "Phone", "Registered At", "Verified"]
    const rows = users.map((u) => [
      u.id,
      `"${u.full_name.replace(/"/g, '""')}"`,
      u.email,
      u.phone,
      new Date(u.created_at).toISOString(),
      u.is_verified ? "Yes" : "No",
    ])
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `cyberguardian-users-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // ─── Delete user ──────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deleteTarget || !adminKey) return
    setDeleteLoading(true)
    setDeleteError("")
    try {
      const res = await fetch(`/api/admin/users?id=${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminKey}` },
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
        setStats((prev) => ({
          ...prev,
          total: prev.total - 1,
          verified: deleteTarget.is_verified ? prev.verified - 1 : prev.verified,
          pending: !deleteTarget.is_verified ? prev.pending - 1 : prev.pending,
        }))
        setDeleteTarget(null)
      } else {
        setDeleteError(data.error ?? "Failed to delete user.")
      }
    } catch {
      setDeleteError("Network error. Could not delete user.")
    } finally {
      setDeleteLoading(false)
    }
  }

  // ─── Format helpers ───────────────────────────────────────────────────────────
  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const maskSensitive = (val: string, visibleChars = 3) => {
    if (val.length <= visibleChars) return val
    return "•".repeat(val.length - visibleChars) + val.slice(-visibleChars)
  }

  // Show admin gate if not authenticated
  if (!adminKey) {
    return (
      <>
        {authError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl border border-red-500/40 bg-red-500/10 backdrop-blur-sm text-red-300 font-mono text-sm flex items-center gap-2 shadow-lg">
            <XCircle className="h-4 w-4 text-red-400 shrink-0" />
            {authError}
          </div>
        )}
        <AdminGate onAuthenticate={handleAuthenticate} />
      </>
    )
  }

  return (
    <>
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => { setDeleteTarget(null); setDeleteError("") }}
          loading={deleteLoading}
        />
      )}
      {deleteError && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-xl border border-red-500/40 bg-red-500/10 backdrop-blur-sm text-red-300 font-mono text-sm">
          {deleteError}
        </div>
      )}

      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Grid backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top Nav */}
        <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Shield
                className="h-7 w-7 text-cyan-400 shrink-0"
                strokeWidth={1.5}
                style={{ filter: "drop-shadow(0 0 8px rgba(6,182,212,0.7))" }}
              />
              <div>
                <h1 className="font-mono font-bold text-white text-base leading-none">
                  CyberGuardian
                </h1>
                <p className="font-mono text-xs text-slate-500 leading-none mt-0.5">
                  Admin Control Panel
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                id="refresh-btn"
                type="button"
                onClick={() => fetchUsers(adminKey, search, statusFilter, sortOrder)}
                disabled={loading}
                className="p-2 rounded-lg border border-slate-700/60 bg-slate-800/60 text-slate-400 hover:text-cyan-400 hover:border-slate-600 transition-all duration-200 disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                id="logout-btn"
                type="button"
                onClick={() => setAdminKey(null)}
                className="p-2 rounded-lg border border-slate-700/60 bg-slate-800/60 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all duration-200"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <section aria-label="Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Users" value={stats.total} icon={Users} color="#06b6d4" />
            <StatCard label="Verified" value={stats.verified} icon={UserCheck} color="#22c55e" />
            <StatCard label="Pending" value={stats.pending} icon={Clock} color="#f59e0b" />
            <StatCard label="New Today" value={stats.today} icon={CalendarPlus} color="#a855f7" />
          </section>

          {/* Control Bar */}
          <section
            aria-label="Filters and controls"
            className="flex flex-col sm:flex-row gap-3 mb-6"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                id="user-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or phone…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/60 bg-slate-900/80 text-slate-100 text-sm font-mono placeholder-slate-500 outline-none transition-all duration-200 focus:border-cyan-500/60 focus:shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              />
            </div>

            {/* Status filter */}
            <div className="relative">
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-slate-700/60 bg-slate-900/80 text-slate-100 text-sm font-mono outline-none transition-all duration-200 focus:border-cyan-500/60 cursor-pointer"
              >
                <option value="all">All Users</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <button
              id="sort-btn"
              type="button"
              onClick={() => setSortOrder((s) => (s === "newest" ? "oldest" : "newest"))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700/60 bg-slate-900/80 text-slate-300 text-sm font-mono hover:border-slate-600 hover:text-white transition-all duration-200"
            >
              <ArrowUpDown className="h-4 w-4" />
              {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </button>

            {/* Export CSV */}
            <button
              id="export-csv-btn"
              type="button"
              onClick={handleExport}
              disabled={users.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-mono hover:bg-cyan-500/15 hover:border-cyan-500/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </section>

          {/* Error Banner */}
          {fetchError && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3">
              <XCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300 font-mono">{fetchError}</p>
            </div>
          )}

          {/* Data Table */}
          <section
            aria-label="Users table"
            className="rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-sm overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-[1fr_1.5fr_1.5fr_1.2fr_1.2fr_auto] gap-3 px-6 py-3.5 border-b border-slate-800/80 bg-slate-900/80">
              {["User ID", "Full Name", "Email", "Phone", "Registered At", "Status"].map((h) => (
                <span key={h} className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-widest">
                  {h}
                </span>
              ))}
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-20 gap-3">
                <Loader className="h-6 w-6 text-cyan-400 animate-spin" />
                <span className="text-sm font-mono text-slate-400">Loading users…</span>
              </div>
            )}

            {/* Empty state */}
            {!loading && users.length === 0 && !fetchError && (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Users className="h-10 w-10 text-slate-700" />
                <p className="text-sm font-mono text-slate-500">No users match the current filters.</p>
              </div>
            )}

            {/* Rows */}
            {!loading &&
              users.map((user, idx) => (
                <div
                  key={user.id}
                  className={[
                    "grid grid-cols-[1fr_1.5fr_1.5fr_1.2fr_1.2fr_auto] gap-3 px-6 py-4 items-center",
                    "border-b border-slate-800/50 last:border-0",
                    "transition-colors duration-150 hover:bg-slate-800/30",
                  ].join(" ")}
                >
                  {/* User ID */}
                  <span className="text-xs font-mono text-slate-500 truncate" title={user.id}>
                    {user.id.slice(0, 8)}…
                  </span>

                  {/* Full Name */}
                  <span className="text-sm font-mono text-slate-200 truncate font-medium">
                    {user.full_name}
                  </span>

                  {/* Email */}
                  <span
                    className="text-sm font-mono text-slate-300 truncate"
                    title={user.email}
                  >
                    {user.email}
                  </span>

                  {/* Phone */}
                  <span className="text-sm font-mono text-slate-400 truncate">
                    {maskSensitive(user.phone, 4)}
                  </span>

                  {/* Date */}
                  <span className="text-xs font-mono text-slate-500 truncate">
                    {formatDate(user.created_at)}
                  </span>

                  {/* Status + Delete */}
                  <div className="flex items-center gap-2.5 justify-end">
                    {/* Status Badge */}
                    <span
                      className={[
                        "px-2.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wide",
                        user.is_verified
                          ? "bg-green-500/15 text-green-400 border border-green-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30",
                      ].join(" ")}
                      style={
                        user.is_verified
                          ? { textShadow: "0 0 8px rgba(74,222,128,0.5)" }
                          : { textShadow: "0 0 8px rgba(245,158,11,0.5)" }
                      }
                    >
                      {user.is_verified ? "Verified" : "Pending"}
                    </span>

                    {/* Delete button */}
                    <button
                      id={`delete-user-${user.id}`}
                      type="button"
                      onClick={() => setDeleteTarget(user)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                      title={`Delete ${user.full_name}`}
                      aria-label={`Delete user ${user.full_name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

            {/* Footer row count */}
            {!loading && users.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-900/40">
                <p className="text-xs font-mono text-slate-600">
                  Showing{" "}
                  <span className="text-slate-400 font-semibold">{users.length}</span>{" "}
                  user{users.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  )
}
