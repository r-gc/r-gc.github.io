---
title: Linux CPU / 内存 / 磁盘状态检查速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 Linux 上查看 CPU、内存、磁盘、进程和系统负载的常用命令。
tags: [Linux, CPU, Memory, Disk, Process, 状态检查, 速查]
category: 笔记
draft: false
---

这篇用来复制 Linux 系统状态检查命令。

## 系统整体状态

```bash
uptime
```

查看系统运行时间、登录用户数和负载。

```bash
top
```

交互式查看 CPU、内存和进程。

```bash
htop
```

更好用的 `top`，如果没有需要先安装。

## CPU 信息

```bash
lscpu
```

查看 CPU 型号、核心数、线程数、架构等信息。

```bash
nproc
```

查看可用 CPU 核心数。

```bash
cat /proc/cpuinfo | grep "model name" | head
```

查看 CPU 型号。

## CPU 使用率

```bash
top
```

进入后常用按键：

```txt
P：按 CPU 使用率排序
M：按内存使用率排序
q：退出
```

如果安装了 `sysstat`：

```bash
mpstat 1
```

每 1 秒刷新一次 CPU 使用情况。

## 内存状态

```bash
free -h
```

人类可读格式查看内存。

```bash
free -m
```

以 MB 为单位查看内存。

```bash
cat /proc/meminfo | head
```

查看更详细的内存信息。

## 磁盘空间

```bash
df -h
```

查看各挂载点磁盘使用情况。

```bash
df -Th
```

同时显示文件系统类型。

```bash
du -sh .
```

查看当前目录总大小。

```bash
du -h --max-depth=1
```

查看当前目录下一层文件和目录大小。

```bash
du -h --max-depth=1 | sort -h
```

按大小排序。

## 磁盘 IO

如果安装了 `sysstat`：

```bash
iostat -xz 1
```

每 1 秒刷新磁盘 IO 状态。

如果安装了 `iotop`：

```bash
sudo iotop
```

查看哪个进程正在读写磁盘。

## 进程查看

```bash
ps aux
```

查看所有进程。

```bash
ps aux | grep nginx
```

按关键词查进程。

```bash
pgrep -af nginx
```

更简洁地按进程名查找。

## 杀进程

```bash
kill PID
```

正常结束进程。

```bash
kill -9 PID
```

强制结束进程。优先用普通 `kill`，不行再用 `-9`。

## 查看端口占用进程

```bash
sudo lsof -i :8080
```

或者：

```bash
sudo ss -lntp | grep :8080
```

## 常用参数解释

`-h`：human readable，人类可读格式，例如 GB / MB。

`-T`：显示文件系统类型。

`--max-depth=1`：只统计当前目录下一层。

`sort -h`：按人类可读大小排序。

`ps aux`：显示所有用户的所有进程。

`grep`：按文本过滤。

`kill -9`：发送 SIGKILL，强制结束进程。
