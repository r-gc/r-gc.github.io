---
title: RGC Blog：用 Astro、Fuwari 和 Cloudflare Workers 搭建个人站
published: 2026-05-20
description: 记录这个博客从选型、部署到栏目规划的第一版架构。
tags: [Astro, Fuwari, Cloudflare, GitHub Pages]
category: 项目复盘
draft: false
---

这个博客的目标不是只放几篇文章，而是做成一个长期维护的个人空间：技术文章、项目复盘、学习笔记、代码片段和一些 Web 实验都可以沉淀在这里。

## 技术选型

第一版选择：

- Astro
- Fuwari
- Markdown 内容
- Pagefind 搜索
- GitHub 代码托管
- Cloudflare Workers Static Assets 主部署
- GitHub Pages 备用部署

选择 Astro 的原因是它适合内容型站点，默认静态生成，性能好，又能在需要动态能力时接入组件。

选择 Fuwari 的原因是它已经具备博客所需的基础体验：

- 首页文章流
- 文章详情
- 归档
- 分类和标签
- 搜索
- 深色模式
- 页面转场
- RSS 和 sitemap

## 部署结构

当前部署链路是：

```txt
本地开发
  -> git push
  -> GitHub 仓库
  -> Cloudflare Workers 构建部署
  -> blog.rgcdev.top
```

同时保留 GitHub Pages：

```txt
GitHub Actions
  -> pnpm build
  -> dist
  -> r-gc.github.io
```

这样做的好处是：主站可以走 Cloudflare，自定义域名和后续 R2 / Workers 能力都在一个体系里；GitHub Pages 则作为备用访问和对照环境。

## 内容结构

目前规划了几个顶层栏目：

- 首页：最新文章
- 归档：按时间、分类、标签浏览
- 项目：展示系统、工具、AI 应用和工程实践
- 笔记：保存短内容、配置备忘和学习记录
- 实验室：放动画、音乐、视频和交互 demo
- 关于：个人介绍和站点说明

项目页已经改成数据驱动，项目数据统一放在 `src/data/projects.ts`。后续新增项目时，不需要直接改页面布局。

## 当前状态

第一版已经完成：

- 站点初始化
- 中文配置
- Cloudflare Workers 部署
- GitHub Pages 备用部署
- 自定义域名
- 项目、笔记、实验室栏目
- 项目页数据化
- 第一批项目复盘文章

后续还需要继续打磨：

- 替换头像和 favicon
- 补真实项目截图
- 为重点项目建立详情页
- 优化首页布局
- 增加音乐和视频实验
- 把大图和媒体资源迁移到 Cloudflare R2

这个站点会边写边改。博客不是一次性完成品，而是一个长期演进的工作台。
