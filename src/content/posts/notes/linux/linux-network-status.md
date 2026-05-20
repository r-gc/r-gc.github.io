---
title: Linux 网络状态检查速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 Linux 上查看 IP、端口、连接、DNS、路由和网络连通性的常用命令。
tags: [Linux, Network, DNS, Port, ss, curl, 状态检查, 速查]
category: 笔记
draft: false
---

这篇用来复制网络状态检查命令。

## 查看 IP 地址

```bash
ip addr
```

简写：

```bash
ip a
```

只看 IPv4：

```bash
ip -4 addr
```

## 查看默认路由

```bash
ip route
```

查看默认网关：

```bash
ip route | grep default
```

## 查看监听端口

```bash
ss -lntp
```

查看 TCP 监听端口和进程。

```bash
ss -lnup
```

查看 UDP 监听端口和进程。

查看某个端口：

```bash
sudo ss -lntp | grep :8080
```

## 查看连接状态

```bash
ss -ant
```

查看所有 TCP 连接。

```bash
ss -ant | grep ESTAB
```

查看已建立连接。

```bash
ss -ant | grep TIME-WAIT | wc -l
```

统计 `TIME-WAIT` 数量。

## 查看端口占用

```bash
sudo lsof -i :8080
```

或者：

```bash
sudo fuser -v 8080/tcp
```

## 测试连通性

```bash
ping github.com
```

指定次数：

```bash
ping -c 4 github.com
```

测试 TCP 端口：

```bash
nc -vz github.com 443
```

测试 HTTP：

```bash
curl -I https://github.com
```

显示详细连接过程：

```bash
curl -v https://github.com
```

## DNS 检查

```bash
nslookup github.com
```

如果有 `dig`：

```bash
dig github.com
```

只看 A 记录：

```bash
dig github.com A +short
```

指定 DNS 服务器：

```bash
dig @1.1.1.1 github.com
dig @8.8.8.8 github.com
```

## 查看 DNS 配置

```bash
cat /etc/resolv.conf
```

如果使用 systemd-resolved：

```bash
resolvectl status
```

## 路由追踪

```bash
traceroute github.com
```

如果没有 `traceroute`，可以用：

```bash
tracepath github.com
```

## 查看公网 IP

```bash
curl ifconfig.me
```

或者：

```bash
curl https://api.ipify.org
```

## 常用参数解释

`ss`：查看 socket 状态，现代 Linux 上常用来替代 `netstat`。

`-l`：只显示监听中的端口。

`-n`：不解析域名和服务名，显示数字端口。

`-t`：TCP。

`-u`：UDP。

`-p`：显示进程信息，通常需要 `sudo`。

`nc -vz`：测试 TCP 端口是否可连接。

`curl -I`：只请求响应头。

`curl -v`：输出详细连接过程。

`dig +short`：只输出简短解析结果。
