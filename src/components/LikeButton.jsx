import { useState } from 'react'

export default function LikeButton({ liked, count, onToggle, size = 'md' }) {
  const [animate, setAnimate] = useState(false)

  const handle = (e) => {
    e.stopPropagation()
    setAnimate(true)
    setTimeout(() => setAnimate(false), 400)
    onToggle()
  }

  return (
    <button
      onClick={handle}
      aria-pressed={liked}
      aria-label={liked ? 'Remove like' : 'Like this artwork'}
      className={`inline-flex items-center gap-1.5 rounded-full bg-white/90 shadow-sm transition hover:bg-white ${
        size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1.5 text-sm'
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${animate ? 'pop' : ''}`}
        fill={liked ? '#e11d48' : 'none'}
        stroke={liked ? '#e11d48' : 'currentColor'}
        strokeWidth="2"
      >
        <path d="M12 21s-7-4.6-9.5-9.2C.6 8.2 2.6 4.5 6.2 4.5c2 0 3.2 1 3.8 2 .6-1 1.8-2 3.8-2 3.6 0 5.6 3.7 3.7 7.3C19 16.4 12 21 12 21z" />
      </svg>
      <span className="font-medium tabular-nums">{count}</span>
    </button>
  )
}
