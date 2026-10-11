import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Copy, KeyRound, Trash2, Upload, UserPlus } from 'lucide-react'
import { api } from '../src/api'
import type { Credentials, Material, Student } from '../src/api'
import PortalShell from '../src/PortalShell'
import { formatDate, formatSize } from '../src/studentportal'

const categories = ['Alphabet', 'Grammar', 'Vocabulary', 'Worksheets', 'Stories', 'Other']

export default function TeacherDashboard() {
  const [tab, setTab] = useState<'materials' | 'students'>('materials')
  return (
    <PortalShell title="Teacher dashboard">
      <div className="mt-6 inline-flex rounded-full border border-orange-100 bg-white p-1">
        {(['materials', 'students'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold capitalize transition ${tab === t ? 'bg-[#421a36] text-white' : 'text-stone-600'}`}
          >
            {t === 'materials' ? 'PDF notes' : 'Students'}
          </button>
        ))}
      </div>
      {tab === 'materials' ? <Materials /> : <Students />}
    </PortalShell>
  )
}

function Materials() {
  const [items, setItems] = useState<Material[]>([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const load = () => api.materials().then(setItems).catch((e) => setMessage(e.message))
  useEffect(() => { load() }, [])

  async function upload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) return setMessage('Choose a PDF first.')
    if (file.type !== 'application/pdf') return setMessage('Only PDF files can be uploaded.')
    setBusy(true)
    setMessage('')
    try {
      await api.uploadMaterial(file, title || file.name.replace(/\.pdf$/i, ''), category)
      setTitle('')
      setFile(null)
      e.currentTarget.reset()
      setMessage('Uploaded. Students can see it now.')
      await load()
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  async function remove(m: Material) {
    if (!window.confirm(`Delete "${m.title}"? Students will no longer see it.`)) return
    await api.deleteMaterial(m.id).catch((e) => setMessage(e.message))
    load()
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
      <form onSubmit={upload} className="h-fit rounded-2xl border border-orange-100 bg-white p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><Upload size={18} /> Upload a PDF</h2>
        <label htmlFor="file" className="mt-5 block text-sm font-medium">PDF file (up to 25 MB)</label>
        <input id="file" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm" />
        <label htmlFor="title" className="mt-5 block text-sm font-medium">Title</label>
        <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Defaults to the file name" className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3 text-sm outline-none focus:border-orange-500" />
        <label htmlFor="category" className="mt-5 block text-sm font-medium">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-2 w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm">
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        {message && <p role="status" className="mt-4 text-sm text-[#7d3d49]">{message}</p>}
        <button type="submit" disabled={busy} className="mt-5 w-full rounded-full bg-[#421a36] px-6 py-3.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50">
          {busy ? 'Uploading…' : 'Upload PDF'}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold">Shared with students ({items.length})</h2>
        {items.length === 0 && <p className="mt-4 text-sm text-stone-600">No PDFs yet. Upload one and every student can open it from their portal.</p>}
        <ul className="mt-4 space-y-3">
          {items.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{m.title}</p>
                <p className="text-xs text-stone-500">{m.category} · {formatSize(m.size)} · {formatDate(m.createdAt)}</p>
              </div>
              <button type="button" onClick={() => remove(m)} aria-label={`Delete ${m.title}`} className="rounded-full p-2 text-stone-500 hover:bg-red-50 hover:text-red-700">
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [name, setName] = useState('')
  const [issued, setIssued] = useState<Credentials | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const load = () => api.students().then(setStudents).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])

  const loginMessage = (c: Credentials) =>
    `Namaste ${c.student.name}! Your Hindi with Geetha student login:\n\nWebsite: ${window.location.origin}/login\nUsername: ${c.student.username}\nPassword: ${c.password}`

  async function add(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      setIssued(await api.addStudent(name))
      setName('')
      setCopied(false)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add student')
    }
  }

  async function reset(s: Student) {
    if (!window.confirm(`Create a new password for ${s.name}? The old one stops working.`)) return
    setIssued(await api.resetStudent(s.id))
    setCopied(false)
  }

  async function remove(s: Student) {
    if (!window.confirm(`Remove ${s.name}? They will lose access immediately.`)) return
    await api.deleteStudent(s.id)
    if (issued?.student.id === s.id) setIssued(null)
    load()
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
      <div className="h-fit space-y-5">
        <form onSubmit={add} className="rounded-2xl border border-orange-100 bg-white p-6">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><UserPlus size={18} /> Add a student</h2>
          <p className="mt-2 text-sm text-stone-600">A username and password are created for you to send them.</p>
          <label htmlFor="student" className="mt-5 block text-sm font-medium">Student name</label>
          <input id="student" value={name} onChange={(e) => setName(e.target.value)} required className="mt-2 w-full rounded-xl border border-orange-100 px-4 py-3 text-sm outline-none focus:border-orange-500" />
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          <button type="submit" className="mt-5 w-full rounded-full bg-[#421a36] px-6 py-3.5 text-sm font-semibold text-white hover:bg-orange-700">Create login</button>
        </form>

        {issued && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="font-semibold">Login for {issued.student.name}</h3>
            <p className="mt-1 text-xs text-stone-600">The password is shown only now. Copy it before leaving this page.</p>
            <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-white p-4 text-sm">{`Username: ${issued.student.username}\nPassword: ${issued.password}`}</pre>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(loginMessage(issued)).then(() => setCopied(true))}
                className="inline-flex items-center gap-2 rounded-full bg-[#421a36] px-4 py-2.5 text-xs font-semibold text-white"
              >
                <Copy size={14} /> {copied ? 'Copied' : 'Copy message'}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(loginMessage(issued))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-emerald-300 bg-white px-4 py-2.5 text-xs font-semibold"
              >
                Send on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold">Students ({students.length})</h2>
        {students.length === 0 && <p className="mt-4 text-sm text-stone-600">No students yet. Add the first one to create their login.</p>}
        <ul className="mt-4 space-y-3">
          {students.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{s.name}</p>
                <p className="text-xs text-stone-500">{s.username} · Added {formatDate(s.createdAt)}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => reset(s)} aria-label={`New password for ${s.name}`} className="rounded-full p-2 text-stone-500 hover:bg-orange-50 hover:text-orange-700"><KeyRound size={18} /></button>
                <button type="button" onClick={() => remove(s)} aria-label={`Remove ${s.name}`} className="rounded-full p-2 text-stone-500 hover:bg-red-50 hover:text-red-700"><Trash2 size={18} /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
