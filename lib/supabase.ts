import { createBrowserClient } from '@supabase/ssr'

// Environment variables with fallback values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ljpjkigzxvbnthbkbzmu.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqcGpraWd6eHZibnRoYmtiem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjYwMTEsImV4cCI6MjA3OTgwMjAxMX0.aKshMLzyKRf5IVO67PnW81scwFBOr6oN_e_Y39HQRLc'

// Browser client (for client components)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
