import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, verifyBrandOwnership } from '@/lib/supabase-server'
import { getServerUser } from '@/lib/auth-server'
import type { Competitor } from '@/app/types'

// GET /api/competitors - Get competitors for user's brand
export async function GET() {
  try {
    // Get authenticated user
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First get user's brand
    const { data: brand, error: brandError } = await supabaseAdmin
      .from('brands')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (brandError) {
      // Check if it's a "not found" error (PGRST116) vs actual error
      if (brandError.code === 'PGRST116') {
        // User has no brand yet - return empty array
        return NextResponse.json({ competitors: [] })
      }
      // Actual error - log and return 500
      console.error('Error fetching brand:', brandError)
      return NextResponse.json(
        { error: 'Failed to fetch brand' },
        { status: 500 }
      )
    }

    if (!brand) {
      return NextResponse.json({ competitors: [] })
    }

    // Fetch competitors for the brand
    const { data, error } = await supabaseAdmin
      .from('competitors')
      .select('*')
      .eq('brand_id', brand.id)
      .order('added_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ competitors: data || [] })
  } catch (error) {
    console.error('Error fetching competitors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitors' },
      { status: 500 }
    )
  }
}

// POST /api/competitors - Add a new competitor
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { handle, platform = 'instagram', brand_id } = body

    // Validate required fields
    if (!handle || !brand_id) {
      return NextResponse.json(
        { error: 'Handle and brand_id are required' },
        { status: 400 }
      )
    }

    // Verify user owns this brand
    const ownsIt = await verifyBrandOwnership(brand_id, user.id)
    if (!ownsIt) {
      return NextResponse.json(
        { error: 'You do not own this brand' },
        { status: 403 }
      )
    }

    // Check if competitor already exists
    const { data: existing } = await supabaseAdmin
      .from('competitors')
      .select('id')
      .eq('brand_id', brand_id)
      .eq('handle', handle)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Competitor already exists' },
        { status: 400 }
      )
    }

    // Add new competitor
    const { data, error } = await supabaseAdmin
      .from('competitors')
      .insert([
        {
          handle,
          platform,
          brand_id
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ competitor: data }, { status: 201 })
  } catch (error) {
    console.error('Error adding competitor:', error)
    return NextResponse.json(
      { error: 'Failed to add competitor' },
      { status: 500 }
    )
  }
}