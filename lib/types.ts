export interface CottonPrice {
  id: string
  variety_name: string
  price: number
  change: string
  is_positive: boolean
  volume: number
  high: number
  low: number
  avg_price: number
  history_volume: number
  updated_at: string
  created_at: string
}

export interface News {
  id: string
  category: string
  title: string
  content?: string
  image_url?: string
  published_at: string
  created_at: string
  updated_at: string
}

export interface PriceAlert {
  id: string
  user_id: string
  variety_name: string
  condition: 'above' | 'below'
  target_price: number
  is_active: boolean
  app_notification: boolean
  sms_notification: boolean
  created_at: string
  updated_at: string
}

export interface PushSubscription {
  id: string
  user_id: string
  endpoint: string
  p256dh: string
  auth: string
  created_at: string
}

// Database types
export interface Database {
  public: {
    Tables: {
      cotton_prices: {
        Row: CottonPrice
        Insert: Omit<CottonPrice, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<CottonPrice, 'id' | 'created_at' | 'updated_at'>>
      }
      news: {
        Row: News
        Insert: Omit<News, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<News, 'id' | 'created_at' | 'updated_at'>>
      }
      price_alerts: {
        Row: PriceAlert
        Insert: Omit<PriceAlert, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<PriceAlert, 'id' | 'created_at' | 'updated_at'>>
      }
      push_subscriptions: {
        Row: PushSubscription
        Insert: Omit<PushSubscription, 'id' | 'created_at'>
        Update: Partial<Omit<PushSubscription, 'id' | 'created_at'>>
      }
    }
  }
}
