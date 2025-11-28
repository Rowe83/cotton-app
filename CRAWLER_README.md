# 棉花数据爬虫系统

这个 Vercel Serverless 函数会自动爬取棉花价格和新闻数据，并保存到 Supabase 数据库中。

## 🚀 功能特性

- ✅ **自动爬取**：每天 8:00、14:00、20:00 自动运行
- ✅ **多数据源**：爬取中国棉花信息网、MySteel、郑商所等多个网站
- ✅ **智能去重**：同一天同一地区的数据不会重复插入
- ✅ **实时数据**：支持手动触发和定时任务
- ✅ **类型安全**：完整的 TypeScript 支持

## 📊 爬取的数据

### 价格数据 (cotton_prices 表)
- 新疆及全国棉花现货价格
- 郑商所 CF 主力合约价格
- 成交量、涨跌幅等指标

### 新闻数据 (news 表)
- 最新 10 条棉花相关新闻
- 政策、市场分析等各类资讯

## 🛠️ 技术栈

- **Puppeteer Core** + **@sparticuz/chromium**：无头浏览器爬取
- **Cheerio**：HTML 解析
- **Supabase**：数据存储
- **Vercel Cron**：定时任务

## 📁 文件结构

```
app/api/crawl/
├── route.ts          # 主要的爬虫逻辑
├── vercel.json        # Vercel 配置（定时任务）
└── package.json       # 已添加爬虫依赖
```

## ⚙️ 配置说明

### 环境变量
在 Vercel 项目设置中配置以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 数据库表结构
确保 Supabase 数据库中有以下表：

#### cotton_prices 表
```sql
CREATE TABLE cotton_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  variety_name TEXT NOT NULL,
  price DECIMAL NOT NULL,
  change TEXT,
  is_positive BOOLEAN DEFAULT false,
  volume INTEGER,
  high DECIMAL,
  low DECIMAL,
  avg_price DECIMAL,
  history_volume INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### news 表
```sql
CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚀 部署和使用

### 1. 安装依赖
```bash
npm install puppeteer-core cheerio @sparticuz/chromium-min
```

### 2. 部署到 Vercel
```bash
vercel --prod
```

### 3. 配置环境变量
在 Vercel 控制台的 Project Settings > Environment Variables 中设置 Supabase 配置。

### 4. 手动触发爬取
```bash
curl https://your-app.vercel.app/api/crawl
```

或在浏览器中访问：
```
https://your-app.vercel.app/api/crawl
```

## ⏰ 定时任务

Vercel Cron 已配置为每天运行 3 次：
- **08:00** - 早间数据更新
- **14:00** - 下午盘中数据
- **20:00** - 晚间收盘数据

## 🔍 监控和调试

### 查看执行日志
在 Vercel 控制台的 Functions > crawl > Logs 中查看执行日志。

### 手动测试
```bash
# 测试爬虫功能
curl -X GET https://your-app.vercel.app/api/crawl

# 或使用 POST 请求
curl -X POST https://your-app.vercel.app/api/crawl
```

响应示例：
```json
{
  "success": true,
  "message": "Successfully crawled and saved 5 price records and 10 news items",
  "data": {
    "prices": 5,
    "news": 10
  }
}
```

## 🛡️ 错误处理

- 网络超时：30 秒超时设置
- 网站变更：代码会适应常见的 HTML 结构变化
- 数据库错误：详细的错误日志和回滚机制
- 重复数据：基于日期和品种名的智能去重

## 🔄 数据更新策略

- **价格数据**：同一天同一品种更新现有记录，不新增
- **新闻数据**：基于标题去重，避免重复插入
- **失败重试**：单个网站失败不影响其他数据源

## 📈 扩展和定制

### 添加新的数据源
在 `route.ts` 中添加新的爬取函数：

```typescript
async function scrapeNewSource() {
  // 实现新的爬取逻辑
}
```

### 修改定时频率
在 `vercel.json` 中调整 cron 表达式：

```json
{
  "crons": [
    {
      "path": "/api/crawl",
      "schedule": "0 */4 * * *"  // 每 4 小时运行
    }
  ]
}
```

---

## 📞 技术支持

如遇到问题，请检查：
1. Vercel 函数日志
2. Supabase 数据库连接
3. 目标网站是否可访问
4. 网络超时设置是否合适
