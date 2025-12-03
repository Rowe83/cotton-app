-- Alternative setup using JWT sub field
-- If the main setup fails, try this version

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS cotton_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variety_name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  change TEXT,
  is_positive BOOLEAN DEFAULT false,
  volume INTEGER,
  high DECIMAL,
  low DECIMAL,
  avg_price DECIMAL,
  history_volume INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  variety_name TEXT NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  target_price DECIMAL NOT NULL,
  is_active BOOLEAN DEFAULT true,
  app_notification BOOLEAN DEFAULT true,
  sms_notification BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE cotton_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for cotton_prices and news)
DROP POLICY IF EXISTS "Allow public read access on cotton_prices" ON cotton_prices;
CREATE POLICY "Allow public read access on cotton_prices" ON cotton_prices
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access on news" ON news;
CREATE POLICY "Allow public read access on news" ON news
  FOR SELECT USING (true);

-- Create policies for authenticated users (using JWT sub field)
DROP POLICY IF EXISTS "Users can view their own alerts" ON price_alerts;
CREATE POLICY "Users can view their own alerts" ON price_alerts
  FOR SELECT USING (user_id::text = (auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can insert their own alerts" ON price_alerts;
CREATE POLICY "Users can insert their own alerts" ON price_alerts
  FOR INSERT WITH CHECK (user_id::text = (auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can update their own alerts" ON price_alerts;
CREATE POLICY "Users can update their own alerts" ON price_alerts
  FOR UPDATE USING (user_id::text = (auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can delete their own alerts" ON price_alerts;
CREATE POLICY "Users can delete their own alerts" ON price_alerts
  FOR DELETE USING (user_id::text = (auth.jwt() ->> 'sub'));

DROP POLICY IF EXISTS "Users can view their own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can view their own push subscriptions" ON push_subscriptions
  FOR SELECT USING (user_id::text = (auth.jwt() ->> 'sub') OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert their own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can insert their own push subscriptions" ON push_subscriptions
  FOR INSERT WITH CHECK (user_id::text = (auth.jwt() ->> 'sub') OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete their own push subscriptions" ON push_subscriptions;
CREATE POLICY "Users can delete their own push subscriptions" ON push_subscriptions
  FOR DELETE USING (user_id::text = (auth.jwt() ->> 'sub') OR user_id IS NULL);

-- Create policies for service role (for data seeding and API operations)
DROP POLICY IF EXISTS "Service role can manage cotton_prices" ON cotton_prices;
CREATE POLICY "Service role can manage cotton_prices" ON cotton_prices
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage news" ON news;
CREATE POLICY "Service role can manage news" ON news
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cotton_prices_variety_name ON cotton_prices(variety_name);
CREATE INDEX IF NOT EXISTS idx_cotton_prices_updated_at ON cotton_prices(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_cotton_prices_updated_at ON cotton_prices;
CREATE TRIGGER update_cotton_prices_updated_at BEFORE UPDATE ON cotton_prices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_price_alerts_updated_at ON price_alerts;
CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON price_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
