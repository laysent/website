---
title: 使用 N-API 移植现有 C 语言库
date: 2019-01-19
modified: 2019-02-10
tags: Node.js, JavaScript
category: Node.js
description: 如何使用 N-API 与 node-gyp，将一个现有的 C 语言库移植为 Node.js 可直接运行的 C/C++ 插件
---

本文主要介绍将 Skype 开源的 SILK v3 解码器从 C 语言库移植到 Node.js 环境的流程，主要用到了 node-gyp 以及 Node.js 提供的 N-API。移植后的包可以在[这里](https://www.npmjs.com/package/silk-sdk)找到 ，同时在 [GitHub](https://github.com/laysent/silk-sdk) 开源了代码。

## 目的

原 C 语言库的目录如下

+ api：存放了开放接口的三个对应文件，分别是 encode，decode 和 compare
+ doc：文档
+ interface：SDK 公开的 API 对应头文件存放位置
+ src：SDK 代码的存放位置

这次主要需要做的，就是将 `api` 目录（在原库中，为 `test` 目录）下的三个 CLI 功能以 C/C++ 插件的形式，提供给 Node.js 直接调用。

## 创建项目

在 `package.json` 中，需要配置 gypfile 并设置为 `true`，以指明程序去寻找 `binding.gyp` 文件。scripts 中的 install 命令，会在 npm 包安装完之后进行，用于将源文件编译成平台相关的二进制包，用于后续的使用。具体如下：

```json
{
  "gypfile": true,
  "scripts": {
    "install": "node-gyp rebuild"
  }
}
```

另外，需要创建 `binding.gyp` 文件，内容配置如下：

```json
{
  "targets": [
    {
      "target_name": "编译结果的名字",
      "sources": ["所有用到的源文件"],
      "include_dirs": ["所有头文件所在的目录"]
    },
  ]
}
```

以 SILK SDK 为例，target\_name 设置为 silk，这样最终编译出来的结果就是 `silk.node` 文件；sources 中需要把所有用到的 `.c` 文件都列举出来，在本例中就是 `api` 和 `src` 文件夹下的所有 `.c` 文件；include_dirs 指明了项目需要去哪里找头文件，在本例中就是 `interface` 和 `src` 两个目录。最终的结果可以查看[这里](https://github.com/laysent/silk-sdk/blob/master/binding.gyp)。

至此，node-gyp 已经可以正确编译了。运行如下代码可以查看编译是否成功

```bash
npm run install
```

或者

```bash
node-gyp clean configure build
```

然而，此时虽然编译可以成功，但是由于没有公开任何接口，引用编译结果还什么都不能做。

## 公开接口

对于 JavaScript 的代码来说，可以使用 `module.exports = xxx` 将接口公开；对于 C/C++ 的插件来说，也有类似的处理方法。参考的代码如下：

```c
#include <node_api.h>
#include <assert.h>

/**
 * 这里定义一个宏，方便函数方法的导出
 */
#define DECLARE_NAPI_METHOD(name, func)                          \
  { name, 0, func, 0, 0, 0, napi_default, 0 }

/**
 * 这里定义了一个导出方法的入口函数
 * @param {napi_value} env - 这个是 N-API 方法调用需要用到的上下文数据
 * @param {napi_callback_info} info - 可以用此拿到函数调用参数的具体信息
 * @returns {napi_value} - 函数的返回值，在 JavaScript 中可以直接使用
 */
napi_value Decode_Entry(napi_env env, napi_callback_info info) {
  return NULL;
}

/**
 * 初始化函数，主要用于注册开放的接口
 * @param {napi_value} env - 这个是 N-API 方法调用需要用到的上下文数据
 * @param {napi_value} exports - 这个等价于 JavaScript 模块中用到的 `module.exports` 对象
 * @param {napi_value} 将 `module.exports` 对象返回
 */
napi_value Init(napi_env env, napi_value exports) {
  napi_status status;
  /**
   * 这里定义 `module.exports` 的具体属性值。
   * 在这个例子中，"decode" 是 JavaScript 中实际能用到的接口名字，
   * 而 Decode_Entry 是 C 中对应的函数名。
   * 在实际使用的时候，`require('silk-sdk').decode()` 可以调用这个导出的接口。
   */
  napi_property_descriptor desc[] = {
    DECLARE_NAPI_METHOD("decode", Decode_Entry),
  };
  /**
   * 将这些属性值赋值到 `exports` 中
   * 如果赋值成功，函数返回 napi_ok
   */
  status = napi_define_properties(env, exports, 1 /* 总共定义的属性数量 */, desc);
  assert(status == napi_ok);

  return exports;
}

/** 模块注册 */
NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```

至此，公开接口已经注册成功了。编译完成之后，模块将导出一个 `decode` 接口，可以使用如下的 JavaScript 代码来直接调用：

```javascript
const silk = require('sdk-silk');

silk.decode();
```

### 读取参数

以下的代码，可以从给定的 `napi_callback_info` 中提取出参数列表：

```c
size_t argc;
napi_value args[2]; // 这里假定最多两个参数

status = napi_get_cb_info(env, info, &argc, args, NULL, NULL);
assert(status == napi_ok);
```

其中的 `args` 数组，每一个对应 JavaScript 调用函数时给定的一个参数，而 `argc` 中记录了参数的总数量。使用 `argc` 的数据，可以在给定参数数量不足的时候，抛出异常，参考代码如下：

```c
if (argc < 1) {
  status = napi_throw_error(env, NULL, "Wrong number of arguments.");
  assert(status == napi_ok);
  return NULL;
}
```

需要注意的是，从 `napi_get_cb_info` 获取到的结果，都是 `napi_value` 类型的。这里，一般需要转化为 C 中一般使用的类型，以提供给已有的 C 语言库来进行后续的调用。

#### 值参数转化

对于一般的非对象参数，转化的方法比较简单。这里以 Buffer 类型为例：

```c
napi_status status;
void *buffer;
size_t bufferLength;

status = napi_get_buffer_info(env, args[0], &buffer, &bufferLength);
assert(status == napi_ok);
```

以上代码，将第一个参数的数据，从 `napi_value` 转化为 `void*` 类型。其中，Buffer 的头指针存储在 `buffer` 中，Buffer 的总长度存储在 `bufferLength` 变量里。

其他的值参数转化，可以参考[官方的 API 文档](https://nodejs.org/api/n-api.html#n_api_functions_to_convert_from_n_api_to_c_types)。

#### 对象参数

从对象参数中提取出具体的属性值，可以参考如下代码：

```c{9}
/* 定义变量 */
napi_status status;
napi_value key;
napi_value value;
bool hasPropert = false;
bool quiet = true; // 提供一个默认的值

/* 获取属性名赋 */
status = napi_create_string_utf8(env, "quiet", strlen("quiet"), &key);
assert(status == napi_ok);

/* 检查对象中是否有该属性定义 */
status = napi_has_property(env, args[1], key, &hasProperty);
assert(status == napi_ok);

if (hasProperty) {
  /* 读取属性值 */
  status = napi_get_property(env, args[1], key, &value);
  assert(status == napi_ok);

  /* 将属性值转化为基础类型 */
  status = napi_get_value_bool(env, value, &quiet);
  assert(status == napi_ok);
}
```

这里需要注意的是，`napi_has_property` 与 `napi_get_property` 都不直接接受字符串作为属性名，需要现将属性名转化为 `napi_value` 类型之后才可以使用（参考上述代码的高亮标注行）。直接使用字符串作为属性名参数的话，程序会出错。

### 返回结果

与获取参数类似，C 中的基础类型也不能直接作为返回值，需要使用 N-API 提供的接口进行转化。下面展示如何将布尔值转化会 JavaScript 中可以识别的布尔值：

```c
bool result = true; // 待转化的布尔值
napi_value ret;

status = napi_get_boolean(env, result, &ret);
assert(status == napi_ok);

return ret;
```

类似的，下面展示如何将一段数组转化为 JavaScript 中可以识别的 Buffer：

```c
size_t size = 100; // 数组的长度
void *output; // 待转化的数组

napi_status status;
napi_value result;

status = napi_create_buffer_copy(env, size, output, NULL/* 复制后数据的头指针 */, &result);
assert(status == napi_ok);

return result;
```

## JavaScript 层的封装

在完成了 C 插件部分的代码之后，还需要用 JavaScript 对代码做一层封装。这里主要是出于两个方面的考虑：

1. 从上述代码不难看出，使用 N-API 去做 JavaScript 和 C 之间的变量转化是相对繁琐的。为了给 npm 包提供更丰富的 API，可以将参数的转化、判断部分交给 JavaScript 来做，将处理后的结果移交给 C 来处理。这样，C 部分就不需要提供多态的 API 了，代码更简单。
2. node-gyp 的编译结果，在不同的平台/编译配置下，可能会被放到不同的位置。一般会使用 `bindings` 这个 npm 库来间接引用。

参考代码如下：

```javascript
/* 使用 bindings 正确的引用二进制结果 */
const silk = require('bindings')('silk.node');

function decode(...args) {
  /*
   * silk.decode 是 C 插件提供的接口，
   * 这里可以针对参数/返回值做一些额外的处理
   */
  return silk.decode(...args);
}

/* 导出封装后的接口 */
module.exports = { decode };
```

最后，需要在 `package.json` 中指明这个文件作为调用的入口文件即可：

```json
{
  "main": "index.js"
}
```
