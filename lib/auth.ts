import { supabase } from './supabase-client'

// Sign up new user
export async function signUp(email: string, password: string) {
  // Basic client-side validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please provide a valid email address')
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

// Log in existing user
export async function signIn(email: string, password: string) {
  // Basic client-side validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please provide a valid email address')
  }
  if (!password) {
    throw new Error('Please provide a password')
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

// Log out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Get current user
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    throw new Error(`getCurrentUser failed: ${error.message}`)
  }
  
  return user
}