'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        // Sign up new user
        const response = await signUp(email, password)
        
        // Check if email confirmation is required
        if (!response.session) {
          setMessage('Account created! Check your email to verify.')
        } else {
          // User was automatically logged in (no email confirmation required)
          setMessage('Account created and logged in!')
          router.push('/dashboard')
        }
      } else {
        // Log in existing user
        await signIn(email, password)
        setMessage('Logged in successfully!')
        
        // Redirect to dashboard
        router.push('/dashboard')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessage('Error: ' + errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">FoodFlow AI</h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Log In')}
            </button>
          </form>

          {message && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:underline text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Log in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}