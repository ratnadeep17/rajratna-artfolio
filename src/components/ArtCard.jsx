import LikeButton from './LikeButton.jsx'

export default function ArtCard({ art, liked, onOpen, onToggleLike }) {
  return (
    <figure
      className="group relative mb-4 cursor-zoom-in break-inside-avoid overflow-hidden rounded-lg bg-stone"
      onClick={onOpen}
    >
      <img
        src={art.image_url}
        alt={art.title}
        loading="lazy"
        className="w-full transition duration-500 group-hover:scale-[1.03]"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-10 text-white opacity-0 transition group-hover:opacity-100">
        <p className="font-display text-base font-semibold">{art.title}</p>
        {art.medium && <p className="text-xs text-white/80">{art.medium}</p>}
      </figcaption>
      <div className="absolute right-2 top-2">
        <LikeButton liked={liked} count={art.likes} onToggle={onToggleLike} />
      </div>
    </figure>
  )
}
