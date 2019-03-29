---
title: Subresource Integrity
date: 2019-01-06
modified: 2019-03-29
tags: Web, JavaScript
category: Web
description: Subresource Integrity (SRI) 的基本用法、目的、行为，以及配合 Preload，Prefetch 等一同使用时的注意事项
---

> [在线演示](https://laysent.github.io/subresource-integrity-demo/index.html)

当前，大量的前端引用资源文件是放在 CDN 上进行加速的。因为文件不存放在自己的服务器上，这些文件的安全性实际上是交由 CDN 来保证的。攻击者可以利用这一点，诱使用户下载到不正确的脚本，从而达到攻击的手段。诱使的方法多种多样，比如 DNS 污染，或者直接攻陷 CDN 服务器从而篡改服务器上的文件内容等。

注意到，TLS 也好，HSTS 也好，pinned public keys 也好，这些手段都只能保证用户是和指定的服务器在进行沟通，但是不能保证用户使用了指定的文件内容。攻击者如果不动服务器，只是单纯的修改服务器上的文件内容，那么这些防范手段就都失效了。

为了防止文件层面的安全问题，integrity 提供了浏览器层面的资源文件校对功能，以确保真正使用到的资源文件都是没有被篡改的（如插入挖矿代码）。

## 使用

（[在线演示](https://laysent.github.io/subresource-integrity-demo/integrity.html)）

在资源文件中，可以加上 integrity 属性，用于指明文件的校验码。例如：

```html
<script
  src="http://example.com/example.js"
  integrity="sha384-correct+hash+here"
  crossorigin="anonymous"
></script>
```

integrity 属性，主流浏览器都是支持的，包括最新版的 Chrome，Firefox，Edge，Safari，Opera 等。但是 Internet Explore 不支持。具体的支持列表见 <https://caniuse.com/#search=sri>。

### integrity

在上面的例子中，`sha384-` 指明了 hash 值的具体类型（目前可以使用的值包括 `sha256`, `sha384`, `sha512`）。之后的字符串是具体的 hash 值。integrity 属性可以一次性指定多个 hash 值，用空格分隔就可以了。例如 `integrity="sha256-xxx sha384-xxx sha512-xxx"`。需要注意的是，当多个 hash 值一同给出时，浏览器会以 `sha512` > `sha384` > `sha256` 的顺序选择提供结果中强度最大的来使用。如果这个结果是正确的，那么验证通过；否则验证失败，不论其他的结果是否是正确的。另外，如果给出的算法是浏览器不能识别的，那么这个对应的 Hash 值就会被忽略，不会直接报错。

举例来说，如果 `integrity="sha256-correct sha512-wrong sha1024-correct"` 是提供的 integrity，那么 `sha512` 会被浏览器采纳使用。而由于 `sha512` 的结果是错误的，所以资源加载失败，此时 `sha256` 的结果并没有被考虑。同时，`sha1024` 的结果被浏览器忽略了，因为暂时没有支持这样的算法。这里这么设计，主要是出于浏览器的兼容性考虑。当开发者为一个资源提供了多个 Hash 值后，新的浏览器可以自动匹配最新的算法验证结果，而对于老的浏览器来说，老的算法虽然可能有缺陷，但依然可以使用。

同时，如果提供的 hash 值中包含多个同类型的结果，那么只要其中任意一个是正确的，最终的校验结果就是正确的。举例来说，如果 `integrity="sha512-wrong sha512-correct"` 是提供的 integrity，那么最终浏览器会确认校验成功，因为第二个值是正确的。这里这么设计的原因，主要是考虑到一个 URL 地址可能在不同情况下对应不同的资源文件。开发者可以一次性给出所有可能情况的 Hash 值，浏览器会自行判定最终的结果是否正确。

### CORS

在使用 integrity 的时候，往往需要配合 `crossorigin="anonymous"` 一同使用。这是因为，integrity 的主要目的，是为了确保第三方资源加载时的正确性。而浏览器如果需要检查一个跨域文件的 hash 值是否是正确的，需要资源在加载的时候，以 `crossorigin="anonymous"` 方式声明，同时需要对方服务器的确认（即，在 HTTP 头中提供正确的 `allow-control-allow-origin`）。可以试想一下，如果没有这样的要求，会造成怎样的安全隐患：如果一个资源文件在用户登陆前与登陆后会提供不同的内容，那么黑客就可以通过加载这个资源文件并带上 integrity 的方式来判断当前用户是否登陆；亦或者，如果一个请求的返回值是当前用户的登录名和密码，那么黑客可以通过暴力穷举的方式来生成大量可能的用户名与密码组合，计算出对应的 Hash 值，并利用 integrity 来要求浏览器检验是否正确，从而猜出原始的内容。这些内容，在没有服务器允许的情况下（`allow-control-allow-origin`），本来是不会告知给前端使用者的。

如果加载的资源文件不存在跨域问题，那么这里的 `crossorigin="anonymous"` 是非必须的。但是在非跨域情况下，integrity 的设置也没有太大意义。

### HTTP(s)

integrity 并不强制在 HTTPs 环境下使用，即使是 HTTP 环境下也是可行的。然而，需要注意的是，在 HTTP 环境下使用 integrity 本身的意义并不是非常的大。理由很简单，对于 HTTP 这样不安全的环境来说，攻击者可以很轻松的修改内容，包括修改 integrity 的值，或是干脆直接删除。这样，integrity 就只是一种摆设了。

### Proxies

既然需要对文本的内容做检查，那么就必须确保传输的过程中内容没有被篡改。一般可以考虑几个方案：

1. 修改内容的时候把 integrity 也一并修改了；
2. 不允许修改内容，在 `Cache-Control` 中增加 `no-transform` 的字段。

## 行为

当遇到资源文件的加载带有 integrity 属性时，浏览器会首先下载这个资源文件，然后用指定的算法对资源文件的内容（一般不进行 encoding）进行计算，得出最终的 Hash 值，并与原先设置的值进行比较。如果比对成功，那么这个脚本/样式文件会被执行；如果比对失败，那么文件不会被执行，`network error` 会被抛出。这里，在 console 中可以看到具体的报错信息。但是出于隐私的考虑，在 JavaScript 代码中，报错不会提供详细的信息，只会告知 `network error`。

### Preload

（[在线演示](https://laysent.github.io/subresource-integrity-demo/integrity-and-preload.html)）

根据 <https://github.com/w3c/preload/issues/127> 和 <https://github.com/w3c/webappsec-subresource-integrity/issues/26> 的描述，Chrome 浏览器在处理 preload 和 integrity 配合使用的资源上存在问题。简单来说，当 preload 加载的时候，资源就已经被编译解析了，而原始的文本资源被丢弃。因此，当浏览器之后运行到具体的资源加载语句的时候，由于没有了原始文本，就无法计算具体的 hash 值，也就无法确认 integrity 是否正确，只能不得已重新请求一次。而最终使用的是第二次请求的资源，preload 的结果会被丢弃，Chrome 也会在 console 中给出 warning。

> A preload for 'xxx' is found, but is not used due to an integrity mismatch.

试验了一下，Safari 似乎没有相同的问题。Firefox 本身还不支持 preload。如果在 `about:config` 中将 Firefox 的 `network.preload` 功能打开，那么 Firefox 的表现行为看上去和 Chrome 是相同的，但由于没有足够的信息，尚不清楚实际上是否和 Chrome 一样，最开始 preload 的资源被遗弃了。

另外，在跨域的请求中，如果实际请求资源的时候有 `crossorigin="anonymous"`，那么 preload 需要提供同样的 `crossorigin="anonymous"`，否则资源文件依旧会被请求两次，无论是否有 integrity。

### Prefetch

（[在线演示](https://laysent.github.io/subresource-integrity-demo/integrity-and-prefetch.html)）

prefetch 的优先级比 preload 低很多，行为也有所不同。对于 prefetch 来说，下载完成的文件会被存储在 cache 中，当实际文件请求到的时候，会生成一次请求，并从 cache 中把文件取出来使用。是否有 integrity 对此行为不会造成影响。

## 生成

使用下面的 node.js 代码可以生成具体文件对应的 hash 值：

```javascript
const crypto = require('crypto');

crypto.createHash('sha256').update(content, 'utf8').digest('base64');
```

同样，也可以使用 [Web App](https://laysent.github.io/sri-hash-generator/) 来在线生成文件的 integrity 值。

## Content-Security-Policy

（[在线演示](https://laysent.github.io/subresource-integrity-demo/content-security-policy.html)）

在 HTTP 头中增加 `Content-Security-Policy` 的设置，可以要求浏览器强制对加载的脚本/样式文件进行校验。例如

+ `Content-Security-Policy: require-sri-for script;` 可以对脚本文件进行校验
+ `Content-Security-Policy: require-sri-for style;` 可以对样式文件进行校验
+ `Content-Security-Policy: require-sri-for script style;` 可以同时对脚本和样式进行校验

注意，无论是否设置了上述 HTTP 头，浏览器都会对拥有 integrity 属性的资源进行校验。这里当 HTTP 头设置了之后，会强制让没有设置 integrity 属性的资源文件加载失败。可以作为一个调试工具来检查是否有遗漏的内容。

如果不在 HTTP 头中带这一条，也可以在 HTML 中增加如下的代码，能达到同样的效果：

```html
<meta http-equiv=Content-Security-Policy content="require-sri-for script style">
```

这个 HTTP 头的校验功能，在当前版本（Chrome 70）中还未被默认打开。这意味着，即使请求带有以上任何一种 HTTP 头，Chrome 也不会对 HTML 中引用的资源文件做强制校验。当 Chrome 监测到以上的任意一种 HTTP 头之后，会在 console 中输出：

> The Content-Security-Policy directive 'require-sri-for' is implemented behind a flag which is currently disabled.

如果需要让 Chrome 运行检测，需要访问 <chrome://flags/#enable-experimental-web-platform-features>，并打开实验功能。

Firefox 和 Safari 暂时不支持该功能。

## 注意

在使用 `webpack` 的 `hot-reload` 功能，或是使用 proxy 服务器对资源文件进行替换的时候，如果有 integrity 会导致使用失败。`hot-reload` 需要保证每次资源的变动都重新计算出正确的 integrity 值，才能保证使用；proxy 服务器需要首先修改 html 中的内容（比如直接去掉 integrity，然后才能保证之后修改资源文件依然可以使用）。

`webpack` 可以使用 `webpack-subresource-integrity` 插件来完成自动编译 integrity 的功能：<https://github.com/waysact/webpack-subresource-integrity>

## 参考

<https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity>

<https://github.com/waysact/webpack-subresource-integrity>

<https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf>

<https://w3c.github.io/webappsec-subresource-integrity/>
