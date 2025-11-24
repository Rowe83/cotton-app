"use client"

import Link from "next/link"
import { Home, TrendingUp, Newspaper, User } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { label: "首页", icon: Home, href: "/" },
    { label: "行情", icon: TrendingUp, href: "/market" },
    { label: "资讯", icon: Newspaper, href: "/news" },
    { label: "我的", icon: User, href: "/profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-3 px-4 text-xs font-medium transition ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
