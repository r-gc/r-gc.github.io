---
title: 端口占用与进程排错速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 Linux 和 Windows 上查看端口占用、定位进程、杀进程和理解监听地址的常用命令。
tags: [Linux, Windows, Port, Process, 网络, 排错, 速查]
category: 笔记
draft: false
---

这篇用来复制端口和进程排错命令。

## Linux 查看端口监听

```bash
sudo ss -lntp
```

查看指定端口：

```bash
sudo ss -lntp | grep :3000
```

UDP：

```bash
sudo ss -lnup
```

## Linux 查看端口占用进程

```bash
sudo lsof -i :3000
```

或者：

```bash
sudo fuser -v 3000/tcp
```

## Linux 杀掉占用端口的进程

先查 PID：

```bash
sudo lsof -i :3000
```

正常结束：

```bash
kill PID
```

强制结束：

```bash
kill -9 PID
```

一行命令：

```bash
sudo kill -9 $(sudo lsof -t -i :3000)
```

## Linux 查看进程

```bash
ps aux | grep node
```

更简洁：

```bash
pgrep -af node
```

查看进程树：

```bash
pstree -ap
```

## Windows 查看端口占用

PowerShell 或 CMD：

```powershell
netstat -ano | findstr :3000
```

查看 PID 对应进程：

```powershell
tasklist | findstr PID
```

杀进程：

```powershell
taskkill /PID PID /F
```

PowerShell 写法：

```powershell
Get-Process -Id PID
Stop-Process -Id PID -Force
```

## 监听地址区别

只允许本机访问：

```txt
127.0.0.1:3000
```

监听所有网卡：

```txt
0.0.0.0:3000
```

如果服务在 WSL / Docker / 虚拟机里，想让外部访问，通常需要监听 `0.0.0.0`，并确认端口映射或防火墙规则。

## 测试端口是否可连

```bash
nc -vz 127.0.0.1 3000
```

测试 HTTP 服务：

```bash
curl -I http://127.0.0.1:3000
```

查看详细连接过程：

```bash
curl -v http://127.0.0.1:3000
```

## 常用参数解释

`ss -lntp`：查看 TCP 监听端口和进程。

`lsof -i :3000`：查看使用 3000 端口的进程。

`lsof -t`：只输出 PID。

`fuser -v 3000/tcp`：查看使用指定 TCP 端口的进程。

`kill`：发送终止信号。

`kill -9`：强制终止。

`netstat -ano`：Windows 查看连接、监听端口和 PID。

`taskkill /F`：Windows 强制结束进程。

`nc -vz`：测试 TCP 端口连通性。
