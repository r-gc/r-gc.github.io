---
title: systemd 服务管理速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 systemctl、journalctl、服务启停、开机启动、环境变量和自定义 service 文件的常用命令。
tags: [Linux, systemd, systemctl, journalctl, Service, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制 systemd 服务管理命令。

## 查看服务状态

```bash
sudo systemctl status SERVICE
```

例如：

```bash
sudo systemctl status docker
sudo systemctl status nginx
```

## 启动、停止、重启

启动：

```bash
sudo systemctl start SERVICE
```

停止：

```bash
sudo systemctl stop SERVICE
```

重启：

```bash
sudo systemctl restart SERVICE
```

重新加载配置：

```bash
sudo systemctl reload SERVICE
```

如果不确定服务是否支持 reload：

```bash
sudo systemctl reload-or-restart SERVICE
```

## 开机启动

启用开机启动：

```bash
sudo systemctl enable SERVICE
```

禁用开机启动：

```bash
sudo systemctl disable SERVICE
```

立即启用并启动：

```bash
sudo systemctl enable --now SERVICE
```

查看是否开机启动：

```bash
systemctl is-enabled SERVICE
```

查看是否正在运行：

```bash
systemctl is-active SERVICE
```

## 查看日志

查看服务日志：

```bash
journalctl -u SERVICE
```

实时跟随：

```bash
journalctl -u SERVICE -f
```

看最近 100 行：

```bash
journalctl -u SERVICE -n 100
```

从今天开始：

```bash
journalctl -u SERVICE --since today
```

指定时间范围：

```bash
journalctl -u SERVICE --since "2026-05-20 10:00" --until "2026-05-20 12:00"
```

## 查看失败服务

```bash
systemctl --failed
```

重置 failed 状态：

```bash
sudo systemctl reset-failed
```

## 查看服务环境变量

```bash
sudo systemctl show --property=Environment SERVICE
```

查看完整配置：

```bash
systemctl cat SERVICE
```

## 修改服务后重载 systemd

```bash
sudo systemctl daemon-reload
```

修改 service 文件或 drop-in 配置后，都需要执行这个命令。

## 创建自定义 service

```bash
sudo nano /etc/systemd/system/myapp.service
```

示例：

```ini
[Unit]
Description=My App
After=network.target

[Service]
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

启用：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now myapp
```

查看：

```bash
sudo systemctl status myapp
journalctl -u myapp -f
```

## drop-in 覆盖配置

创建覆盖目录：

```bash
sudo systemctl edit SERVICE
```

示例：

```ini
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:10808"
Environment="HTTPS_PROXY=http://127.0.0.1:10808"
```

保存后：

```bash
sudo systemctl daemon-reload
sudo systemctl restart SERVICE
```

## 常用参数解释

`systemctl status`：查看服务状态和最近日志。

`start`：启动服务。

`stop`：停止服务。

`restart`：重启服务。

`reload`：重新加载配置，不一定重启进程。

`enable`：设置开机启动。

`disable`：取消开机启动。

`enable --now`：设置开机启动并立即启动。

`journalctl -u`：查看某个服务日志。

`-f`：实时跟随日志。

`-n 100`：显示最近 100 行。

`daemon-reload`：重新加载 systemd 单元文件。

`Restart=always`：服务退出后自动重启。

`WantedBy=multi-user.target`：让服务进入常规多用户启动目标。
