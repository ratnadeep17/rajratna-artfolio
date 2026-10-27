import { useEffect, useMemo, useState, useCallback } from 'react'
import { supabase, isConfigured, ARTIST_NAME } from '../lib/supabase.js'
import { getLiked, saveLiked } from '../lib/likes.js'
import { demoArtworks } from '../lib/demo.js'
import ArtCard from '../components/ArtCard.jsx'
import Lightbox from '../components/Lightbox.jsx'

export default function Gallery() {
  const [arts, setArts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [liked, setLiked] = useState(getLiked)
  const [openIndex, setOpenIndex] = useState(null)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!isConfigured) {
        setArts(demoArtworks)
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false })
      if (cancelled) return
      if (error) setError('Could not load the gallery. Please try again later.')
      else setArts(data)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const mediums = useMemo(() => {
    const set = new Set(arts.map((a) => a.medium).filter(Boolean))
    return ['All', ...set]
  }, [arts])

  const visible = useMemo(
    () => (filter === 'All' ? arts : arts.filter((a) => a.medium === filter)),
    [arts, filter]
  )

  const toggleLike = useCallback(
    async (art) => {
      const isLiked = liked.has(art.id)
      const delta = isLiked ? -1 : 1

      // Optimistic update
      const nextLiked = new Set(liked)
      isLiked ? nextLiked.delete(art.id) : nextLiked.add(art.id)
      setLiked(nextLiked)
      saveLiked(nextLiked)
      setArts((prev) => prev.map((a) => (a.id === art.id ? { ...a, likes: Math.max(0, a.likes + delta) } : a)))

      if (!isConfigured) return
      const { data, error } = await supabase.rpc(isLiked ? 'unlike_artwork' : 'like_artwork', { p_id: art.id })
      if (error) {
        // Roll back
        const back = new Set(nextLiked)
        isLiked ? back.add(art.id) : back.delete(art.id)
        setLiked(back)
        saveLiked(back)
        setArts((prev) => prev.map((a) => (a.id === art.id ? { ...a, likes: Math.max(0, a.likes - delta) } : a)))
      } else if (typeof data === 'number') {
        setArts((prev) => prev.map((a) => (a.id === art.id ? { ...a, likes: data } : a)))
      }
    },
    [liked]
  )

  const openArt = openIndex !== null ? visible[openIndex] : null
  const prev = openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined
  const next = openIndex !== null && openIndex < visible.length - 1 ? () => setOpenIndex(openIndex + 1) : undefined

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10 text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Sketches &amp; Paintings
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink/70">
          A collection of work by {ARTIST_NAME}. Tap any piece to see it larger, leave a ♥ if it speaks to you.
        </p>
        {!isConfigured && (
          <p className="mx-auto mt-4 max-w-xl rounded-md bg-clay/10 px-3 py-2 text-sm text-clay-dark">
            Showing demo art. Add your Supabase keys in <code>.env</code> to connect the real gallery.
          </p>
        )}
      </section>

      {mediums.length > 2 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {mediums.map((m) => (
            <button
              key={m}
              onClick={() => { setFilter(m); setOpenIndex(null) }}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                filter === m
                  ? 'border-clay bg-clay text-white'
                  : 'border-stone bg-white text-ink/70 hover:border-clay/50'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="py-20 text-center text-ink/60">Loading gallery…</p>}
      {error && <p className="py-20 text-center text-red-700">{error}</p>}
      {!loading && !error && visible.length === 0 && (
        <p className="py-20 text-center text-ink/60">No artwork here yet. Check back soon.</p>
      )}

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {visible.map((art, i) => (
          <ArtCard
            key={art.id}
            art={art}
            liked={liked.has(art.id)}
            onOpen={() => setOpenIndex(i)}
            onToggleLike={() => toggleLike(art)}
          />
        ))}
      </div>

      {openArt && (
        <Lightbox
          art={openArt}
          liked={liked.has(openArt.id)}
          onToggleLike={() => toggleLike(openArt)}
          onClose={() => setOpenIndex(null)}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  )
}
