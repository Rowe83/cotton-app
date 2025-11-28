import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { News } from '@/lib/types'
import type { RealtimeChannel } from '@supabase/supabase-js'

export function useNews(limit?: number) {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })

        if (limit) {
          query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) throw error
        setNews(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [limit])

  return { news, loading, error }
}

export function useRealtimeNews(limit?: number) {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        let query = supabase
          .from('news')
          .select('*')
          .order('published_at', { ascending: false })

        if (limit) {
          query = query.limit(limit)
        }

        const { data, error } = await query

        if (error) throw error
        setNews(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch news')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('news_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNews(prev => [payload.new as News, ...prev.slice(0, limit || prev.length)])
          } else if (payload.eventType === 'UPDATE') {
            setNews(prev =>
              prev.map(item =>
                item.id === payload.new.id ? payload.new as News : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setNews(prev => prev.filter(item => item.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [limit])

  const refresh = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('news')
        .select('*')
        .order('published_at', { ascending: false })

      if (limit) {
        query = query.limit(limit)
      }

      const { data, error } = await query

      if (error) throw error
      setNews(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh news')
    } finally {
      setLoading(false)
    }
  }

  return { news, loading, error, refresh }
}
