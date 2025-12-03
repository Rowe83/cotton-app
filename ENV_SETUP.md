# 环境变量配置指南

## 问题描述

如果首页、行情、资讯页面数据为空，说明环境变量没有正确配置。

## 解决方案

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 在项目根目录创建 .env.local 文件
touch .env.local
```

### 2. 配置 Supabase 连接信息

将以下内容复制到 `.env.local` 文件中，并替换为你的实际 Supabase 项目信息：

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://你的项目ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
```

### 3. 获取 Supabase 连接信息

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单的 "Settings" > "API"
4. 复制以下信息：
   - **Project URL**: 填入 `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public 密钥**: 填入 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### 5. 填充测试数据

运行爬虫 API 来填充数据库：

```bash
# 在浏览器中访问
http://localhost:3000/api/crawl

# 或者使用 curl
curl http://localhost:3000/api/crawl
```

## 数据库配置

### 运行数据库设置脚本

#### 方法1：完整设置（推荐）

在 Supabase 控制台运行数据库设置：

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 点击左侧 "SQL Editor"
4. 复制粘贴 `scripts/setup-database.sql` 的内容
5. 点击 "Run" 执行

这个脚本会：
- ✅ 创建所有必要的表
- ✅ 设置正确的权限策略
- ✅ 创建索引和触发器

#### 方法2：替代设置（如果方法1失败）

如果上面的脚本仍有问题，尝试运行：

1. 在 SQL Editor 中运行 `scripts/alternative-setup.sql`
2. 这个版本使用 JWT token 中的用户 ID

#### 方法3：快速测试（临时禁用RLS）

如果你只是想快速测试，可以运行：

1. 在 SQL Editor 中运行 `scripts/quick-setup.sql`
2. 然后运行 `npm run seed`

**注意**: 这会暂时禁用安全策略，仅用于测试！

#### 方法4：手动禁用 RLS

如果上面的脚本仍有问题，可以手动执行：

```sql
-- 临时禁用 RLS 用于测试
ALTER TABLE cotton_prices DISABLE ROW LEVEL SECURITY;
ALTER TABLE news DISABLE ROW LEVEL SECURITY;
```

### 获取 Service Role Key

为了完全解决权限问题，可以添加 Service Role Key：

1. 去 Supabase Dashboard > Settings > API
2. 复制 "service_role" secret
3. 添加到 `.env.local`：

```env
SUPABASE_SERVICE_ROLE_KEY=你的service_role密钥
```

## 验证配置

配置正确后，你应该能看到：

- ✅ 首页显示棉花价格数据
- ✅ 行情页面显示品种列表
- ✅ 资讯页面显示新闻列表
- ✅ 个人中心显示统计数据

## 常见问题

### Q: Row Level Security 错误？
A: 运行 `scripts/setup-database.sql` 或暂时禁用 RLS。确保使用最新版本的脚本。

### Q: 触发器已存在错误？
A: 脚本已修复，会在创建触发器前先删除已存在的触发器。

### Q: 策略已存在错误？
A: 脚本已修复，会在创建策略前先删除已存在的策略。

### Q: 还是看不到数据？
A: 检查浏览器控制台是否有错误信息，可能需要重新启动开发服务器。

### Q: Supabase 连接失败？
A: 确认环境变量名称正确，且密钥没有多余的空格。

### Q: 爬虫API返回错误？
A: 确认 Supabase 数据库表已经创建（参考数据库架构文档）。

### Q: 如何获取 Service Role Key？
A: Supabase Dashboard > Settings > API > service_role secret

## 生产环境配置

在 Vercel 部署时，需要在 Vercel 控制台设置相同的环境变量：
1. 进入项目设置
2. 选择 "Environment Variables"
3. 添加相同的变量名和值
