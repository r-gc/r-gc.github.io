---
title: Fuwari 写作规则与 Markdown 扩展速查
published: 2026-05-20
updated: 2026-05-20
description: 整理 Fuwari 文章 frontmatter、文章位置、图片路径、提示块和 GitHub 仓库卡片语法。
tags: [Fuwari, Astro, Markdown, 写作, 速查, 配置]
category: 笔记
draft: false
---

这篇整理当前博客写文章时最容易忘的规则。

## 文章放哪里

正式文章放在：

```txt
src/content/posts/
```

笔记建议放在：

```txt
src/content/posts/notes/
```

可以用子目录组织文章和图片：

```txt
src/content/posts/notes/example-note/
  index.md
  cover.png
  screenshot.png
```

## 文章 frontmatter 模板

```yaml
---
title: 笔记标题
published: 2026-05-20
updated: 2026-05-20
description: 一句话说明这篇笔记解决什么问题。
tags: [Linux, Docker, 速查]
category: 笔记
draft: false
---
```

## 常用字段

`title`：文章标题。

`published`：发布时间。

`updated`：更新时间，可选。

`description`：首页、归档和搜索里会显示的摘要。

`tags`：标签，用来描述主题和用途。

`category`：一级分类。当前建议只用 `笔记`、`项目`、`博客`、`实验`、`随笔`。

`draft`：是否草稿。`true` 时生产环境不会显示。

`image`：封面图，可选。

## 图片路径规则

网络图片：

```yaml
image: https://example.com/cover.png
```

`public` 目录下的图片：

```yaml
image: /images/cover.png
```

相对文章文件的图片：

```yaml
image: ./cover.png
```

如果文章是目录形式：

```txt
my-note/
  index.md
  cover.png
```

那么 `./cover.png` 会相对 `index.md` 生效。

## 创建新文章

```bash
pnpm new-post filename
```

也可以直接手动新建 `.md` 文件。手动建更适合现在这种按目录分类的笔记库。

## 提示块语法

普通提示：

```md
::::note
这里是一条 note。
::::
```

提示：

```md
::::tip
这里是一条 tip。
::::
```

警告：

```md
::::warning
这里是一条 warning。
::::
```

注意：

```md
::::caution
这里是一条 caution。
::::
```

重要：

```md
::::important
这里是一条 important。
::::
```

自定义标题：

```md
::::note[自定义标题]
这里是内容。
::::
```

## GitHub 仓库卡片

```md
::github{repo="r-gc/r-gc.github.io"}
```

或者：

```md
::github{repo="rgc318/frappe_docker"}
```

这个卡片会在页面加载时请求 GitHub API 获取仓库信息，所以网络环境不稳定时可能加载慢。

## 代码块

普通代码块：

````md
```bash
pnpm build
```
````

带文件名或标题的代码块可以继续使用 Expressive Code 支持的写法。这个项目已经接入了代码复制按钮、行号和语言标识。

## 写作注意事项

笔记不需要一开始写成完整文章。

速查类内容优先写可复制命令，再写参数解释。

排错类内容优先写现象、原因、解决命令和下次怎么判断。

项目类内容优先写为什么这样做、踩过什么坑、以后怎么复用。
