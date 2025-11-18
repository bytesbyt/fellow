// Database schema types
export interface Brand {
  id: string
  brand_name: string
  instagram_handle: string | null
  industry: string
  user_id?: string
  created_at?: string
}

export interface Competitor {
  id: string
  handle: string
  platform: string
  brand_id: string
  added_at: string
}

// Industry options
export const INDUSTRIES = [
  { value: 'food', label: 'Food & Beverage' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'cpg', label: 'CPG Brand' },
] as const

export type Industry = typeof INDUSTRIES[number]['value']