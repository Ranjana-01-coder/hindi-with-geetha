import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock } from 'lucide-react'
import { homeFor, useAuth } from '../src/auth'

export default function Login() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to={homeFor(user.role)} replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const u = await login(username, password)
      navigate(homeFor(u.role), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="paper-pattern flex min-h-screen items-center justify-center bg-[#fffaf3] px-5 py-10 text-[#421a36]">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-orange-700">
          <ArrowLeft size={16} /> Back to website
        </Link>
        <form onSubmit={submit} className="rounded-3xl border border-white bg-white p-8 shadow-xl shadow-orange-900/5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#421a36] text-amber-200">
            <Lock size={20} />
          </span>
          <h1 className="mt-5 text-2xl font-semibold">Student login</h1>
          <p className="hindi mt-1 text-lg text-[#7d3d49]">आपका स्वागत है</p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Use the username and password Geetha sent you. Forgot them? Ask Geetha for a new password.
          </p>

          <label htmlFor="username" className="mt-6 block text-sm font-medium">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            required
            className="mt-2 w-full rounded-xl border border-orange-100 bg-[#fffdf9] px-4 py-3.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          <label htmlFor="password" className="mt-5 block text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-xl border border-orange-100 bg-[#fffdf9] px-4 py-3.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />

          {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-full bg-[#421a36] px-6 py-4 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            {busy ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}
