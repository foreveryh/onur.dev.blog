# OAuth2 认证系统实现

## 概述

为了解决 Raindrop.io 书签同步中的 token 过期问题，本项目实现了完整的 OAuth2 自动认证系统，支持多种存储方案，确保无需手动干预即可维持书签数据的持续同步。

## 核心特性

### 🔄 自动 Token 刷新
- **三层刷新机制**：请求时刷新、定时刷新、错误恢复
- **智能过期检测**：提前刷新，避免服务中断
- **失败重试**：自动重试机制，提高可靠性

### 🗄️ 多存储方案支持
1. **Vercel KV**（优先）- 原生云存储，性能最佳
2. **Supabase**（推荐）- 免费可靠，功能完整  
3. **环境变量**（备用）- 最简单，适合小规模使用

### 🔐 安全性保障
- **AES-256-GCM 加密**：所有存储的 tokens 都经过军用级加密
- **环境隔离**：敏感信息通过环境变量管理
- **访问控制**：Cron 作业和管理接口都有访问控制

### 🛡️ 容错机制
- **优雅降级**：存储不可用时自动切换到备用方案
- **缓存支持**：减少API调用，提高响应速度
- **错误处理**：完整的错误处理和日志记录

## 技术架构

```
┌─────────────────────┐
│   前端页面/组件      │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   raindrop-with-auth │  ← 统一认证接口
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  动态 Token Manager  │  ← 自动选择存储方案
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │ 存储方案选择 │
    └──┬──┬───┬───┘
       │  │   │
   ┌───▼┐ │   │
   │ KV │ │   │
   └────┘ │   │
      ┌───▼───┐
      │Supabase│
      └───────┘
          │
      ┌───▼───┐
      │ Env  │
      │ Vars │
      └───────┘
```

## 文件结构

```
src/lib/auth/
├── crypto.js                    # AES-256 加密/解密工具
├── token-manager.js             # Vercel KV 存储实现
├── supabase-token-manager.js    # Supabase 存储实现
└── env-token-manager.js         # 环境变量存储实现

src/lib/
├── raindrop-with-auth.js        # 带认证的 Raindrop API 封装
└── raindrop.js                  # 原始 API 封装（向后兼容）

src/app/api/
├── auth/raindrop/              # OAuth2 认证端点
│   ├── route.js                # 启动认证
│   ├── callback/route.js       # 处理回调
│   ├── status/route.js         # 检查状态
│   └── clear/route.js          # 清除认证
├── bookmarks/route.js          # 增强的书签API
└── cron/refresh-tokens/        # 定时刷新任务
    └── route.js
```

## API 端点

### OAuth2 认证
- `GET /api/auth/raindrop` - 启动 OAuth 认证流程
- `GET /api/auth/raindrop/callback` - 处理 OAuth 回调
- `GET /api/auth/raindrop/status` - 检查认证状态
- `POST /api/auth/raindrop/clear` - 清除认证信息

### 书签数据
- `GET /api/bookmarks` - 获取所有书签（支持缓存）
- `GET /api/bookmarks?collection=ID&page=N` - 分页获取特定收藏夹

### 系统维护
- `GET /api/cron/refresh-tokens` - 定时刷新 tokens（Cron Job）

## 环境变量配置

### 必需变量（所有方案）
```bash
RAINDROP_CLIENT_ID=xxx              # Raindrop.io OAuth Client ID
RAINDROP_CLIENT_SECRET=xxx          # Raindrop.io OAuth Client Secret  
RAINDROP_ENCRYPTION_KEY=xxx         # 32字符加密密钥
NEXT_PUBLIC_BASE_URL=xxx            # 应用基础URL
CRON_SECRET=xxx                     # Cron作业保护密钥
```

### Vercel KV 方案
```bash
KV_REST_API_URL=xxx                 # Vercel KV REST API URL
KV_REST_API_TOKEN=xxx               # Vercel KV REST API Token
```

### Supabase 方案
```bash
NEXT_PUBLIC_SUPABASE_URL=xxx        # Supabase 项目 URL
SUPABASE_ANON_KEY=xxx               # Supabase Anonymous Key
```

### 环境变量方案
```bash
RAINDROP_ENCRYPTED_REFRESH_TOKEN=xxx # 加密的 Refresh Token
```

## 部署流程

1. **配置 OAuth 应用**（Raindrop.io 开发者控制台）
2. **选择存储方案**（推荐 Supabase）
3. **设置环境变量**（Vercel 项目设置）
4. **部署应用**
5. **完成初始认证**（访问 /admin/oauth-setup）
6. **验证功能**（检查书签页面）

详细步骤请参考 `QUICK_START.md`。

## 监控和维护

### 日志监控
- Vercel 函数日志中可查看认证和刷新状态
- 错误日志包含详细的故障信息

### Token 生命周期
- **Access Token**：1小时有效期，自动刷新
- **Refresh Token**：180天有效期，需要重新认证

### 健康检查
使用 `scripts/verify-deployment.js` 验证系统状态：
```bash
node scripts/verify-deployment.js
```

## 性能优化

- **智能缓存**：2天缓存周期，减少API调用
- **分页支持**：大量数据的高效加载
- **并发控制**：避免API限制和竞态条件
- **错误恢复**：快速从临时故障中恢复

## 安全考虑

- **加密存储**：所有敏感数据都经过AES-256加密
- **最小权限**：只请求必需的API权限
- **访问控制**：管理接口需要适当的认证
- **日志清理**：不在日志中暴露敏感信息

这个系统确保了 Raindrop.io 书签数据的持续可用性，同时提供了灵活的部署选项和强大的容错能力。