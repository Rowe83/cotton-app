"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import NewsCard from "@/components/news-card"
import Navigation from "@/components/navigation"

export default function NewsPage() {
  const [selectedTab, setSelectedTab] = useState("关键新闻")

  const newsList = {
    关键新闻: [
      {
        category: "头条",
        time: "2小时前",
        title: "新疆棉花收购价持续走强，市场信心得到提振",
        image: "/cotton-bales.jpg",
      },
      {
        category: "头条",
        time: "4小时前",
        title: "国际棉价波澜壮阔，国内外市场联动现象明显",
        image: "/cotton-market.jpg",
      },
    ],
    政策速递: [
      {
        category: "政策",
        time: "8小时前",
        title: "农业部发布最新棉花补贴政策解读",
        image: "/government-building.jpg",
      },
      {
        category: "政策",
        time: "1天前",
        title: "国家发布最新棉花补贴政策，重点支持南疆地区",
        image: "/policy-support.jpg",
      },
    ],
    深度分析: [
      {
        category: "分析",
        time: "3天前",
        title: "深度分析：全球棉花供需格局与未来价格走势",
        image: "/analysis-data.jpg",
      },
      {
        category: "分析",
        time: "5天前",
        title: "国内棉花库存数据公布，市场反应积极",
        image: "/data-analysis-visual.png",
      },
    ],
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">市场资讯</h1>
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6 overflow-x-auto">
            {Object.keys(newsList).map((tab) => (
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
        <div className="space-y-3">
          {newsList[selectedTab as keyof typeof newsList].map((item, idx) => (
            <NewsCard key={idx} {...item} />
          ))}
        </div>
      </div>

      <Navigation />
    </main>
  )
}
