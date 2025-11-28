"use client"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Star, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import { useRealtimeCottonPrices } from "@/hooks/use-cotton-prices"
import { formatLastUpdateTime } from "@/lib/time-utils"

export default function MarketPage() {
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { prices, loading, error, refresh } = useRealtimeCottonPrices()

  // Update last update time when data changes
  useEffect(() => {
    if (prices.length > 0) {
      setLastUpdateTime(new Date())
    }
  }, [prices])

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

  const displayVarieties = prices.map(variety => ({
    name: variety.variety_name,
    price: variety.price.toLocaleString(),
    change: variety.change || "0.00%",
    isPositive: variety.is_positive,
    volume: `${(variety.volume / 1000).toFixed(1)}K手`,
    high: variety.high.toLocaleString(),
    low: variety.low.toLocaleString(),
    avgPrice: variety.avg_price.toLocaleString(),
    historyVolume: `${(variety.history_volume / 1000).toFixed(1)}K手`,
    updatedAt: variety.updated_at,
    id: variety.id
  }))

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold">行情</h1>
            <p className="text-xs text-muted-foreground">
              {formatLastUpdateTime(lastUpdateTime)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={isRefreshing ? "animate-spin" : ""}
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Cotton Varieties List */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-2">数据加载失败</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
          </div>
        ) : loading && !isRefreshing ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : displayVarieties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">暂无行情数据</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayVarieties.map((variety, index) => (
              <Link key={variety.id} href={`/price/${encodeURIComponent(variety.name)}`}>
                <Card className={`p-4 bg-card hover:bg-card/80 transition-all duration-300 cursor-pointer ${
                  variety.isPositive
                    ? "hover:shadow-green-500/10 hover:shadow-lg"
                    : "hover:shadow-red-500/10 hover:shadow-lg"
                } animate-in slide-in-from-bottom-2`}
                style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{variety.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{variety.price}</span>
                        <div
                          className={`flex items-center gap-1 text-sm font-medium transition-all duration-500 ${
                            variety.isPositive
                              ? "text-green-600 animate-in zoom-in-50"
                              : "text-red-600 animate-in zoom-in-50"
                          }`}
                        >
                          {variety.isPositive ? (
                            <TrendingUp className="w-4 h-4 animate-bounce" />
                          ) : (
                            <TrendingDown className="w-4 h-4 animate-bounce" />
                          )}
                          <span className={`transition-all duration-500 ${
                            variety.isPositive ? "animate-pulse" : ""
                          }`}>
                            {variety.change}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Star className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>

                  {/* Mini stats */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>成交量：{variety.volume}</div>
                    <div>24h高：{variety.high}</div>
                  </div>

                  {/* Last update time */}
                  <div className="mt-2 text-xs text-muted-foreground">
                    更新时间: {formatLastUpdateTime(variety.updatedAt)}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Navigation />
    </main>
  )
}
