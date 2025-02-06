---

layout:     post  
title:      "Git 代理配置"  
subtitle:   "如何在 Windows 和 Linux 上配置 Git 代理"  
date:       2025-02-06 12:00:00  
author:     "王康太"  
header-img: "img/git-proxy-bg.jpg"  
catalog: true  
tags:  
- Git  
- 网络配置  
- 代理设置

---

> “配置 Git 代理，让你在网络受限环境下也能顺畅使用 Git。”

在很多公司或特定的网络环境中，可能需要配置代理来访问外部 Git 仓库。本文将详细介绍如何在 **Windows** 和 **Linux** 下配置 Git 代理，包括常见的设置、移除和查看代理的命令。

[跳过废话，直接看技术实现 ](#setup)

### 配置 Git 代理

Git 支持 HTTP 和 HTTPS 代理配置，下面分别介绍如何在不同操作系统下设置代理。

#### Windows 下配置代理

1. **设置 HTTP 代理**：
    ```bash
    git config --global http.proxy http://proxyserver:port
    ```

2. **设置 HTTPS 代理**：
    ```bash
    git config --global https.proxy https://proxyserver:port
    ```

3. **设置不使用代理的地址**：
    ```bash
    git config --global http.noProxy "*.gitlab.com"
    ```

4. **移除代理配置**：
    - 移除 HTTP 代理：
      ```bash
      git config --global --unset http.proxy
      ```
    - 移除 HTTPS 代理：
      ```bash
      git config --global --unset https.proxy
      ```

5. **查看当前代理配置**：
    ```bash
    git config --global --get http.proxy
    git config --global --get https.proxy
    ```

#### Linux 下配置代理

1. **设置 HTTP 代理**：
    ```bash
    git config --global http.proxy http://proxyserver:port
    ```

2. **设置 HTTPS 代理**：
    ```bash
    git config --global https.proxy https://proxyserver:port
    ```

3. **设置不使用代理的地址**：
    ```bash
    git config --global http.noProxy "*.gitlab.com"
    ```

4. **移除代理配置**：
    - 移除 HTTP 代理：
      ```bash
      git config --global --unset http.proxy
      ```
    - 移除 HTTPS 代理：
      ```bash
      git config --global --unset https.proxy
      ```

5. **查看当前代理配置**：
    ```bash
    git config --global --get http.proxy
    git config --global --get https.proxy
    ```

#### 通过环境变量设置代理

除了 Git 配置命令，你还可以通过环境变量设置代理，这对于一些特殊情况更为灵活。

1. **设置环境变量**：

    - **在 Windows 上**：
      ```bash
      setx HTTP_PROXY "http://proxyserver:port"
      setx HTTPS_PROXY "https://proxyserver:port"
      ```

    - **在 Linux 上**：
      ```bash
      export HTTP_PROXY="http://proxyserver:port"
      export HTTPS_PROXY="https://proxyserver:port"
      ```

2. **设置不使用代理的地址**：

    - **Windows**：
      ```bash
      setx NO_PROXY "*.gitlab.com"
      ```

    - **Linux**：
      ```bash
      export NO_PROXY="*.gitlab.com"
      ```

3. **永久设置环境变量（Linux）**：
   如果希望每次启动终端时都使用代理，可以将环境变量写入 `~/.bashrc` 或 `~/.bash_profile` 文件：

    ```bash
    echo 'export HTTP_PROXY="http://proxyserver:port"' >> ~/.bashrc
    echo 'export HTTPS_PROXY="https://proxyserver:port"' >> ~/.bashrc
    echo 'export NO_PROXY="*.gitlab.com"' >> ~/.bashrc
    source ~/.bashrc
    ```

---

### 总结

通过以上步骤，你可以在 **Windows** 和 **Linux** 系统上配置 Git 代理，确保在网络受限环境下顺畅访问 Git 仓库。你可以选择通过 Git 配置命令或环境变量来设置代理。

如果你遇到任何问题，欢迎随时联系我！

—— 王康太 2025.02

---
