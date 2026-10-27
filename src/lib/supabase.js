import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(url && key)

// Fall back to placeholders so the app still renders before .env is filled in
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  key || 'placeholder-key'
)

export const BUCKET = 'art'
//export const ARTIST_NAME = import.meta.env.VITE_ARTIST_NAME || 'Artist Name'
export const ARTIST_NAME = 'Rajratna'
