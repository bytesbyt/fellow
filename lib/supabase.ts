import { createClient } from '@supabase/supabase-js'

// Get the keys from your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create the client (this is your connection to the database)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)