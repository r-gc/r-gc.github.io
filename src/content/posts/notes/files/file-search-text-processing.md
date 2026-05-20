---
title: 文件查找与文本搜索速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 find、rg、grep、sed、awk、xargs 等常用文件查找和文本处理命令。
tags: [Linux, find, rg, grep, sed, awk, xargs, 速查]
category: 笔记
draft: false
---

这篇用来复制文件查找和文本搜索命令。

## 推荐优先用 rg

查找文本：

```bash
rg "keyword"
```

查找文件名：

```bash
rg --files | rg "config"
```

忽略大小写：

```bash
rg -i "keyword"
```

显示行号：

```bash
rg -n "keyword"
```

只查某类文件：

```bash
rg "keyword" -g "*.ts"
```

排除目录：

```bash
rg "keyword" -g "!node_modules"
```

## find 查找文件

按文件名：

```bash
find . -name "*.md"
```

忽略大小写：

```bash
find . -iname "*readme*"
```

按目录深度：

```bash
find . -maxdepth 2 -type f
```

只找目录：

```bash
find . -type d -name "node_modules"
```

按大小：

```bash
find . -type f -size +100M
```

按修改时间：

```bash
find . -type f -mtime -1
```

## grep 搜索文本

递归搜索：

```bash
grep -R "keyword" .
```

显示行号：

```bash
grep -Rni "keyword" .
```

排除目录：

```bash
grep -R "keyword" . --exclude-dir=node_modules
```

## sed 常用替换

只输出匹配行附近内容：

```bash
sed -n '1,120p' file.txt
```

替换输出，不修改文件：

```bash
sed 's/old/new/g' file.txt
```

原地替换：

```bash
sed -i 's/old/new/g' file.txt
```

macOS 上原地替换：

```bash
sed -i '' 's/old/new/g' file.txt
```

## awk 常用命令

打印第一列：

```bash
awk '{print $1}' file.txt
```

按冒号分隔：

```bash
awk -F ':' '{print $1}' /etc/passwd
```

打印匹配行：

```bash
awk '/keyword/ {print}' file.txt
```

## xargs 常用组合

查找并删除日志文件：

```bash
find . -name "*.log" -print0 | xargs -0 rm
```

批量 grep：

```bash
find . -name "*.md" -print0 | xargs -0 grep -n "keyword"
```

配合 rg 文件列表：

```bash
rg --files -g "*.md" | xargs grep -n "keyword"
```

## 查看大文件

```bash
find . -type f -size +100M -print
```

按大小排序：

```bash
find . -type f -printf "%s %p\n" | sort -n | tail
```

## 常用参数解释

`rg`：ripgrep，速度快，默认尊重 `.gitignore`。

`rg --files`：列出文件。

`-g "*.ts"`：只包含某类路径。

`-g "!node_modules"`：排除路径。

`find -name`：按名称匹配，区分大小写。

`find -iname`：按名称匹配，不区分大小写。

`-type f`：只找文件。

`-type d`：只找目录。

`-maxdepth`：限制搜索深度。

`grep -R`：递归搜索。

`grep -n`：显示行号。

`sed -n`：只输出指定内容。

`sed -i`：原地修改文件。

`awk -F`：指定字段分隔符。

`xargs`：把前一个命令的输出变成后一个命令的参数。

`-print0` 和 `xargs -0`：用空字符分隔，能安全处理带空格的文件名。
