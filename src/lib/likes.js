// Remembers which artworks this browser has already liked (soft spam guard)
const KEY = 'artfolio:liked'

export function getLiked() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'))
  } catch {
    return new Set()
  }
}

export function saveLiked(set) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]))
  } catch {
    /* storage unavailable, ignore */
  }
}
