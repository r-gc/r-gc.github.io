---
title: npm / pnpm / yarn 代理与镜像配置速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 Node 包管理器的代理、registry、查看配置和取消配置命令。
tags: [Node, npm, pnpm, yarn, Proxy, 代理, registry, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制 Node 包管理器相关配置。

## npm 查看配置

```bash
npm config list
npm config get proxy
npm config get https-proxy
npm config get registry
```

## npm 设置代理

```bash
npm config set proxy http://127.0.0.1:10808
npm config set https-proxy http://127.0.0.1:10808
```

取消代理：

```bash
npm config delete proxy
npm config delete https-proxy
```

## npm 设置 registry

官方源：

```bash
npm config set registry https://registry.npmjs.org/
```

国内镜像：

```bash
npm config set registry https://registry.npmmirror.com/
```

查看：

```bash
npm config get registry
```

## pnpm 查看配置

```bash
pnpm config list
pnpm config get proxy
pnpm config get https-proxy
pnpm config get registry
```

## pnpm 设置代理

```bash
pnpm config set proxy http://127.0.0.1:10808
pnpm config set https-proxy http://127.0.0.1:10808
```

取消代理：

```bash
pnpm config delete proxy
pnpm config delete https-proxy
```

## pnpm 设置 registry

官方源：

```bash
pnpm config set registry https://registry.npmjs.org/
```

国内镜像：

```bash
pnpm config set registry https://registry.npmmirror.com/
```

查看：

```bash
pnpm config get registry
```

## yarn 查看与设置

查看：

```bash
yarn config get proxy
yarn config get https-proxy
yarn config get registry
```

设置代理：

```bash
yarn config set proxy http://127.0.0.1:10808
yarn config set https-proxy http://127.0.0.1:10808
```

取消代理：

```bash
yarn config delete proxy
yarn config delete https-proxy
```

设置 registry：

```bash
yarn config set registry https://registry.npmjs.org/
```

## 使用环境变量临时代理

```bash
http_proxy=http://127.0.0.1:10808 https_proxy=http://127.0.0.1:10808 pnpm install
```

或者：

```bash
HTTP_PROXY=http://127.0.0.1:10808 HTTPS_PROXY=http://127.0.0.1:10808 npm install
```

## 常用配置文件位置

npm 用户配置通常在：

```txt
~/.npmrc
```

pnpm 也会读取 npm 兼容配置。可以直接查看：

```bash
cat ~/.npmrc
```

## 常用参数解释

`proxy`：HTTP 请求代理。

`https-proxy`：HTTPS 请求代理。

`registry`：包下载源地址。

`config set`：写入配置。

`config get`：读取配置。

`config delete`：删除配置。

`registry.npmjs.org`：npm 官方源。

`registry.npmmirror.com`：常用 npm 国内镜像源。
