import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import rateLimit from 'express-rate-limit'
import { S3Client, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'

const {
  PORT = 4000,
  CLIENT_ORIGIN = 'http://localhost:5173',
  JWT_SECRET,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  AWS_REGION = 'ap-south-1',
  S3_BUCKET,
  NODE_ENV,
} = process.env

if (!JWT_SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD || !S3_BUCKET) {
  console.error('Missing JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD or S3_BUCKET in .env')
  process.exit(1)
}

const s3 = new S3Client({ region: AWS_REGION })
const MAX_PDF_BYTES = 25 * 1024 * 1024
const adminHash = bcrypt.hashSync(ADMIN_PASSWORD, 10)

// ---- tiny JSON "database" (fine for one teacher + a few dozen students) ----
const DB_FILE = path.resolve('data/db.json')
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
const db = fs.existsSync(DB_FILE)
  ? JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  : { students: [], materials: [] }
const save = () => {
  fs.writeFileSync(`${DB_FILE}.tmp`, JSON.stringify(db, null, 2))
  fs.renameSync(`${DB_FILE}.tmp`, DB_FILE)
}

const app = express()
app.set('trust proxy', 1)
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json())
app.use(cookieParser())

const cookieOptions = {
  httpOnly: true,
  sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
  secure: NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

function auth(role) {
  return (req, res, next) => {
    try {
      const user = jwt.verify(req.cookies.token, JWT_SECRET)
      if (role && user.role !== role) return res.status(403).json({ error: 'Not allowed' })
      if (user.role === 'student' && !db.students.some((s) => s.id === user.id)) {
        return res.status(401).json({ error: 'This account has been removed' })
      }
      req.user = user
      next()
    } catch {
      res.status(401).json({ error: 'Please log in' })
    }
  }
}

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false })

// ---- auth ----
app.post('/api/login', loginLimiter, async (req, res) => {
  const username = String(req.body.username ?? '').trim().toLowerCase()
  const password = String(req.body.password ?? '')
  let user = null

  if (username === ADMIN_USERNAME.toLowerCase()) {
    if (await bcrypt.compare(password, adminHash)) user = { id: 'teacher', name: 'Geetha', role: 'teacher' }
  } else {
    const s = db.students.find((x) => x.username === username)
    if (s && (await bcrypt.compare(password, s.passwordHash))) user = { id: s.id, name: s.name, role: 'student' }
  }

  if (!user) return res.status(401).json({ error: 'Incorrect username or password' })
  res.cookie('token', jwt.sign(user, JWT_SECRET, { expiresIn: '7d' }), cookieOptions).json(user)
})

app.post('/api/logout', (_req, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: undefined }).json({ ok: true })
})

app.get('/api/me', auth(), (req, res) => {
  const { id, name, role } = req.user
  res.json({ id, name, role })
})

// ---- materials (students and teacher can read) ----
app.get('/api/materials', auth(), (_req, res) => {
  res.json([...db.materials].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
})

app.get('/api/materials/:id/url', auth(), async (req, res) => {
  const m = db.materials.find((x) => x.id === req.params.id)
  if (!m) return res.status(404).json({ error: 'File not found' })
  const download = req.query.download === '1'
  const safeName = `${m.title.replace(/[^\w\- ]+/g, '')}.pdf`
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: m.key,
      ResponseContentType: 'application/pdf',
      ResponseContentDisposition: `${download ? 'attachment' : 'inline'}; filename="${safeName}"`,
    }),
    { expiresIn: 300 },
  )
  res.json({ url })
})

// ---- teacher: materials ----
// Step 1: get a short-lived, size-limited upload form for S3
app.post('/api/admin/materials/upload', auth('teacher'), async (_req, res) => {
  const key = `materials/${crypto.randomUUID()}.pdf`
  const post = await createPresignedPost(s3, {
    Bucket: S3_BUCKET,
    Key: key,
    Conditions: [
      ['content-length-range', 1, MAX_PDF_BYTES],
      ['eq', '$Content-Type', 'application/pdf'],
    ],
    Fields: { 'Content-Type': 'application/pdf' },
    Expires: 300,
  })
  res.json({ ...post, key })
})

// Step 2: after the browser has uploaded, record it
app.post('/api/admin/materials', auth('teacher'), async (req, res) => {
  const { key, title, category } = req.body
  if (!String(key ?? '').startsWith('materials/') || !String(title ?? '').trim()) {
    return res.status(400).json({ error: 'Title and file are required' })
  }
  let size = 0
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key }))
    size = head.ContentLength ?? 0
  } catch {
    return res.status(400).json({ error: 'Upload not found in S3' })
  }
  const material = {
    id: crypto.randomUUID(),
    key,
    title: String(title).trim().slice(0, 120),
    category: String(category || 'Other').slice(0, 40),
    size,
    createdAt: new Date().toISOString(),
  }
  db.materials.push(material)
  save()
  res.status(201).json(material)
})

app.delete('/api/admin/materials/:id', auth('teacher'), async (req, res) => {
  const i = db.materials.findIndex((x) => x.id === req.params.id)
  if (i === -1) return res.status(404).json({ error: 'File not found' })
  const [m] = db.materials.splice(i, 1)
  save()
  await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: m.key })).catch(() => {})
  res.json({ ok: true })
})

// ---- teacher: students (credentials are issued here, students never sign up) ----
const PASSWORD_ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789' // no look-alike characters
const makePassword = () => Array.from({ length: 8 }, () => PASSWORD_ALPHABET[crypto.randomInt(PASSWORD_ALPHABET.length)]).join('')

function makeUsername(name) {
  const base = name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 12) || 'student'
  let username
  do {
    username = `${base}${crypto.randomInt(100, 1000)}`
  } while (db.students.some((s) => s.username === username) || username === ADMIN_USERNAME.toLowerCase())
  return username
}

const publicStudent = ({ passwordHash, ...s }) => s

app.get('/api/admin/students', auth('teacher'), (_req, res) => res.json(db.students.map(publicStudent)))

app.post('/api/admin/students', auth('teacher'), async (req, res) => {
  const name = String(req.body.name ?? '').trim().slice(0, 60)
  if (!name) return res.status(400).json({ error: 'Student name is required' })
  const password = makePassword()
  const student = {
    id: crypto.randomUUID(),
    name,
    username: makeUsername(name),
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: new Date().toISOString(),
  }
  db.students.push(student)
  save()
  res.status(201).json({ student: publicStudent(student), password })
})

app.post('/api/admin/students/:id/reset', auth('teacher'), async (req, res) => {
  const s = db.students.find((x) => x.id === req.params.id)
  if (!s) return res.status(404).json({ error: 'Student not found' })
  const password = makePassword()
  s.passwordHash = await bcrypt.hash(password, 10)
  save()
  res.json({ student: publicStudent(s), password })
})

app.delete('/api/admin/students/:id', auth('teacher'), (req, res) => {
  const i = db.students.findIndex((x) => x.id === req.params.id)
  if (i === -1) return res.status(404).json({ error: 'Student not found' })
  db.students.splice(i, 1)
  save()
  res.json({ ok: true })
})

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
