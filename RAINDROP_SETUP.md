# Raindrop.io OAuth2 自动认证设置指南

本文档介绍如何为博客设置完全自动化的 Raindrop.io 书签同步功能。

## 🎯 功能特性

- ✅ OAuth2 安全认证
- ✅ Token 自动刷新，永不过期
- ✅ 加密存储认证信息
- ✅ 错误自动恢复
- ✅ 零手动维护

## 📋 前置要求

1. **Vercel 账户** - 用于部署和 KV 存储
2. **Raindrop.io 账户** - 获取 API 访问权限
3. **域名** - 配置 OAuth2 回调地址

## 🔧 环境变量配置

### 1. Raindrop.io 应用注册

访问 [Raindrop.io Developer Console](https://app.raindrop.io/settings/integrations)：

1. 创建新应用
2. 设置回调 URL: `https://your-domain.com/api/auth/raindrop/callback`
3. 获取 `Client ID` 和 `Client Secret`

### 2. 必需的环境变量

```bash
# Raindrop OAuth2 配置
RAINDROP_CLIENT_ID=your_client_id_here
RAINDROP_CLIENT_SECRET=your_client_secret_here
RAINDROP_ENCRYPTION_KEY=your_32_character_random_key_here

# 基础配置
NEXT_PUBLIC_BASE_URL=https://your-domain.com
CRON_SECRET=your_random_secret_for_cron_security

# Vercel KV 配置 (自动提供，无需手动设置)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
```

### 3. 生成加密密钥

使用以下命令生成安全的加密密钥：

```bash
# 生成32字符随机密钥
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# 或者使用 openssl
openssl rand -hex 16
```

## 🚀 部署步骤

### 1. Vercel KV 设置

1. 在 Vercel 项目中启用 KV 存储
2. KV 环境变量会自动添加

### 2. 环境变量设置

在 Vercel Dashboard 中添加所有环境变量：

- 项目设置 → Environment Variables
- 添加上述所有变量

### 3. 初始认证

部署后访问：`https://your-domain.com/admin/raindrop-setup`

1. 点击"开始 OAuth 认证"
2. 在 Raindrop.io 完成授权
3. 系统自动存储认证信息

## 🔄 自动化机制

### Token 自动刷新

系统通过3层机制确保 Token 永不过期：

1. **请求时检查** - 每次 API 调用前检查过期时间
2. **定时任务** - 每6小时自动检查并刷新
3. **错误恢复** - 401错误时自动刷新并重试

### 缓存策略

- **书签缓存**: 2天 TTL，减少 API 调用
- **分页缓存**: 支持无限滚动加载
- **手动刷新**: `/api/bookmarks/refresh` 清除缓存

## 📡 API 端点

| 端点 | 功能 | 说明 |
|------|------|------|
| `/api/bookmarks` | 获取所有书签 | 支持缓存 |
| `/api/bookmarks?collection=ID&page=N` | 获取指定收藏夹分页数据 | 支持无限滚动 |
| `/api/bookmarks/refresh` | 手动刷新缓存 | POST 请求 |
| `/api/auth/raindrop` | 开始 OAuth2 认证 | 重定向到 Raindrop.io |
| `/api/auth/raindrop/status` | 查看认证状态 | 管理界面使用 |
| `/api/auth/raindrop/clear` | 清除认证信息 | 重置功能 |

## 🛠️ 故障排除

### Token 过期问题

```bash
# 检查 token 状态
curl https://your-domain.com/api/auth/raindrop/status

# 手动触发刷新
curl https://your-domain.com/api/cron/refresh-tokens \
  -H "Authorization: Bearer $CRON_SECRET"
```

### 缓存清除

```bash
# 清除书签缓存
curl -X POST https://your-domain.com/api/bookmarks/refresh
```

### 重新认证

1. 访问 `/admin/raindrop-setup`
2. 点击"清除认证信息"
3. 重新完成 OAuth2 流程

## 🔐 安全考虑

1. **加密存储** - 所有 Token 使用 AES-256 加密
2. **环境隔离** - 认证信息仅存储在服务端
3. **访问控制** - Cron 端点需要密钥验证
4. **自动清理** - KV 存储支持 TTL 自动过期

## 📊 监控建议

### 健康检查

定期检查以下指标：

- Token 有效性状态
- API 调用成功率
- 缓存命中率
- 自动刷新频率

### 日志监控

关注以下日志：

- `Token refreshed successfully` - 正常刷新
- `Token expires soon, refreshing...` - 预防性刷新
- `OAuth callback error` - 认证失败
- `Bookmarks API error` - API 调用失败

## 🔄 升级说明

从旧版 Test Token 升级到 OAuth2：

1. 备份现有配置
2. 添加新的环境变量
3. 完成 OAuth2 认证
4. 移除旧的 `NEXT_PUBLIC_RAINDROP_ACCESS_TOKEN`
5. 验证功能正常

---

**完成设置后，书签同步将完全自动化，无需任何手动维护！** 🎉