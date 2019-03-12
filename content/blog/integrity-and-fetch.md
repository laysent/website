---
title: integrity & fetch
date: '2019-03-07'
modified: '2019-03-12'
tags: 'JavaScript, Web'
category: Web
description: >-
  这篇文章主要介绍 fetch 中 integrity 字段的用法，以及如何用此功能给其他资源文件提供 integrity 的校验功能（如图片），附带
  React 示例代码。
---

根据目前的 Subresrouce Integrity [规格](https://www.w3.org/TR/SRI/)，当前 `integrity` 只适用于 `HTMLLinkElement` 和 `HTMLScriptElement`。在其中的 Note 里，提到了未来支持其他所有资源类型的可能性：

> A future revision of this specification is likely to include integrity support for all possible subresources, i.e., a, audio, embed, iframe, img, link, object, script, source, track, and video elements.

遗憾的是，目前在这方面还尚未有进展。

虽然 HTML 原生并不支持其他资源类型的 `integrity` 检测，但是 `fetch` API 提供了 `integrity` 的支持，这使得动态加载资源文件的 `integrity` 检测成为了可能。

## Fetch & Integrity

`fetch` 的 API 格式如下：

```plain
Promise<Response> fetch(input[, init]);
```

除了 input 作为第一参数之外，可以提供额外的初始化信息作为第二参数。而这个初始化的信息中，就包括了 `integrity` 属性。示例代码如下：

```javascript
fetch('resource url', { integrity: 'sha256-xxxx', mode: 'cors' });
```

这里，`integrity` 提供的格式，与 Subresource Integrity 在 HTML tag 中使用的格式是相同的，前半部分是具体安全散列算法的名称，后半部分是算法计算出的结果。

同时，需要注意到的是，除了 `integrity` 属性之外，对于跨域请求来说，`mode` 属性也是必须的。这是因为，对于跨域请求来说，如果需要浏览器去判断 `integrity` 是否是正确的，那么就需要浏览器去访问具体的资源内容。对于跨域请求来说，默认这种资源访问是不被允许的，因此需要显示得指定允许跨域资源访问。当然，这就需要第三方服务器显示得允许资源访问。

至此，如果请求资源与给定的 `integrity` 不符合，`fetch` 请求会报错，否则就可以拿到正确的 `Response`，`integrity` 检查完成。

## 后续处理

然而，要真正的使用还需要额外的一步。到目前为止，如果请求的资源文件没有被篡改，那么 `fetch` 就会返回正确的 `Reponse`。然而，`Response` 并不是常见的资源引用的方式。最理想的情况，应该是输入一个 URL，通过 `fetch` 的 `integrity` 检查，最终依然输出一个可以直接使用的 URL 地址。

为此，就需要用到 `URL.createObjectURL` 了。

`URL.createObjectURL` 方法会创建一个 URL 地址，用于指向指定的 `File` 或 `Blob` 资源文件。因此，只需要先通过 `fetch` 请求，然后将 `Response` 转化成 `Blob`，最后用 `URL.createObjectURL` 将 `Blob` 转化为 URL 地址就可以了。示例代码如下：

```javascript
fetch('resource url', { integrity: 'sha256-xxxx', mode: 'cors' })
  .then(response => response.blob())
  .then(blob => URL.createObjectURL(blob))
  /* .then((url) => { img.src = url; }) */
  .catch((error) => { console.error(error); });
```

[在线演示](https://laysent.github.io/subresource-integrity-demo/integrity-and-fetch.html)

## React Example

```jsx
import React from 'react';

function getFetch(src, integrity) {
  return fetch(src, { integrity, mode: 'cors' })
      .then(response => response.blob())
      .then(blob => URL.createObjectURL(blob));
};

const ImageComponent =
  /**
   * 用 React.memo 避免不必要的重复网络请求
   */
  React.memo(({ src, integrity, alt, ...rest }) => {
    /**
     * 用 React.lazy 和 React.Suspense 配合使用，
     * 构造一个 loading & display 的效果。
     * 在 fetch 成功/失败之前，显示 loading 效果；
     * 网络请求完成后再显示结果。
     */
    const Component = React.lazy(
      () => getFetch(src, integrity)
        .then(
          url => ({
            /**
             * React.lazy 需要返回的值是 { default: React.Component } 格式
             */
            default: (props) => {
              React.useEffect(() => () => {
                URL.revokeObjectURL(url);
              }, []);
              return <img src={url} alt={props.alt} {...props} />;
            },
          }),
          error => ({
            default: () => <div>Error: {error.toString()}</div>
          }),
        ),
    );
    return <Component alt={alt} {...rest} />;
  });

const Image = ({ src, integrity, alt, ...rest }) => (
  <React.Suspense fallback={<div>loading...</div>}>
    <ImageComponent src={src} integrity={integrity} alt={alt} {...rest} />
  </React.Suspense>
);
```

## 缺点

以上这种方案，主要存在两个弊端：

1. `fetch` 请求的优先级和 `img` 或其他资源是不同的，`fetch` 的优先级更低。
2. 针对 `fetch` 和其他 HTML 标签发起的请求，浏览器并不会共享缓存（`mode` 不同）。
  这意味着，如果 `fetch` 过后，`img` 再次请求，网络会重复发送，即使内容是一样的。
