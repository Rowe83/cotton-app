import { TrendingDown, TrendingUp } from "lucide-react"

export default function PriceOverview() {
  const prices = [
    {
      id: 1,
      name: "郑州期货",
      current: "15,850",
      change: "+145",
      percent: "+0.92%",
      trend: "up",
    },
    {
      id: 2,
      name: "新疆地级市平均价",
      current: "12,200",
      change: "-80",
      percent: "-0.65%",
      trend: "down",
    },
    {
      id: 3,
      name: "国家储备收购价",
      current: "11,950",
      change: "+20",
      percent: "+0.17%",
      trend: "up",
    },
    {
      id: 4,
      name: "国际棉价(ICE)",
      current: "82.45",
      change: "-2.15",
      percent: "-2.54%",
      trend: "down",
    },
  ]

  return (
    <section className="px-4 pt-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">实时价格</h2>
        <p className="text-sm text-muted-foreground">最新市场行情概览</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prices.map((price) => (
          <div
            key={price.id}
            className="bg-card border border-border rounded-lg p-4 hover:border-accent transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">{price.name}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{price.current}</span>
                  <span className="text-xs text-muted-foreground">元/吨</span>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold ${
                  price.trend === "up"
                    ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-200"
                    : "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-200"
                }`}
              >
                {price.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{price.percent}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              变化：{price.change} 元/吨
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
