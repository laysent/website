---
title: Subresource Integrity 出错时的处理方案
date: '2019-03-27'
tags: 'Web, JavaScript'
category: Web
description: >-
  Subresource Integirty (SRI)
  会在资源文件不匹配的情况下加载失败，从而影响用户正常使用。本文介绍当出现这种情况时，如何将问题记录并汇报给预警服务器，并启用备用资源文件保证用户的正常使用。
modified: '2019-03-27'
---

> [在线演示](https://laysent.github.io/subresource-integrity-demo/service-worker/integrity-with-service-worker-and-inserted-resource.html)

本文主要介绍，当含有 `integrity` 的文件加载失败时，可行的处理方案。

## Subresource Integrity 的问题

SRI 的目的是为了校验第三方资源文件。当第三方资源文件被篡改的时候，浏览器会拒绝有风险文件的加载，从而保护用户不会受到来自不明代码的安全威胁。

然而，当浏览器拒绝加载有风险的文件时，不仅风险被隔绝了，原有的功能也被隔绝了。这意味着部分、甚至全部的功能丧失（因为放在第三方的资源文件一般是底层的依赖库）。这显然不是一个良好的用户体验。为此，有两个问题亟待解决：

1. 如何及时发现这个问题
2. 如何保证客户的功能使用不受到影响

## 如何及时发现问题

有几个可行的思路。

首先，可以考虑使用 JavaScript 来加载资源文件。这样加载的同时可以附加一个 `onerror` 的事件，当加载失败的时候，就可以得到回调。这样做的好处是，方案是不依赖于具体资源文件的通用方案；但是缺点是，动态加载的资源文件使得浏览器无法在加载 HTML 的时候静态分析，加载效率会受到影响。示例代码：

```javascript
const script = document.createElement('script');
script.src = 'src here';
script.type = 'text/javascript';
script.onerror = () => { /* 资源加载失败了 */ }
document.body.appendChild(script);
```

其次，也可以通过 JavaScript 去检查某些功能点，以确保资源被正确加载了。举例来说，如果要检查 `jQuery` 是否被正确加载了，可以这样做：

```javascript
const isJQueryLoaded = typeof window.jQuery !== 'undefined';
```

这样做的好处是，不需要使用动态加载的方案，可以尽享浏览器能提供的加速服务；然而缺点是，不同的资源文件，检查点是不同的，无法提供一个通用的解决方案。同时，如果资源文件是使用 `defer` 或 `async` 加载的，那么检查的时间点也不好控制。对于 `defer` 的文件，尚且可以在 `DOMContentLoaded` 事件后做检查；而 `async` 类型的资源加载完成点更加不可控，需要在 JavaScript 文件 `load` 事件之后检查才行。

## 如何保证功能

在检查到问题之后，为了不影响功能的使用，可以考虑立即加载一个备用资源。一般来说，这个备用资源是存放在自有服务器，而不是 CDN 服务器上的。这是因为，自有服务器是可自控的，可信赖度会比第三方的要高。如果自有服务器上的文件受到了污染，那么其实前端无论做什么都于事无补了。

示例代码如下：

```javascript
if (typeof window.jQuery !== 'undefined') {
  const script = document.createElement('script');
  script.src = 'jQuery located on own server';
  script.type = 'text/javascript';
  document.body.appendChild(script);
}
```

## Service Worker 的解决方案

Service Worker 提供了对网络请求的代理，这使得一个统一的通用解决方案有望成为可能。

```javascript
/**
 * 这里定义了需要检查对资源文件
 * 以及当资源文件加载出现问题之后，替代文件的位置
 */
const REPLACEMENT_MAPPING = {
  'resource on cdn': 'backup resource on own server',
};

const RESOURCES = Object.keys(REPLACEMENT_MAPPING);

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const { pathname } = new URL(request.url);
  /**
   * 对于不存在备用方案的资源文件，不作处理
   */
  if (RESOURCES.indexOf(pathname) < 0) {
    event.respondWith(fetch(request));
    return;
  }
  event.respondWith(
    fetch(request)
    .catch(() => {
      /**
       * 网络资源请求失败的时候，使用备用资源再请求一次，并将结果返回给前端
       * 对于前端代码来说，这部分逻辑是隐藏的
       * 即是说，前端无法知晓具体使用的是 CDN 还是自有服务器的资源文件，也不需要关心这个
       */
      const linkFromOwnServer = REPLACEMENT_MAPPING[pathname];
      const req = new Request(linkFromOwnServer, request);
      /**
       * 这里可以将问题汇报给服务器预警程序
       */
      console.log('Should notify server here...');
      return fetch(req);
    })
  );
});
```

使用 Service Worker 的解决方案，可以将处理的逻辑从原有的业务逻辑中独立出来。前端的业务逻辑不需要知道具体使用的是哪个服务器上的代码，也不需要关心。

然而，从实际的测试上来看，不同的浏览器对这里 Subresource Integrity 的行为略有不同。（可以用不同的浏览器在[这里](https://laysent.github.io/subresource-integrity-demo/service-worker/integrity-with-service-worker-and-inserted-resource.html) 进行测试）

具体来说，在 Chrome 里，如果资源文件是通过 HTML 直接引用的，Service Worker 无法捕捉到 `fetch` 的异常，`fetch` 请求中也没有 integrity 属性。但是对于使用 JavaScript 动态插入的资源引用，Chrome 的 Service Worker 可以正确处理，`fetch` 中也可以查看到 `integrity` 的属性。

对 Firefox 来说，无论资源文件是通过 HTML 直接引用的，还是通过 JavaScript 动态加载的，Service Worker 都可以正确捕获到异常并处理。

Safari 的情况比较怪异，对于 HTML 直接引用的资源文件，Service Worker 可以正确处理其中的样式资源文件，但是无法处理脚本文件；对于使用 JavaScript 动态插入的资源引用，Safari 的 Service Worker 都可以正确处理。
