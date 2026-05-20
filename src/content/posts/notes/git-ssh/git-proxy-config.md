---
title: Git 代理配置速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 Git HTTP/HTTPS 代理的设置、查看、取消和按域名配置方式。
tags: [Git, Proxy, 代理, GitHub, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制 Git 代理相关命令。

## 查看当前 Git 代理

```bash
git config --global --get http.proxy
git config --global --get https.proxy
git config --show-origin --get http.proxy
git config --show-origin --get https.proxy
```

查看所有代理相关配置：

```bash
git config --global --list | grep -i proxy
```

## 设置 HTTP/HTTPS 代理

HTTP 代理：

```bash
git config --global http.proxy http://127.0.0.1:10808
git config --global https.proxy http://127.0.0.1:10808
```

SOCKS5 代理：

```bash
git config --global http.proxy socks5://127.0.0.1:10808
git config --global https.proxy socks5://127.0.0.1:10808
```

如果代理软件同时提供 HTTP 和 SOCKS5 端口，Git 的 HTTP/HTTPS 拉取通常用 HTTP 代理更直接。

## 只给 GitHub 设置代理

```bash
git config --global http.https://github.com.proxy http://127.0.0.1:10808
```

取消 GitHub 单独代理：

```bash
git config --global --unset http.https://github.com.proxy
```

这种写法只影响访问 `https://github.com` 的 Git HTTP 请求。

## 取消全局代理

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

如果不确定是否存在：

```bash
git config --global --unset-all http.proxy
git config --global --unset-all https.proxy
```

## 临时使用代理执行一次 Git 命令

```bash
git -c http.proxy=http://127.0.0.1:10808 -c https.proxy=http://127.0.0.1:10808 pull
```

这个不会写入配置文件，只对这一次命令生效。

## 注意 SSH remote 不走 Git HTTP 代理

如果 remote 是 HTTPS：

```txt
https://github.com/USER/REPO.git
```

Git 的 `http.proxy` / `https.proxy` 会生效。

如果 remote 是 SSH：

```txt
git@github.com:USER/REPO.git
```

Git 的 HTTP 代理不会生效，需要配置 SSH 代理，也就是 `~/.ssh/config` 里的 `ProxyCommand`。

## 常用参数解释

`http.proxy`：Git 访问 HTTP 地址时使用的代理。

`https.proxy`：Git 访问 HTTPS 地址时使用的代理。

`http.https://github.com.proxy`：只给指定 URL 前缀设置代理。

`--get`：只读取某个配置值。

`--unset`：删除某个配置值。

`--unset-all`：删除同名配置的所有值。

`-c key=value`：只在当前这次 Git 命令里临时覆盖配置。
