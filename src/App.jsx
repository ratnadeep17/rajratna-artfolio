import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'
import { ARTIST_NAME } from './lib/supabase.js'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Gallery />} />
        </Routes>
      </main>
      <footer className="border-t border-stone py-8 text-center text-sm text-ink/60">
        © {new Date().getFullYear()} {ARTIST_NAME}. All artwork belongs to the artist.
      </footer>
    </div>
  )
}
