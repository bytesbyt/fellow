'use client'

import { createBrowserClient } from '@supabase/ssr'

// Create a Supabase client for client-side use with cookie-based auth
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)