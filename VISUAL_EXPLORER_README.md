# Visual Explorer Module

## 概述

Visual Explorer 是一个受 Sora Explore 启发的高质量视觉内容展示模块，支持摄影作品和 AI 生成内容的分类展示。

## 🎯 功能特性

### ✅ 已实现功能
- **深色主题 UI**：黑色背景 + 现代化设计
- **双层标签切换**：图片/视频 + 摄影/AIGC 分类
- **瀑布流布局**：响应式多列网格展示
- **Lightbox 查看器**：全屏图片/视频查看
- **悬停交互**：动态按钮和遮罩效果
- **键盘导航**：ESC 关闭，左右箭头切换
- **移动端适配**：响应式设计支持

### 🔄 数据源架构
- **Cloudinary**：媒体文件存储和 CDN 优化
- **Contentful**：可选元数据管理（标题、描述等）
- **混合模式**：上传即可见 + 后续补充详细信息

## 📁 文件结构

```
src/
├── app/visual/
│   ├── page.js                    # 页面入口
│   └── opengraph-image.js         # SEO 图片
├── components/visual/
│   ├── visual-explorer.js         # 主组件
│   ├── tab-selector.js           # 标签切换
│   ├── gallery.js                # 瀑布流网格
│   ├── media-card.js             # 单个卡片
│   └── lightbox-viewer.js        # 全屏查看器
└── hooks/
    └── use-visual-data.js         # 数据获取
```

## 🚀 使用方法

### 访问页面
- URL: `/visual`
- 导航：主菜单中的 "Visual" 链接

### 内容分类
1. **媒体类型**：Images / Videos
2. **内容来源**：Photography / AI Generated

### 交互操作
- **点击卡片**：进入全屏查看模式
- **悬停卡片**：显示点赞、分享、查看按钮
- **键盘操作**：
  - `ESC` - 关闭 lightbox
  - `←/→` - 切换上一张/下一张

## 📊 数据结构

### 媒体对象格式
```javascript
{
  id: 'unique-id',
  cloudinaryId: 'cloudinary-public-id',
  mediaType: 'image' | 'video',
  sourceType: 'photography' | 'aigc',
  aspectRatio: 1.5,
  title: 'Media Title',
  description: 'Detailed description',
  tags: ['tag1', 'tag2'],
  timestamp: '2024-01-15T18:30:00Z',
  camera: 'Camera Model',
  location: 'Location Name',
  author: 'Author Name',
  likes: 42,
  views: 156
}
```

## 🔧 技术实现

### 核心技术栈
- **Next.js 14** - App Router + SSR
- **Tailwind CSS** - 样式系统
- **Framer Motion** - 动画效果
- **Lucide React** - 图标库
- **Cloudinary** - 媒体 CDN

### 性能优化
- **图片懒加载**：next/image 组件
- **CDN 优化**：Cloudinary 自动格式转换
- **响应式图片**：多尺寸变体
- **动画优化**：GPU 加速过渡

### 代码特点
- **TypeScript 就绪**：组件接口清晰
- **可访问性**：键盘导航支持
- **SEO 友好**：元数据和结构化数据
- **移动优先**：响应式设计

## 🛠️ 开发和扩展

### 添加新内容
1. **快速发布**：直接上传到 Cloudinary
2. **完整信息**：在 Contentful 中添加元数据

### 自定义样式
- 修改 `components/visual/` 中的组件
- 调整 Tailwind 类名
- 添加自定义 CSS 变量

### 数据源扩展
- 更新 `hooks/use-visual-data.js`
- 集成 Cloudinary Admin API
- 连接 Contentful GraphQL

## 🔜 后续规划

### 即将推出的功能
- [ ] 标签筛选器
- [ ] 搜索功能
- [ ] 收藏/点赞系统
- [ ] 分页/无限滚动
- [ ] 内容管理界面

### 性能优化
- [ ] 虚拟滚动（大量内容时）
- [ ] 图片预加载策略
- [ ] 缓存优化

## 📱 移动端体验

- **触摸友好**：大按钮和手势支持
- **响应式布局**：1-4 列自适应
- **快速加载**：优化图片尺寸
- **原生感受**：流畅动画和过渡

## 🎨 设计系统

### 颜色方案
- **背景**：`bg-black`
- **卡片**：`bg-gray-900`
- **文字**：`text-white` / `text-gray-300`
- **强调**：`bg-white/10` / `bg-white/20`

### 动画效果
- **进入动画**：`opacity + translateY`
- **悬停效果**：`scale + overlay`
- **切换过渡**：`opacity + translateY`
- **Lightbox**：`backdrop-blur + fade`

## 🚀 部署说明

Visual Explorer 模块已集成到现有的 Next.js 应用中，无需额外配置即可部署。

### 环境要求
- Node.js 18+
- Next.js 14+
- Cloudinary 账户（用于图片 CDN）
- Contentful 账户（可选，用于元数据管理）

---

**技术支持**：如有问题或建议，请查看组件代码或联系开发团队。 