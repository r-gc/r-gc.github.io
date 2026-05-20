---
title: Git 多账号配置速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 Git 全局账号、单仓库账号、远程地址和多 GitHub 账号的常用配置命令。
tags: [Git, GitHub, SSH, 账号配置, 速查, 配置]
category: 笔记
draft: false
---

这篇用来复制 Git 账号相关命令。

## 查看当前配置

```bash
git config --list
git config --global --list
git config --local --list
git config --show-origin --list
```

`--show-origin` 会显示配置来自哪个文件，排查“为什么这个仓库用错账号”时很有用。

## 设置全局账号

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

全局配置会写入：

```txt
~/.gitconfig
```

适合主力账号。比如一台机器主要用 `rgc318` 工作，就把全局账号设成 `rgc318` 对应的用户名和邮箱。

## 设置当前仓库账号

在仓库目录里执行：

```bash
git config user.name "Blog Account"
git config user.email "blog@example.com"
```

这会写入当前仓库的：

```txt
.git/config
```

适合某个仓库需要使用另一个身份的情况。

## 查看某个配置最终生效值

```bash
git config user.name
git config user.email
git config --show-origin user.name
git config --show-origin user.email
```

Git 配置优先级大致是：

```txt
仓库 local > 用户 global > 系统 system
```

所以仓库里设置过 `user.name`，就会覆盖全局配置。

## 修改远程仓库地址

查看远程地址：

```bash
git remote -v
```

改成普通 GitHub SSH 地址：

```bash
git remote set-url origin git@github.com:USER/REPO.git
```

改成 HTTPS 地址：

```bash
git remote set-url origin https://github.com/USER/REPO.git
```

改成 SSH Host 别名地址：

```bash
git remote set-url origin git@github-r-gc:r-gc/r-gc.github.io.git
```

这里的 `github-r-gc` 不是 GitHub 官方域名，而是 `~/.ssh/config` 里自己定义的 Host 别名。

## 单仓库指定 SSH key

在仓库目录里执行：

```bash
git config core.sshCommand "ssh -i ~/.ssh/id_ed25519_r_gc -o IdentitiesOnly=yes"
```

查看是否生效：

```bash
git config --local core.sshCommand
```

取消：

```bash
git config --unset core.sshCommand
```

这个方式适合“默认 GitHub 账号保持主力账号，但某个仓库固定使用另一把 key”。

## 常用参数解释

`--global`：写入当前用户的全局 Git 配置。

`--local`：只看或只改当前仓库配置。默认在仓库中执行 `git config` 时就是 local。

`--show-origin`：显示配置来源文件，排查配置覆盖时常用。

`remote set-url`：修改已有 remote 的 URL，不会重建 remote。

`core.sshCommand`：让当前仓库执行 Git SSH 操作时使用指定 SSH 命令。

`-i ~/.ssh/id_ed25519_r_gc`：指定 SSH 私钥文件。

`-o IdentitiesOnly=yes`：只使用显式指定的 key，避免 SSH 把其它 key 也拿去尝试。
