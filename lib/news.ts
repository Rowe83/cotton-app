import { supabase } from './supabase'
import type { News } from './types'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Get all news
export const getNews = async (): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Get news by category
export const getNewsByCategory = async (category: string): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('category', category)
    .order('published_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Get latest news (limited)
export const getLatestNews = async (limit: number = 10): Promise<News[]> => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// Insert new news
export const insertNews = async (news: Omit<News, 'id' | 'created_at' | 'updated_at'>): Promise<News> => {
  const { data, error } = await supabase
    .from('news')
    .insert(news)
    .select()
    .single()

  if (error) throw error
  return data
}

// Update news
export const updateNews = async (id: string, updates: Partial<Omit<News, 'id' | 'created_at' | 'updated_at'>>): Promise<News> => {
  const { data, error } = await supabase
    .from('news')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete news
export const deleteNews = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('news')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Subscribe to real-time news updates
export const subscribeToNews = (callback: (payload: any) => void): RealtimeChannel => {
  const channel = supabase
    .channel('news_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'news'
      },
      callback
    )
    .subscribe()

  return channel
}
