import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, verifyBrandOwnership } from '@/lib/supabase-server'
import { getServerUser } from '@/lib/auth-server'

// DELETE /api/competitors/[id] - Delete a competitor
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const user = await getServerUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: competitorId } = await params

    // First verify the competitor belongs to user's brand
    const { data: competitor, error: fetchError } = await supabaseAdmin
      .from('competitors')
      .select('brand_id')
      .eq('id', competitorId)
      .single()

    // Check if competitor exists (PGRST116 = no rows returned)
    if (fetchError || !competitor) {
      if (fetchError?.code === 'PGRST116' || !competitor) {
        return NextResponse.json(
          { error: 'Competitor not found or already deleted' },
          { status: 404 }
        )
      }
      // Other database errors
      throw fetchError
    }

    // Verify user owns the brand
    const ownsIt = await verifyBrandOwnership(competitor.brand_id, user.id)
    
    if (!ownsIt) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this competitor' },
        { status: 403 }
      )
    }

    // Delete the competitor
    const { error } = await supabaseAdmin
      .from('competitors')
      .delete()
      .eq('id', competitorId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting competitor:', error)
    return NextResponse.json(
      { error: 'Failed to delete competitor' },
      { status: 500 }
    )
  }
}