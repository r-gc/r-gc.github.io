---
title: Cloudflare Workers 部署博客的记录
published: 2026-05-20
description: 记录这个 Astro 博客接入 Cloudflare Workers Static Assets 时用到的构建和部署配置。
tags: [Cloudflare, Workers, 部署, 配置]
category: 笔记
draft: false
---

这个博客目前主部署放在 Cloudflare Workers，GitHub Pages 作为备用。

当前 Cloudflare 侧的构建命令是：

```bash
pnpm run build
```

部署命令是：

```bash
npx wrangler deploy
```

项目里保留了 `wrangler.jsonc`，核心配置是把 Astro 构建后的 `dist` 作为静态资源目录：

```json
{
  "name": "r-gc-github-io",
  "compatibility_date": "2026-05-20",
  "assets": {
    "directory": "./dist/",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  }
}
```

后续如果接入 R2 放图片、音频或视频，Workers 会比单纯 GitHub Pages 更方便一些。现在先保持静态博客形态，等媒体资源真的多起来再迁移。
