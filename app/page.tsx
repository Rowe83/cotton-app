"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Header from "@/components/header"
import PriceOverview from "@/components/price-overview"
import NewsHighlights from "@/components/news-highlights"
import QuickLinks from "@/components/quick-links"
import Footer from "@/components/footer"

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 顶部导航 */}
      <Header />

      {/* 主内容区 */}
      <main className="flex-1">
        {activeTab === "home" && (
          <div className="space-y-6 pb-20">
            <PriceOverview />
            <QuickLinks />
            <NewsHighlights />
          </div>
        )}
        {activeTab === "market" && (
          <div className="p-4 pb-20">
            <h1 className="text-2xl font-bold text-foreground">市场资讯</h1>
            <p className="text-muted-foreground mt-2">市场新闻与深度分析内容</p>
          </div>
        )}
        {activeTab === "predict" && (
          <div className="p-4 pb-20">
            <h1 className="text-2xl font-bold text-foreground">价格预测</h1>
            <p className="text-muted-foreground mt-2">棉花价格走势预测和分析</p>
          </div>
        )}
        {activeTab === "profile" && (
          <div className="p-4 pb-20">
            <h1 className="text-2xl font-bold text-foreground">我的</h1>
            <p className="text-muted-foreground mt-2">价格预警和个人设置</p>
          </div>
        )}
      </main>

      {/* 底部导航 */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 页脚 */}
      <Footer />
    </div>
  )
}
