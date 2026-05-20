---
title: Docker Compose 常用命令速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 Docker Compose 启动、停止、日志、进入容器、构建、拉取和指定服务的常用命令。
tags: [Docker, Docker Compose, Container, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制 Docker Compose 常用命令。

## 查看服务状态

```bash
docker compose ps
```

查看所有容器，包括已退出：

```bash
docker compose ps -a
```

## 启动服务

前台启动：

```bash
docker compose up
```

后台启动：

```bash
docker compose up -d
```

只启动某个服务：

```bash
docker compose up -d SERVICE
```

启动前重新构建：

```bash
docker compose up -d --build
```

## 停止服务

停止并删除容器和默认网络：

```bash
docker compose down
```

只停止，不删除容器：

```bash
docker compose stop
```

重新启动：

```bash
docker compose restart
```

只重启某个服务：

```bash
docker compose restart SERVICE
```

## 不删除 volume 的停止方式

```bash
docker compose down
```

默认不会删除 named volumes。

如果加了这个参数才会删除 volume：

```bash
docker compose down -v
```

所以不想删数据时，不要加 `-v`。

## 查看日志

查看全部日志：

```bash
docker compose logs
```

实时跟随：

```bash
docker compose logs -f
```

查看某个服务：

```bash
docker compose logs -f SERVICE
```

只看最后 100 行：

```bash
docker compose logs --tail 100 SERVICE
```

带时间戳：

```bash
docker compose logs -f --timestamps SERVICE
```

## 进入容器

```bash
docker compose exec SERVICE bash
```

如果没有 bash：

```bash
docker compose exec SERVICE sh
```

以 root 进入：

```bash
docker compose exec -u root SERVICE bash
```

## 临时运行一个服务命令

```bash
docker compose run --rm SERVICE bash
```

执行一次命令：

```bash
docker compose run --rm SERVICE npm install
```

## 构建镜像

```bash
docker compose build
```

不使用缓存：

```bash
docker compose build --no-cache
```

只构建某个服务：

```bash
docker compose build SERVICE
```

## 拉取镜像

```bash
docker compose pull
```

只拉某个服务：

```bash
docker compose pull SERVICE
```

## 指定 compose 文件

```bash
docker compose -f docker-compose.yml -f docker-compose.override.yml up -d
```

指定项目名：

```bash
docker compose -p PROJECT_NAME up -d
```

## profiles

启动指定 profile：

```bash
docker compose --profile dev up -d
```

多个 profile：

```bash
docker compose --profile dev --profile debug up -d
```

## 查看最终配置

```bash
docker compose config
```

这个命令会展开变量、合并多个 compose 文件，排查配置时很好用。

## 常用参数解释

`up`：创建并启动服务。

`-d`：后台运行。

`down`：停止并删除容器和网络。

`stop`：只停止容器，不删除。

`restart`：重启服务。

`logs -f`：实时跟随日志。

`exec`：进入正在运行的服务容器执行命令。

`run --rm`：临时创建容器执行命令，结束后删除。

`build --no-cache`：不使用构建缓存。

`-f`：指定 compose 文件。

`-p`：指定项目名，影响容器、网络、volume 前缀。

`--profile`：启用带 profile 的服务。
