import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = 'https://ljpjkigzxvbnthbkbzmu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqcGpraWd6eHZibnRoYmtiem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjYwMTEsImV4cCI6MjA3OTgwMjAxMX0.aKshMLzyKRf5IVO67PnW81scwFBOr6oN_e_Y39HQRLc'

// Browser client (for client components)
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
