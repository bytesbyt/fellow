import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

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

// Create a Supabase client configured to use cookies for auth
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

// Get current user from server-side
export const getServerUser = async () => {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}