import { supabase } from './supabase'
import type { PriceAlert } from './types'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Get user's price alerts
export const getUserPriceAlerts = async (userId: string): Promise<PriceAlert[]> => {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Get active price alerts for a user
export const getActiveUserPriceAlerts = async (userId: string): Promise<PriceAlert[]> => {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Create new price alert
export const createPriceAlert = async (alert: Omit<PriceAlert, 'id' | 'created_at' | 'updated_at'>): Promise<PriceAlert> => {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert(alert)
    .select()
    .single()

  if (error) throw error
  return data
}

// Update price alert
export const updatePriceAlert = async (id: string, updates: Partial<Omit<PriceAlert, 'id' | 'created_at' | 'updated_at'>>): Promise<PriceAlert> => {
  const { data, error } = await supabase
    .from('price_alerts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete price alert
export const deletePriceAlert = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('price_alerts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Get price alerts by variety
export const getPriceAlertsByVariety = async (varietyName: string): Promise<PriceAlert[]> => {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('variety_name', varietyName)
    .eq('is_active', true)

  if (error) throw error
  return data || []
}

// Subscribe to user's price alert changes
export const subscribeToUserPriceAlerts = (userId: string, callback: (payload: any) => void): RealtimeChannel => {
  const channel = supabase
    .channel(`user_price_alerts_${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'price_alerts',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()

  return channel
}
