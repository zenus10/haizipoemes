# 诗歌总览页 - Poetry Index Page

## 页面概述

诗歌总览页是海子诗歌网站的核心页面之一，提供诗歌浏览、筛选和搜索功能。

**访问路径**：`/poetry`

**核心功能**：
- 📚 诗歌列表展示
- 🔍 实时搜索功能
- 🏷️ 多维度筛选（类型、时间）
- 📱 响应式设计

**页面布局**：
```
┌─────────────────────────────────────────────┐
│            导航栏 (Navbar)                    │
├──────────────┬──────────────────────────────┤
│              │  搜索栏 (Search Bar)           │
│  筛选栏      │  ┌────────┐                   │
│  (Sidebar)   │  └────────┘                   │
│              │                               │
│  ┌ 筛选 ┐    │  • 诗歌标题1                  │
│  [类型]      │  • 诗歌标题2                  │
│   ☑ 短诗     │  • 诗歌标题3                  │
│   □ 长诗     │  • 诗歌标题4                  │
│              │  • 诗歌标题5                  │
│  [时间]      │  ...                          │
│   ☑ 1989     │                               │
│   □ 1988     │                               │
│              │                               │
└──────────────┴──────────────────────────────┘
```

---

## 文件组成

### 核心文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 页面文件 | `index.astro` | 页面结构和交互逻辑 |
| 样式文件 | `../../styles/pages/poetry-index.css` | 页面专属样式 |
| 数据源 | `../../content/data.ts` | 诗歌数据定义 |
| 布局组件 | `../../layouts/BaseLayout.astro` | 基础布局 |
| 全局样式 | `../../styles/global.css` | CSS变量定义 |

### 文件依赖关系

```
index.astro
  ├─ import BaseLayout from '../../layouts/BaseLayout.astro'
  ├─ import { samplePoems, poemTypes, poemYears } from '../../content/data'
  └─ import '../../styles/pages/poetry-index.css'
       └─ 使用 var(--colorPrimary) 等全局CSS变量
```

---

## 功能详解

### 1. 筛选功能

#### 1.1 类型筛选

**支持的类型**：
```typescript
export const poemTypes = [
  { key: 'short', label: '短诗' },
  { key: 'long', label: '长诗' },
  { key: 'sun', label: '太阳·七部书' },
  { key: 'essay', label: '文论' },
];
```

**筛选逻辑**：
- 多选支持：可同时选择多个类型
- 空选显示全部：未选择任何类型时显示所有诗歌
- AND逻辑：与其他筛选条件组合使用

#### 1.2 时间筛选

**年份范围**：1983-1989（海子创作时期）
```typescript
export const poemYears = [
  '1983', '1984', '1985', '1986', '1987', '1988', '1989'
];
```

**筛选特点**：
- 覆盖完整创作时期
- 支持多选
- 与类型筛选联动

#### 1.3 可折叠筛选组

**HTML结构**：
```astro
<div class="filter-group">
  <button class="filter-group-toggle" data-group="type">
    <span>类型</span>
    <svg class="toggle-icon">...</svg>
  </button>
  <div class="filter-options" data-group-content="type">
    <!-- 筛选选项 -->
  </div>
</div>
```

**交互行为**：
- 点击标题展开/收起
- 图标旋转动画（90度）
- 默认展开状态

#### 1.4 清除按钮

**位置**：筛选栏顶部右侧

**功能**：
- 取消所有复选框选中
- 清空搜索框
- 重新显示全部诗歌

**实现代码**：
```javascript
clearButton?.addEventListener('click', () => {
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  searchInput.value = '';
  filterPoems();
});
```

---

### 2. 搜索功能

#### 2.1 实时搜索

**触发方式**：`input`事件（每次输入都触发）

**搜索范围**：诗歌标题

**匹配规则**：
- 不区分大小写
- 包含匹配（部分匹配即可）
- 支持中英文

**实现代码**：
```javascript
searchInput?.addEventListener('input', filterPoems);

function filterPoems() {
  const searchTerm = searchInput.value.toLowerCase();
  poems?.forEach(poem => {
    const title = poem.getAttribute('data-title')?.toLowerCase() || '';
    const matchesSearch = !searchTerm || title.includes(searchTerm);
    // ...
  });
}
```

#### 2.2 粘性搜索栏

**CSS实现**：
```css
.search-bar {
  position: sticky;
  top: var(--navHeight);  /* 70px */
  z-index: 10;
  background: var(--colorBackground);
}
```

**效果**：
- 滚动时搜索栏保持在导航栏下方
- 方便用户在浏览长列表时快速搜索

---

### 3. 列表展示

#### 3.1 诗歌列表项

**HTML结构**：
```astro
<a
  href={`/poetry/${poem.id}`}
  class="poem-item"
  data-type={poem.type}
  data-year={poem.year}
  data-title={poem.title}
>
  <span class="poem-dot"></span>
  <span class="poem-title">{poem.title}</span>
</a>
```

**设计元素**：
- 红色装饰圆点（8px）
- 诗歌标题
- 悬停背景变色
- 标题颜色变深红

#### 3.2 data属性设计

**用途**：存储诗歌元数据，供JavaScript过滤使用

| 属性 | 说明 | 示例 |
|------|------|------|
| `data-type` | 诗歌类型 | `short`, `long`, `sun`, `essay` |
| `data-year` | 创作年份 | `1989`, `1988`, ... |
| `data-title` | 诗歌标题 | `面朝大海，春暖花开` |

**优势**：
- 避免在DOM中存储复杂对象
- 方便JavaScript通过属性选择器查询
- 语义化标记

#### 3.3 链接跳转

**目标页面**：`/poetry/[id]`（诗歌详情页）

**路由示例**：
```
/poetry/facing-the-sea    → 《面朝大海，春暖花开》
/poetry/haizi-diary       → 《海子小夜曲》
```

---

## 数据结构

### Poem接口

```typescript
export interface Poem {
  id: string;           // 唯一标识符，用于URL路由
  title: string;        // 诗歌标题
  content: string;      // 诗歌完整内容（多行文本）
  type?: string;        // 类型: 'short' | 'long' | 'sun' | 'essay'
  year?: string;        // 年份: '1983'-'1989'
  tags: string[];       // 标签数组（暂未使用）
}
```

### 示例数据

```typescript
{
  id: 'facing-the-sea',
  title: '面朝大海，春暖花开',
  content: `从明天起，做一个幸福的人
喂马，劈柴，周游世界
从明天起，关心粮食和蔬菜
我有一所房子，面朝大海，春暖花开`,
  type: 'short',
  year: '1989',
  tags: ['短诗', '1989']
}
```

---

## 样式系统

### CSS变量（来自global.css）

**颜色**：
```css
--colorPrimary: #600000;              /* 深红色（主题色） */
--colorPrimaryLight: #8B0000;         /* 浅红色（悬停） */
--colorText: #1a1a1a;                 /* 正文文字 */
--colorTextLight: #666666;            /* 次要文字 */
--colorBackground: #ffffff;           /* 背景白色 */
--colorBorder: #e5e5e5;               /* 边框灰色 */
```

**字体**：
```css
--fontDisplay: 'SimSun', 'Songti SC', serif;              /* 宋体（标题） */
--fontBody: 'Satoshi', 'SimSun', 'Songti SC', sans-serif; /* Satoshi（正文） */
--fontSizeBase: 1rem;                                      /* 16px */
--fontSizeSm: 0.875rem;                                    /* 14px */
```

**间距**：
```css
--spacingMd: 1rem;                    /* 16px */
--spacingLg: 1.5rem;                  /* 24px */
--spacingXl: 2rem;                    /* 32px */
--spacing2xl: 3rem;                   /* 48px */
```

**布局**：
```css
--navHeight: 70px;                    /* 导航栏高度 */
--sidebarWidth: 320px;                /* 侧边栏宽度 */
```

**动画**：
```css
--transitionFast: 150ms ease;         /* 快速过渡 */
--transitionNormal: 250ms ease;       /* 标准过渡 */
```

### 布局方式

**两列Flexbox布局**：
```css
.poetry-page {
  display: flex;                      /* 左右布局 */
}

.filter-sidebar {
  width: var(--sidebarWidth);         /* 固定宽度320px */
  position: sticky;                   /* 粘性定位 */
  top: var(--navHeight);              /* 在导航栏下方 */
}

.poetry-main {
  flex: 1;                            /* 占据剩余空间 */
}
```

### 自定义复选框

**实现原理**：
1. 隐藏原生`<input type="checkbox">`
2. 使用`.checkbox-custom`伪元素模拟
3. 通过`:checked`伪类控制样式

**关键代码**：
```css
/* 隐藏原生复选框 */
.filter-option input {
  position: absolute;
  opacity: 0;
}

/* 自定义复选框外观 */
.checkbox-custom {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--colorBorder);
  border-radius: 3px;
}

/* 选中状态 */
.filter-option input:checked + .checkbox-custom {
  background-color: var(--colorPrimary);
  border-color: var(--colorPrimary);
}

/* 勾选符号（CSS绘制） */
.filter-option input:checked + .checkbox-custom::after {
  content: '';
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translateY(-1px);
}
```

---

## 交互逻辑

### 核心过滤函数

```javascript
function filterPoems() {
  // 1. 获取搜索关键词
  const searchTerm = searchInput.value.toLowerCase();

  // 2. 获取选中的类型
  const selectedTypes = Array.from(
    document.querySelectorAll('input[name="type"]:checked')
  ).map(input => input.value);

  // 3. 获取选中的年份
  const selectedYears = Array.from(
    document.querySelectorAll('input[name="year"]:checked')
  ).map(input => input.value);

  // 4. 遍历所有诗歌项
  const poems = poemList?.querySelectorAll('.poem-item');
  poems?.forEach(poem => {
    const title = poem.getAttribute('data-title')?.toLowerCase() || '';
    const type = poem.getAttribute('data-type') || '';
    const year = poem.getAttribute('data-year') || '';

    // 5. 三重条件判断（AND逻辑）
    const matchesSearch = !searchTerm || title.includes(searchTerm);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(type);
    const matchesYear = selectedYears.length === 0 || selectedYears.includes(year);

    // 6. 显示或隐藏
    if (matchesSearch && matchesType && matchesYear) {
      poem.classList.remove('hidden');
    } else {
      poem.classList.add('hidden');
    }
  });
}
```

**过滤逻辑**：
- **搜索匹配**：标题包含关键词（空则不过滤）
- **类型匹配**：类型在选中列表中（空则不过滤）
- **年份匹配**：年份在选中列表中（空则不过滤）
- **组合规则**：三个条件必须同时满足（AND）

### 事件监听

```javascript
// 复选框变化 → 触发过滤
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', filterPoems);
});

// 搜索输入 → 实时过滤
searchInput?.addEventListener('input', filterPoems);

// 清除按钮 → 重置 + 过滤
clearButton?.addEventListener('click', () => {
  checkboxes.forEach(cb => cb.checked = false);
  searchInput.value = '';
  filterPoems();
});

// 筛选组折叠/展开
filterToggles.forEach(toggle => {
  toggle.addEventListener('click', () => {
    const group = toggle.getAttribute('data-group');
    const content = document.querySelector(`[data-group-content="${group}"]`);
    toggle.classList.toggle('collapsed');
    content?.classList.toggle('hidden');
  });
});
```

### 数据流向图

```
用户操作
  ↓
┌─────────────────┬──────────────────┬───────────────┐
│  输入搜索关键词   │  勾选/取消复选框  │  点击清除按钮  │
└─────────────────┴──────────────────┴───────────────┘
  ↓                  ↓                   ↓
  input事件          change事件          click事件
  ↓                  ↓                   ↓
  └──────────────────┴────────────────────┘
                     ↓
              filterPoems() 函数
                     ↓
      ┌──────────────┼──────────────┐
      ↓              ↓              ↓
   读取搜索词    读取选中类型   读取选中年份
      ↓              ↓              ↓
      └──────────────┴──────────────┘
                     ↓
         遍历所有 .poem-item 元素
                     ↓
        读取 data-title, data-type, data-year
                     ↓
           三重条件判断（AND逻辑）
                     ↓
       ┌─────────────┴─────────────┐
       ↓                           ↓
   全部匹配                    至少一项不匹配
       ↓                           ↓
 移除 .hidden 类              添加 .hidden 类
       ↓                           ↓
   诗歌项显示                   诗歌项隐藏
```

---

## 响应式设计

### 断点定义

| 设备 | 屏幕宽度 | 布局特点 |
|------|---------|---------|
| 桌面 | > 1024px | 两列（320px + flex:1） |
| 平板 | 768px - 1024px | 两列（260px + flex:1） |
| 手机 | < 768px | 单列堆叠 |

### 桌面布局（默认）

```css
.poetry-page {
  display: flex;
  flex-direction: row;                /* 左右布局 */
}

.filter-sidebar {
  width: 320px;
  min-width: 320px;
  position: sticky;
  top: 70px;
}

.poetry-main {
  flex: 1;
  padding: 48px;
}
```

### 平板布局

```css
@media (max-width: 1024px) {
  .filter-sidebar {
    width: 260px;                     /* 缩小侧边栏 */
    min-width: 260px;
    padding: 24px;                    /* 减小内边距 */
  }
}
```

### 手机布局

```css
@media (max-width: 768px) {
  .poetry-page {
    flex-direction: column;           /* 竖向堆叠 */
  }

  .filter-sidebar {
    width: 100%;                      /* 全宽 */
    min-width: 100%;
    height: auto;                     /* 自适应高度 */
    position: relative;               /* 取消粘性定位 */
    top: 0;
    border-right: none;
    border-bottom: 1px solid var(--colorBorderLight);
  }

  .poetry-main {
    padding: 24px;
  }

  .search-bar {
    flex-direction: column;           /* 搜索栏竖排 */
  }

  .search-button {
    width: 100%;                      /* 按钮全宽 */
  }
}
```

---

## 使用指南

### 如何添加新诗歌

#### 步骤1：在data.ts中添加数据

```typescript
// src/content/data.ts
export const samplePoems: Poem[] = [
  // ... 现有诗歌
  {
    id: 'new-poem-id',              // 使用小写字母和连字符
    title: '新诗歌标题',
    content: `第一行
第二行
第三行`,
    type: 'short',                  // short | long | sun | essay
    year: '1989',                   // 1983-1989
    tags: ['短诗', '1989']
  }
];
```

#### 步骤2：创建详情页（自动生成）

由于使用了`getStaticPaths()`，添加数据后Astro会自动生成对应的详情页路由。

#### 步骤3：验证

1. 重启开发服务器
2. 访问 `/poetry` 查看列表
3. 点击新诗歌标题，跳转到 `/poetry/new-poem-id`

### 如何修改筛选选项

#### 添加新的诗歌类型

```typescript
// src/content/data.ts
export const poemTypes = [
  { key: 'short', label: '短诗' },
  { key: 'long', label: '长诗' },
  { key: 'sun', label: '太阳·七部书' },
  { key: 'essay', label: '文论' },
  { key: 'new-type', label: '新类型' },  // ← 添加新类型
];
```

无需修改页面代码，筛选选项会自动生成。

#### 添加新的年份

```typescript
// src/content/data.ts
export const poemYears = [
  '1983', '1984', '1985', '1986', '1987', '1988', '1989',
  '1990'  // ← 添加新年份
];
```

### 如何自定义样式

#### 修改主题色

```css
/* src/styles/global.css */
:root {
  --colorPrimary: #600000;          /* 改为其他颜色 */
}
```

所有使用`var(--colorPrimary)`的地方会自动更新。

#### 修改侧边栏宽度

```css
/* src/styles/global.css */
:root {
  --sidebarWidth: 320px;            /* 改为其他宽度，如280px */
}
```

#### 修改列表项样式

```css
/* src/styles/pages/poetry-index.css */
.poem-item {
  padding: var(--spacingMd) var(--spacingLg);
  border-radius: var(--radiusSm);
  /* 添加自定义样式 */
  font-size: 18px;
  font-weight: 500;
}

.poem-dot {
  width: 8px;                       /* 改变圆点大小 */
  height: 8px;
  background: var(--colorPrimary);
}
```

---

## 维护说明

### 样式变量修改位置

**全局变量**：`src/styles/global.css`
- 颜色系统
- 字体系统
- 间距系统
- 布局尺寸

**页面专属样式**：`src/styles/pages/poetry-index.css`
- 筛选栏布局
- 搜索栏样式
- 列表项样式
- 响应式适配

### 筛选逻辑扩展方法

#### 添加新的筛选维度（如：标签筛选）

**步骤1**：在data.ts中定义标签数据
```typescript
export const poemTags = ['爱情', '自然', '哲思', '生活'];
```

**步骤2**：在index.astro中添加筛选组
```astro
<div class="filter-group">
  <button class="filter-group-toggle" data-group="tag">
    <span>标签</span>
    <svg class="toggle-icon">...</svg>
  </button>
  <div class="filter-options" data-group-content="tag">
    {poemTags.map((tag) => (
      <label class="filter-option">
        <input type="checkbox" name="tag" value={tag} />
        <span class="checkbox-custom"></span>
        <span class="option-label">{tag}</span>
      </label>
    ))}
  </div>
</div>
```

**步骤3**：在filterPoems()中添加过滤逻辑
```javascript
const selectedTags = Array.from(
  document.querySelectorAll('input[name="tag"]:checked')
).map(input => input.value);

const tags = poem.getAttribute('data-tags')?.split(',') || [];
const matchesTag = selectedTags.length === 0 ||
  selectedTags.some(tag => tags.includes(tag));

// 在最终判断中添加
if (matchesSearch && matchesType && matchesYear && matchesTag) {
  poem.classList.remove('hidden');
} else {
  poem.classList.add('hidden');
}
```

**步骤4**：在诗歌列表项中添加data属性
```astro
<a
  href={`/poetry/${poem.id}`}
  class="poem-item"
  data-type={poem.type}
  data-year={poem.year}
  data-title={poem.title}
  data-tags={poem.tags.join(',')}  ← 新增
>
```

### 性能优化建议

#### 1. 搜索防抖

对于大量诗歌，频繁的过滤操作可能影响性能。

**优化方案**：添加防抖（debounce）
```javascript
let debounceTimer;
searchInput?.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(filterPoems, 300);  // 300ms延迟
});
```

#### 2. 事件委托

目前每个复选框都有独立监听器，数量多时可能影响性能。

**优化方案**：使用事件委托
```javascript
// 替代为：
document.querySelector('.filter-sidebar')?.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  if (target.type === 'checkbox') {
    filterPoems();
  }
});
```

#### 3. 虚拟滚动

如果诗歌数量超过1000首，可考虑虚拟滚动。

**推荐库**：
- `@tanstack/virtual`
- `react-window`（需要React集成）

#### 4. CSS优化

**避免重排重绘**：
```css
/* 使用 transform 代替 top/left */
.poem-item {
  transform: translateY(0);
  transition: transform var(--transitionFast);
}

.poem-item:hover {
  transform: translateY(-2px);  /* 比修改 margin-top 更高效 */
}
```

---

## 常见问题

### Q1: 筛选不生效？

**检查清单**：
1. 确认诗歌数据中有`type`和`year`字段
2. 检查`data-type`和`data-year`属性是否正确设置
3. 打开浏览器控制台查看是否有JavaScript错误

### Q2: 搜索框无法输入中文？

**原因**：IME输入法可能触发多次`input`事件

**解决方案**：使用`compositionend`事件
```javascript
let isComposing = false;

searchInput?.addEventListener('compositionstart', () => {
  isComposing = true;
});

searchInput?.addEventListener('compositionend', () => {
  isComposing = false;
  filterPoems();
});

searchInput?.addEventListener('input', () => {
  if (!isComposing) {
    filterPoems();
  }
});
```

### Q3: 移动端筛选栏太长？

**解决方案**：添加高度限制和滚动
```css
@media (max-width: 768px) {
  .filter-sidebar {
    max-height: 50vh;
    overflow-y: auto;
  }
}
```

### Q4: 如何添加动画效果？

**淡入动画**：
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.poem-item {
  animation: fadeIn 0.3s ease;
}

.poem-item.hidden {
  display: none;
}
```

---

## 技术栈总结

| 技术 | 用途 |
|------|------|
| **Astro** | 框架和SSG（静态站点生成） |
| **TypeScript** | 客户端脚本类型安全 |
| **CSS Variables** | 主题系统和设计令牌 |
| **Flexbox** | 响应式布局 |
| **Media Queries** | 断点适配 |
| **Data Attributes** | 元数据存储和DOM查询 |
| **Event Delegation** | 事件处理优化 |

---

## 相关文档

- [诗歌详情页 README](./[id]/README.md)（如需创建）
- [全局样式文档](../../styles/README.md)
- [数据结构文档](../../content/README.md)
- [项目重构文档](../../../REFACTORING.md)

---

**文档版本**：1.0
**最后更新**：2026年1月
**维护者**：海子诗歌网站开发团队
