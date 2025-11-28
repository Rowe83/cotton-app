"use client"

import { useState, useEffect } from "react"
import { User, LogOut, Settings, Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/navigation"
import { supabase } from "@/lib/supabase"
import { useRealtimeCottonPrices } from "@/hooks/use-cotton-prices"
import { useRealtimeNews } from "@/hooks/use-news"
import { formatLastUpdateTime } from "@/lib/time-utils"
import Link from "next/link"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  const { prices, loading: pricesLoading, refresh: refreshPrices } = useRealtimeCottonPrices()
  const { news, loading: newsLoading, refresh: refreshNews } = useRealtimeNews()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        setUser(user)
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setSigningOut(false)
    }
  }

  const handleRefresh = async () => {
    await Promise.all([refreshPrices(), refreshNews()])
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">我的</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={pricesLoading || newsLoading}
            className={(pricesLoading || newsLoading) ? "animate-spin" : ""}
          >
            <RefreshCw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-32 bg-card rounded-lg animate-pulse" />
            <div className="h-20 bg-card rounded-lg animate-pulse" />
          </div>
        ) : user ? (
          <>
            <Card className="p-6 bg-card text-center mb-6 animate-in slide-in-from-top-2">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold mb-1">用户账户</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-2">
                上次更新: {formatLastUpdateTime(new Date())}
              </p>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-4 bg-card text-center animate-in slide-in-from-left-2">
                <p className="text-2xl font-bold text-primary">{prices.length}</p>
                <p className="text-sm text-muted-foreground">关注的品种</p>
              </Card>
              <Card className="p-4 bg-card text-center animate-in slide-in-from-right-2">
                <p className="text-2xl font-bold text-primary">{news.length}</p>
                <p className="text-sm text-muted-foreground">新闻资讯</p>
              </Card>
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Settings className="w-5 h-5" />
                <span>设置</span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                <LogOut className="w-5 h-5" />
                <span>{signingOut ? '退出中...' : '退出登录'}</span>
              </Button>
            </div>
          </>
        ) : (
          <Card className="p-6 bg-card text-center animate-in fade-in-50">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="font-semibold mb-2">未登录</p>
            <p className="text-sm text-muted-foreground mb-4">
              请先登录以使用完整功能
            </p>
            <Link href="/auth/login">
              <Button className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                邮箱登录
              </Button>
            </Link>
          </Card>
        )}
      </div>

      <Navigation />
    </main>
  )
}
