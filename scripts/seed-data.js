// Script to seed initial data into Supabase
const { createClient } = require('@supabase/supabase-js')

// Use environment variables or fallback to demo values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ljpjkigzxvbnthbkbzmu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqcGpraWd6eHZibnRoYmtiem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjYwMTEsImV4cCI6MjA3OTgwMjAxMX0.aKshMLzyKRf5IVO67PnW81scwFBOr6oN_e_Y39HQRLc'

const supabase = createClient(supabaseUrl, supabaseKey)

const samplePrices = [
  {
    variety_name: '阿克苏长绒棉137',
    price: 15.82,
    change: '+0.15%',
    is_positive: true,
    volume: 1200,
    high: 15.88,
    low: 15.75,
    avg_price: 15.82,
    history_volume: 8500
  },
  {
    variety_name: '新疆细绒棉',
    price: 14.55,
    change: '-0.08%',
    is_positive: false,
    volume: 850,
    high: 14.60,
    low: 14.40,
    avg_price: 14.52,
    history_volume: 5200
  },
  {
    variety_name: '郑棉主力',
    price: 14550,
    change: '-0.08%',
    is_positive: false,
    volume: 2100,
    high: 14550,
    low: 14500,
    avg_price: 14525,
    history_volume: 12800
  },
  {
    variety_name: 'CC Index 3128B',
    price: 148.96,
    change: '+5',
    is_positive: true,
    volume: 10000,
    high: 151.0,
    low: 147.0,
    avg_price: 148.96,
    history_volume: 10000
  }
]

const sampleNews = [
  {
    category: '头条',
    title: '新疆棉花收购价持续走强，市场信心得到提振',
    content: '来源: 中国棉花网综合整理',
    image_url: undefined,
    published_at: new Date().toISOString()
  },
  {
    category: '政策',
    title: '农业部发布最新棉花补贴政策解读',
    content: '来源: 中国棉花网综合整理',
    image_url: undefined,
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    category: '分析',
    title: '全球棉花供需格局与未来价格走势深度分析',
    content: '来源: 中国棉花网综合整理',
    image_url: undefined,
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    category: '头条',
    title: '国际棉价波澜壮阔，国内外市场联动现象明显',
    content: '来源: 中国棉花网综合整理',
    image_url: undefined,
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
]

async function seedData() {
  console.log('🌱 Seeding sample data...')

  // Check if we have service role key
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('⚠️  No SUPABASE_SERVICE_ROLE_KEY found. This may fail due to Row Level Security.')
    console.log('💡 Please run the SQL script in Supabase dashboard first:')
    console.log('   scripts/setup-database.sql')
    console.log('')
  }

  try {
    // Clear existing data first
    console.log('🧹 Clearing existing data...')
    await supabase.from('cotton_prices').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('news').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert sample prices
    console.log('📊 Inserting cotton prices...')
    const { data: pricesData, error: pricesError } = await supabase
      .from('cotton_prices')
      .insert(samplePrices)
      .select()

    if (pricesError) {
      console.error('❌ Error inserting prices:', pricesError)
    } else {
      console.log(`✅ Successfully inserted ${pricesData?.length || 0} price records`)
    }

    // Insert sample news
    console.log('📰 Inserting news...')
    const { data: newsData, error: newsError } = await supabase
      .from('news')
      .insert(sampleNews)
      .select()

    if (newsError) {
      console.error('❌ Error inserting news:', newsError)
    } else {
      console.log(`✅ Successfully inserted ${newsData?.length || 0} news records`)
    }

    console.log('🎉 Data seeding completed!')
    console.log('📱 Now refresh your app to see the data.')

  } catch (error) {
    console.error('💥 Error seeding data:', error)
    console.log('🔧 Make sure your Supabase credentials are correct in .env.local')
  }
}

// Run the seeder
seedData()
