# 项目重构文档

本文档记录了海子诗歌网站的重构过程，包括设计系统优化、样式架构改进和代码组织重构。

## 重构概览

### 重构目标
1. 建立统一的设计系统和CSS变量命名规范
2. 分离关注点：将页面样式从`.astro`文件中提取到独立CSS文件
3. 优化字体系统，统一中英文字体
4. 简化导航栏设计，提升用户体验
5. 优化首页设计，突出视觉效果

### 重构时间
2026年1月

---

## 一、设计系统重构

### 1.1 CSS变量命名规范

**重构前**：使用混合的命名方式，包含分级结构
```css
--color-primary-500: #600000;
--font-size-base: 1rem;
--spacing-md: 1rem;
```

**重构后**：统一使用驼峰式命名（camelCase），去除层级结构
```css
--colorPrimary: #600000;
--fontSizeBase: 1rem;
--spacingMd: 1rem;
```

**命名规范**：
- 颜色：`--colorPrimary`, `--colorText`, `--colorBackground`
- 字体：`--fontDisplay`, `--fontBody`, `--fontLogo`
- 字号：`--fontSizeBase`, `--fontSizeLg`, `--fontSize2xl`
- 间距：`--spacingMd`, `--spacingXl`, `--spacing2xl`
- 圆角：`--radiusSm`, `--radiusMd`, `--radiusFull`
- 阴影：`--shadowSm`, `--shadowMd`, `--shadowLg`
- 动画：`--transitionFast`, `--transitionNormal`
- 布局：`--navHeight`, `--containerMax`, `--sidebarWidth`

### 1.2 设计令牌（Design Tokens）

所有CSS变量定义在 `src/styles/global.css` 中，形成统一的设计系统：

#### 颜色系统
```css
--colorPrimary: #600000;          /* 主色 - 深红 */
--colorPrimaryLight: #8B0000;     /* 主色 - 浅红 */
--colorPrimaryDark: #400000;      /* 主色 - 深红 */
--colorText: #1a1a1a;             /* 正文文字 */
--colorTextLight: #666666;        /* 次要文字 */
--colorTextMuted: #999999;        /* 弱化文字 */
--colorBackground: #ffffff;       /* 主背景 */
--colorBackgroundAlt: #f8f8f8;    /* 次背景 */
--colorBorder: #e5e5e5;           /* 边框 */
```

#### 字体系统
```css
--fontDisplay: 'SimSun', 'Songti SC', serif;              /* 标题字体 */
--fontBody: 'Satoshi', 'SimSun', 'Songti SC', sans-serif; /* 正文字体 */
--fontLogo: 'Satoshi', 'SimSun', 'Songti SC', sans-serif; /* Logo字体 */
```

#### 字号系统
```css
--fontSizeXs: 0.75rem;    /* 12px */
--fontSizeSm: 0.875rem;   /* 14px */
--fontSizeBase: 1rem;     /* 16px */
--fontSizeLg: 1.125rem;   /* 18px */
--fontSizeXl: 1.25rem;    /* 20px */
--fontSize2xl: 1.5rem;    /* 24px */
--fontSize3xl: 1.875rem;  /* 30px */
--fontSize4xl: 2.25rem;   /* 36px */
--fontSize5xl: 3rem;      /* 48px */
--fontSize6xl: 3.75rem;   /* 60px */
```

#### 间距系统
```css
--spacingXs: 0.25rem;   /* 4px */
--spacingSm: 0.5rem;    /* 8px */
--spacingMd: 1rem;      /* 16px */
--spacingLg: 1.5rem;    /* 24px */
--spacingXl: 2rem;      /* 32px */
--spacing2xl: 3rem;     /* 48px */
--spacing3xl: 4rem;     /* 64px */
```

---

## 二、字体系统重构

### 2.1 字体变更

**重构前**：
- 英文：Google Fonts (Noto Sans, Noto Serif)
- 中文：思源黑体/思源宋体
- 装饰：Playfair Display

**重构后**：
- 英文：**Satoshi** (via Fontshare CDN)
- 中文：**宋体 (SimSun)**
- Logo：Satoshi 20px

### 2.2 字体加载

在 `src/layouts/BaseLayout.astro` 中通过Fontshare CDN加载：

```html
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet">
```

### 2.3 字体应用

```css
/* 中文标题 - 宋体 */
--fontDisplay: 'SimSun', 'Songti SC', serif;

/* 英文正文 - Satoshi，中文fallback到宋体 */
--fontBody: 'Satoshi', 'SimSun', 'Songti SC', sans-serif;

/* Logo - Satoshi */
--fontLogo: 'Satoshi', 'SimSun', 'Songti SC', sans-serif;
```

---

## 三、样式架构重构

### 3.1 样式分离原则

**重构前**：所有页面样式内联在`.astro`文件的`<style>`标签中

**重构后**：样式提取到独立CSS文件

**优势**：
- ✅ 关注点分离：结构(HTML)、样式(CSS)、行为(JS)独立
- ✅ 代码复用：相同样式可在多个页面引用
- ✅ 维护性：样式集中管理，易于查找和修改
- ✅ 可读性：`.astro`文件更简洁，专注于组件结构
- ✅ 缓存优化：CSS文件可独立缓存

### 3.2 样式文件结构

```
src/styles/
├── global.css                      # 全局样式和CSS变量
├── components/                     # 组件样式（未来扩展）
└── pages/                          # 页面样式
    ├── README.md                   # 页面样式说明文档
    ├── home.css                    # 首页
    ├── poetry-index.css            # 诗歌索引页
    ├── poetry-detail.css           # 诗歌详情页
    ├── timeline.css                # 时间线页
    ├── biographies-index.css       # 传记索引页
    ├── biographies-detail.css      # 传记详情页
    └── conversations.css           # 对话页
```

### 3.3 页面样式文件详情

#### home.css (首页背景图片样式)
```css
/* 首页样式 */
body {
  background: url(/images/haizi-hero.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
```

#### poetry-index.css (296行)
- 左侧筛选栏样式（类型、时间筛选）
- 搜索栏样式
- 诗歌列表样式
- 响应式设计

#### poetry-detail.css (165行)
- 诗歌内容展示
- 右侧标签栏
- 返回按钮
- 淡入动画

#### timeline.css (200行)
- 左侧时间轴导航
- 时间线交互效果
- 年份详情展示
- 响应式布局

#### biographies-index.css (189行)
- 轮播卡片样式
- 导航箭头
- 卡片悬停效果
- 响应式轮播

#### biographies-detail.css (188行)
- 左侧书籍卡片
- 右侧摘录列表
- 返回按钮
- 版权提示

#### conversations.css (60行)
- Coming Soon页面
- 居中布局
- 返回链接

### 3.4 样式使用方式

在对应的`.astro`页面文件中导入：

```astro
---
import '../../styles/pages/页面名称.css';
---
```

**示例**：
```astro
---
// src/pages/poetry/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import '../../styles/pages/poetry-index.css';
---

<BaseLayout title="诗歌" currentPage="poetry">
  <!-- 页面内容 -->
</BaseLayout>
```

---

## 四、导航栏重构

### 4.1 布局优化

**重构前**：导航链接和装饰分散
**重构后**：
- Logo靠左
- 导航链接和装饰元素组合在右侧（`.nav-right`容器）

### 4.2 尺寸优化

| 属性 | 重构前 | 重构后 |
|------|--------|--------|
| 导航栏高度 | 80px | **70px** |
| Logo字体 | 24px | **20px** |
| 导航链接字体 | 14px | **16px** |
| 链接间距 | 1.5rem | **2rem** |
| 内边距 | 1rem | **1.5rem** |

### 4.3 交互优化

**移除内容**：
- ❌ 鼠标悬停时的下划线动画

**保留内容**：
- ✅ 当前页面高亮显示
- ✅ 悬停颜色变化
- ✅ 响应式折叠菜单（移动端）

### 4.4 代码注释

为 `src/components/Navbar.astro` 添加了详细的中文注释，包括：
- 组件用途说明
- 数据结构说明
- 布局结构说明
- 样式说明
- 交互逻辑说明

---

## 五、首页重构

### 5.1 设计简化

**重构前**：包含多个内容区块、标题、描述等

**重构后**：极简设计
- 仅保留导航栏组件
- 背景图片全屏展示
- 无滚动，无额外内容

### 5.2 背景图片设置

```css
body {
  background: url(/images/haizi-hero.png);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
```

**特点**：
- 图片覆盖整个视口
- 居中显示
- 不重复
- 响应式适配

---

## 六、重构影响范围

### 6.1 修改的文件

#### 核心样式文件
- ✅ `src/styles/global.css` - CSS变量系统重构
- ✅ `src/layouts/BaseLayout.astro` - 字体加载更新

#### 组件文件
- ✅ `src/components/Navbar.astro` - 布局和样式重构、添加注释

#### 页面文件（移除内联样式，添加CSS导入）
- ✅ `src/pages/index.astro`
- ✅ `src/pages/poetry/index.astro`
- ✅ `src/pages/poetry/[id].astro`
- ✅ `src/pages/timeline/index.astro`
- ✅ `src/pages/biographies/index.astro`
- ✅ `src/pages/biographies/[id].astro`
- ✅ `src/pages/conversations.astro`

#### 新增CSS文件
- ✅ `src/styles/pages/home.css`
- ✅ `src/styles/pages/poetry-index.css`
- ✅ `src/styles/pages/poetry-detail.css`
- ✅ `src/styles/pages/timeline.css`
- ✅ `src/styles/pages/biographies-index.css`
- ✅ `src/styles/pages/biographies-detail.css`
- ✅ `src/styles/pages/conversations.css`

#### 新增文档
- ✅ `src/styles/pages/README.md`
- ✅ `REFACTORING.md` (本文档)

### 6.2 未修改的内容

- ✅ JavaScript功能完全保留（筛选、搜索、轮播、时间轴交互等）
- ✅ 响应式设计完全保留
- ✅ 动画效果完全保留
- ✅ 数据结构和内容未改变

---

## 七、技术要点

### 7.1 CSS变量的优势

```css
/* 定义一次 */
:root {
  --colorPrimary: #600000;
}

/* 全局使用 */
.button { background: var(--colorPrimary); }
.link:hover { color: var(--colorPrimary); }
```

**优势**：
- 主题统一性
- 易于维护（修改一处，全局更新）
- 支持动态修改（JavaScript可修改CSS变量）
- 语义化命名

### 7.2 驼峰命名的选择

虽然CSS传统使用kebab-case（`font-size`），但本项目选择camelCase（`fontSize`）原因：

1. **与JavaScript一致**：`style.fontSize`
2. **更易读**：不需要连字符
3. **现代化**：符合组件化开发趋势
4. **团队习惯**：根据团队偏好统一

### 7.3 响应式设计保留

所有页面样式文件中都包含了媒体查询，确保在不同设备上的体验：

```css
/* 平板 */
@media (max-width: 768px) {
  .container { padding: var(--spacingMd); }
}

/* 手机 */
@media (max-width: 480px) {
  .nav-links { flex-direction: column; }
}
```

---

## 八、代码示例对比

### 8.1 页面文件对比

**重构前** (`poetry/index.astro`)：
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { samplePoems } from '../../content/data';
---

<BaseLayout title="诗歌" currentPage="poetry">
  <div class="poetry-page">
    <!-- HTML 内容 -->
  </div>
</BaseLayout>

<style>
  /* 300行的CSS代码内联在这里 */
  .poetry-page { ... }
  .filter-sidebar { ... }
  .search-bar { ... }
  /* ... */
</style>

<script>
  // JavaScript代码
</script>
```

**重构后** (`poetry/index.astro`)：
```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { samplePoems } from '../../content/data';
import '../../styles/pages/poetry-index.css';
---

<BaseLayout title="诗歌" currentPage="poetry">
  <div class="poetry-page">
    <!-- HTML 内容 -->
  </div>
</BaseLayout>

<script>
  // JavaScript代码
</script>
```

**改进**：
- ✅ 文件大小减少约300行
- ✅ 结构更清晰
- ✅ 样式可独立维护

### 8.2 CSS变量使用对比

**重构前**：
```css
.navbar {
  height: 70px;
  background: #ffffff;
  color: #1a1a1a;
  font-size: 16px;
  padding: 0 2rem;
}
```

**重构后**：
```css
.navbar {
  height: var(--navHeight);
  background: var(--colorBackground);
  color: var(--colorText);
  font-size: var(--fontSizeBase);
  padding: 0 var(--spacingXl);
}
```

**改进**：
- ✅ 语义化更强
- ✅ 统一管理
- ✅ 易于主题切换

---

## 九、最佳实践

### 9.1 CSS文件组织

```
✅ 推荐：按页面组织
src/styles/pages/poetry-index.css

❌ 不推荐：按功能混合
src/styles/filters-and-search.css
```

### 9.2 变量命名

```css
✅ 推荐：语义化驼峰命名
--colorPrimary
--fontSizeBase
--spacingLg

❌ 不推荐：缩写或混合
--clr-primary
--font-size-base
--spacing_lg
```

### 9.3 样式导入

```astro
✅ 推荐：在frontmatter中导入
---
import '../styles/pages/home.css';
---

❌ 不推荐：在<head>中手动链接
<link rel="stylesheet" href="...">
```

---

## 十、维护指南

### 10.1 修改全局样式

修改 `src/styles/global.css` 中的CSS变量：

```css
:root {
  --colorPrimary: #600000;  /* 修改主色调 */
  --fontSizeBase: 1rem;     /* 修改基础字号 */
}
```

### 10.2 修改页面样式

直接编辑对应的CSS文件：

```
诗歌索引页 → src/styles/pages/poetry-index.css
诗歌详情页 → src/styles/pages/poetry-detail.css
时间线页 → src/styles/pages/timeline.css
```

### 10.3 添加新页面

1. 创建页面文件：`src/pages/new-page.astro`
2. 创建样式文件：`src/styles/pages/new-page.css`
3. 在页面中导入：`import '../styles/pages/new-page.css';`
4. 使用CSS变量：`color: var(--colorPrimary);`

### 10.4 修改导航栏

编辑 `src/components/Navbar.astro`：
- 样式修改：在`<style>`标签中
- 布局修改：在HTML结构中
- 链接修改：在`navItems`数组中

---

## 十一、性能影响

### 11.1 构建优化

- ✅ CSS文件可独立缓存
- ✅ 减少单个文件体积
- ✅ 按需加载（每个页面只加载自己的CSS）

### 11.2 开发体验

- ✅ 热更新更快（修改CSS不影响JS）
- ✅ 代码编辑器性能更好（文件更小）
- ✅ Git diff更清晰（样式改动独立）

---

## 十二、未来改进建议

### 12.1 短期改进

- [ ] 考虑提取组件样式到 `src/styles/components/`
- [ ] 添加暗色模式支持
- [ ] 优化移动端响应式设计

### 12.2 长期改进

- [ ] 考虑使用CSS Modules或CSS-in-JS方案
- [ ] 引入设计令牌管理工具
- [ ] 建立组件库和设计系统文档

---

## 十三、总结

本次重构实现了以下核心目标：

1. ✅ **统一设计系统**：建立了完整的CSS变量体系，使用驼峰命名规范
2. ✅ **关注点分离**：将所有页面样式提取到独立CSS文件
3. ✅ **优化字体系统**：统一使用Satoshi（英文）和宋体（中文）
4. ✅ **简化导航栏**：优化布局、尺寸和交互
5. ✅ **提升代码质量**：添加注释、文档，提高可维护性

### 重构成果

- **7个CSS文件**：共约1,200行样式代码从`.astro`文件中提取
- **100+ CSS变量**：统一的设计令牌系统
- **完整文档**：包含本文档和 `src/styles/pages/README.md`
- **零功能损失**：所有功能、动画、响应式设计完全保留

### 技术栈

- **框架**：Astro
- **样式**：CSS + CSS Variables
- **字体**：Satoshi (Fontshare CDN) + SimSun
- **命名规范**：camelCase for CSS variables

---

**文档版本**：1.0
**最后更新**：2026年1月
**维护者**：海子诗歌网站开发团队
