---
title: pip / apt / Docker 代理配置速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 Python pip、Ubuntu apt 和 Docker 的代理配置、查看与取消方式。
tags: [Python, pip, apt, Docker, Proxy, 代理, Linux, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制 pip、apt 和 Docker 代理配置。

## pip 临时使用代理

```bash
pip install requests --proxy http://127.0.0.1:10808
```

指定源：

```bash
pip install requests -i https://pypi.org/simple
```

指定国内镜像：

```bash
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

## pip 写入用户配置

```bash
pip config set global.proxy http://127.0.0.1:10808
pip config set global.index-url https://pypi.org/simple
```

查看配置：

```bash
pip config list
pip config debug
```

取消配置：

```bash
pip config unset global.proxy
pip config unset global.index-url
```

常见用户配置文件位置：

```txt
~/.config/pip/pip.conf
```

## apt 临时使用代理

```bash
sudo apt -o Acquire::http::Proxy="http://127.0.0.1:10808" update
```

同时设置 HTTP 和 HTTPS：

```bash
sudo apt \
  -o Acquire::http::Proxy="http://127.0.0.1:10808" \
  -o Acquire::https::Proxy="http://127.0.0.1:10808" \
  update
```

## apt 写入代理配置

创建配置文件：

```bash
sudo nano /etc/apt/apt.conf.d/95proxies
```

写入：

```txt
Acquire::http::Proxy "http://127.0.0.1:10808";
Acquire::https::Proxy "http://127.0.0.1:10808";
```

取消：

```bash
sudo rm /etc/apt/apt.conf.d/95proxies
```

如果代理在 Windows 主机上，WSL 里 `127.0.0.1` 是否可用取决于网络模式和代理软件监听地址；不通时可以改用 Windows 主机 IP。

## Docker CLI 代理

创建 Docker 客户端配置目录：

```bash
mkdir -p ~/.docker
```

编辑：

```bash
nano ~/.docker/config.json
```

写入：

```json
{
  "proxies": {
    "default": {
      "httpProxy": "http://127.0.0.1:10808",
      "httpsProxy": "http://127.0.0.1:10808",
      "noProxy": "localhost,127.0.0.1,::1"
    }
  }
}
```

这个配置主要影响 Docker 客户端给容器传递的代理环境。

## Docker daemon 代理

创建 systemd drop-in 目录：

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d
```

编辑：

```bash
sudo nano /etc/systemd/system/docker.service.d/http-proxy.conf
```

写入：

```ini
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:10808"
Environment="HTTPS_PROXY=http://127.0.0.1:10808"
Environment="NO_PROXY=localhost,127.0.0.1,::1"
```

重载并重启 Docker：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

查看 Docker 服务环境变量：

```bash
sudo systemctl show --property=Environment docker
```

取消 Docker daemon 代理：

```bash
sudo rm /etc/systemd/system/docker.service.d/http-proxy.conf
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 常用参数解释

`pip --proxy`：只给当前 pip 命令指定代理。

`pip config set global.proxy`：写入 pip 用户配置。

`pip config debug`：显示 pip 会读取哪些配置文件。

`apt -o`：只给当前 apt 命令临时覆盖配置。

`Acquire::http::Proxy`：apt 的 HTTP 代理配置。

`Acquire::https::Proxy`：apt 的 HTTPS 代理配置。

`~/.docker/config.json`：Docker CLI 用户配置。

`docker.service.d`：systemd 用来覆盖 Docker 服务配置的目录。

`systemctl daemon-reload`：重新加载 systemd 配置。

`systemctl restart docker`：重启 Docker 服务，让代理配置生效。
