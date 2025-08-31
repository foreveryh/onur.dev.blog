# Raindrop.io OAuth2 部署指南

由于 Vercel KV 存储选项在某些账户中不可用，我们提供了三种存储方案供选择：

## 存储方案选择

系统会自动检测可用的存储方案并按优先级选择：

1. **Vercel KV** (优先) - 如果环境变量 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 存在
2. **Supabase** (推荐) - 如果环境变量 `NEXT_PUBLIC_SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 存在
3. **环境变量存储** (备用) - 始终可用，但需要手动更新环境变量

## 方案 1: Vercel KV 存储 (如果可用)

### 前置条件
- Vercel 仪表板中 KV 存储选项可见
- Hobby 或 Pro 计划

### 设置步骤
1. 在 Vercel 仪表板中创建 KV 数据库
2. 连接到您的项目
3. 添加以下环境变量：
```bash
RAINDROP_CLIENT_ID=your_client_id_here
RAINDROP_CLIENT_SECRET=your_client_secret_here
RAINDROP_ENCRYPTION_KEY=your_32_character_random_key
NEXT_PUBLIC_BASE_URL=https://me.deeptoai.com
CRON_SECRET=your_random_cron_secret
```

## 方案 2: Supabase 存储 (推荐)

### 前置条件
- Supabase 免费账户
- 创建一个新项目

### 设置步骤

#### 1. 创建 Supabase 项目
1. 访问 [supabase.com](https://supabase.com) 并创建免费账户
2. 创建新项目
3. 记录项目的 URL 和 anon key

#### 2. 设置数据库表
在 Supabase SQL Editor 中运行以下 SQL：
```sql
-- 见 supabase-setup.sql 文件内容
```

#### 3. 添加环境变量到 Vercel
```bash
RAINDROP_CLIENT_ID=your_client_id_here
RAINDROP_CLIENT_SECRET=your_client_secret_here
RAINDROP_ENCRYPTION_KEY=your_32_character_random_key
NEXT_PUBLIC_BASE_URL=https://me.deeptoai.com
CRON_SECRET=your_random_cron_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 方案 3: 环境变量存储

### 特点
- 最简单的设置
- 无需外部数据库
- 需要手动更新 refresh token

### 设置步骤
1. 添加基本环境变量：
```bash
RAINDROP_CLIENT_ID=your_client_id_here
RAINDROP_CLIENT_SECRET=your_client_secret_here
RAINDROP_ENCRYPTION_KEY=your_32_character_random_key
NEXT_PUBLIC_BASE_URL=https://me.deeptoai.com
CRON_SECRET=your_random_cron_secret
```

2. 完成 OAuth 认证后，系统会在控制台输出加密的 refresh token
3. 手动将其添加为环境变量：
```bash
RAINDROP_ENCRYPTED_REFRESH_TOKEN=encrypted_token_from_console
```

## Raindrop.io OAuth 应用设置

无论选择哪种存储方案，都需要设置 Raindrop.io OAuth 应用：

1. 访问 [Raindrop.io 开发者控制台](https://app.raindrop.io/settings/integrations)
2. 创建新的 OAuth 应用
3. 设置回调 URL: `https://me.deeptoai.com/api/auth/raindrop/callback`
4. 记录 Client ID 和 Client Secret

## 初始认证流程

1. 部署应用后，访问: `https://me.deeptoai.com/admin/oauth-setup`
2. 点击 "开始 OAuth 认证" 按钮
3. 完成 Raindrop.io 授权流程
4. 系统会自动存储 tokens

## 验证部署

1. 检查书签页面是否正常加载: `https://me.deeptoai.com/bookmarks`
2. 查看服务器日志确认 token 刷新正常运行
3. 测试标签过滤功能

## 故障排除

### Token 刷新失败
- 检查环境变量是否正确设置
- 验证 Raindrop.io OAuth 应用配置
- 查看服务器日志了解具体错误信息

### 存储连接问题
- **Supabase**: 验证 URL 和 key 是否正确
- **Vercel KV**: 检查 KV 数据库是否正确连接到项目
- **环境变量**: 确认加密的 token 已正确添加

### 建议的测试顺序
1. 先尝试 Supabase 方案（最稳定）
2. 如果 Vercel KV 可用，可以考虑迁移
3. 环境变量方案作为临时解决方案

## 注意事项
- 所有 tokens 都使用 AES-256 加密存储
- Refresh tokens 有效期为 180 天
- 系统会自动在 token 过期前刷新
- Cron job 每天检查一次 token 状态