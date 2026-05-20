---
title: RGC Blog 构建与部署注意事项
published: 2026-05-20
updated: 2026-05-20
description: 整理当前博客项目的 pnpm、Astro、Pagefind、GitHub Pages 和 Cloudflare Workers 部署注意事项。
tags: [Astro, Fuwari, Cloudflare, GitHub Pages, pnpm, 部署, 排错, 速查]
category: 笔记
draft: false
---

这篇记录当前博客项目自己的构建和部署注意事项。

## 本地开发命令

安装依赖：

```bash
pnpm install
```

启动开发服务器：

```bash
pnpm dev
```

本地构建：

```bash
pnpm build
```

预览构建结果：

```bash
pnpm preview
```

## 包管理器版本

项目指定：

```json
{
  "packageManager": "pnpm@9.14.4"
}
```

并且有 preinstall 限制：

```json
{
  "preinstall": "npx only-allow pnpm"
}
```

所以这个项目应该使用 `pnpm`，不要用 `npm install` 或 `yarn install`。

## Node 版本

GitHub Actions 使用：

```yaml
node-version: 22
```

本地如果有多个 Node 版本，优先使用 Node 22。

查看：

```bash
node -v
pnpm -v
```

## 构建命令实际做了什么

`package.json` 里：

```json
{
  "build": "astro build && pagefind --site dist"
}
```

也就是说 `pnpm build` 会先生成 Astro 静态站点，再为 `dist` 生成 Pagefind 搜索索引。

如果只运行 `astro build`，页面可以生成，但搜索索引可能不是最新的。

## GitHub Pages 部署方式

当前正确方式是 GitHub Actions。

workflow 文件：

```txt
.github/workflows/deploy.yml
```

关键步骤：

```yaml
- run: pnpm install --frozen-lockfile
- run: pnpm build
- uses: actions/upload-pages-artifact@v3
- uses: actions/deploy-pages@v4
```

GitHub 仓库设置里应该选择：

```txt
Settings -> Pages -> Build and deployment -> Source -> GitHub Actions
```

不要选择：

```txt
Deploy from a branch
```

否则 GitHub 可能会同时触发默认 Jekyll 构建，出现一个成功的 Astro workflow 和一个失败的 `pages build and deployment`。

## GitHub Pages 出现 Jekyll 日志是什么意思

如果日志里出现：

```txt
GitHub Pages: jekyll
Theme: jekyll-theme-primer
Source: /github/workspace/.
Destination: /github/workspace/./_site
```

说明 GitHub 正在把仓库根目录当成 Jekyll 站点构建。

这个项目是 Astro，不应该走 Jekyll。

解决方法是把 Pages Source 改成：

```txt
GitHub Actions
```

## Cloudflare Workers 部署

当前 Cloudflare Workers Static Assets 配置在：

```txt
wrangler.jsonc
```

核心配置：

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

Cloudflare 构建命令：

```bash
pnpm run build
```

部署命令：

```bash
npx wrangler deploy
```

## 站点地址配置

Astro 配置里：

```js
site: "https://r-gc.github.io/",
base: "/",
trailingSlash: "always",
```

`site` 会影响 sitemap、RSS 等生成结果。

如果以后主域名完全切到：

```txt
https://blog.rgcdev.top/
```

可以考虑把 `site` 改成主域名。

## 常见排查命令

本地构建：

```bash
pnpm build
```

检查生成页面：

```bash
find dist -maxdepth 3 -type f | sort
```

查看 GitHub Actions 配置：

```bash
sed -n '1,220p' .github/workflows/deploy.yml
```

查看 Cloudflare 配置：

```bash
sed -n '1,160p' wrangler.jsonc
```

查看 scripts：

```bash
node -p "require('./package.json').scripts"
```

## 注意事项

Cloudflare Workers 和 GitHub Pages 是两套部署。

Cloudflare 当前是主站部署，GitHub Pages 可以作为备用和对照。

GitHub Pages 默认 Jekyll 构建失败，不代表 Astro workflow 失败；看绿色的 `Deploy to GitHub Pages` workflow 是否成功更关键。

新增笔记后，Pagefind 会在构建时更新搜索索引。
