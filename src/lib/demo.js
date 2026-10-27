// Placeholder artworks shown until Supabase is configured, so you can see the layout right away.
const svg = (w, h, c1, c2) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient></defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`
  )

export const demoArtworks = [
  { id: 'demo-1', title: 'Morning Study', medium: 'Pencil sketch', description: 'Demo piece. Connect Supabase to see real art.', image_url: svg(800, 1000, '#d9c7b0', '#8c6f56'), likes: 12 },
  { id: 'demo-2', title: 'Blue Hour', medium: 'Oil on canvas', description: 'Demo piece.', image_url: svg(900, 700, '#2f4b7c', '#a3b8d8'), likes: 34 },
  { id: 'demo-3', title: 'Ember', medium: 'Acrylic', description: 'Demo piece.', image_url: svg(800, 800, '#b4532a', '#f2b880'), likes: 8 },
  { id: 'demo-4', title: 'Quiet Garden', medium: 'Watercolor', description: 'Demo piece.', image_url: svg(800, 1100, '#6b8f71', '#dfeacb'), likes: 21 },
  { id: 'demo-5', title: 'Portrait in Ink', medium: 'Ink', description: 'Demo piece.', image_url: svg(900, 650, '#1f1b16', '#6e655a'), likes: 17 },
  { id: 'demo-6', title: 'Dusk', medium: 'Gouache', description: 'Demo piece.', image_url: svg(800, 900, '#7a3e65', '#f3a683'), likes: 5 },
]
