'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import { User } from '@supabase/supabase-js'
import type { Brand, Competitor } from '@/app/types'

const Dashboard = () => {
  // Brand state
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loadingBrand, setLoadingBrand] = useState(true)
  
  // Brand form state
  const [brandName, setBrandName] = useState('')
  const [brandHandle, setBrandHandle] = useState('')
  const [brandIndustry, setBrandIndustry] = useState('food')
  
  // Competitor state
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [competitors, setCompetitors] = useState<Competitor[]>([])

  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Check for existing brand using API
  const checkForBrand = async (): Promise<void> => {
    try {
      const response = await fetch('/api/brands')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('Failed to fetch brand')
      }

      const { brand } = await response.json()
      setBrand(brand)
    } catch (error) {
      console.error('Error fetching brand:', error)
    } finally {
      setLoadingBrand(false)
    }
  }

  // Fetch competitors using API
  const fetchCompetitors = async (): Promise<void> => {
    try {
      const response = await fetch('/api/competitors')
      
      if (!response.ok) {
        throw new Error('Failed to fetch competitors')
      }

      const { competitors } = await response.json()
      setCompetitors(competitors || [])
    } catch (error) {
      console.error('Error fetching competitors:', error)
    }
  }

  // Create brand handler using API
  const handleCreateBrand = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand_name: brandName,
          instagram_handle: brandHandle,
          industry: brandIndustry,
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to create brand')
      }

      const { brand } = await response.json()
      setBrand(brand)
      setMessage('Brand created successfully!')
      
      // Clear form
      setBrandName('')
      setBrandHandle('')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessage('Error: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Add competitor handler using API
  const handleAddCompetitor = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!brand) return

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/competitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handle: handle,
          platform: 'instagram',
          brand_id: brand.id,
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to add competitor')
      }

      setMessage('Competitor added successfully!')
      setHandle('')
      fetchCompetitors()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessage('Error: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Delete competitor handler using API
  const handleDelete = async (competitorId: string, handle: string): Promise<void> => {
    if (!confirm(`Are you sure you want to remove ${handle}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/competitors/${competitorId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || 'Failed to delete competitor')
      }

      fetchCompetitors()
    } catch (error) {
      console.error('Error deleting competitor:', error)
      alert('Failed to delete competitor')
    }
  }

  // Logout handler
  const handleLogout = async (): Promise<void> => {
    try {
      await signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        const currentUser = await getCurrentUser()
        
        if (!currentUser) {
          router.push('/login')
          return
        }
        
        setUser(currentUser)
        await checkForBrand()
      } catch (error) {
        console.error('Auth error:', error)
        router.push('/login')
      } finally {
        setCheckingAuth(false)
      }
    }
    
    checkAuth()
  }, [router])

  // Fetch competitors when brand is set
  useEffect(() => {
    if (brand) {
      fetchCompetitors()
    }
  }, [brand])

  // Loading state
  if (loadingBrand || checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  // Brand creation form
  if (!brand) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome to FoodFlow AI!</h1>
          <p className="text-gray-600 mb-8">Let&apos;s start by creating your brand profile</p>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Create Your Brand</h2>
            
            <form onSubmit={handleCreateBrand} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Joe's Coffee Shop"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Instagram Handle (optional)
                </label>
                <input
                  type="text"
                  value={brandHandle}
                  onChange={(e) => setBrandHandle(e.target.value)}
                  placeholder="@joescoffee"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry
                </label>
                <select
                  value={brandIndustry}
                  onChange={(e) => setBrandIndustry(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="food">Food & Beverage</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Cafe</option>
                  <option value="cpg">CPG Brand</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Brand'}
              </button>
            </form>

            {message && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Main dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Brand Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">FoodFlow AI Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Managing: <span className="font-semibold text-blue-600">{brand.brand_name}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Log Out
          </button>
        </div>
        
        {/* Add Competitor Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Competitor</h2>
          
          <form onSubmit={handleAddCompetitor} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Instagram Handle
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@competitor"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Competitor'}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-gray-100 rounded">
              {message}
            </div>
          )}
        </div>

        {/* Competitors List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Your Competitors ({competitors.length})
          </h2>
          
          {competitors.length === 0 ? (
            <p className="text-gray-500">No competitors added yet. Add your first one above!</p>
          ) : (
            <div className="space-y-3">
              {competitors.map((competitor) => (
                <div 
                  key={competitor.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{competitor.handle}</p>
                    <p className="text-sm text-gray-500">
                      Added: {new Date(competitor.added_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {competitor.platform}
                    </span>
                    
                    <button
                      onClick={() => handleDelete(competitor.id, competitor.handle)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard