import { supabase } from './supabase'
import type { PushSubscription } from './types'

// Get user's push subscriptions
export const getUserPushSubscriptions = async (userId: string): Promise<PushSubscription[]> => {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data || []
}

// Create push subscription
export const createPushSubscription = async (subscription: Omit<PushSubscription, 'id' | 'created_at'>): Promise<PushSubscription> => {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .insert(subscription)
    .select()
    .single()

  if (error) throw error
  return data
}

// Delete push subscription
export const deletePushSubscription = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Delete push subscription by endpoint
export const deletePushSubscriptionByEndpoint = async (endpoint: string): Promise<void> => {
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', endpoint)

  if (error) throw error
}

// Check if subscription exists
export const checkPushSubscriptionExists = async (endpoint: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('push_subscriptions')
    .select('id')
    .eq('endpoint', endpoint)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return !!data
}
