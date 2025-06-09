# Cursor Rules for onur.dev Blog Project

## 🚨 重要环境配置 🚨

### 包管理器要求
- **必须使用 Bun**: 这个项目专门配置为使用 Bun 作为包管理器和运行时
- **禁止使用 pnpm**: pnpm 与 Million Lint 存在兼容性问题，会导致：
  - CSS 404 死循环
  - 组件无限渲染错误
  - 依赖残留问题

### 开发环境启动
```bash
# ✅ 正确方式
bun install
bun dev

# ❌ 错误方式 - 不要使用
pnpm install
pnpm dev
```

### Node.js 版本
- package.json 中指定: `"node": "20.x"`
- 当前环境: Node v23.10.0 (虽然有警告但可工作)
- Bun 运行时可以处理 Node 版本不匹配问题

## 🐛 已知问题及解决方案

### Million Lint 兼容性
- Million Lint 在 pnpm 环境下会导致编译错误
- 已从项目中完全移除
- 如需类似功能，寻找 Bun 兼容的替代方案

### CSS 编译问题
- 症状: `/_next/static/css/app/layout.css?v=xxx` 返回 404
- 原因: 包管理器不兼容导致的编译失败
- 解决: 切换到 Bun 环境

### 组件无限渲染
- 症状: "Maximum update depth exceeded" 错误
- 常见原因: useMemo 不当使用，props 作为依赖项
- 解决: 避免在 useMemo 中包裹整个 JSX 返回值

## 📝 开发指南

### 调试步骤
1. 确认使用 `bun dev` 启动
2. 检查是否有 Million Lint 残留
3. 清理缓存: `rm -rf .next .turbo node_modules/.cache`
4. 重新安装: `bun install`

### 部署环境
- 生产环境使用 Vercel
- 需要环境变量: `MUSING_CODE`, `GITHUB_PAT`, `GITHUB_REPO`
- 确保 Vercel 配置使用正确的构建命令

## 🔧 技术栈
- Next.js 15.2.4
- React 19
- Bun 1.2.2 (包管理器 + 运行时)
- Contentful CMS
- Vercel Analytics
- Cloudinary (visual assets)

## 💡 最佳实践
- 保持环境一致性：开发、测试、部署都使用相同的包管理器
- 新依赖安装使用: `bun add <package>`
- 移除依赖使用: `bun remove <package>`
- 不要混用 npm/pnpm/yarn 和 bun

---
**最后更新**: 2025-06-09
**维护者**: 需要了解 Bun 环境配置的重要性 