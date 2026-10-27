import { useEffect, useState } from 'react'
import imageCompression from 'browser-image-compression'
import { supabase, isConfigured, BUCKET } from '../lib/supabase.js'

const field =
  'w-full rounded-md border border-stone bg-white px-3 py-2.5 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/20'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!isConfigured) { setChecking(false); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!isConfigured) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-ink/70">
        Connect Supabase first (see the README), then come back to this page.
      </div>
    )
  }
  if (checking) return <p className="py-20 text-center text-ink/60">Loading…</p>
  return session ? <Dashboard /> : <Login />
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Artist login</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-md bg-clay px-4 py-2.5 font-medium text-white hover:bg-clay-dark disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

function Dashboard() {
  const [arts, setArts] = useState([])
  const [title, setTitle] = useState('')
  const [medium, setMedium] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' })

  const load = async () => {
    const { data } = await supabase.from('artworks').select('*').order('created_at', { ascending: false })
    setArts(data || [])
  }
  useEffect(() => { load() }, [])

  const pickFile = (e) => {
    const f = e.target.files?.[0]
    setFile(f || null)
    setPreview(f ? URL.createObjectURL(f) : '')
  }

  const upload = async (e) => {
    e.preventDefault()
    if (!file) return setMsg({ type: 'error', text: 'Please choose an image.' })
    setBusy(true)
    setMsg({ type: '', text: '' })
    try {
      // Shrink big phone photos before upload (keeps free storage going further)
      const compressed = await imageCompression(file, {
        maxSizeMB: 1.2,
        maxWidthOrHeight: 2200,
        useWebWorker: true,
      })
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, compressed, {
        contentType: compressed.type || file.type,
        cacheControl: '31536000',
      })
      if (upErr) throw upErr

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)

      const { error: dbErr } = await supabase.from('artworks').insert({
        title: title.trim(),
        medium: medium.trim() || null,
        description: description.trim() || null,
        image_url: pub.publicUrl,
        image_path: path,
      })
      if (dbErr) {
        await supabase.storage.from(BUCKET).remove([path]) // clean up orphan file
        throw dbErr
      }

      setTitle(''); setMedium(''); setDescription(''); setFile(null); setPreview('')
      e.target.reset()
      setMsg({ type: 'ok', text: 'Uploaded! It is now live in the gallery.' })
      load()
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Upload failed.' })
    } finally {
      setBusy(false)
    }
  }

  const remove = async (art) => {
    if (!confirm(`Delete "${art.title}"? This cannot be undone.`)) return
    await supabase.storage.from(BUCKET).remove([art.image_path])
    const { error } = await supabase.from('artworks').delete().eq('id', art.id)
    if (error) setMsg({ type: 'error', text: error.message })
    else load()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Upload artwork</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-ink/60 underline hover:text-ink">
          Sign out
        </button>
      </div>

      <form onSubmit={upload} className="grid gap-4 rounded-lg border border-stone bg-white p-5 sm:grid-cols-2">
        <div className="space-y-4">
          <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
          <input placeholder="Medium (e.g. Oil on canvas, Pencil sketch)" value={medium} onChange={(e) => setMedium(e.target.value)} className={field} />
          <textarea placeholder="Description (optional)" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={field} />
          <input type="file" accept="image/*" onChange={pickFile} className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-stone file:px-3 file:py-2" />
        </div>
        <div className="flex min-h-48 items-center justify-center rounded-md bg-paper">
          {preview ? <img src={preview} alt="Preview" className="max-h-72 rounded" /> : <span className="text-sm text-ink/40">Image preview</span>}
        </div>
        <div className="sm:col-span-2">
          {msg.text && (
            <p className={`mb-3 text-sm ${msg.type === 'ok' ? 'text-green-700' : 'text-red-700'}`}>{msg.text}</p>
          )}
          <button disabled={busy} className="rounded-md bg-clay px-6 py-2.5 font-medium text-white hover:bg-clay-dark disabled:opacity-60">
            {busy ? 'Uploading…' : 'Publish'}
          </button>
        </div>
      </form>

      <h2 className="mb-4 mt-12 font-display text-2xl font-semibold">Your artworks ({arts.length})</h2>
      <ul className="divide-y divide-stone rounded-lg border border-stone bg-white">
        {arts.map((a) => (
          <li key={a.id} className="flex items-center gap-4 p-3">
            <img src={a.image_url} alt="" className="h-16 w-16 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{a.title}</p>
              <p className="text-sm text-ink/60">♥ {a.likes}{a.medium ? ` · ${a.medium}` : ''}</p>
            </div>
            <button onClick={() => remove(a)} className="text-sm text-red-700 hover:underline">Delete</button>
          </li>
        ))}
        {arts.length === 0 && <li className="p-5 text-sm text-ink/60">Nothing uploaded yet.</li>}
      </ul>
    </div>
  )
}
