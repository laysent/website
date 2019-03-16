---
title: Html5 的旁注标记
date: '2019-03-16'
modified: '2019-03-16'
tags: Web
category: Web
description: 本文主要介绍了 HTML5 中的旁注标记 ruby 及其使用
---

## Furigana

在日语漫画中，经常看到<ruby>注音假名<rp>(<rt>Furigana</rt><rp>)</rp></ruby>，也被称为振假名或<ruby>ルビー<rt>Ruby</rt></ruby>。根据 [wiki](https://zh.wikipedia.org/wiki/%E6%8C%AF%E5%81%87%E5%90%8D) 的解释，Ruby 一词主要源自英国对 5.5 号字体的传统称呼（和编程语言 Ruby 无关），因此有时候印刷物的注音假名也被称作<ruby>ルビ<rp>(</rp><rt>Ruby</rt><rp>)</rp></ruby>。

除了一般的注音功能之外，日语中也常用注音假名来给汉字赋予新的含义。比如：<ruby>紳士<rp>(</rp><rt>hentai</rt><rp>)</rp></ruby>这个梗，写作绅士，但读作 Hentai。

旁注标记就是这种表意文字的音标印刷方式，广泛地运用于东亚文字中，如中文或日文。一般这些字是放于表意文字的上方或右边，作为文字的拼音或注解。

## ruby

在 HTML5 中，可以使用 `ruby` 标签来对文字进行旁注。一个简单的例子如下：

```html
<ruby>
注<rp>(</rp><rt>zhù</rt><rp>)</rp>
音<rp>(</rp><rt>yīn</rt><rp>)</rp>
</ruby>
```

展示效果：<ruby>注<rp>(</rp><rt>zhù</rt><rp>)</rp>音<rp>(</rp><rt>yīn</rt><rp>)</rp></ruby>。在不支持 `ruby` 的浏览器中，显示效果大致为：`注(zhù)音(yīn)`。

值得一提的是，`ruby` 虽然不是一个常见的 HTML 标签，但是其基础功能在各个浏览器中的支持率其实非常高。Internet Explorer 从 IE5 就开始支持 `ruby`，之后 `ruby` 加入 HTML5 标准，各大浏览器也纷纷实现。根据 [Caniuse](https://caniuse.com/#search=ruby) 的数据，基础功能的浏览器支持率达到了 96.34%。因此，理论上来说，基本可以不用考虑不支持 `ruby` 的情况。

从上面的例子中不难看出，一个带旁注的文字主要由两个部分组成，基础的文字部分与旁注部分。对于 `ruby` 标签来说，里面的内容默认是基础的文字部分，旁注部分需要额外使用其他标签注明。可以在 `ruby` 标签内辅助声明内容格式的标签有：`rt`，`rp`，`rb`，`rtc` 和 `rbc`。其中，`rt` 和 `rp` 已经得到了大多数浏览器的支持，而 `rb`，`rtc` 和 `rbc` 目前只有 Firefox 做了适配，其他浏览器暂时还未支持。

下面介绍 `ruby` 中辅助展示旁注内容的这些标签。

### rp

`rp` 是 Ruby Fallback Parenthesis 的缩写，是 `ruby` 中相对特殊的标签。在支持 `ruby` 的浏览器中，`rp` 是一个不会被展示的标签（即，useragent 里设置了 `rp { display: none; }`）。但是对于不支持 `ruby` 的老式浏览器来说，没有这样的 useragent 设置，`rp` 只是被识别为一个普通的标签，表现形式和一般的行内元素无差。因此，在这些不支持 `ruby` 的浏览器中，一方面旁注系统不生效，没有文字与旁注上下排列的效果；另一方面 `rp` 的隐藏属性也不生效，会直接显示出来。这样，最终显示的文字依然是按照 HTML 书写的顺序一字排列的，`rp` 中的内容显示出来正好可以作为文本内容与旁注内容之间的分割符号，让读者可以区分出文本与旁注，不至于产生混淆。

### rt

`rt` 是 Ruby Text 的缩写，用于为文字提供旁注。这个标签必须是 `ruby` 的子标签才可以生效。

如果没有 `rb` 标签，那么 `rt` 旁注的对象是这个标签前紧跟着的内容，而旁注的具体内容写在这个标签里面；如果存在 `rb` 标签，那么每一个 `rt` 标签会和 `rb` 标签一一匹配，一段文字配一段旁注。（具体匹配见下文 `rb` 的介绍内容）

### rb

`rb` 是 Ruby Base 的缩写，用于注明被标注的对象。一般来说，`ruby` 标签内的文字，如果不包裹其他标签，本身就是被标注的对象，和额外套一个 `rb` 标签的效果是一样的。这里之所以再提供一个标签，是为了对被标注的对象做进一步的拆分，同时又不打乱原来的显示顺序。以上面的例子来说，如果没有 `rb` 标签，如果需要对文字做旁注，要写：

```html
<ruby>
注<rp>(</rp><rt>zhù</rt><rp>)</rp>
音<rp>(</rp><rt>yīn</rt><rp>)</rp>
</ruby>
```

如果有了 `rb` 标签，就可以将文字和旁注分别写在一起，而不用穿插着写：

```html
<ruby>
<rb>注</rb><rb>音</rb>
<rp>(</rp>
<rt>zhù</rt><rt>yīn</rt>
<rp>)</rp>
</ruby>
```

这样，最终的文字流是 `注音(zhùyīn)` 而不是 `注(zhù)音(yīn)`。`rt` 不需要紧跟着出现在 `rb` 的后面，可以先写完 `rb` 然后再按顺序写对应的 `rt`。最终的文字流结果更符合日常的使用习惯。

理论上来说，每一个 `rb` 标签都对应一个 `rt` 标签，对应的顺序是 `rb` 和 `rt` 标签分别出现的顺序。如果 `rb` 的数量少而 `rt` 多，那么多余的 `rb` 就会分配到空的 `rt`；如果 `rt` 少而 `rb` 多，最后一个 `rt` 会被应用到所有多余的 `rb` 上。

### rtc 与 rtb

`rtc` 是 Ruby Text Container 的缩写，`rtb` 是 Ruby Base Container 的缩写。

有的时候，一个文字可能需要多个旁注。比如，一个注音，一个注释。这个时候，就需要用到 `rtc` 和 `rbc` 了。

`rtc` 可以对 `rt` 进行分组。默认情况下，`ruby` 标签下的 `rt` 都是在同一个分组中，分别一一对应到给定的基础文字上。使用 `rtc` 标签可以额外创建新的分组，在 `rtc` 标签下的 `rt` 会重新一一分配到基础文字上去对应，而不受已有 `rt` 分配的影响。

此外，如果两套注解需要的匹配规则是不同的，那么就需要用上 `rbc` 对 `rb` 进行分组了。上文提到，一般情况下 `rt` 会一一对应到 `rb` 上去。这在注音系统里非常方便，但是对于注释来说就不方便了，因为几个字可能同属于一个意思，无法像注音一样拆分。使用 `rbc` 对 `rb` 分组后，对于不在 `rbc` 标签内的其他标签来说，会把这个 `rbc` 中的内容看作是一块基础文字。这样，外部的 `rt` 就可以对整个文字做注释了。

举个例子：

```html
<ruby lang="zh-Hant" style="ruby-position: under;">
  <rtb>
  <rb>旧<rb>金<rb>山<rp>(<rt>jiù<rt>jīn<rt>shān<rp>)
  <rtb>
  <rtc lang="en" style="ruby-position: over;">
    <rp>(<rt>San Francisco<rp>)
  </rtc>
</ruby>
```

在这个例子中，`rt` 给出了旧金山的拼音，同时 `rtc` 定义了一个新的注释，用于给出“旧金山”的英文名。在这里，注音系统是对每一个汉字单独注音的，一个 `rb` 对应一个 `rt`。但是对于 San Francisco 这个英文名来说，应该被整体应用到“旧金山”三个字上，而不是其中的任意一个字上。由于注音系统的需要，这里的每一个字已经用 `rb` 做了拆分。如果不使用 `rbc` 标签将这三个文字打包在一起，最终 `rtc` 里的文字会被应用到第一个字“旧”上，而不是整体的“旧金山”上。这是因为，根据规则，一个 `rt` 对应一个 `rb`，多余的 `rb` 会被赋予空的 `rt`（具体见之前的内容）。`rbc` 的功能就是将三个 `rb` 合并成一个，让 `rtc` 中的 `rt` 可以直接匹配。

### 简写

在上例中，已经用到了简写的规则。这里，出于书写方便的考虑，上面介绍的这些 `ruby` 中的子标签，都可以只写开始的标签而省略闭合标签，如只写 `<rt>` 而不写 `</rt>`。程序会在匹配到下一个标签的时候，自动闭合上一个标签。举例来说，

```html
<ruby>
<rb>注</rb><rb>音</rb>
<rp>(</rp>
<rt>zhù</rt><rt>yīn</rt>
<rp>)</rp>
</ruby>
```

可以写成

```html
<ruby>
<rb>注<rb>音<rp>(<rt>zhù<rt>yīn<rp>)
</ruby>
```

两者是等价的。

### ruby-position

`ruby-position` 是 CSS 中的一个属性，目前仍然处于草案的阶段。根据目前给出的[定义](https://drafts.csswg.org/css-ruby/#rubypos)，该属性可以配置的值有三种，分别是 `over`，`under` 和 `inter-character`。

`over` 会将旁注放置于文字的上方，对于文字是竖排排列的情况，则会将旁注放置于文字的右侧。

`under` 会将旁注放置于文字的下方，对于文字是竖排排列的情况，则会将旁注放置于文字的左侧。

`inter-character` 主要是为台湾地区的繁体字注音设计的。在这种模式下，注音会被放置于文字的中间，且注音的部分会强制使用 `vertical-rl` 来显示。

目前，Firefox 支持了 `over` 和 `under` 两种属性，`inter-character` 还没有得到支持。

### ruby-align

`ruby-align` 是 CSS 中的一个属性，同样处于草案阶段。根据目前给出的[定义](https://drafts.csswg.org/css-ruby/#rubypos)，该属性可以配置的值有四种，分别是 `start`，`center`，`space-between` 和 `space-around`。

这里几个属性的具体效果，可以参考 `flex` 中，`justify-content` 的属性展示效果。在对应基础文字的总宽度内，旁注文字可以选择<ruby>前对齐<rp>(</rp><rt>start</rt><rp>)</rp></ruby>，<ruby>居中<rp>(</rp><rt>center</rt><rp>)</rp></ruby>，<ruby>旁注间空白均匀分布<rp>(</rp><rt>space-between</rt><rp>)</rp></ruby>或<ruby>旁注每个元素均匀分配空间<rp>(</rp><rt>space-around</rt><rp>)</rp></ruby>。
