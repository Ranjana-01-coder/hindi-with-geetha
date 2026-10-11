const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5173/'

export type Role = 'student' | 'teacher'
export type User = { id: string; name: string; role: Role }
export type Material = { id: string; title: string; category: string; size: number; createdAt: string }
export type Student = { id: string; name: string; username: string; createdAt: string }
export type Credentials = { student: Student; password: string }

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: init.body ? { 'Content-Type': 'application/json', ...init.headers } : init.headers,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? 'Something went wrong. Please try again.')
  return data as T
}

const json = (body: unknown) => JSON.stringify(body)

export const api = {
  me: () => request<User>('/api/me'),
  login: (username: string, password: string) =>
    request<User>('/api/login', { method: 'POST', body: json({ username, password }) }),
  logout: () => request('/api/logout', { method: 'POST' }),

  materials: () => request<Material[]>('/api/materials'),
  materialUrl: (id: string, download = false) =>
    request<{ url: string }>(`/api/materials/${id}/url${download ? '?download=1' : ''}`),

  // Upload straight from the browser to S3, then record it
  async uploadMaterial(file: File, title: string, category: string) {
    const post = await request<{ url: string; fields: Record<string, string>; key: string }>(
      '/api/admin/materials/upload',
      { method: 'POST' },
    )
    const form = new FormData()
    Object.entries(post.fields).forEach(([k, v]) => form.append(k, v))
    form.append('file', file) // must be the last field
    const s3 = await fetch(post.url, { method: 'POST', body: form })
    if (!s3.ok) throw new Error('Upload to storage failed. Check the file is a PDF under 25 MB.')
    return request<Material>('/api/admin/materials', {
      method: 'POST',
      body: json({ key: post.key, title, category }),
    })
  },
  deleteMaterial: (id: string) => request(`/api/admin/materials/${id}`, { method: 'DELETE' }),

  students: () => request<Student[]>('/api/admin/students'),
  addStudent: (name: string) => request<Credentials>('/api/admin/students', { method: 'POST', body: json({ name }) }),
  resetStudent: (id: string) => request<Credentials>(`/api/admin/students/${id}/reset`, { method: 'POST' }),
  deleteStudent: (id: string) => request(`/api/admin/students/${id}`, { method: 'DELETE' }),
}
