"use client"

import { User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Navigation from "@/components/navigation"

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold">我的</h1>
        </div>
      </div>

      {/* User Profile */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card className="p-6 bg-card text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-primary" />
          </div>
          <p className="font-semibold mb-1">用户账户</p>
          <p className="text-sm text-muted-foreground">user@example.com</p>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="w-5 h-5" />
            <span>设置</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive">
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </Button>
        </div>
      </div>

      <Navigation />
    </main>
  )
}
