# 页面样式文件说明

本目录包含所有页面的独立CSS样式文件。

## 文件列表

### 首页
- **home.css** - 首页背景图片样式

### 诗歌相关
- **poetry-index.css** - 诗歌索引页样式（筛选栏、搜索栏、诗歌列表）
- **poetry-detail.css** - 诗歌详情页样式（诗歌内容、标签栏）

### 时间线
- **timeline.css** - 时间线页面样式（时间轴导航、年份详情）

### 传记相关
- **biographies-index.css** - 传记索引页样式（轮播卡片、导航箭头）
- **biographies-detail.css** - 传记详情页样式（书籍卡片、摘录内容）

### 对话
- **conversations.css** - 对话页面样式（Coming Soon页面）

## 使用方式

在对应的 `.astro` 页面文件中导入：

```astro
---
import '../../styles/pages/页面名称.css';
---
```

## 命名规范

所有CSS变量使用驼峰式命名（camelCase）：
- 颜色：`--colorPrimary`, `--colorText`, `--colorBackground`
- 字体：`--fontDisplay`, `--fontBody`, `--fontLogo`
- 字号：`--fontSizeBase`, `--fontSizeLg`, `--fontSize2xl`
- 间距：`--spacingMd`, `--spacingXl`, `--spacing2xl`
- 圆角：`--radiusSm`, `--radiusMd`, `--radiusFull`
- 阴影：`--shadowSm`, `--shadowMd`, `--shadowLg`
- 动画：`--transitionFast`, `--transitionNormal`
- 布局：`--navHeight`, `--containerMax`, `--sidebarWidth`

## 注意事项

1. 所有页面样式已从 `.astro` 文件中分离，使结构更清晰
2. 样式文件使用了全局CSS变量，定义在 `src/styles/global.css`
3. 响应式设计已包含在各个样式文件中
4. 动画效果（如 `fadeInUp`, `fadeIn`）在需要的文件中单独定义
