import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getServerUser } from '@/lib/auth-server'
import type { Brand } from '@/app/types'

// GET /api/brands - Get user's brand
export async function GET() {
  try {
    // Get authenticated user
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's brand
    const { data, error } = await supabaseAdmin
      .from('brands')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }

    return NextResponse.json({ brand: data })
  } catch (error) {
    console.error('Error fetching brand:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand' },
      { status: 500 }
    )
  }
}

// POST /api/brands - Create a new brand
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const { brand_name, instagram_handle, industry } = body

    // Validate required fields
    if (!brand_name || !industry) {
      return NextResponse.json(
        { error: 'Brand name and industry are required' },
        { status: 400 }
      )
    }

    // Check if user already has a brand
    const { data: existingBrand } = await supabaseAdmin
      .from('brands')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (existingBrand) {
      return NextResponse.json(
        { error: 'User already has a brand' },
        { status: 400 }
      )
    }

    // Create new brand
    const { data, error } = await supabaseAdmin
      .from('brands')
      .insert([
        {
          brand_name,
          instagram_handle,
          industry,
          user_id: user.id
        }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ brand: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}