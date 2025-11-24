"use client"

import { useState } from "react"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/navigation"

export default function AlertPage({ params }: { params: { variety: string } }) {
  const [selectedCondition, setSelectedCondition] = useState("低于或等于")
  const [targetPrice, setTargetPrice] = useState("")
  const [appNotification, setAppNotification] = useState(true)
  const [smsNotification, setSmsNotification] = useState(true)
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "长绒棉",
      condition: "≤",
      price: 15000,
      currentPrice: 15230,
      status: "活跃中",
      statusColor: "text-accent",
      createdAt: "2023-10-26",
    },
    {
      id: 2,
      type: "细绒棉",
      condition: "≥",
      price: 18000,
      currentPrice: 15150,
      status: "已触发",
      statusColor: "text-destructive",
      createdAt: "2023-10-22",
    },
  ])

  const variety_name = decodeURIComponent(params.variety)

  const handleCreateAlert = () => {
    if (targetPrice) {
      // Handle alert creation
      console.log("Creating alert:", { selectedCondition, targetPrice, appNotification, smsNotification })
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/price/${params.variety}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">价格预警</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Create Alert Form */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-4">
          <h2 className="text-base font-semibold">设置新的价格预警</h2>

          <Card className="p-4 bg-card">
            <label className="text-sm text-muted-foreground mb-2 block">棉花品种</label>
            <div className="w-full px-3 py-2 rounded bg-muted/50 text-foreground text-sm">{variety_name}</div>
          </Card>

          <Card className="p-4 bg-card">
            <label className="text-sm text-muted-foreground mb-2 block">预警条件</label>
            <div className="grid grid-cols-2 gap-2">
              {["低于或等于", "高于或等于"].map((condition) => (
                <button
                  key={condition}
                  onClick={() => setSelectedCondition(condition)}
                  className={`px-3 py-2 rounded text-sm font-medium transition border ${
                    selectedCondition === condition
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-card border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4 bg-card">
            <label className="text-sm text-muted-foreground mb-2 block">目标价格（元/吨）</label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="请输入价格"
              className="w-full px-3 py-2 rounded bg-input border border-border text-foreground placeholder-muted-foreground text-sm"
            />
          </Card>

          {/* Notifications */}
          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between p-3 rounded bg-card border border-border">
              <label className="text-sm">App内推送</label>
              <button
                onClick={() => setAppNotification(!appNotification)}
                className={`relative w-12 h-6 rounded-full transition ${appNotification ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    appNotification ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded bg-card border border-border">
              <label className="text-sm">短信通知</label>
              <button
                onClick={() => setSmsNotification(!smsNotification)}
                className={`relative w-12 h-6 rounded-full transition ${smsNotification ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    smsNotification ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleCreateAlert}>
            创建预警
          </Button>
        </div>
      </div>

      {/* My Alerts */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-base font-semibold mb-4">我的预警</h2>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card key={alert.id} className="p-4 bg-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{alert.type}</h3>
                  <p className="text-sm text-muted-foreground">当前价格: {alert.currentPrice} 元/吨</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${alert.statusColor}`}>{alert.status}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-3">
                <div>
                  <span className="text-lg font-bold">= {alert.price}</span>
                  <span className="text-muted-foreground ml-2">元/吨</span>
                </div>
                <span className="text-xs text-muted-foreground">创建于: {alert.createdAt}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  编辑
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Navigation />
    </main>
  )
}
