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
 * Ensures it starts with @ and follows Instagram rules
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
 * Returns true if valid, false otherwise
 */
export const validateInstagramHandle = (handle: string): boolean => {
  const handleRegex = /^@[a-zA-Z0-9_.]{1,30}$/
  return handleRegex.test(handle)
}