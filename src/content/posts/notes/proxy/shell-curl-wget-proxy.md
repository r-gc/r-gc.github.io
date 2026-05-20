---
title: 终端代理与 curl / wget 配置速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 shell 环境变量代理、临时代理、curl 代理、wget 代理和 no_proxy 的常用写法。
tags: [Proxy, 代理, Shell, curl, wget, no_proxy, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制终端代理相关命令。

## 临时设置终端代理

HTTP 代理：

```bash
export http_proxy=http://127.0.0.1:10808
export https_proxy=http://127.0.0.1:10808
export HTTP_PROXY=http://127.0.0.1:10808
export HTTPS_PROXY=http://127.0.0.1:10808
```

SOCKS5 代理：

```bash
export all_proxy=socks5://127.0.0.1:10808
export ALL_PROXY=socks5://127.0.0.1:10808
```

常见组合：

```bash
export http_proxy=http://127.0.0.1:10808
export https_proxy=http://127.0.0.1:10808
export all_proxy=socks5://127.0.0.1:10808
```

这些只对当前终端会话生效。新开终端后需要重新设置。

## 取消终端代理

```bash
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY
unset all_proxy
unset ALL_PROXY
```

## 查看当前代理环境变量

```bash
env | grep -i proxy
```

或者：

```bash
echo "$http_proxy"
echo "$https_proxy"
echo "$all_proxy"
```

## 设置不走代理的地址

```bash
export no_proxy=localhost,127.0.0.1,::1
export NO_PROXY=localhost,127.0.0.1,::1
```

如果要让局域网地址也不走代理：

```bash
export no_proxy=localhost,127.0.0.1,::1,192.168.0.0/16,10.0.0.0/8
```

## 单次命令使用代理

```bash
http_proxy=http://127.0.0.1:10808 https_proxy=http://127.0.0.1:10808 curl https://github.com
```

不污染当前终端，适合临时测试。

## curl 使用代理

HTTP 代理：

```bash
curl -x http://127.0.0.1:10808 https://github.com
```

SOCKS5 代理：

```bash
curl -x socks5://127.0.0.1:10808 https://github.com
```

让 DNS 也通过 SOCKS5 代理解析：

```bash
curl -x socks5h://127.0.0.1:10808 https://github.com
```

查看连接细节：

```bash
curl -v -x http://127.0.0.1:10808 https://github.com
```

只看响应头：

```bash
curl -I -x http://127.0.0.1:10808 https://github.com
```

## wget 使用代理

单次命令：

```bash
wget -e use_proxy=yes -e http_proxy=http://127.0.0.1:10808 -e https_proxy=http://127.0.0.1:10808 https://github.com
```

写入用户配置：

```bash
nano ~/.wgetrc
```

```txt
use_proxy = on
http_proxy = http://127.0.0.1:10808
https_proxy = http://127.0.0.1:10808
```

## 常用参数解释

`http_proxy`：HTTP 请求使用的代理。

`https_proxy`：HTTPS 请求使用的代理。

`all_proxy`：所有协议的通用代理，常用于 SOCKS5。

`no_proxy`：不走代理的主机或地址。

`curl -x`：给当前 curl 请求指定代理。

`socks5://`：使用 SOCKS5 代理，但 DNS 可能仍在本地解析。

`socks5h://`：使用 SOCKS5 代理，并让代理端解析 DNS。

`curl -v`：输出详细连接过程。

`curl -I`：只请求响应头。

`wget -e`：临时设置 wget 配置项。
