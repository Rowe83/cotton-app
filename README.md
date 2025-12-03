# 新棉通 - 棉花市场分析平台

一个现代化的棉花价格跟踪和市场分析应用。

## 🚀 快速开始

### 1. 环境配置

首先配置 Supabase 连接信息：

```bash
# 创建环境变量文件
touch .env.local
```

编辑 `.env.local` 文件，填入你的 Supabase 项目信息：

```env
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
```

**如何获取 Supabase 信息：**
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击 "Settings" > "API"
4. 复制 Project URL 和 anon/public 密钥

### 2. 安装依赖

```bash
npm install
```

### 3. 填充测试数据

```bash
npm run seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## 📊 功能特性

- ✅ **实时价格数据** - 棉花现货和期货价格
- ✅ **市场资讯** - 行业新闻和政策解读
- ✅ **价格预警** - 自定义价格提醒功能
- ✅ **数据可视化** - 价格趋势图表
- ✅ **实时更新** - WebSocket 实时数据同步

## 🛠️ 技术栈

- **Next.js 16** - React 全栈框架
- **Supabase** - 后端即服务 (BaaS)
- **Tailwind CSS** - 实用优先的 CSS 框架
- **Puppeteer** - 网页自动化工具
- **TypeScript** - 类型安全的 JavaScript

## 📁 项目结构

```
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   ├── auth/              # 认证页面
│   ├── market/            # 行情页面
│   ├── news/              # 资讯页面
│   └── profile/           # 个人中心
├── components/            # 可复用组件
├── hooks/                 # 自定义 React Hooks
├── lib/                   # 工具函数和配置
└── scripts/               # 脚本文件
```

## 🔧 开发指南

### 数据库设置

确保你的 Supabase 项目有以下表：

- `cotton_prices` - 棉花价格数据
- `news` - 新闻资讯
- `price_alerts` - 价格预警
- `push_subscriptions` - 推送订阅

### 环境变量

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJhbGc...` |

## 🚀 部署

### Vercel 部署

1. 连接你的 GitHub 仓库到 Vercel
2. 在 Vercel 控制台设置环境变量
3. 自动部署完成

### 手动部署

```bash
npm run build
npm run start
```

## 📚 更多文档

- [环境变量配置](ENV_SETUP.md)
- [爬虫系统说明](CRAWLER_README.md)
