import { createClient } from '@supabase/supabase-js'


export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
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