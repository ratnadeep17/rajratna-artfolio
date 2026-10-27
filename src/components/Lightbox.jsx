import { useEffect } from 'react'
import LikeButton from './LikeButton.jsx'

export default function Lightbox({ art, liked, onToggleLike, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  if (!art) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={art.title}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1 text-2xl leading-none text-white hover:bg-white/20"
        aria-label="Close"
      >
        ×
      </button>

      {onPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-3xl text-white hover:bg-white/20"
          aria-label="Previous"
        >
          ‹
        </button>
      )}
      {onNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 px-3 py-2 text-3xl text-white hover:bg-white/20"
          aria-label="Next"
        >
          ›
        </button>
      )}

      <div
        className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-paper"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={art.image_url}
          alt={art.title}
          className="max-h-[70vh] w-full bg-black/5 object-contain"
        />
        <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
          <div>
            <h2 className="font-display text-xl font-semibold">{art.title}</h2>
            {art.medium && <p className="text-sm text-clay">{art.medium}</p>}
            {art.description && (
              <p className="mt-2 text-sm text-ink/75 whitespace-pre-line">{art.description}</p>
            )}
          </div>
          <LikeButton size="lg" liked={liked} count={art.likes} onToggle={onToggleLike} />
        </div>
      </div>
    </div>
  )
}
