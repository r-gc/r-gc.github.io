---
title: SSH 代理与多 GitHub 账号配置速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 SSH config、ProxyCommand、GitHub 443 端口、多账号 Host 别名和常用参数。
tags: [SSH, GitHub, Proxy, 多账号, 代理, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制 SSH 代理和多账号配置。

## 基础 GitHub SSH 配置

编辑：

```bash
nano ~/.ssh/config
```

普通 GitHub SSH：

```ssh-config
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
```

## GitHub SSH 走 443 端口

有些网络环境下，22 端口不稳定，可以改用 GitHub 提供的 SSH over HTTPS 端口：

```ssh-config
Host github.com
  HostName ssh.github.com
  User git
  Port 443
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
```

测试：

```bash
ssh -T git@github.com
```

## SSH 通过 SOCKS5 代理

```ssh-config
Host github.com
  HostName ssh.github.com
  User git
  Port 443
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
  ProxyCommand nc -X 5 -x 127.0.0.1:10808 %h %p
```

这里适合本地代理监听在 `127.0.0.1:10808` 的情况。

## 多 GitHub 账号 Host 别名

默认账号：

```ssh-config
Host github.com
  HostName ssh.github.com
  User git
  Port 443
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
  ProxyCommand nc -X 5 -x 127.0.0.1:10808 %h %p
```

博客账号：

```ssh-config
Host github-r-gc
  HostName ssh.github.com
  User git
  Port 443
  IdentityFile ~/.ssh/id_ed25519_r_gc
  IdentitiesOnly yes
  ProxyCommand nc -X 5 -x 127.0.0.1:10808 %h %p
```

使用别名测试：

```bash
ssh -T git@github-r-gc
```

仓库 remote 使用别名：

```bash
git remote set-url origin git@github-r-gc:r-gc/r-gc.github.io.git
```

这样默认 `github.com` 可以继续给主力账号使用，`github-r-gc` 专门给博客账号使用。

## 查看 SSH 实际使用的配置

```bash
ssh -G github.com | less
ssh -G github-r-gc | less
```

调试连接过程：

```bash
ssh -vT git@github.com
ssh -vT git@github-r-gc
```

如果信息不够，再增加 `v`：

```bash
ssh -vvvT git@github.com
```

## 常用参数解释

`Host`：本地别名。Git remote 里写的主机名会匹配它。

`HostName`：真实连接的服务器地址。

`User git`：GitHub SSH 固定使用 `git` 用户。

`Port 443`：使用 443 端口连接 GitHub SSH，适合 22 端口不通或不稳定时。

`IdentityFile`：指定私钥路径。

`IdentitiesOnly yes`：只使用 `IdentityFile` 指定的 key，避免 SSH 尝试一堆其它 key。

`ProxyCommand`：连接目标服务器前，先通过这个命令建立网络通道。

`nc`：netcat，用来建立代理连接。

`-X 5`：告诉 `nc` 使用 SOCKS5 代理。

`-x 127.0.0.1:10808`：指定代理地址和端口。

`%h`：SSH 会替换成目标主机，也就是 `HostName`。

`%p`：SSH 会替换成目标端口，也就是 `Port`。
