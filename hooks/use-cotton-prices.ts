import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { CottonPrice } from '@/lib/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useCottonPrices() {
  const [prices, setPrices] = useState<CottonPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('cotton_prices')
          .select('*')
          .order('updated_at', { ascending: false })

        if (error) throw error
        setPrices(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [])

  return { prices, loading, error }
}

export function useRealtimeCottonPrices() {
  const [prices, setPrices] = useState<CottonPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('cotton_prices')
          .select('*')
          .order('updated_at', { ascending: false })

        if (error) throw error
        setPrices(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prices')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('cotton_prices_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cotton_prices'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPrices(prev => [payload.new as CottonPrice, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setPrices(prev =>
              prev.map(price =>
                price.id === payload.new.id ? payload.new as CottonPrice : price
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setPrices(prev => prev.filter(price => price.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [])

  const refresh = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cotton_prices')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) throw error
      setPrices(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh prices')
    } finally {
      setLoading(false)
    }
  }

  return { prices, loading, error, refresh }
}
