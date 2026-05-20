---
title: WSL 网络与代理配置速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 WSL 查看版本、重启、访问 Windows 代理、Windows 访问 WSL 服务和常见网络排查命令。
tags: [WSL, Windows, Linux, Proxy, 网络, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制 WSL 网络和代理相关命令。

## 查看 WSL 版本

在 Windows PowerShell 执行：

```powershell
wsl --list --verbose
```

简写：

```powershell
wsl -l -v
```

## 关闭并重启 WSL

在 Windows PowerShell 执行：

```powershell
wsl --shutdown
```

然后重新打开 WSL 终端。

## 查看 WSL 内 IP

在 WSL 执行：

```bash
hostname -I
```

或者：

```bash
ip addr
```

## WSL 获取 Windows 主机 IP

常用方式：

```bash
cat /etc/resolv.conf | grep nameserver
```

提取 IP：

```bash
export WINDOWS_HOST=$(cat /etc/resolv.conf | awk '/nameserver/ {print $2; exit}')
echo "$WINDOWS_HOST"
```

## WSL 使用 Windows 代理

如果 Windows 代理监听在 `127.0.0.1:10808`，WSL 里不一定能直接访问这个地址。更稳的方式是使用 Windows 主机 IP：

```bash
export WINDOWS_HOST=$(cat /etc/resolv.conf | awk '/nameserver/ {print $2; exit}')
export http_proxy=http://$WINDOWS_HOST:10808
export https_proxy=http://$WINDOWS_HOST:10808
export all_proxy=socks5://$WINDOWS_HOST:10808
```

测试：

```bash
curl -I https://github.com
```

取消：

```bash
unset http_proxy
unset https_proxy
unset all_proxy
```

## Windows 访问 WSL 服务

在 WSL 启动服务时，尽量监听：

```txt
0.0.0.0
```

而不是只监听：

```txt
127.0.0.1
```

查看 WSL 服务监听：

```bash
ss -lntp
```

如果服务监听 `0.0.0.0:3000`，Windows 通常可以访问：

```txt
http://localhost:3000
```

## 查看 Windows 到 WSL 的端口

在 Windows PowerShell 中：

```powershell
netstat -ano | findstr :3000
```

## DNS 异常检查

```bash
cat /etc/resolv.conf
nslookup github.com
```

如果 DNS 临时异常，可以先重启 WSL：

```powershell
wsl --shutdown
```

## .wslconfig 位置

Windows 用户目录：

```txt
C:\Users\<你的用户名>\.wslconfig
```

常见示例：

```ini
[wsl2]
memory=8GB
processors=4
swap=8GB
localhostForwarding=true
```

修改后需要：

```powershell
wsl --shutdown
```

## 常用参数解释

`wsl -l -v`：查看发行版、运行状态和 WSL 版本。

`wsl --shutdown`：关闭所有 WSL 实例。

`hostname -I`：输出当前 Linux 环境的 IP。

`/etc/resolv.conf`：DNS 配置文件，WSL 中常能看到 Windows 主机相关地址。

`0.0.0.0`：监听所有网卡，方便从 Windows 或局域网访问。

`127.0.0.1`：只监听本机回环地址。

`localhostForwarding`：WSL2 的 localhost 转发配置。
