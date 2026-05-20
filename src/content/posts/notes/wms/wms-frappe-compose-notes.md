---
title: WMS / ERPNext 单机 Compose 配置注意事项
published: 2026-05-20
updated: 2026-05-20
description: 从 wms-system 目录整理 ERPNext 单机 Docker Compose、Nginx、MariaDB、Redis、站点配置和安全注意事项。
tags: [WMS, ERPNext, Frappe, Docker Compose, MariaDB, Redis, Nginx, 项目笔记, 配置]
category: 笔记
draft: false
---

这篇从 `wms-system` 当前目录结构整理，偏环境快照和注意事项。

## 当前服务结构

Compose 中包含：

```txt
db           MariaDB 10.11
redis-cache  Redis cache
redis-queue  Redis queue / socketio
frontend     Nginx
erp-app      frappe/erpnext:v16.0.0
```

## 端口映射

Nginx：

```yaml
ports:
  - "8080:80"
```

ERPNext app：

```yaml
ports:
  - "8000:8000"
  - "9000:9000"
  - "5678:5678"
```

含义：

- `8080`：宿主机访问 Nginx
- `8000`：Frappe web 服务
- `9000`：Socket.IO
- `5678`：调试端口

## MariaDB 配置

当前 MariaDB 命令：

```yaml
command:
  - --character-set-server=utf8mb4
  - --collation-server=utf8mb4_unicode_ci
  - --skip-character-set-client-handshake
  - --innodb-file-per-table=1
```

这些配置用于：

- 使用 `utf8mb4`
- 避免字符集握手不一致
- 每张 InnoDB 表独立表空间

## Redis 配置

Frappe common site config 中需要类似：

```json
{
  "redis_cache": "redis://redis-cache:6379",
  "redis_queue": "redis://redis-queue:6379"
}
```

Compose 环境变量也要对应：

```yaml
environment:
  - REDIS_CACHE=redis-cache:6379
  - REDIS_QUEUE=redis-queue:6379
  - REDIS_SOCKETIO=redis-queue:6379
```

## apps 和 sites 挂载

当前挂载：

```yaml
volumes:
  - ./apps:/home/frappe/frappe-bench/apps
  - ./sites:/home/frappe/frappe-bench/sites
```

含义：

- `apps` 保存 Frappe / ERPNext 应用代码
- `sites` 保存站点配置、assets、日志、私有文件和备份

注意：

- `sites/site_config.json` 里可能包含数据库账号和密码
- 这类文件不适合公开提交
- 如果这是本地实验快照，要注意不要把真实生产配置放进去

## 站点配置

`sites/apps.txt` 中记录已安装应用：

```txt
frappe
erpnext
```

`sites/common_site_config.json` 中记录通用配置：

```json
{
  "db_host": "db",
  "redis_cache": "redis://redis-cache:6379",
  "redis_queue": "redis://redis-queue:6379"
}
```

单个站点的 `site_config.json` 会包含：

```json
{
  "db_name": "<db-name>",
  "db_password": "<db-password>",
  "db_type": "mariadb",
  "db_user": "<db-user>",
  "developer_mode": 1
}
```

不要把真实值直接写进公开笔记或公开仓库。

## 常用检查命令

查看服务：

```bash
docker compose ps
```

查看日志：

```bash
docker compose logs -f frontend
docker compose logs -f erp-app
docker compose logs -f db
```

进入 ERPNext 容器：

```bash
docker compose exec erp-app bash
```

进入数据库：

```bash
docker compose exec db mariadb -uroot -p
```

查看 Redis：

```bash
docker compose exec redis-cache redis-cli ping
docker compose exec redis-queue redis-cli ping
```

## Nginx 注意事项

Nginx 挂载：

```yaml
- ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
- ./sites:/home/frappe/frappe-bench/sites
```

这说明 Nginx 会直接读取宿主机 `sites` 下的静态资源。

如果页面资源 404，优先检查：

```bash
docker compose logs -f frontend
ls -la sites/assets
```

## 安全注意事项

不要公开：

- `site_config.json` 中的数据库密码
- 生产站点的私有文件
- `private/backups`
- 真实管理员密码
- 真实 token / secret

如果要把环境整理成可复用模板，建议把真实配置替换成：

```txt
<db-password>
<admin-password>
<site-name>
```

并提供 `.env.example` 或 `site_config.example.json`。

## 适合后续整理的方向

这个目录更像一个本地 ERPNext / WMS 环境快照。

后续如果继续整理，优先补：

- 当前站点创建命令
- Nginx 配置说明
- 初始化数据来源
- WMS 相关自定义 app 是否存在
- 备份恢复流程
- 哪些文件应该 gitignore
