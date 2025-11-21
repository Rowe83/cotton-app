import { TrendingUp, Bell } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：Logo和标题 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">棉花市场</h1>
              <p className="text-xs text-muted-foreground">实时价格分析平台</p>
            </div>
          </div>

          {/* 右侧：消息按钮 */}
          <button className="p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  )
}
