import { useEffect, useMemo, useState } from 'react'
import { Download, FileText, Search } from 'lucide-react'
import { api } from '../src/api'
import type { Material } from '../src/api'
import { useAuth } from '../src/auth'
import PortalShell from '../src/PortalShell'

export const formatSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function StudentPortal() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState<Material[] | null>(null)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    api.materials().then(setMaterials).catch((e) => setError(e.message))
  }, [])

  const categories = useMemo(() => ['All', ...new Set((materials ?? []).map((m) => m.category))], [materials])
  const shown = (materials ?? []).filter(
    (m) =>
      (category === 'All' || m.category === category) &&
      m.title.toLowerCase().includes(query.trim().toLowerCase()),
  )

  async function open(id: string, download = false) {
    // Open the tab first so pop-up blockers allow it, then point it at the file
    const tab = download ? null : window.open('', '_blank')
    try {
      const { url } = await api.materialUrl(id, download)
      if (tab) tab.location.href = url
      else window.location.href = url
    } catch (e) {
      tab?.close()
      setError(e instanceof Error ? e.message : 'Could not open the file')
    }
  }

  return (
    <PortalShell title={`Namaste, ${user?.name.split(' ')[0]}`}>
      <p className="mt-2 text-stone-600">All the notes and worksheets Geetha has shared with you are here.</p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes"
            aria-label="Search notes"
            className="w-full rounded-full border border-orange-100 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-500"
          />
        </div>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2.5 text-xs font-semibold transition ${
              category === c ? 'bg-[#421a36] text-white' : 'border border-orange-100 bg-white hover:bg-orange-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-6 text-sm text-red-700">{error}</p>}
      {materials === null && !error && <p className="mt-8 text-sm text-stone-500">Loading your notes…</p>}
      {materials?.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-orange-200 bg-white p-8 text-center text-sm text-stone-600">
          Nothing here yet. When Geetha uploads notes, they will appear in this list.
        </p>
      )}
      {materials && materials.length > 0 && shown.length === 0 && (
        <p className="mt-8 text-sm text-stone-600">No notes match your search.</p>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((m) => (
          <li key={m.id} className="flex flex-col rounded-2xl border border-orange-100 bg-white p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700"><FileText size={22} /></span>
            <h2 className="mt-4 text-base font-semibold leading-snug">{m.title}</h2>
            <p className="mt-1 text-xs text-stone-500">{m.category} · {formatSize(m.size)} · Added {formatDate(m.createdAt)}</p>
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={() => open(m.id)} className="flex-1 rounded-full bg-[#421a36] px-4 py-2.5 text-xs font-semibold text-white hover:bg-orange-700">
                Open PDF
              </button>
              <button type="button" onClick={() => open(m.id, true)} aria-label={`Download ${m.title}`} className="rounded-full border border-orange-200 px-3 hover:bg-orange-50">
                <Download size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </PortalShell>
  )
}
