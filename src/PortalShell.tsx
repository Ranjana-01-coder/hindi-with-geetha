import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from './auth'

export default function PortalShell({ title, children }: { title: string; children: ReactNode }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-[#fffaf3] text-[#421a36]">
      <header className="border-b border-orange-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#421a36] font-bold text-amber-200">हि</span>
            <span className="text-sm font-bold sm:text-base">Hindi with Geetha</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-stone-600 sm:inline">{user?.name}</span>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-orange-200 px-4 py-2 text-xs font-semibold hover:bg-orange-50"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <h1 className="text-3xl font-semibold">{title}</h1>
        {children}
      </main>
    </div>
  )
}
