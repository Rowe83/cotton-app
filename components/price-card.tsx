"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface PriceCardProps {
  title: string
  price: string
  change: string
  isPositive: boolean
  updateTime: string
  trend: "up" | "down"
}

export default function PriceCard({ title, price, change, isPositive, updateTime, trend }: PriceCardProps) {
  const chartData =
    trend === "up"
      ? [
          { name: "09/28", value: 100 },
          { name: "10/05", value: 108 },
          { name: "10/12", value: 102 },
          { name: "10/19", value: 115 },
          { name: "10/26", value: 125 },
          { name: "11/02", value: 132 },
          { name: "11/09", value: 140 },
          { name: "11/16", value: 138 },
        ]
      : [
          { name: "09/28", value: 100 },
          { name: "10/05", value: 98 },
          { name: "10/12", value: 105 },
          { name: "10/19", value: 95 },
          { name: "10/26", value: 92 },
          { name: "11/02", value: 88 },
          { name: "11/09", value: 85 },
          { name: "11/16", value: 87 },
        ]

  return (
    <Card className="p-4 bg-card hover:bg-card/80 transition cursor-pointer">
      <p className="text-sm text-muted-foreground mb-3">{title}</p>
      <div className="mb-4">
        <p className="text-3xl font-bold mb-2">{price}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{updateTime}</span>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-accent" : "text-destructive"}`}
          >
            {trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {change}
          </div>
        </div>
      </div>

      <div className="h-20 -mx-4 -mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis dataKey="name" stroke="transparent" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis stroke="transparent" domain={["auto", "auto"]} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke={trend === "up" ? "#22c55e" : "#ef4444"}
              dot={false}
              strokeWidth={2.5}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
