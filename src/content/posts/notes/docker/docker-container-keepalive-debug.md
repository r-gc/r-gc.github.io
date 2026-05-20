---
title: Docker 容器不退出与调试命令速查
published: 2026-05-20
updated: 2026-05-20
description: 记录让 Docker 容器保持运行、进入容器、临时调试、查看退出原因和常用 run 参数。
tags: [Docker, Container, Debug, Shell, 保活, 速查]
category: 笔记
draft: false
---

这篇用来复制 Docker 容器保活和调试命令。

## 让容器不退出

最常用：

```bash
docker run -d --name debug-container IMAGE tail -f /dev/null
```

或者：

```bash
docker run -d --name debug-container IMAGE sleep infinity
```

如果镜像里没有 `sleep infinity`，用：

```bash
docker run -d --name debug-container IMAGE sh -c "while true; do sleep 3600; done"
```

## 交互式进入容器

进入正在运行的容器：

```bash
docker exec -it CONTAINER bash
```

如果没有 bash：

```bash
docker exec -it CONTAINER sh
```

以 root 用户进入：

```bash
docker exec -it -u root CONTAINER bash
```

## 直接启动并进入临时容器

```bash
docker run --rm -it IMAGE bash
```

如果没有 bash：

```bash
docker run --rm -it IMAGE sh
```

挂载当前目录：

```bash
docker run --rm -it -v "$PWD":/work -w /work IMAGE bash
```

## 容器退出后查看原因

查看所有容器：

```bash
docker ps -a
```

查看日志：

```bash
docker logs CONTAINER
```

查看退出码：

```bash
docker inspect -f '{{.State.ExitCode}}' CONTAINER
```

查看错误信息：

```bash
docker inspect -f '{{.State.Error}}' CONTAINER
```

查看状态：

```bash
docker inspect -f '{{.State.Status}}' CONTAINER
```

## 重新启动已退出容器

```bash
docker start CONTAINER
```

启动并附加到终端：

```bash
docker start -ai CONTAINER
```

## 停止和删除容器

停止：

```bash
docker stop CONTAINER
```

删除：

```bash
docker rm CONTAINER
```

强制删除运行中的容器：

```bash
docker rm -f CONTAINER
```

## 常用 docker run 模板

后台运行并指定名称：

```bash
docker run -d --name app IMAGE
```

映射端口：

```bash
docker run -d --name app -p 8080:80 IMAGE
```

设置环境变量：

```bash
docker run -d --name app -e NODE_ENV=production IMAGE
```

挂载目录：

```bash
docker run -d --name app -v "$PWD":/app IMAGE
```

指定工作目录：

```bash
docker run -d --name app -w /app IMAGE
```

指定网络：

```bash
docker run -d --name app --network my-network IMAGE
```

容器退出自动删除：

```bash
docker run --rm IMAGE
```

## Docker Compose 调试

进入服务容器：

```bash
docker compose exec SERVICE bash
```

如果没有 bash：

```bash
docker compose exec SERVICE sh
```

临时启动服务并进入：

```bash
docker compose run --rm SERVICE bash
```

只启动某个服务：

```bash
docker compose up -d SERVICE
```

重启某个服务：

```bash
docker compose restart SERVICE
```

## 常用参数解释

`-d`：后台运行容器。

`--name`：指定容器名称。

`-it`：交互式终端，常用于进入 shell。

`--rm`：容器退出后自动删除。

`-v`：挂载目录或 volume。

`-w`：指定容器内工作目录。

`-p 8080:80`：把宿主机 8080 映射到容器 80。

`-e KEY=value`：设置环境变量。

`--network`：指定容器加入的 Docker 网络。

`tail -f /dev/null`：持续等待，不主动退出，常用于调试保活。

`sleep infinity`：无限睡眠，让容器保持运行。

`exec`：在运行中的容器里执行命令。

`start -ai`：启动已存在容器并附加输入输出。
