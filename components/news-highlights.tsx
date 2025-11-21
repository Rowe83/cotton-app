import { ExternalLink } from "lucide-react"

export default function NewsHighlights() {
  const news = [
    {
      id: 1,
      title: "新疆棉花产量创历史新高，2024年有望突破300万吨",
      category: "产业动态",
      date: "2024-11-20",
      excerpt: "据最新数据显示，新疆棉花亩产和总产继续创新高，产业发展呈现良好势头...",
      image: "/cotton-field.png",
    },
    {
      id: 2,
      title: "国际棉价下跌，国内棉价将面临压力",
      category: "市场分析",
      date: "2024-11-19",
      excerpt: "受全球棉花供应增加影响，国际棉价跌幅超5%，专家预计国内价格承压...",
      image: "/price-chart.png",
    },
    {
      id: 3,
      title: "政策利好：国家储备棉定向投放启动",
      category: "政策",
      date: "2024-11-18",
      excerpt: "为稳定棉花市场，国家储备棉开始定向投放，目标是引导市场理性预期...",
      image: "/grand-government-building.png",
    },
    {
      id: 4,
      title: "棉花期货创新合约上线，交易量迅速增长",
      category: "市场动态",
      date: "2024-11-17",
      excerpt: "郑州商品交易所推出新型棉花期货产品，首日成交创新高，投资者热情高涨...",
      image: "/trading-floor.jpg",
    },
  ]

  return (
    <section className="px-4 pb-20 space-y-4">
      <h2 className="text-xl font-bold text-foreground">头条资讯</h2>

      <div className="space-y-3">
        {news.map((item) => (
          <article
            key={item.id}
            className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors cursor-pointer"
          >
            <div className="flex gap-4 p-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-24 h-20 rounded object-cover flex-shrink-0"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block text-xs px-2 py-1 rounded bg-accent text-accent-foreground font-semibold">
                      {item.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <h3 className="font-bold text-foreground line-clamp-2 text-sm">{item.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{item.excerpt}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
