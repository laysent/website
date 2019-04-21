---
title: 蝉原则（Cicada Principle）
date: '2019-04-21'
modified: '2019-04-21'
tags: 'Web, CSS'
category: Web
description: 本文主要整理了“蝉原则”在 CSS 中的应用及相关原理，包括其他网上文章针对这一内容常见说法的补充/勘误。
---

## 背景

> [周期蝉](https://zh.wikipedia.org/wiki/%E5%91%A8%E6%9C%9F%E8%9D%89)属（学名：Magicicada）是半翅目蝉科的一属，主要分布于北美，其生命周期为十三年或十七年，也被称为十七年蝉或十三年蝉。幼虫孵化后即钻入地下，一生绝大多数时间在地下度过，靠吸食树根的汁液生存。在地下生活十三年或十七年后，同种蝉的若虫同时破土而出，在 4-6 周内羽化、交配、产卵、死亡，而卵孵化后进入下一个生命周期。因此某一年份在美国东部一些地方每过十七或十三年就会突然出现的大量的蝉，成为一种奇景。
>（[source](https://zh.wikipedia.org/wiki/%E5%91%A8%E6%9C%9F%E8%9D%89)）

对于周期蝉来说，这样的生命周期有两个主要的意义：

1. 长时间的地下蛰伏，使得蝉可以尽可能避开冷夏，增加成活率
2. 两个周期都是**质数**，使得不同种群的蝉可以错峰生存（也包括和天敌错开），不相互抢占资源

这里的第二点，也是“蝉原则”的主要出发点。

> 这种以质数作为循环周期来增加“自然随机性”的策略就称之为“蝉原则”。
>（[source](https://www.zhangxinxu.com/wordpress/2017/02/%E8%9D%89%E5%8E%9F%E5%88%99-background-border-radius/)）

## 伪随机性

首先需要考虑一个问题，为什么这种以质数作为循环周期的操作可以提供伪随机性，或者说是直觉上的随机性。

简单来说，如果一个系统内被引入了大量的影响因子，使得人不能很容易的发现内在的规律，就会产生一种“随机”的错觉。假设现在有两个周期，分别是 $m$ 周期和 $n$ 周期。当这两个周期合并在一起的时候，新的结果的周期长度是 $lcm(m, n)$。而由于 $lcm(m, n) \leq m \times n$，因此不难知道，当各个周期的长度互质的时候，最终合成的周期长度会是最长的。

以上面北美周期蝉为例，十三年蝉和十七年蝉两者形成的合成周期，长度是 $13\times17=221$。也就是说，每隔 221 年才会出现一次同时的爆发，蝉生长和爆发也以 221 年为单位进行重复。221 年已经是非常大的一个时间周期了，如果以一个普通人的一生作为观察尺度的话，不会发现重复，因而很容易产生随机的错觉。

这还只是两个周期重叠的效果。试想，如果有六个素数周期叠加在一起，最终形成的周期长度将会是非常大的。以最小的六个素数为例，$lcm(2, 3, 5, 7, 11, 13)=2\times3\times5\times7\times11\times13=30030$。

当然，需要声明的是，这只是一种**伪**随机性，并不是真正意义上的随机。只要观察的尺度被拉大，规律性还是很容易被发觉的。

## CSS 中的应用

基于以上的分析，用“{蝉原则}^(Cicada Principle)”在 CSS 中制造伪随机是一个很不错的方案，主要有以下两个方面的考量：

1. CSS 本身并不提供随机函数，想要形成随机的感觉，只能求助于伪随机的方案；
2. 对于 CSS 来说，最终的效果总是要在终端显示出来的。而只要是在物理终端上有所展示，尺度问题就一定是被限制的（屏幕没法无限大），因而只要参与的互质数够多，就很难被发现规律。

### nth-child 方案

使用 CSS 的 `nth-child` 选择器，可以针对一组子元素分别定义不同的样式，从而达到设置周期的效果。举例来说：

```css
.child { }
.child:nth-child(2n) { }
.child:nth-child(3n) { }
```

设置了以 2 和 3 为周期的两种不同周期。同时 `.child {}` 保证了对于这两个周期没有覆盖到的元素，也会有一个 fallback 的样式。

[伦敦 UX 大会](https://2016.uxlondon.com/speakers)的嘉宾头像展示了随机的圆角，就是应用了上面提到的技巧来处理的。一些细节的介绍可以看作者的[博客说明](http://www.lottejackson.com/learning/nth-child-cicada-principle)。

### linear-gradient 方案

[Cicada stripes](https://leaverou.github.io/css3patterns/#cicada-stripes) 就是使用了这样一个方案来实现背景纹理的伪随机化。

涉及到的 CSS 代码为：

```css
.stripes {
  /* 这个是图案的背景主题色，条纹效果是在这个背景色的基础上，增加一些透明度不一的蒙版 */
  background-color: #026873;
  background-image:
  /* 渐变轴垂直 90 度，一半是 0.07 透明度，一半是完全透明 */
  linear-gradient(90deg, rgba(255,255,255,.07) 50%, transparent 50%),
  linear-gradient(90deg, rgba(255,255,255,.13) 50%, transparent 50%),
  linear-gradient(90deg, transparent 50%, rgba(255,255,255,.17) 50%),
  linear-gradient(90deg, transparent 50%, rgba(255,255,255,.19) 50%);
  /* 上面这四种渐变，周期分别是 13px，29px，37px 和 53px */
  background-size: 13px, 29px, 37px, 53px;
}
```

## 一些{补充}^(勘误)

在上面 nth-child 方案的章节中，引用了伦敦 UX 大会的例子。其中，作者在解释的博客说明中，提到了一般的 `:nth-child(2n)`，`:nth-child(3n)` 效果并不非常好，因而做了一些改进：

> However, I found that just using prime numbers didn't quite target enough items to make it look really random, so I added another layer of nth-child using prime numbers like this
>
> ```css
> .nth-child(2n+1) { }
> .nth-child(3n+2) { }
> ```

在很多其他的文章中，也都提到了这一条。然而，从数学上看，这一点似乎很难成立。

首先，`.nth-child(2n+1)` 和 `.nth-child(2n)` 的选择器，本质上都是在创建一个以 2 为长度的周期。区别仅仅是在于，前者做了一个平移，平移的长度是一个元素。而针对有平移的方案，并不会导致最终形成的循环周期发生变化。举例来说，如果用 `.nth-child(2n+1)` 和 `.nth-child(3n+2)` 有重合，那么就会有 $2n+1=3m+2$，不难得出 $2(n+3)+1=3(m+2)+2$ 是一个新的重合，新周期的长度依然是 $lcm(2, 3) = 2\times3$。因而，不管用哪一种方案，最终形成的一个周期长度，都是 $lcm(n, m) = n \times m$。

其次，`.nth-child(2n+1)` 的方案可以覆盖更多的元素，似乎也不成立。对于没有平移的方案 `:nth-child(2n)` 来说，在一个最终形成的周期内，不能被子周期覆盖到的部分，就是那些更大的素数。换句话说，不能覆盖的集合是 $P = \{p | p \in prime, p \leq lcm(n, m)\}\cup\{1\}$。如果由 2、3、5 来组成周期，那么在 $2\times3\times5=30$ 个数内，1、7、11、13、17、19、23、29 是不能被覆盖到的数。以同样的周期组合，来考虑带平移的方案，不能被覆盖到的部分，是 4、6、10、12、16、22、24、30。不难发现，不能被覆盖到的量其实是一样的。

当然，两种方案不能覆盖到的具体值是不一样的。所以是否存在感觉上的不同，光从数字上很难区别。下面给了一个实际可操作的例子，展示了 30 个元素的“伪随机”效果，总共用到了 2、3、5 这三个周期。鼠标不 hover 时候，展示的是没有平移的效果，hover 上去后展示带有平移的效果。

<style>
  .demo-small {
    display: flex;
    margin-bottom: 1.75rem;
  }
  .demo-small .box {
    width: 5px;
    height: 60px;
    background-color:rgb(0, 0, 255);
  }
  .demo-small .box:nth-child(2n) {
    background-color: rgba(0, 0, 255, 0.9);
  }
  .demo-small .box:nth-child(3n) {
    background-color: rgba(0, 0, 255, 0.7);
  }
  .demo-small .box:nth-child(5n) {
    background-color: rgba(0, 0, 255, 0.5);
  }

  .demo-small:hover .box {
    background-color: rgb(0, 0, 255);
  }
  .demo-small:hover .box:nth-child(2n+1) {
    background-color: rgba(0, 0, 255, 0.9);
  }
  .demo-small:hover .box:nth-child(3n+2) {
    background-color: rgba(0, 0, 255, 0.7);
  }
  .demo-small:hover .box:nth-child(5n+3) {
    background-color: rgba(0, 0, 255, 0.5);
  }
</style>

<div class=demo-small>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
</div>

整体上看，似乎也没有很大的差异。

<style>
  .demo-large {
    display: flex;
    margin-bottom: 1.75rem;
  }
  .demo-large .box {
    width: 5px;
    height: 60px;
    background-color:rgb(255, 0, 0);
  }
  .demo-large .box:nth-child(2n) {
    background-color: rgba(255, 0, 0, 0.9);
  }
  .demo-large .box:nth-child(3n) {
    background-color: rgba(255, 0, 0, 0.8);
  }
  .demo-large .box:nth-child(5n) {
    background-color: rgba(255, 0, 0, 0.7);
  }
  .demo-large .box:nth-child(7n) {
    background-color: rgba(255, 0, 0, 0.6);
  }
  .demo-large .box:nth-child(11n) {
    background-color: rgba(255, 0, 0, 0.5);
  }
  .demo-large .box:nth-child(13n) {
    background-color: rgba(255, 0, 0, 0.4);
  }

  .demo-large:hover .box {
    background-color: rgb(255, 0, 0);
  }
  .demo-large:hover .box:nth-child(2n+1) {
    background-color: rgba(255, 0, 0, 0.9);
  }
  .demo-large:hover .box:nth-child(3n+2) {
    background-color: rgba(255, 0, 0, 0.8);
  }
  .demo-large:hover .box:nth-child(5n+3) {
    background-color: rgba(255, 0, 0, 0.7);
  }
  .demo-large:hover .box:nth-child(7n+5) {
    background-color: rgba(255, 0, 0, 0.6);
  }
  .demo-large:hover .box:nth-child(11n+7) {
    background-color: rgba(255, 0, 0, 0.5);
  }
  .demo-large:hover .box:nth-child(13n+11) {
    background-color: rgba(255, 0, 0, 0.4);
  }
</style>

<div class=demo-large>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
  <div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div><div class=box></div>
</div>

上面这个例子，总共用到了 2、3、5、7、11、13 这六个周期，在总长度为 30030 的周期中，选取了前 100 个元素形成的最终展示效果。感觉上，也没有明显的优化。但是从实际的情况来看，数据上有细微的不同。

有平移效果的情况，在 100 以内不能被覆盖的总数是 19 个；没有平移的情况，100 以内剩余的素数个数也是 19 个，但还需要加上 1，一共是 20 个元素。同时，在有平移效果的情况下，各个素数被使用的次数统计如下：

```json
{
  "2": 21, 
  "3": 17, 
  "5": 15, 
  "7": 12, 
  "11": 9, 
  "13": 7
}
```

而没有平移效果的情况下，各个素数被使用的次数统计如下：

```json
{ 
  "2": 18, 
  "3": 18, 
  "5": 16, 
  "7": 12, 
  "11": 9, 
  "13": 7
}
```

没有平移效果的情况，分布更均匀一些，但差别也不大。另，如果看整个周期 30030 个元素，那么分布结果是相同的：

```json
{
  "2": 5760,
  "3": 5760,
  "5": 4320,
  "7": 3600,
  "11": 2520,
  "13": 2310
}
```

因为平移的存在，一段区间内的实际未覆盖率和无平移的情况存在细微的偏差，但不影响总体效果。

综上所述，似乎没有看到加平移的特别效果，可以根据实际感受按需选择。
