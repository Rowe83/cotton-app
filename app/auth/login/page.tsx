"use client"

import { useState } from "react"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navigation from "@/components/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setMessage("请输入邮箱地址")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setMessage("发送邮件失败，请重试")
        console.error('Login error:', error)
      } else {
        setIsSuccess(true)
        setMessage("登录链接已发送到您的邮箱，请查收邮件并点击链接登录")
      }
    } catch (error) {
      setMessage("发送邮件失败，请重试")
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">登录</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Login Form */}
      <div className="max-w-md mx-auto px-4 py-12">
        <Card className="p-6 bg-card animate-in slide-in-from-bottom-2">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">邮箱登录</h2>
            <p className="text-sm text-muted-foreground">
              输入您的邮箱地址，我们将发送登录链接
            </p>
          </div>

          {isSuccess ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-green-600 font-medium mb-4">{message}</p>
              <p className="text-sm text-muted-foreground mb-6">
                如果没有收到邮件，请检查垃圾邮件文件夹
              </p>
              <Link href="/profile">
                <Button className="w-full">
                  返回个人中心
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">邮箱地址</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱地址"
                  className="mt-1"
                  disabled={loading}
                />
              </div>

              {message && (
                <div className={`text-sm p-3 rounded ${
                  message.includes('失败') ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground'
                }`}>
                  {message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    发送中...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    发送登录链接
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              点击登录即表示您同意我们的使用条款和隐私政策
            </p>
          </div>
        </Card>
      </div>

      <Navigation />
    </main>
  )
}
