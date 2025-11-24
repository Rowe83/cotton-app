import { Card } from "@/components/ui/card"
import Image from "next/image"

interface NewsCardProps {
  category: string
  time: string
  title: string
  image: string
}

export default function NewsCard({ category, time, title, image }: NewsCardProps) {
  return (
    <Card className="p-4 bg-card hover:bg-card/80 transition cursor-pointer">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{category}</span>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          <p className="text-sm text-foreground line-clamp-2">{title}</p>
        </div>
        <div className="w-24 h-20 rounded overflow-hidden flex-shrink-0 bg-muted">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            width={96}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Card>
  )
}
