# 笔记架构

这个博客以笔记为主，项目页只作为辅助入口。

## 内容位置

所有正式内容继续使用 Fuwari / Astro 原生文章集合：

```txt
src/content/posts/
```

笔记建议放在：

```txt
src/content/posts/notes/
```

后续可以继续按主题分目录：

```txt
src/content/posts/notes/
  linux/
  docker/
  frontend/
  ai/
  frappe/
  deploy/
```

## 分类规则

`category` 保持少量一级分类：

- 笔记
- 项目
- 博客
- 实验
- 随笔

## 标签规则

`tags` 用来表达主题和用途，例如：

- 技术栈：`Docker`、`Frappe`、`Astro`、`Cloudflare`
- 场景：`部署`、`排错`、`配置`、`速查`
- 内容类型：`项目笔记`、`阅读摘记`、`实验记录`

## 推荐笔记模板

```yaml
---
title: 笔记标题
published: 2026-05-20
updated: 2026-05-20
description: 一句话说明这篇笔记解决什么问题。
tags: [主题, 场景, 类型]
category: 笔记
draft: false
---
```

## 写作顺序

1. 先写问题或背景。
2. 再写关键结论。
3. 保留命令、配置、错误信息和链接。
4. 最后补“下次怎么做”。

笔记可以短，不需要一开始写成完整文章。
