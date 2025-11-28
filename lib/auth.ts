import { supabase } from './supabase'
import { createSupabaseServerClient } from './supabase-server'
import type { User } from '@supabase/supabase-js'

// Sign in with magic link
export const signInWithMagicLink = async (email: string): Promise<{ error?: any }> => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { error }
}

// Sign out
export const signOut = async (): Promise<{ error?: any }> => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Get current user (client-side)
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

// Get current user (server-side)
export const getCurrentUserServer = async (): Promise<User | null> => {
  const supabaseServer = await createSupabaseServerClient()
  const { data: { user }, error } = await supabaseServer.auth.getUser()
  if (error) throw error
  return user
}

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback)
}
