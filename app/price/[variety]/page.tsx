"use client"

import { Card } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line } from "recharts"
import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Star, Bell, RefreshCw, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { useRealtimeCottonPrices } from "@/hooks/use-cotton-prices"
import { formatLastUpdateTime } from "@/lib/time-utils"

const PricePage = ({ params }: { params: { variety: string } }) => {
  const [timeFrame, setTimeFrame] = useState("日K")
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const variety = decodeURIComponent(params.variety)
  const { prices, loading, error, refresh } = useRealtimeCottonPrices()

  // Find the current variety's data
  const priceData = prices.find(p => p.variety_name === variety)

  // Update last update time when data changes
  useEffect(() => {
    if (priceData) {
      setLastUpdateTime(new Date(priceData.updated_at))
    }
  }, [priceData])

  // Pull to refresh functionality
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await refresh()
    } catch (error) {
      console.error('Refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [refresh])

  const getChartData = () => {
    if (!priceData) return []

    // Generate mock historical data based on current price
    const basePrice = priceData.price
    const volatility = 0.02 // 2% volatility

    if (timeFrame === "实时") {
      return Array.from({ length: 8 }, (_, i) => {
        const time = new Date()
        time.setHours(9 + Math.floor(i / 2), 30 + (i % 2) * 30)
        const variation = (Math.random() - 0.5) * volatility * basePrice
        return {
          time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          price: Math.round(basePrice + variation)
        }
      })
    } else if (timeFrame === "日K") {
      return Array.from({ length: 5 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (4 - i))
        const variation = (Math.random() - 0.5) * volatility * basePrice
        return {
          time: date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }).slice(-5),
          price: Math.round(basePrice + variation)
        }
      })
    } else if (timeFrame === "周K") {
      return Array.from({ length: 5 }, (_, i) => {
        const variation = (Math.random() - 0.5) * volatility * basePrice
        return {
          time: `W${i + 1}`,
          price: Math.round(basePrice + variation)
        }
      })
    } else {
      return Array.from({ length: 4 }, (_, i) => {
        const variation = (Math.random() - 0.5) * volatility * basePrice
        return {
          time: `${9 + i}月`,
          price: Math.round(basePrice + variation)
        }
      })
    }
  }

  const chartData = getChartData()

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded p-2 shadow-lg">
          <p className="text-sm font-medium">¥{payload[0].value.toLocaleString()} 元/吨</p>
        </div>
      )
    }
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/market">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold line-clamp-1">{variety}</h1>
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
              <Star className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Time Frame Selection */}
      <div className="max-w-6xl mx-auto px-4 py-4 border-b border-border">
        <div className="flex gap-3 justify-center">
          {["实时", "日K", "周K", "月K"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                timeFrame === tf
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Price Chart */}
      <div className="max-w-6xl mx-auto py-6">
        <div className="relative">
          <Card className="bg-card rounded-none">
            <div className="px-4 pt-4 pb-2">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(44, 100%, 55%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(44, 100%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="time"
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
                    domain={["dataMin - 50", "dataMax + 50"]}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="price" fill="url(#priceGradient)" stroke="none" />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(44, 100%, 55%)"
                    dot={false}
                    strokeWidth={2.5}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Price label */}
      <div className="mt-2 text-xs text-muted-foreground text-center">价格 (元/吨)</div>

      {/* Price Info */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-2">数据加载失败</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
          </div>
        ) : loading && !isRefreshing ? (
          <>
            <div className="h-32 bg-card rounded-lg animate-pulse" />
            <div className="h-48 bg-card rounded-lg animate-pulse" />
          </>
        ) : priceData ? (
          <>
            <Card className="p-6 bg-card animate-in slide-in-from-bottom-2">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">24h 最高</p>
                  <p className="text-2xl font-bold text-green-600">{priceData.high.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">24h 最低</p>
                  <p className="text-2xl font-bold text-red-600">{priceData.low.toLocaleString()}</p>
                </div>
              </div>

              {/* Current Price Display */}
              <div className="mt-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-3xl font-bold">{priceData.price.toLocaleString()}</span>
                  <span className="text-lg text-muted-foreground">元/吨</span>
                </div>
                <div className={`flex items-center justify-center gap-1 text-lg font-medium transition-all duration-500 ${
                  priceData.is_positive
                    ? "text-green-600 animate-in zoom-in-50"
                    : "text-red-600 animate-in zoom-in-50"
                }`}>
                  {priceData.is_positive ? (
                    <TrendingUp className="w-5 h-5 animate-bounce" />
                  ) : (
                    <TrendingDown className="w-5 h-5 animate-bounce" />
                  )}
                  <span className={`transition-all duration-500 ${
                    priceData.is_positive ? "animate-pulse" : ""
                  }`}>
                    {priceData.change}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card animate-in slide-in-from-bottom-2" style={{ animationDelay: "100ms" }}>
              <h3 className="font-semibold mb-4">市场指标</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">价格波动区间</span>
                  <span className="font-medium">{priceData.low.toLocaleString()} - {priceData.high.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">平均成交价</span>
                  <span className="font-medium">{priceData.avg_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">历史成交量（周）</span>
                  <span className="font-medium">{(priceData.history_volume / 1000).toFixed(1)}K手</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">成交量</span>
                  <span className="font-medium">{(priceData.volume / 1000).toFixed(1)}K手</span>
                </div>
              </div>
            </Card>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">暂无{variety}的数据</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
          </div>
        )}
      </div>

      {/* Alert Button */}
      <div className="max-w-6xl mx-auto px-4 pb-6">
        <Link href={`/price/${encodeURIComponent(variety)}/alert`}>
          <Button className="w-full" size="lg" variant="default">
            <Bell className="w-4 h-4 mr-2" />
            设置价格提醒
          </Button>
        </Link>
      </div>

      <Navigation />
    </main>
  )
}

export default PricePage
