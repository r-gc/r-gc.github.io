---
title: Frappe Docker 本地开发命令速查
published: 2026-05-20
updated: 2026-05-20
description: 从 frappe_docker 项目文档整理本地开发、建站、migrate、进入容器和日志查看命令。
tags: [Frappe, ERPNext, Docker, Docker Compose, bench, 项目笔记, 速查]
category: 笔记
draft: false
---

这篇从 `frappe_docker` 项目文档整理，主要用于本地开发时复制命令。

## 开发模式启动

使用 noproxy，直接暴露端口：

```bash
docker compose \
  -f compose.yaml \
  -f overrides/compose.redis.yaml \
  -f overrides/compose.mariadb.yaml \
  -f overrides/compose.noproxy.yaml \
  up -d
```

如果项目里有封装脚本：

```bash
./start-dev.sh
```

## 生产模式启动

Traefik + HTTPS：

```bash
docker compose \
  -f compose.yaml \
  -f overrides/compose.redis.yaml \
  -f overrides/compose.mariadb.yaml \
  -f overrides/compose.traefik.yaml \
  -f overrides/compose.https.yaml \
  up -d
```

如果项目里有封装脚本：

```bash
./start-prod.sh
```

## 停止服务

```bash
docker compose down
```

或者：

```bash
./stop.sh
```

## 进入 backend 容器

```bash
docker compose exec backend bash
```

## 创建新站点

在容器内执行：

```bash
bench new-site \
  --mariadb-user-host-login-scope=% \
  --db-root-password <db-root-password> \
  --admin-password <admin-password> \
  sitename.localhost
```

注意把密码和站点名换成自己的值。

## migrate

```bash
docker compose exec backend bench --site sitename.localhost migrate
```

## 进入 bench console

```bash
docker compose exec backend bench --site sitename.localhost console
```

## 查看日志

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f websocket
docker compose logs -f queue-short
docker compose logs -f queue-long
docker compose logs -f scheduler
```

## 重启单个服务

```bash
docker compose restart backend
docker compose restart frontend
docker compose restart websocket
```

## myapp 开发注意事项

`apps/myapp` 在开发环境中通常会 bind mount 到容器：

```txt
/home/frappe/frappe-bench/apps/myapp
```

开发态修改代码后通常可以直接反映到容器中；如果涉及前端资源或静态文件，可能还需要：

```bash
docker compose exec backend bench build
```

## 代码检查

进入 app 目录：

```bash
cd apps/myapp
```

运行 ruff：

```bash
ruff check .
ruff format .
```

运行 pre-commit：

```bash
pre-commit run --all-files
```

## 常用环境变量

`.env` 中常见配置：

```txt
ERPNEXT_VERSION=v16.x.x
DB_PASSWORD=<db-root-password>
FRAPPE_SITE_NAME_HEADER=sitename.localhost
HTTP_PUBLISH_PORT=8080
HTTPS_PUBLISH_PORT=443
```

`FRAPPE_SITE_NAME_HEADER` 很适合单站点调试，用来覆盖 Host 头解析。

## 常用服务说明

`configurator`：初始化服务，配置数据库和 Redis，执行完会退出。

`backend`：Python / Werkzeug 后端服务。

`frontend`：Nginx 反向代理和静态资源服务。

`websocket`：Node.js Socket.IO 实时通信服务。

`queue-short`：短任务队列 worker。

`queue-long`：长任务队列 worker。

`scheduler`：定时任务调度器。

## 注意事项

本地开发用 bind mount 很方便，但 staging / production 更建议把自定义 app 烘焙进镜像。

如果 staging 继续挂载 `./apps/myapp`，而服务器上没有源码目录，可能会把镜像里已经存在的 `myapp` 覆盖掉，导致：

```txt
ModuleNotFoundError: No module named 'myapp'
```
