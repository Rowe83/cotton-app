import { supabase } from './supabase'
import type { CottonPrice } from './types'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Get all cotton prices
export const getCottonPrices = async (): Promise<CottonPrice[]> => {
  const { data, error } = await supabase
    .from('cotton_prices')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Get cotton price by variety
export const getCottonPriceByVariety = async (varietyName: string): Promise<CottonPrice | null> => {
  const { data, error } = await supabase
    .from('cotton_prices')
    .select('*')
    .eq('variety_name', varietyName)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

// Insert new cotton price
export const insertCottonPrice = async (price: Omit<CottonPrice, 'id' | 'created_at' | 'updated_at'>): Promise<CottonPrice> => {
  const { data, error } = await supabase
    .from('cotton_prices')
    .insert(price)
    .select()
    .single()

  if (error) throw error
  return data
}

// Update cotton price
export const updateCottonPrice = async (id: string, updates: Partial<Omit<CottonPrice, 'id' | 'created_at' | 'updated_at'>>): Promise<CottonPrice> => {
  const { data, error } = await supabase
    .from('cotton_prices')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Subscribe to real-time cotton price updates
export const subscribeToCottonPrices = (callback: (payload: any) => void): RealtimeChannel => {
  const channel = supabase
    .channel('cotton_prices_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cotton_prices'
      },
      callback
    )
    .subscribe()

  return channel
}

// Subscribe to specific variety price updates
export const subscribeToCottonPriceByVariety = (varietyName: string, callback: (payload: any) => void): RealtimeChannel => {
  const channel = supabase
    .channel(`cotton_price_${varietyName}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'cotton_prices',
        filter: `variety_name=eq.${varietyName}`
      },
      callback
    )
    .subscribe()

  return channel
}
