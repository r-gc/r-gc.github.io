---
title: SSH 密钥生成与 GitHub 配置速查
published: 2026-05-20
updated: 2026-05-20
description: 记录生成 SSH key、启动 ssh-agent、添加公钥到 GitHub 和测试连接的常用命令。
tags: [SSH, GitHub, 密钥, ssh-agent, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制 SSH key 相关命令。

## 生成 ed25519 key

```bash
ssh-keygen -t ed25519 -C "you@example.com" -f ~/.ssh/id_ed25519_github
```

如果是给另一个 GitHub 账号单独生成 key，可以换文件名：

```bash
ssh-keygen -t ed25519 -C "blog@example.com" -f ~/.ssh/id_ed25519_r_gc
```

## 查看公钥

```bash
cat ~/.ssh/id_ed25519_github.pub
```

把输出内容复制到 GitHub：

```txt
GitHub -> Settings -> SSH and GPG keys -> New SSH key
```

注意复制的是 `.pub` 公钥，不是没有后缀的私钥。

## 设置权限

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519_github
chmod 644 ~/.ssh/id_ed25519_github.pub
```

如果权限太开放，SSH 可能会拒绝使用私钥。

## 启动 ssh-agent 并添加 key

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_github
```

查看 agent 里已有 key：

```bash
ssh-add -l
```

从 agent 删除某个 key：

```bash
ssh-add -d ~/.ssh/id_ed25519_github
```

清空 agent 中所有 key：

```bash
ssh-add -D
```

## 测试 GitHub SSH

普通测试：

```bash
ssh -T git@github.com
```

如果 `~/.ssh/config` 里配置了 Host 别名：

```bash
ssh -T git@github-r-gc
```

成功时通常会看到类似：

```txt
Hi USER! You've successfully authenticated, but GitHub does not provide shell access.
```

## 常用参数解释

`ssh-keygen`：生成 SSH 密钥。

`-t ed25519`：指定密钥算法。现在一般优先用 ed25519。

`-C "you@example.com"`：给 key 加注释，常用邮箱或用途，方便以后识别。

`-f ~/.ssh/id_ed25519_github`：指定生成文件路径和文件名。

`.pub`：公钥文件，可以上传到 GitHub。

没有 `.pub` 后缀的文件：私钥文件，不能公开。

`ssh-agent`：本地密钥代理，可以记住已添加的私钥。

`ssh-add`：把私钥加入 agent。

`ssh -T`：测试 SSH 认证，不打开远程 shell。
