"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowLeft, Trash2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import { getUserPriceAlerts, createPriceAlert, deletePriceAlert } from "@/lib/price-alerts"
import { getCurrentUser } from "@/lib/auth"
import { useRealtimeCottonPrices } from "@/hooks/use-cotton-prices"
import { formatLastUpdateTime } from "@/lib/time-utils"
import type { PriceAlert } from "@/lib/types"

export default function AlertPage({ params }: { params: { variety: string } }) {
  const [selectedCondition, setSelectedCondition] = useState("低于或等于")
  const [targetPrice, setTargetPrice] = useState("")
  const [appNotification, setAppNotification] = useState(true)
  const [smsNotification, setSmsNotification] = useState(true)
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const variety_name = decodeURIComponent(params.variety)
  const { prices, refresh: refreshPrices } = useRealtimeCottonPrices()

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        const [userData, alertsData] = await Promise.all([
          getCurrentUser(),
          user ? getUserPriceAlerts(user.id) : Promise.resolve([])
        ])

        setUser(userData)
        if (userData) {
          const userAlerts = await getUserPriceAlerts(userData.id)
          setAlerts(userAlerts)
        }
      } catch (error) {
        console.error('Error initializing data:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Update last update time when data changes
  useEffect(() => {
    if (alerts.length > 0 || prices.length > 0) {
      setLastUpdateTime(new Date())
    }
  }, [alerts, prices])

  // Pull to refresh functionality
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([
        refreshPrices(),
        user ? getUserPriceAlerts(user.id).then(setAlerts) : Promise.resolve()
      ])
      setLastUpdateTime(new Date())
    } catch (error) {
      console.error('Refresh error:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [refreshPrices, user])

  const handleCreateAlert = async () => {
    if (!user || !targetPrice) return

    setCreating(true)
    try {
      const condition = selectedCondition === "低于或等于" ? "below" : "above"
      const alertData = {
        user_id: user.id,
        variety_name: variety_name,
        condition: condition as "above" | "below",
        target_price: parseFloat(targetPrice),
        is_active: true,
        app_notification: appNotification,
        sms_notification: smsNotification,
      }

      const newAlert = await createPriceAlert(alertData)
      setAlerts(prev => [newAlert, ...prev])
      setTargetPrice("")
      setLastUpdateTime(new Date())
    } catch (error) {
      console.error('Error creating alert:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteAlert = async (alertId: string) => {
    try {
      await deletePriceAlert(alertId)
      setAlerts(prev => prev.filter(alert => alert.id !== alertId))
      setLastUpdateTime(new Date())
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }

  const getCurrentPrice = (varietyName: string) => {
    const price = prices.find(p => p.variety_name === varietyName)
    return price?.price || 0
  }

  const getDisplayAlerts = () => {
    return alerts
      .filter(alert => alert.variety_name === variety_name)
      .map(alert => {
        const currentPrice = getCurrentPrice(alert.variety_name)
        const isTriggered = alert.condition === 'below' ? currentPrice <= alert.target_price : currentPrice >= alert.target_price

        return {
          id: alert.id,
          type: alert.variety_name,
          condition: alert.condition === 'below' ? '≤' : '≥',
          price: alert.target_price,
          currentPrice,
          status: isTriggered ? "已触发" : "活跃中",
          statusColor: isTriggered ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50",
          createdAt: new Date(alert.created_at).toLocaleDateString('zh-CN'),
        }
      })
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={`/price/${encodeURIComponent(variety_name)}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold">价格预警</h1>
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

      {/* Create Alert Form */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-4">
          <h2 className="text-base font-semibold">设置新的价格预警</h2>

          {!user ? (
            <Card className="p-6 bg-card text-center">
              <p className="text-muted-foreground mb-4">请先登录后再设置价格预警</p>
              <Link href="/profile">
                <Button>去登录</Button>
              </Link>
            </Card>
          ) : (
            <>
              <Card className="p-4 bg-card animate-in slide-in-from-top-2">
                <label className="text-sm text-muted-foreground mb-2 block">棉花品种</label>
                <div className="w-full px-3 py-2 rounded bg-muted/50 text-foreground text-sm">{variety_name}</div>
              </Card>

              <Card className="p-4 bg-card animate-in slide-in-from-top-2" style={{ animationDelay: "50ms" }}>
                <label className="text-sm text-muted-foreground mb-2 block">预警条件</label>
                <div className="grid grid-cols-2 gap-2">
                  {["低于或等于", "高于或等于"].map((condition) => (
                    <button
                      key={condition}
                      onClick={() => setSelectedCondition(condition)}
                      className={`px-3 py-2 rounded text-sm font-medium transition border ${
                        selectedCondition === condition
                          ? "bg-primary/20 border-primary text-primary animate-in zoom-in-50"
                          : "bg-card border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-4 bg-card animate-in slide-in-from-top-2" style={{ animationDelay: "100ms" }}>
                <label className="text-sm text-muted-foreground mb-2 block">目标价格（元/吨）</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="请输入价格"
                  className="w-full px-3 py-2 rounded bg-input border border-border text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </Card>

              {/* Notifications */}
              <div className="space-y-3 py-2">
                <div className="flex items-center justify-between p-3 rounded bg-card border border-border animate-in slide-in-from-bottom-2" style={{ animationDelay: "150ms" }}>
                  <label className="text-sm">App内推送</label>
                  <button
                    onClick={() => setAppNotification(!appNotification)}
                    className={`relative w-12 h-6 rounded-full transition ${appNotification ? "bg-green-500" : "bg-gray-300"}`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                        appNotification ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-card border border-border animate-in slide-in-from-bottom-2" style={{ animationDelay: "200ms" }}>
                  <label className="text-sm">短信通知</label>
                  <button
                    onClick={() => setSmsNotification(!smsNotification)}
                    className={`relative w-12 h-6 rounded-full transition ${smsNotification ? "bg-green-500" : "bg-gray-300"}`}
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                        smsNotification ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <Button
                className="w-full animate-in slide-in-from-bottom-2"
                size="lg"
                onClick={handleCreateAlert}
                disabled={creating || !user || !targetPrice}
                style={{ animationDelay: "250ms" }}
              >
                {creating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    创建中...
                  </>
                ) : (
                  "创建预警"
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* My Alerts */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-base font-semibold mb-4">我的预警</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }, (_, i) => (
              <div key={i} className="h-32 bg-card rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {getDisplayAlerts().length === 0 ? (
              <div className="text-center py-8 animate-in fade-in-50">
                <p className="text-muted-foreground">暂无预警设置</p>
                <p className="text-sm text-muted-foreground mt-2">创建您的第一个价格预警来跟踪市场变化</p>
              </div>
            ) : (
              getDisplayAlerts().map((alert, index) => (
                <Card
                  key={alert.id}
                  className={`p-4 bg-card animate-in slide-in-from-bottom-2 transition-all duration-300 ${
                    alert.status === "已触发"
                      ? "border-red-200 bg-red-50/50"
                      : "border-green-200 bg-green-50/50"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{alert.type}</h3>
                      <p className="text-sm text-muted-foreground">当前价格: {alert.currentPrice.toLocaleString()} 元/吨</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${alert.statusColor} animate-in zoom-in-50`}>
                      {alert.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div>
                      <span className="text-lg font-bold text-primary">{alert.condition} {alert.price.toLocaleString()}</span>
                      <span className="text-muted-foreground ml-2">元/吨</span>
                    </div>
                    <span className="text-xs text-muted-foreground">创建于: {alert.createdAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1 hover:bg-primary/10">
                      编辑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <Navigation />
    </main>
  )
}
