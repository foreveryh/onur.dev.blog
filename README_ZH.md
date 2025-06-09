# 我的 onur.dev 分支

[**English**](./README.md) | **简体中文**

这个项目是 [onur.dev](https://github.com/onurschu/onur.dev) 的分支，已适配个人使用并部署在 Vercel 上。

## 🚀 最新更新

### 2025年6月
- ✅ **添加 Vercel Analytics 集成**：内置网站分析，零配置即用
- 🔧 **修复环境变量配置**：解决碎碎念生产部署问题
- 📊 **改进数据同步**：增强 ISR 缓存管理

## 📖 文档

### 🚨 [**Contentful 完整使用指南**](./docs/CONTENTFUL_GUIDE.md) 🚨

**必读文档**：这个综合指南涵盖了在此项目中使用 Contentful 的所有必要知识，包括：

- 内容模型设置和字段配置
- 博客写作工作流程和最佳实践
- Webhook 自动化部署
- 多层缓存机制
- SEO 优化策略
- 常见问题故障排除

**在设置 Contentful 空间之前请先阅读此文档。**

### 🎨 [**Visual Explorer 模块**](./docs/VISUAL_EXPLORER_README.md) 🎨

**可视内容展示**：Visual Explorer 模块的完整指南，包含：

- 受 Sora 启发的瀑布流布局与 Cloudinary 集成
- 自动图片优化和视频缩略图生成
- EXIF 元数据提取和显示
- 完整的设置和部署说明
- 实时媒体管理和响应式设计

**完全部署的生产就绪可视化作品集系统。**

### 💭 [**碎碎念系统**](./docs/MUSINGS_README.md) 💭

**GitHub Issues 作为 CMS**：一个创新的微博平台，使用 GitHub Issues 作为后端：

- 使用 GitHub Issues 的无服务器内容管理
- Next.js ISR 配合 24 小时缓存重新验证
- 基于标签的过滤和现代卡片设计
- 验证码认证系统
- 完整的技术文档和设置指南

**轻量级、可扩展的个人思考和反思解决方案。**

## 重要说明

### Contentful 设置

你需要创建自己的 Contentful 空间并定义必要的内容模型和字段。这个项目依赖特定的 Contentful 结构，所以请确保你的设置符合 [Contentful 使用指南](./docs/CONTENTFUL_GUIDE.md) 中概述的要求。

### 环境变量

在运行或部署项目之前，你必须在 `.env` 文件中配置以下环境变量。如果项目根目录中不存在 `.env` 文件，请创建一个。

```bash
# 站点配置（Open Graph 图片必需）
NEXT_PUBLIC_SITE_URL=https://your-deployed-domain.com

# Contentful CMS 配置
CONTENTFUL_SPACE_ID=your_contentful_space_id
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_contentful_preview_access_token
CONTENTFUL_PREVIEW_SECRET=your_contentful_preview_secret

# Supabase 数据库配置
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_public_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_public_anon_key

# Cloudinary 媒体存储（Visual Explorer 必需）
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# 碎碎念模块配置
MUSING_CODE=your_secret_validation_code
GITHUB_PAT=ghp_your_github_personal_access_token

# 可选集成

# 分析与监控
NEXT_PUBLIC_TINYBIRD_TOKEN=your_tinybird_analytics_token # 可选：额外分析功能

# 书签集成
NEXT_PUBLIC_RAINDROP_ACCESS_TOKEN=your_raindrop_io_access_token # Raindrop.io 书签功能

# 重新验证与缓存管理
NEXT_REVALIDATE_SECRET=your_nextjs_revalidation_secret

# Airtable 集成（如果使用 Airtable 数据存储）
AIRTABLE_PERSONAL_ACCESS_TOKEN=your_airtable_personal_access_token
AIRTABLE_BASE_ID=your_airtable_base_id
AIRTABLE_BOOKMARKS_TABLE_ID=your_airtable_bookmarks_table_id
```

请将 `your_...` 占位符替换为你的实际凭据和 ID。

**Twitter/社交媒体分享重要提示**：确保将 `NEXT_PUBLIC_SITE_URL` 设置为你的实际部署域名（例如，`https://yourdomain.vercel.app`），以便 Open Graph 图片在社交平台上正常工作。

#### Visual Explorer 的 Cloudinary 设置

Visual Explorer 模块需要 Cloudinary 进行媒体存储和优化。设置步骤：

1. **创建 Cloudinary 账户**：在 [cloudinary.com](https://cloudinary.com) 注册
2. **获取凭据**：在 Cloudinary 仪表板中找到
   - **Cloud Name**：在仪表板 URL 和设置中找到
   - **API Key**：你的唯一 API 标识符
   - **API Secret**：你的秘密认证密钥
3. **创建 Visual 文件夹**：在 Cloudinary 中创建名为 `visual` 的文件夹用于媒体文件
4. **上传内容**：将图片/视频拖放到 `visual` 文件夹中
5. **添加元数据**：使用 Cloudinary 的上下文字段添加标题、描述和其他元数据

Visual Explorer 将自动显示 `visual` 文件夹中的所有媒体，并提供优化的传输和响应式尺寸。

## 碎碎念系统设置

碎碎念系统允许你直接从博客发布简短的想法和笔记到 GitHub 仓库，它们作为 Issues 存储并在你的网站上显示。**完整的技术文档请参见 [碎碎念文档](./docs/MUSINGS_README.md)**。

### 前置要求

- 一个用于存储碎碎念的公共 GitHub 仓库（例如，`foreveryh/git-thoughts`）
- 具有 `public_repo` 权限的 GitHub Personal Access Token
- 在你的想法仓库中的 GitHub Action，用于生成 `public/issues.json`

### 步骤 1：GitHub 仓库设置

1. **创建 GitHub 仓库**：
   - 创建一个新的公共仓库（例如，`git-thoughts`）
   - 这将作为 GitHub Issues 存储你的碎碎念

2. **设置 GitHub Action**：
   - 在你的想法仓库中创建 `.github/workflows/update-issues.yml`
   - 配置它在创建/更新 issues 时生成 `public/issues.json`
   - JSON 应该可以在以下地址访问：`https://raw.githubusercontent.com/username/git-thoughts/main/public/issues.json`

### 步骤 2：GitHub Personal Access Token

1. **生成令牌**：
   - 前往 GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - 点击 "Generate new token"
   - 选择范围：`public_repo`
   - 复制生成的令牌

### 步骤 3：配置环境变量

将这些添加到你的 `.env` 文件中：

```bash
# 必须包含在帖子中进行验证的秘密代码
MUSING_CODE=your_secret_validation_code

# 具有 public_repo 权限的 GitHub Personal Access Token
GITHUB_PAT=ghp_your_github_personal_access_token
```

### 步骤 4：使用方法

1. **查看碎碎念**：在你的网站上导航到 `/musings`
2. **发布**：点击 "New Musing" 打开快速发布对话框
3. **内容**：写下你的想法并包含秘密验证码
4. **发布**：内容将作为 GitHub Issue 发布并出现在你的网站上

### 功能特性

- **ISR 缓存**：页面静态生成并每 24 小时重新验证一次
- **标签过滤**：按标签过滤碎碎念（Daily、Idea、Work、Life 等）
- **Markdown 支持**：完整的 markdown 渲染，支持换行和格式化
- **安全性**：秘密代码验证防止未授权发布
- **现代 UI**：优雅的卡片设计，带有渐变悬停效果
- **移动友好**：响应式设计适用于所有设备
- **智能标题**：从内容自动生成标题，智能截断

### 数据同步

- GitHub 仓库每天法国时间凌晨 2 点更新
- 网站数据通过 ISR 每天法国时间凌晨 3 点更新
- 通过发布新的碎碎念可以手动重新验证

## 碎碎念 ISR 缓存问题解决方案

如果你发布了新的 GitHub Issues 但博客没有显示最新内容，这是由于 Next.js ISR 缓存机制导致的。

### 解决方法：

1. **使用重新验证脚本**（推荐）：
   ```bash
   # 重新验证生产环境
   ./scripts/revalidate-musings.sh
   
   # 重新验证本地开发环境
   ./scripts/revalidate-musings.sh "http://localhost:3000"
   ```

2. **手动 API 调用**：
   ```bash
   # POST 请求到重新验证端点
   curl -X POST "https://me.deeptoai.com/api/revalidate?path=/musings"
   ```

3. **等待自动更新**：
   - ISR 缓存会在 24 小时后自动过期
   - 第一个访问者会触发页面重新生成

## Raindrop.io 设置（书签功能）

此项目包含一个与 [Raindrop.io](https://raindrop.io) 集成的书签功能，用于显示你保存的书签。按照以下步骤正确设置集成：

### 前置要求

- 一个 Raindrop.io 账户（免费账户即可）
- 在你的 Raindrop.io 账户中创建一些书签收藏

### 步骤 1：创建 Raindrop.io 应用程序

1. **登录 Raindrop.io**：
   - 前往 [https://raindrop.io](https://raindrop.io)
   - 登录你的账户

2. **访问开发者设置**：
   - 点击右上角的个人资料头像
   - 选择 "Settings"
   - 在左侧边栏中，找到并点击 "Integrations"
   - 点击 "For developers"

## 分析与监控

### Vercel Analytics

内置网站分析，零配置即用。部署后在 Vercel Dashboard → Analytics 标签查看数据统计。

## 原始 README

有关原始项目的更多信息，请参考原始的 [onur.dev 仓库](https://github.com/onurschu/onur.dev)。 