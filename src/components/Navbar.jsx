import { NavLink, Link } from 'react-router-dom'
import { ARTIST_NAME } from '../lib/supabase.js'

const link = ({ isActive }) =>
  `px-1 pb-1 text-sm font-medium transition-colors border-b-2 ${
    isActive ? 'border-clay text-clay' : 'border-transparent text-ink/70 hover:text-ink'
  }`

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          {ARTIST_NAME}
        </Link>
        <nav className="flex gap-6">
          <NavLink to="/" end className={link}>Gallery</NavLink>
          <NavLink to="/contact" className={link}>Contact</NavLink>
        </nav>
      </div>
    </header>
  )
}
