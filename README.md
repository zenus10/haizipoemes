# 海子诗歌网站 (HaiZiPoemes)

一个致敬中国当代诗人海子的个人网站，收录其诗歌全集、生平时间轴等信息。

## 🌟 项目特点

- **现代化设计**: 简洁优雅的视觉风格，中文排版优化
- **完整功能**: 诗歌浏览、筛选、搜索，时间轴导航
- **响应式布局**: 支持桌面端、平板端和移动端
- **高性能**: 基于 Astro 构建，静态生成，加载快速

## 🏗️ 技术栈

- **框架**: [Astro](https://astro.build/) v4.x
- **样式**: 原生 CSS + CSS Variables
- **部署**: [Netlify](https://netlify.com/)（敬请期待）

## 📁 项目结构

（敬请期待）

## 🚀 开始使用

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📝 添加内容

### 添加诗歌

在 `src/content/poems/` 目录下创建 Markdown 文件：

```markdown
---
title: "诗歌标题"
type: "short"       # short(短诗), long(长诗), sun(太阳·七部书), essay(文论)
year: "1989"        # 创作年份
tags: ["短诗", "1989"]
order: 1            # 排序（可选）
---

诗歌正文内容...
```

### 添加时间轴事件

在 `src/content/timeline/` 目录下创建 Markdown 文件：

```markdown
---
year: 1987
title: "事件标题"
images: ["/images/1987-photo.jpg"]  # 可选
order: 7
---

事件详细描述...
```

## 🎨 自定义主题

主题颜色定义在 `src/styles/global.css` 的 CSS 变量中：

```css
:root {
  --color-primary: #600000;      /* 主色调 - 深红色 */
  --color-primary-light: #8B0000;
  --color-primary-dark: #400000;
  /* ... */
}
```

## 📱 页面说明

1. **首页**: 全屏展示海子形象，诗句装饰
2. **诗歌总览**: 左侧标签筛选 + 右侧诗歌列表，支持搜索
3. **诗歌详情**: 诗歌全文 +目录导航
4. **时间轴**: 交互式年份导航 + 生平详情
7. **CONTACT页面：** 联系页面+表单

## 🌐 部署

项目配置为直接部署到 Netlify：

1. 连接 GitHub 仓库到 Netlify
2. 构建命令: `npm run build`
3. 发布目录: `dist`

## 📄 许可

本项目仅用于学习和纪念目的。诗歌来源于网络，若有问题请联系我。

---

*致敬海子 (1964-1989)*
