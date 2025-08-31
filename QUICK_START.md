# Raindrop.io OAuth2 快速开始指南

## 背景

由于 Vercel KV 存储选项在您的账户中不可用，我已经实现了三种存储方案的自动检测系统。系统会按优先级自动选择最适合的存储方案。

## 推荐方案：使用 Supabase

### 1. 设置 Supabase

1. **创建 Supabase 项目**
   - 访问 [supabase.com](https://supabase.com)
   - 创建免费账户和新项目
   - 记录项目 URL 和 anon key

2. **创建数据库表**
   - 在 Supabase SQL Editor 中运行 `supabase-setup.sql` 文件中的 SQL

### 2. 设置 Raindrop.io OAuth 应用

1. **创建 OAuth 应用**
   - 访问 [Raindrop.io 开发者控制台](https://app.raindrop.io/settings/integrations)
   - 创建新的 OAuth 应用
   - 设置回调 URL: `https://me.deeptoai.com/api/auth/raindrop/callback`
   - 记录 Client ID 和 Client Secret

### 3. 配置 Vercel 环境变量

在 Vercel 项目设置中添加以下环境变量：

```bash
# Raindrop.io OAuth 配置
RAINDROP_CLIENT_ID=your_client_id_here
RAINDROP_CLIENT_SECRET=your_client_secret_here

# 加密密钥 (32字符随机字符串)
RAINDROP_ENCRYPTION_KEY=your_32_character_random_key

# 基础URL
NEXT_PUBLIC_BASE_URL=https://me.deeptoai.com

# Cron 作业密钥
CRON_SECRET=your_random_cron_secret

# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 部署和初始认证

1. **部署应用**
   ```bash
   git add .
   git commit -m "feat: 添加 OAuth2 认证系统支持多存储方案"
   git push origin feature-a
   ```

2. **完成初始 OAuth 认证**
   - 部署完成后，访问: `https://me.deeptoai.com/admin/oauth-setup`
   - 点击 "开始 OAuth 认证" 按钮
   - 完成 Raindrop.io 授权流程

3. **验证部署**
   - 检查书签页面: `https://me.deeptoai.com/bookmarks`
   - 确认标签过滤功能正常工作

## 备用方案：环境变量存储

如果不想设置 Supabase，可以使用更简单的环境变量存储方案：

### 环境变量配置
只需要配置基本的 OAuth 环境变量（不包括 Supabase 配置）：

```bash
RAINDROP_CLIENT_ID=your_client_id_here
RAINDROP_CLIENT_SECRET=your_client_secret_here  
RAINDROP_ENCRYPTION_KEY=your_32_character_random_key
NEXT_PUBLIC_BASE_URL=https://me.deeptoai.com
CRON_SECRET=your_random_cron_secret
```

### 初始认证流程
1. 完成 OAuth 认证后，系统会在控制台输出加密的 refresh token
2. 手动将其添加为环境变量：
   ```bash
   RAINDROP_ENCRYPTED_REFRESH_TOKEN=encrypted_token_from_console
   ```

## 系统特性

✅ **自动存储检测** - 根据可用环境变量自动选择最佳存储方案
✅ **三层 Token 刷新** - 请求时、定时任务、错误恢复
✅ **AES-256 加密** - 所有存储的 tokens 都经过加密
✅ **错误处理** - 完善的降级和恢复机制
✅ **兼容性** - 保持与现有代码的完全兼容

## 故障排除

### 构建错误
- 构建时出现的 token 相关错误是正常的，因为还没有完成 OAuth 认证
- 部署后完成认证即可解决

### Token 刷新失败
- 检查环境变量是否正确配置
- 验证 Raindrop.io OAuth 应用设置
- 查看 Vercel 函数日志了解详细错误

### 存储连接问题
- **Supabase**: 验证 URL 和 key，确认数据库表已创建
- **环境变量**: 确认加密的 token 已正确添加

## 技术实现

- **动态存储选择**: 运行时自动检测可用的存储方案
- **延迟初始化**: 避免构建时的环境变量依赖问题
- **单例模式**: 确保 token manager 的一致性
- **智能缓存**: 根据存储类型选择合适的缓存策略

## 下一步

完成上述设置后，您的博客将拥有一个完全自动化的书签同步系统，无需再担心 token 过期问题。