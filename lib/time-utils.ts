import { formatDistanceToNow, format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatLastUpdateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) {
    return '刚刚'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  } else if (diffInMinutes < 1440) { // Less than 24 hours
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours}小时前`
  } else {
    return format(dateObj, 'MM/dd HH:mm', { locale: zhCN })
  }
}

export function formatNewsTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: zhCN })
  } else if (diffInDays === 1) {
    return '昨天'
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`
  } else {
    return format(dateObj, 'MM/dd', { locale: zhCN })
  }
}
