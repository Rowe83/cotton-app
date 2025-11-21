import { TrendingUp, AlertCircle, Eye, Settings } from "lucide-react"

export default function QuickLinks() {
  const links = [
    {
      icon: TrendingUp,
      label: "价格走势",
      description: "查看历史图表",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-200",
    },
    {
      icon: AlertCircle,
      label: "市场分析",
      description: "深度解读",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-200",
    },
    {
      icon: Eye,
      label: "价格预测",
      description: "趋势预判",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-200",
    },
    {
      icon: Settings,
      label: "我的预警",
      description: "自定义提醒",
      color: "bg-teal-50 text-teal-600 dark:bg-teal-950 dark:text-teal-200",
    },
  ]

  return (
    <section className="px-4 space-y-4">
      <h2 className="text-lg font-bold text-foreground">快速导航</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {links.map((link, idx) => {
          const Icon = link.icon
          return (
            <button
              key={idx}
              className="bg-card border border-border rounded-lg p-4 text-center hover:border-accent transition-colors space-y-2"
            >
              <div className={`w-10 h-10 mx-auto ${link.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">{link.label}</p>
              <p className="text-xs text-muted-foreground">{link.description}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
