"use client"

import { Card } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line } from "recharts"
import { useState } from "react"
import { ArrowLeft, Star, Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"

const PricePage = ({ params }: { params: { variety: string } }) => {
  const [timeFrame, setTimeFrame] = useState("日K")

  const variety = decodeURIComponent(params.variety)

  const getChartData = () => {
    if (timeFrame === "实时") {
      return [
        { time: "09:30", price: 15750 },
        { time: "10:00", price: 15800 },
        { time: "10:30", price: 15780 },
        { time: "11:00", price: 15850 },
        { time: "11:30", price: 15880 },
        { time: "13:00", price: 15820 },
        { time: "14:00", price: 15900 },
        { time: "15:00", price: 15850 },
      ]
    } else if (timeFrame === "日K") {
      return [
        { time: "10/22", price: 15650 },
        { time: "10/23", price: 15750 },
        { time: "10/24", price: 15680 },
        { time: "10/25", price: 15820 },
        { time: "10/26", price: 15880 },
      ]
    } else if (timeFrame === "周K") {
      return [
        { time: "W1", price: 15500 },
        { time: "W2", price: 15680 },
        { time: "W3", price: 15620 },
        { time: "W4", price: 15850 },
        { time: "W5", price: 15880 },
      ]
    } else {
      return [
        { time: "9月", price: 15200 },
        { time: "10月", price: 15650 },
        { time: "11月", price: 15880 },
        { time: "12月", price: 15750 },
      ]
    }
  }

  const chartData = getChartData()

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded p-2">
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
          <h1 className="text-lg font-semibold text-center flex-1 line-clamp-1">{variety}</h1>
          <Button variant="ghost" size="icon">
            <Star className="w-5 h-5" />
          </Button>
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
                    tick={{ fontSize: 12, fill: "#ffffff" }}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 12, fill: "#ffffff" }}
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

      {/* 纵坐标标签 */}
      <div className="mt-2 text-xs text-muted-foreground text-center">价格 (元/吨)</div>

      {/* Price Info */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <Card className="p-6 bg-card">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">24h High</p>
              <p className="text-2xl font-bold">15,880.00</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">24h Low</p>
              <p className="text-2xl font-bold">15,750.00</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card">
          <h3 className="font-semibold mb-4">市场指标</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">价格波动区间</span>
              <span className="font-medium">15,750 - 15,880</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">平均成交价</span>
              <span className="font-medium">15,815.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">历史成交量（周）</span>
              <span className="font-medium">8.5M手</span>
            </div>
          </div>
        </Card>

        <Link href={`/price/${variety}/alert`}>
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
