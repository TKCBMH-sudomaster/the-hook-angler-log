import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("URL loaded:", !!supabaseUrl)
console.log("Key loaded:", !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars - check .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)