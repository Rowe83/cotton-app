"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { TrendingUp, BarChart3, Bell, ShoppingCart, ArrowRight, Zap, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import PriceCard from "@/components/price-card"
import NewsCard from "@/components/news-card"
import Navigation from "@/components/navigation"
import { useRealtimeCottonPrices } from "@/hooks/use-cotton-prices"
import { useRealtimeNews } from "@/hooks/use-news"
import { formatLastUpdateTime, formatNewsTime } from "@/lib/time-utils"

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("头条")
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { prices, loading: pricesLoading, error: pricesError, refresh: refreshPrices } = useRealtimeCottonPrices()
  const { news, loading: newsLoading, error: newsError, refresh: refreshNews } = useRealtimeNews(10)

  // Update last update time when data changes
  useEffect(() => {
    if (prices.length > 0 || news.length > 0) {
      setLastUpdateTime(new Date())
    }
  }, [prices, news])

  // Pull to refresh functionality
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([refreshPrices(), refreshNews()])
      setLastUpdateTime(new Date())
    } catch (error) {
      console.error('Refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshPrices, refreshNews])

  // Filter news by category
  const filteredNews = news.filter(item => {
    if (selectedTab === "头条") return item.category === "头条" || !item.category
    if (selectedTab === "政策") return item.category === "政策"
    if (selectedTab === "期货") return item.category?.includes("期货") || item.title?.includes("期货")
    return true
  }).slice(0, 6)

  // Transform price data for display
  const displayPriceData = prices.slice(0, 2).map(price => ({
    title: `${price.variety_name}（元/吨）`,
    price: price.price.toLocaleString(),
    change: price.change || "0.00%",
    isPositive: price.is_positive,
    updateTime: `最后更新: ${formatLastUpdateTime(price.updated_at)}`,
    trend: (price.is_positive ? "up" : "down") as "up" | "down",
  }))

  // Transform news data for display
  const displayNews = filteredNews.map(item => ({
    category: item.category || "新闻",
    time: formatNewsTime(item.published_at),
    title: item.title,
    image: item.image_url || "/cotton-bales.jpg",
  }))

  const loading = pricesLoading || newsLoading

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">新棉通</h1>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">新疆/阿克苏</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatLastUpdateTime(lastUpdateTime)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={isRefreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Core Price Overview */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">核心价格速览</h2>
        {pricesError ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-2">数据加载失败</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayPriceData.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className={`transition-all duration-500 ${
                  item.isPositive
                    ? "animate-in slide-in-from-left-2"
                    : "animate-in slide-in-from-right-2"
                }`}
              >
                <PriceCard {...item} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { icon: TrendingUp, label: "价格走势", href: "/price-trend" },
            { icon: BarChart3, label: "市场分析", href: "/market-analysis" },
            { icon: ArrowRight, label: "政策解读", href: "/policy" },
            { icon: ShoppingCart, label: "我要卖棉", href: "/sell" },
          ].map((item, idx) => (
            <Link key={idx} href={item.href}>
              <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap bg-transparent">
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Market News */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">市场动态</h2>

        {/* News Tabs */}
        <div className="flex gap-6 border-b border-border mb-4 overflow-x-auto">
          {["头条", "政策", "期货"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`pb-3 px-2 text-sm font-medium border-b-2 -mb-[1px] transition whitespace-nowrap ${
                selectedTab === tab
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* News List */}
        <div className="space-y-4">
          {newsError ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-2">新闻加载失败</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                重试
              </Button>
            </div>
          ) : loading ? (
            Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-24 bg-card rounded-lg animate-pulse" />
            ))
          ) : displayNews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">暂无{selectedTab}新闻</p>
            </div>
          ) : (
            displayNews.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="animate-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <NewsCard {...item} />
              </div>
            ))
          )}
        </div>
      </div>

      <Navigation />
    </main>
  )
}
