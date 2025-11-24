"use client"

import { useState } from "react"
import Link from "next/link"
import { TrendingUp, BarChart3, Bell, ShoppingCart, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import PriceCard from "@/components/price-card"
import NewsCard from "@/components/news-card"
import Navigation from "@/components/navigation"

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("新闻")

  const priceData = [
    {
      title: "今日收购价（元/公斤）",
      price: "15.82",
      change: "+0.15%",
      isPositive: true,
      updateTime: "更新于: 10:35",
      trend: "up",
    },
    {
      title: "郑棉主力（元/吨）",
      price: "14550",
      change: "-0.08%",
      isPositive: false,
      updateTime: "更新于: 10:35",
      trend: "down",
    },
  ]

  const news = [
    {
      category: "头条",
      time: "2小时前",
      title: "新疆棉花收购价持续走强，市场信心得到提振",
      image: "/cotton-bales.jpg",
    },
    {
      category: "政策",
      time: "8小时前",
      title: "农业部发布最新棉花补贴政策解读",
      image: "/government-building.jpg",
    },
    {
      category: "分析",
      time: "3天前",
      title: "深度分析：全球棉花供需格局与未来价格走势",
      image: "/analysis-data.jpg",
    },
  ]

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
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">新疆/原克苏</span>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Core Price Overview */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">核心价格速览</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {priceData.map((item, idx) => (
            <PriceCard key={idx} {...item} />
          ))}
        </div>
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
          {news.map((item, idx) => (
            <NewsCard key={idx} {...item} />
          ))}
        </div>
      </div>

      <Navigation />
    </main>
  )
}
