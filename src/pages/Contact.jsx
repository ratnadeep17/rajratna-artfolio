import { useState } from 'react'
import { ARTIST_NAME } from '../lib/supabase.js'

const encode = (data) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&')

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', 'bot-field': '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'contact', ...form }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('sent')
      setForm({ name: '', email: '', message: '', 'bot-field': '' })
    } catch {
      setStatus('error')
    }
  }

  const field =
    'w-full rounded-md border border-stone bg-white px-3 py-2.5 outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/20'

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display text-4xl font-semibold tracking-tight">Get in touch</h1>
      <p className="mt-3 text-ink/70">
        Interested in a piece, a commission, or just want to say hello? Send a message to {ARTIST_NAME}.
      </p>

      {status === 'sent' ? (
        <div className="mt-8 rounded-lg bg-green-50 p-5 text-green-800">
          Thank you! Your message has been sent. You will hear back soon.
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4" name="contact" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="contact" />
          <p className="hidden">
            <label>Don't fill this out: <input name="bot-field" value={form['bot-field']} onChange={update} /></label>
          </p>

          <label className="block">
            <span className="mb-1 block text-sm font-medium">Name</span>
            <input name="name" required value={form.name} onChange={update} className={field} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input name="email" type="email" required value={form.email} onChange={update} className={field} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Message</span>
            <textarea name="message" required rows={6} value={form.message} onChange={update} className={field} />
          </label>

          {status === 'error' && (
            <p className="text-sm text-red-700">Something went wrong. Please try again in a moment.</p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-md bg-clay px-6 py-2.5 font-medium text-white transition hover:bg-clay-dark disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  )
}
