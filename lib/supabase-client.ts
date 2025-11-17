'use client'

import { createBrowserClient } from '@supabase/ssr'

// Validate required environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing required environment variables: ' +
    (!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : '') +
    (!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : '')
  )
}

// Create a Supabase client for client-side use with cookie-based auth
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)