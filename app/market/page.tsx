"use client"
import Link from "next/link"
import { ArrowLeft, Star, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/navigation"

export default function MarketPage() {
  const varieties = [
    {
      name: "阿克苏长绒棉137",
      price: "15,880.00",
      change: "+2.5%",
      isPositive: true,
      volume: "1.2M手",
      high: "15,880.00",
      low: "15,750.00",
      avgPrice: "15,815.50",
      historyVolume: "8.5M手",
    },
    {
      name: "新疆细绒棉",
      price: "14,550.00",
      change: "-0.08%",
      isPositive: false,
      volume: "850K手",
      high: "14,600.00",
      low: "14,400.00",
      avgPrice: "14,515.25",
      historyVolume: "5.2M手",
    },
    {
      name: "郑棉主力",
      price: "15,200.00",
      change: "+1.2%",
      isPositive: true,
      volume: "2.1M手",
      high: "15,250.00",
      low: "15,100.00",
      avgPrice: "15,175.00",
      historyVolume: "12.8M手",
    },
  ]

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
          <h1 className="text-lg font-semibold">行情</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Cotton Varieties List */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {varieties.map((variety) => (
            <Link key={variety.name} href={`/price/${variety.name}`}>
              <Card className="p-4 bg-card hover:bg-card/80 transition cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{variety.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{variety.price}</span>
                      <div
                        className={`flex items-center gap-1 text-sm font-medium ${
                          variety.isPositive ? "text-accent" : "text-destructive"
                        }`}
                      >
                        {variety.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {variety.change}
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
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Navigation />
    </main>
  )
}
