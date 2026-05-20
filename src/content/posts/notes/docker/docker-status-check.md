---
title: Docker 状态检查速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 Docker 服务、容器、镜像、日志、资源占用和网络状态的常用检查命令。
tags: [Docker, Container, Logs, Network, 状态检查, 速查]
category: 笔记
draft: false
---

这篇用来复制 Docker 状态检查命令。

## Docker 服务状态

```bash
docker version
```

查看客户端和服务端版本。

```bash
docker info
```

查看 Docker daemon 信息。

```bash
sudo systemctl status docker
```

查看 Docker 服务状态。

启动 Docker：

```bash
sudo systemctl start docker
```

重启 Docker：

```bash
sudo systemctl restart docker
```

设置开机启动：

```bash
sudo systemctl enable docker
```

## 查看容器

运行中的容器：

```bash
docker ps
```

所有容器：

```bash
docker ps -a
```

只显示容器 ID：

```bash
docker ps -q
```

格式化输出：

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## 查看容器详情

```bash
docker inspect CONTAINER
```

查看容器 IP：

```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' CONTAINER
```

查看容器启动命令：

```bash
docker inspect -f '{{.Path}} {{range .Args}}{{.}} {{end}}' CONTAINER
```

## 查看日志

```bash
docker logs CONTAINER
```

查看最后 100 行：

```bash
docker logs --tail 100 CONTAINER
```

实时跟随：

```bash
docker logs -f CONTAINER
```

带时间：

```bash
docker logs -f --timestamps CONTAINER
```

## 查看资源占用

```bash
docker stats
```

只看某个容器：

```bash
docker stats CONTAINER
```

只输出一次：

```bash
docker stats --no-stream
```

## 查看镜像

```bash
docker images
```

查看镜像磁盘占用：

```bash
docker system df
```

查看更详细占用：

```bash
docker system df -v
```

## 查看网络

```bash
docker network ls
```

查看网络详情：

```bash
docker network inspect NETWORK
```

查看某个容器连接的网络：

```bash
docker inspect -f '{{json .NetworkSettings.Networks}}' CONTAINER
```

## 查看卷

```bash
docker volume ls
```

查看卷详情：

```bash
docker volume inspect VOLUME
```

## Docker Compose 状态

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs
docker compose logs -f
docker compose logs --tail 100 SERVICE
```

查看配置展开结果：

```bash
docker compose config
```

## 常用参数解释

`docker ps`：查看运行中的容器。

`-a`：包含已停止容器。

`-q`：只输出 ID。

`--format`：自定义输出格式。

`inspect`：查看对象完整 JSON 信息。

`-f`：format，按模板提取字段。

`logs -f`：持续跟随日志输出。

`--tail 100`：只显示最后 100 行。

`stats`：查看容器 CPU、内存、网络 IO、磁盘 IO。

`--no-stream`：只输出一次，不持续刷新。
