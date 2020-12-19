---
title: Baseline & Progressive JPEG
date: '2019-03-13'
modified: '2020-12-19'
tags: 'Web, Graphics'
category: Web
description: 主要介绍了 Web 中使用 Baseline 和 Progressive JPEG 的特点以及图片间的转化方式
---

## 表现区别

<video controls="controls" height="100%" poster="https://cloudinary-res.cloudinary.com/video/upload/non_progressive_vs_progressive_jpeg.jpg" preload="none" width="100%">
  <source src="https://cloudinary-res.cloudinary.com/video/upload/non_progressive_vs_progressive_jpeg.webm" type="video/webm">
  <source src="https://cloudinary-res.cloudinary.com/video/upload/non_progressive_vs_progressive_jpeg.mp4" type="video/mp4">
  <source src="https://cloudinary-res.cloudinary.com/video/upload/non_progressive_vs_progressive_jpeg.ogv" type="video/ogg">
</video>

（[出处](https://cloudinary.com/blog/progressive_jpegs_and_green_martians)）

## 转化方式

`mozjpeg` 提供了转化 JPEG 文件的相关功能。在 Node.js 中，可以使用 `imagemin-mozjpeg` 包对图片进行处理。

```javascript
const imagemin = require('imagemin');
const mozjpeg = require('imagemin-mozjpeg');

imagemin(['input.jpg'], 'output.jpg', {
  plugins: [
    mozjpeg({ quality: 95, progressive: true }),
  ],
});
```

如无需对 JPEG 图片进行有损压缩，只希望把 Baseline JPEG 转化为 Progressive JPEG，可以使用 `imagemin-jpegtran` 工具：

```javascript
const imagemin = require('imagemin');
const jpegtran = require('imagemin-jpegtran');

imagemin(['input.jpg'], 'output.jpg', {
  plugins: {
    jpegtran({ progressive: true }),
  },
});
```

MacOS/Linux 自带了 `libjpeg` 库，其中包含了 `jpegtran` 工具，可以在命令行中直接对 Baseline JPEG 图片进行转化：

```bash
jpegtran -optimize -progressive -outfile output.jpg input.jpg
```

这里，`-optimize` 参数可以优化 JPEG 文件中墒编码的参数，`-progressive` 参数可以将 Baseline JPEG 转化成 Progressive JPEG。同时，如果不需要 EXIF 信息，可以进一步加上 `-copy none` 参数，用于压缩最终的文件大小；如果使用 `jpegtran` 对图片做了变换处理（如旋转等），`-trim` 可以去掉一些用不到的边角料（当然，这会让最终的结果不再是严格意义上的无损压缩）。更多的参数及相关说明，可以参考 `jpegtran` 的[官方网站](https://linux.die.net/man/1/jpegtran)或命令行帮助。

注，如果使用 `Homebrew` 安装 `mozjpeg` ，也会得到一个 `jpegtran` 命令行工具。为了避免其他使用到的工具出现依赖上的问题，默认 `Homebrew` 不会全局安装 `mozjpeg` 中的 `jpegtran`。可以通过软连接的方式，将 `jpegtran` 重命名成不冲突的另一个命令行工具，直接使用。

```bash
ln -s /usr/local/Cellar/mozjpeg/3.0/bin/cjpeg /usr/local/bin/mozcjpeg
ln -s /usr/local/Cellar/mozjpeg/3.0/bin/jpegtran /usr/local/bin/mozjpegtran
```

（如果实际安装的不是 `3.0` 版本，可以根据实际情况修改这里目录中的版本号）

这里，`mozjpeg` 的 `jpegtran` 基本功能是一致的，但是在默认行为上略有不同，`mozjpeg` 做了更多的优化。除了 `jpegtran` 工具之外，`mozjpeg` 也提供了 `cjpeg` 工具，可以对 JPEG 图片进行有损压缩。按照[官方](https://github.com/mozilla/mozjpeg/blob/master/README.md)给出的说法，这里给出的 `cjpeg` 是一个 demo 性质的工具。但从实际使用上来说，够用了。

## 判断方法

根据 [Wiki](https://en.wikipedia.org/wiki/JPEG) 中的介绍，JPEG 由一系列的 `segments` 组成，每一个 `segement` 由一个 `maker` 开头。根据规定，这里的 `maker` 第一个字节是 `0xFF`，如果是 Progressive JPEG，那么第二个紧跟着的字节是 `0xC2`；如果是 Baseline JPEG，那么第二个紧跟着的字节是 `0xC0`。`maker` 后面紧跟着的就是图片的大小等系列参数。

故，判断一张图片是否是 Progressive JPEG 的方法非常简单，只需要在字节流中查找 `0xFF` 和 `0xC2` 两个字符就可以了。

```typescript
function isProgressiveJPEG(buffer: Buffer<Byte>) {
  let prevByte: number = -1;
  for (const byte of buffer) {
    if (prevByte === 0xFF && byte === 0xC2) {
      return true;
    }
    prevByte = byte;
  }
  return false;
}
```

`imagemagick` 也提供了相应的命令行参数 `identify` 来检测 JPEG 的格式。可以用如下方法检查一个图片是否是 Progressive JPEG：

```bash
identify -verbose input.jpg | grep Interlace
```

如果输出是 `Interlace: None` 则说明不是 Progressive JPEG；否则是。

## 优缺点

+ IE8 及更低级的浏览器不支持 Progressive JPEG。

  这里不支持的意思是，Progressive JPEG 图片无法边加载边显示。在这些老版本浏览器中，图片需要完全加载后才能一次性显示。因为 Baseline JPEG 可以逐行从上到下显示，所以仅在这些老浏览器中，Progressive JPEG 的视觉显示效果不如 Baseline JPEG。

+ 使用 Progressive JPEG，用户很难清楚图片是否加载完成了。

  一张模糊的加载中图片，一方面可以提前告知用户大致要加载的内容从而提升用户体验，另一方面也会给不知情的用户一种图片质量非常差的第一印象，从而降低用户体验。

+ Progressive JPEG 一般来说可以获得更小的体积。

  这是因为，相近的数据被放到一起了而不是分散在各个组里面，压缩编码的时候更容易得到较小的结果。当然，这一点并不是绝对的。经过测试，也存在一些图片（比如，小尺寸的缩略图），Baseline JPEG 的大小优于 Progressive JPEG。当然，不论哪种情况，两者的差距不会非常显著。

  > 有实验证明，在 JPEG 文件小于 10KB 的时候，使用标准型编码（Huffman 表已经被优化）的 JPEG 文件要小于使用渐变式编码的 JPEG 文件（发生概率为 75%）。当文件大于 10KB 时，渐变式编码的 JPEG 文件有 94% 的概率拥有比标准编码的文件更小的体积。

  （[出处](https://blog.csdn.net/daruisoft/article/details/19773209)）

+ Progressive JPEG 显示需要更多 CPU 与内存。

  这是由于 Progressive JPEG 需要来回更新一张图片多次，因而更加耗费 CPU 资源。同时，由于图片的任意一块位置在完全加载完前都没能完成显示，这些数据都需要在内存中等待后续的处理，因此也需要更多的内存使用量。一般来说，显示图片的耗时，Progressive JPEG 是 Baseline JPEG 的 2.5 倍左右。这一点在移动设备中，可能还是需要考虑的。

  另外，不仅仅是显示耗时，将图片转化成 Progressive JPEG 也比较耗时（6 ～ 8 倍）。因此，照相机的默认输出格式一般都是 Baseline JPEG。

+ Baseline JPEG 可以通过配合 CSS 来达到更好的显示效果。

举例来说，在 Baseline JPEG 图片上加上 CSS Background，可以起到 loading 的显示效果：

```css
.container {
  overflow: hidden;
  position: relative;
}

.loading-cover {
  background:
    repeating-linear-gradient(-45deg, #444 0, #444 80px, #333 80px, #333 160px);
  animation: gradient-move 2.5s linear 0s infinite;
  width: 816px;
  height: 590px;
  position: absolute;
  z-index: -1;
  top: 0;
}

img {
  width: 590px;
  height: 590px;
}

@keyframes gradient-move {
  0% {
    transform: translate(-226px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
```

```html
<div class="container">
  <div class="loading-cover"></div>
  <img src="src-here" alt="alt" />
</div>
```

例子：

<div style="overflow:hidden;width:742px;height:500px;position:relative;">
  <style>
    @keyframes gradient-move {
      0% {
        transform: translate(-226px, 0);
      }
      100% {
        transform: translate(0, 0);
      }
    }
  </style>
  <div style="background:repeating-linear-gradient(-45deg,#444 0,#444 80px,#333 80px,#333 160px);animation:gradient-move 2.5s linear 0s infinite;width:967px;height:500px;position:absolute;z-index:-1;top:0"></div>
  <img src="../../../baseline-jpeg-demo.jpeg" style="width:742px;height:500px;margin:0" id="demo" />
</div>

Firework, light, dark and night HD photo by Jez Timms ([@jeztimms](https://unsplash.com/@jeztimms)) on Unsplash. ([Source](https://unsplash.com/photos/r4lM2v9M84Q))

在 Baseline JPEG 没有加载完成的部分，后面的 loading 背景会显示出来。背景可以是一个背景色，也可以是一个简单的 SVG，一个 loading 动画或者一个极小的缩略图。可以通过 Chrome DevTool 里，disable cache 并刷新页面来查看上例加载中的效果。

## How it works

JPEG 图片的压缩原理是，使用离散余弦变换（Discrete Cosine Transform, DCT）将像素数据，按每 8x8 像素（共 64 个像素点）一组进行变换。变换后的矩阵，左上角的系数称为 DC 系数，是所有像素的平均值（不带有频率信息），其余的是 AC 系数，按低频到高频分布，保存了从全局到细节的图片信息。经过了这样的变换之后，JPEG 就可以进行有损压缩了。当压缩后的结果只保留了低频的全局信息，而去除了高频的细节信息，那么最终的图片大小就会减少。一定范围的高频信息丢失并不会在视觉上造成影响，JPEG 压缩因而被广泛使用。

传统的 Baseline JPEG 是按分组一次记录图片信息的，因而加载的过程中，也是从上到下，从左往右依次显示出每一组的像素内容。而 Progressive JPEG 的改进之处在于对这里的数据存储顺序做了调整。首先加载的是 DC 系数（也就是一组像素的平均值），然后再依次加载低频数据，最后再加载高频数据。从视觉上看，就会先出现一个较为模糊的图片（此时每一组的像素都被填充为平均值），然后再加载低频数据后，慢慢补充图片细节，最终待高频数据加载完毕形成最终的显示结果。这也意味着，一张图片的显示可能需要来回更新好几遍，每一遍称为一个 `scan`。一般来说，一张 Progressive JPEG 图片可能需要来回更新十次左右。

### 计算 scan 的方式

根据 [WIKI](https://en.wikipedia.org/wiki/JPEG) 的介绍，字节流中的 `0xFF` 和 `0xDA` 表示一个 `scan` 的开始。要计算一张图片中有多少 `scan`，可以参考下面的代码：

```typescript
function getScanOfJPEG(buffer: Buffer<Byte>) {
  let count: number = 0;
  let prevByte: number = -1;
  for (const byte of buffer) {
    if (prevByte === 0xFF && byte === 0xDA) {
      count += 1;
    }
    prevByte = byte;
  }
  return count;
}
```
