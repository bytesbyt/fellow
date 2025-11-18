/**
 * Format a date string consistently across the app
 * Uses UTC timezone to avoid hydration mismatches
 */
export const formatDate = (dateString: string): string => {
  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    }).format(new Date(dateString))
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Format an Instagram handle
 * Ensures it starts with @ and trims whitespace
 */
export const formatInstagramHandle = (handle: string): string => {
  let formatted = handle.trim()
  if (!formatted.startsWith('@')) {
    formatted = '@' + formatted
  }
  return formatted
}

/**
 * Validate an Instagram handle
 * Accepts both "handle" and "@handle" formats
 * Returns true if valid, false otherwise
 */
export const validateInstagramHandle = (handle: string): boolean => {
  // Normalize the handle first (add @ if missing)
  const normalized = handle.trim().startsWith('@') 
    ? handle.trim() 
    : '@' + handle.trim()
  
  // Instagram handle rules:
  // - Must start with @
  // - 1-30 characters after the @
  // - Only letters, numbers, periods, and underscores
  const handleRegex = /^@[a-zA-Z0-9_.]{1,30}$/
  return handleRegex.test(normalized)
}

/**
 * Format and validate an Instagram handle
 * Returns { valid: boolean, formatted: string, error?: string }
 */
export const processInstagramHandle = (handle: string): {
  valid: boolean
  formatted: string
  error?: string
} => {
  const formatted = formatInstagramHandle(handle)
  const valid = validateInstagramHandle(formatted)
  
  return {
    valid,
    formatted,
    error: valid ? undefined : 'Invalid handle: use only letters, numbers, periods, and underscores (max 30 chars)'
  }
}