"use client"

import { useState, useCallback } from "react"
import { Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import NewsCard from "@/components/news-card"
import Navigation from "@/components/navigation"
import { useRealtimeNews } from "@/hooks/use-news"
import { formatNewsTime, formatLastUpdateTime } from "@/lib/time-utils"

const newsTabs = {
  头条: "头条",
  政策: "政策",
  分析: "分析",
  期货: "期货"
}

export default function NewsPage() {
  const [selectedTab, setSelectedTab] = useState("头条")
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { news, loading, error, refresh } = useRealtimeNews()

  // Filter news by category
  const filteredNews = news.filter(item => {
    if (selectedTab === "头条") return item.category === "头条" || !item.category
    if (selectedTab === "政策") return item.category === "政策"
    if (selectedTab === "分析") return item.category === "分析"
    if (selectedTab === "期货") return item.category?.includes("期货") || item.title?.includes("期货")
    return true
  })

  // Pull to refresh functionality
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refresh()
      setLastUpdateTime(new Date())
    } catch (error) {
      console.error('Refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [refresh])

  // Transform news data for display
  const displayNews = filteredNews.map(item => ({
    category: item.category || "新闻",
    time: formatNewsTime(item.published_at),
    title: item.title,
    image: item.image_url || "/cotton-bales.jpg",
  }))

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-semibold">市场资讯</h1>
            <p className="text-xs text-muted-foreground">
              {formatLastUpdateTime(lastUpdateTime)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={isRefreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            {Object.keys(newsTabs).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-3 px-2 text-sm font-medium border-b-2 -mb-[1px] transition whitespace-nowrap ${
                  selectedTab === tab
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-2">新闻加载失败</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
          </div>
        ) : loading && !isRefreshing ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-24 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : displayNews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无{selectedTab}资讯</p>
            <Button onClick={handleRefresh} variant="outline" className="mt-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayNews.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="animate-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <NewsCard {...item} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </main>
  )
}
