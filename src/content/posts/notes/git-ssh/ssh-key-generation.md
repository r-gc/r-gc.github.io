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

## 公钥放到目标服务器

原则很简单：

```txt
私钥留在访问方
公钥放到被访问方
```

比如从自己的电脑访问一台 Linux 服务器，就在自己的电脑生成 key，然后把 `.pub` 公钥放到目标服务器对应用户的：

```txt
~/.ssh/authorized_keys
```

如果目标登录用户是 `deploy`：

```txt
/home/deploy/.ssh/authorized_keys
```

如果目标登录用户是 `root`：

```txt
/root/.ssh/authorized_keys
```

## 快捷添加公钥

本机执行：

```bash
ssh-copy-id -i ~/.ssh/id_ed25519_github.pub user@server_ip
```

指定 SSH 端口：

```bash
ssh-copy-id -i ~/.ssh/id_ed25519_github.pub -p 2222 user@server_ip
```

它会自动把公钥追加到目标服务器的：

```txt
~/.ssh/authorized_keys
```

第一次执行通常需要输入目标服务器用户密码，因为此时目标服务器还没有你的公钥，只能先用密码登录一次。

成功后测试：

```bash
ssh user@server_ip
```

如果你的私钥设置了 passphrase，后续登录时可能还会输入私钥密码。这个不是服务器用户密码。

如果服务器已经禁用了密码登录：

```txt
PasswordAuthentication no
```

那么 `ssh-copy-id` 也无法用密码进去。此时只能通过云厂商控制台、已有可登录账号、服务器面板，或者让管理员帮你把公钥放进去。

## 已登录服务器后手动添加

如果你已经登录到了目标服务器，可以直接在服务器上追加公钥。

先在本机查看并复制公钥：

```bash
cat ~/.ssh/id_ed25519_github.pub
```

复制整行内容，格式类似：

```txt
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... you@example.com
```

然后在目标服务器上执行：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat >> ~/.ssh/authorized_keys
```

粘贴刚才复制的公钥整行，回车，然后按 `Ctrl + D` 结束输入。

最后设置权限：

```bash
chmod 600 ~/.ssh/authorized_keys
```

也可以用 `echo` 一行追加：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... you@example.com' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

注意使用 `>>`，不要随手用 `>`：

```txt
>> 追加，不会删除原有 key
>  覆盖，会清空 authorized_keys 里的原有 key
```

如果确定要重建整个 `authorized_keys`，才使用：

```bash
echo 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... you@example.com' > ~/.ssh/authorized_keys
```

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

`authorized_keys`：目标服务器上保存允许登录的公钥列表。

`ssh-copy-id`：把本机公钥复制到目标服务器 `authorized_keys` 的快捷命令。

`>>`：追加内容到文件末尾，适合给 `authorized_keys` 增加新公钥。

`>`：覆盖文件内容，可能删除已有公钥，谨慎使用。
