# 海子诗歌档案 HaiZiPoemes

一个收录海子诗歌全集的在线档案，帮助读者发现、阅读和理解这位中国当代最重要的诗人之一。

**在线访问**: [haizipoemes.netlify.app](https://haizipoemes.netlify.app)

---

## 内容收录

| 类型 | 数量 | 说明 |
|------|------|------|
| 短诗 | 238 首 | 按年份（1983-1989）分类 |
| 长诗 | 4 首 | 《河流》《传说》《但是水、水》《神秘故事》 |
| 太阳·七部书 | 7 篇 | 海子后期史诗性作品 |
| 文论 | 8 篇 | 诗学随笔与评论 |
| 生平年表 | 28 条 | 1964-1991 |

---

## 技术栈

- **框架**: [Astro](https://astro.build/) 4.x — 静态站点生成
- **样式**: [UnoCSS](https://unocss.dev/) + CSS Variables
- **内容**: Markdown + MDX
- **部署**: [Netlify](https://netlify.com/)

---

## 项目结构

```
src/
├── components/
│   └── Navbar.astro         # 导航栏
├── content/
│   ├── poems/               # 诗歌内容
│   │   ├── short/           # 短诗（按年份子目录）
│   │   ├── long/            # 长诗
│   │   ├── sun/             # 太阳·七部书
│   │   └── essay/           # 文论
│   ├── timeline/            # 生平年表
│   └── config.ts            # 内容集合定义
├── layouts/
│   └── BaseLayout.astro     # 基础布局
├── pages/
│   ├── index.astro          # 首页
│   ├── poetry/
│   │   ├── index.astro      # 诗歌列表（筛选/搜索）
│   │   └── [id].astro       # 诗歌详情
│   ├── timeline/
│   │   └── index.astro      # 生平年表
│   └── contact.astro        # 联系页
└── styles/
    ├── global.css           # 全局变量与基础样式
    └── pages/               # 页面专属样式
```

---

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

---

## 添加内容

### 添加诗歌

在 `src/content/poems/{type}/` 目录下创建 `.mdx` 文件：

```yaml
---
title: "诗歌标题"
type: "short"          # short | long | sun | essay
year: "1987"           # 创作年份
tags: ["麦地", "村庄"]  # 主题标签
order: 1               # 排序权重
---

诗歌正文...
```

### 添加年表事件

在 `src/content/timeline/` 目录下创建 `.mdx` 文件：

```yaml
---
year: 1987
title: "事件标题"
order: 7
---

事件描述...
```

---

## 设计系统

主题变量定义在 `src/styles/global.css`：

```css
:root {
  --colorPrimary: #600000;        /* 深红 */
  --colorText: #1a1a1a;
  --colorBackground: #ffffff;
  --fontDisplay: "Microsoft YaHei", "PingFang SC", sans-serif;
  --fontBody: "Satoshi", "Microsoft YaHei", sans-serif;
}
```

---

## 部署

项目已配置 Netlify 自动部署：

1. 推送代码到 GitHub
2. Netlify 自动执行 `npm run build`
3. 静态文件部署到 CDN

---

## 许可

代码以 MIT 许可开源。诗歌内容版权归海子及其遗产继承人所有，本站仅作学习与纪念用途。

---

海子（1964-1989）
