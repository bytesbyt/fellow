import { createClient } from '@supabase/supabase-js'

// Validate required environment variables at startup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing required environment variables: ' +
    (!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : '') +
    (!serviceRoleKey ? 'SUPABASE_SERVICE_ROLE_KEY' : '')
  )
}

// Server-side Supabase client with service role key
// This bypasses RLS and should ONLY be used in server-side code
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper to verify user owns a brand
export const verifyBrandOwnership = async (brandId: string, userId: string) => {
  const { data, error } = await supabaseAdmin
    .from('brands')
    .select('id')
    .eq('id', brandId)
    .eq('user_id', userId)
    .single()
  
  return !error && data !== null
}