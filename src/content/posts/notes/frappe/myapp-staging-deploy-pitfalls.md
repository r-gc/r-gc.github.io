---
title: myapp Staging 部署问题与解决速查
published: 2026-05-20
updated: 2026-05-20
description: 从 staging 部署文档整理首次部署、CORS、Host 路由、GHCR、migrate、备份恢复和常见问题。
tags: [Frappe, ERPNext, Docker, GHCR, Staging, CORS, 部署, 排错, 项目笔记]
category: 笔记
draft: false
---

这篇从 `frappe_docker/STAGING_DEPLOYMENT.zh-CN.md` 整理，所有真实服务器信息都用占位符替换。

## 推荐发布流程

分支模型：

```txt
feature/* -> develop -> main -> build/deploy/release
```

建议：

- `main` 只放稳定、可部署版本
- `develop` 做日常集成测试
- `feature/*` / `fix/*` 做单个功能或修复
- staging 镜像优先基于 `main`、tag 或明确 commit
- 只有临时调试才建议直接用 `develop`

## 当前 staging 方案

流程：

```txt
Lint
-> Build myapp staging image
-> Push to GHCR
-> Deploy staging stack by SSH
-> 首次建站 init-site.sh
-> 后续升级自动 bench migrate
```

核心原则：

- 服务器只保留部署骨架
- 不再在服务器挂载 `apps/myapp` 源码目录
- `myapp` 烘焙进镜像
- 首次部署允许“容器起来但站点未初始化”

## GitHub Actions Secrets

常见 secrets：

```txt
STAGING_SSH_HOST
STAGING_SSH_PORT
STAGING_SSH_USER
STAGING_SSH_PRIVATE_KEY
GHCR_USERNAME
GHCR_TOKEN
STAGING_SITE_ADMIN_PASSWORD
```

注意：

- `STAGING_SSH_PRIVATE_KEY` 必须是完整私钥
- 不能填 `.pub`
- 不能只填一行公钥
- 建议使用无 passphrase 的 CI 专用 key
- `GHCR_TOKEN` 至少需要读取 packages 的权限

生成 CI key：

```bash
ssh-keygen -t ed25519 -N "" -C "github-actions-staging" -f ~/.ssh/github_actions_staging_ci
```

本地验证：

```bash
ssh -i ~/.ssh/github_actions_staging_ci -p <port> <user>@<host>
```

## 首次部署顺序

推荐顺序：

```txt
1. Lint
2. Build myapp staging image
3. Deploy staging stack
4. init-site.sh 创建站点
5. check-staging.sh 检查
```

原因：

- `bench new-site` 依赖 backend / db / redis 容器
- 所以必须先把基础栈启动起来

首次部署后出现这些情况是正常的：

- 镜像正常拉取
- 容器栈成功启动
- 首页返回 `404`
- `/api/method/ping` 返回 `404`
- deploy 脚本跳过 `migrate`

这通常表示基础栈已启动，但站点还没创建。

## 首次建站

```bash
cd /srv/frappe_docker
SITE_NAME=staging.example.com \
ADMIN_PASSWORD='<admin-password>' \
./deploy/staging/init-site.sh
```

底层动作：

```bash
bench new-site <site>
bench --site <site> install-app erpnext
bench --site <site> install-app myapp
bench --site <site> migrate
```

建站完成后，后续 deploy 就可以自动 migrate。

## CORS 修改与验证

如果浏览器端要直接访问 staging 后端，需要把完整 origin 加入 Frappe 的 `allow_cors`。

实际读取文件通常是容器内：

```txt
/home/frappe/frappe-bench/sites/common_site_config.json
```

修改后至少重启：

```bash
docker compose -p staging restart backend frontend websocket
```

验证预检请求：

```bash
curl -sS -X OPTIONS -D - -o /dev/null \
  -H "Origin: https://frontend.example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  https://erpnext.example.com/api/method/login
```

生效时应看到：

```txt
Access-Control-Allow-Origin: https://frontend.example.com
Access-Control-Allow-Credentials: true
```

注意：CORS 放开只代表浏览器能发请求，不代表跨站 Cookie / Session 一定稳定。长期使用更推荐同主域名方案。

## 直接访问 IP 返回 404

现象：

```bash
curl -I http://127.0.0.1:28080
```

返回 `404`，但：

```bash
curl -I -H 'Host: staging.example.com' http://127.0.0.1:28080
```

返回 `200`。

原因：

- Frappe / Nginx 按 `Host` 头路由站点
- 直接访问 IP 时 Host 不是站点名
- 所以没有命中对应 site

解决：

```txt
FRAPPE_SITE_NAME_HEADER=staging.example.com
```

然后重启 staging。

## 常见问题：SSH 失败

现象：

```txt
missing server host
unable to authenticate
```

常见原因：

- `STAGING_SSH_*` secrets 不完整
- 私钥内容错误
- 端口或用户名带空格/换行
- 服务器 `authorized_keys` 没有对应公钥

解决：

- workflow 增加 secrets 校验
- 使用 CI 专用 SSH key
- 本地先用同一把 key 验证能登录服务器

## 常见问题：git pull 被拒绝

现象：

```txt
Your local changes would be overwritten by merge
```

可能原因：

- 服务器上的脚本只有文件 mode 变化，例如 `100644 -> 100755`

解决：

```bash
cd /srv/frappe_docker
git checkout -- deploy/staging/*.sh
git pull --ff-only origin main
```

## 常见问题：No module named myapp

现象：

```txt
ModuleNotFoundError: No module named 'myapp'
```

原因：

- staging 还在沿用开发态 compose
- compose 挂载了宿主机 `./apps/myapp`
- 服务器没有这份源码目录
- bind mount 把镜像内置的 `myapp` 覆盖掉

解决：

- staging 使用专用 compose
- 不挂载服务器上的 `apps/myapp`
- 让 `myapp` 来自镜像

## 常见问题：数据库端口冲突

现象：

```txt
Bind for 0.0.0.0:3307 failed: port is already allocated
```

解决：

- staging 数据库不映射宿主机端口
- 或使用 staging 专用 compose 覆盖端口配置

## 常见问题：migrate 时站点不存在

现象：

```txt
Error: 404 Not Found: staging.example.com does not exist.
```

原因：

- 第一次部署只启动了基础栈
- 站点尚未 `new-site`

解决：

- deploy 脚本先检查站点是否存在
- 不存在就跳过 migrate
- 先执行 `init-site.sh`

## 常见问题：formatter 导致 CI 失败

现象：

```txt
files were modified by this hook
```

原因：

- 不是业务逻辑错误
- 是 prettier / shfmt / shellcheck 认为格式还没对齐

建议：

- 改 Markdown / YAML / JSON 后关注 prettier
- 改 shell 脚本后关注 shfmt 和 shellcheck
- CI 日志里未显示 `(unchanged)` 的文件，通常就是被 formatter 修改过的文件

## 常见问题：恢复后短暂 503

可能原因：

- 数据恢复后站点仍处于 maintenance mode

解决：

```bash
bench --site <site> set-maintenance-mode off
```

restore 脚本也应该在末尾自动关闭维护模式、执行 migrate 并清缓存。

## 备份与恢复

升级前备份：

```bash
SITE_NAME=all ./deploy/staging/backup-staging.sh
```

恢复：

```bash
SITE_NAME=staging.example.com \
RESTORE_DIR=/srv/frappe_docker/tmp/restore-localhost-YYYYMMDD \
./deploy/staging/restore-staging.sh
```

注意：

- 数据跟着 site 走，不是跟着 app 走
- 恢复会覆盖目标站点数据库和文件
- 不要恢复清理前的旧备份
- 恢复前确认备份时间点
