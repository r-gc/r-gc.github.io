---
title: 博客视觉资源更换速查
published: 2026-05-20
updated: 2026-05-20
description: 记录 RGC Blog 更换头像、顶部 banner、顶部氛围背景图和视觉参数的位置。
tags: [Astro, Fuwari, Blog, 图片, 背景, 视觉配置, 速查]
category: 笔记
draft: false
---

这篇记录博客里和“外观换装”有关的位置，后续换图片时不用重新翻代码。

## 头像

配置位置：

```txt
src/config.ts
```

字段：

```ts
profileConfig.avatar
```

当前值：

```ts
avatar: "assets/images/demo-avatar.png"
```

图片放在：

```txt
src/assets/images/
```

## 顶部 banner

配置位置：

```txt
src/config.ts
```

字段：

```ts
siteConfig.banner
```

开启：

```ts
banner: {
  enable: true,
  src: "assets/images/demo-banner.png",
  position: "center",
}
```

如果不想显示顶部大图：

```ts
enable: false
```

## 顶部氛围背景图

配置位置：

```txt
src/config.ts
```

字段：

```ts
siteConfig.background
```

当前背景图：

```ts
src: "/images/meteor-shower-background.png"
```

图片位置：

```txt
public/images/
```

更换方式：

1. 把新图片放到 `public/images/`
2. 修改 `src`
3. 运行构建检查

```bash
pnpm build
```

## 常用参数

顶部背景高度：

```ts
height: "clamp(24rem, 42vh, 36rem)"
```

透明度：

```ts
opacity: 1
```

图片位置：

```ts
position: "center"
position: "top"
position: "bottom"
```

模糊：

```ts
blur: "4px"
```

缩放：

```ts
scale: 1.03
```

遮罩：

```ts
overlay: {
  light: "transparent",
  dark: "transparent",
}
```

## 推荐习惯

博客图片尽量放本地，不依赖外链。

背景图建议只放在顶部氛围区，长文章阅读区保持干净。常见做法是让顶部背景覆盖导航栏和首屏内容的一部分，然后在固定高度处直接切回页面底色。

如果背景细节比较多，优先降低 `height` 或换一张更干净的图，不要直接把文章卡片做得很透明。

如果图片比较大，可以压缩成 WebP：

```bash
cwebp input.png -q 82 -o meteor-shower-background.webp
```

然后把配置改成：

```ts
src: "/images/meteor-shower-background.webp"
```
