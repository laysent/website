---
title: Web 应用的 Alias 配置
date: '2019-04-16'
modified: '2019-04-17'
tags: 'Tools, JavaScript'
category: Tools
description: 本文主要介绍一个 JavaScript / TypeScript 项目中，可以用到的各种 alias 配置
---

## 什么是 alias

在一个大型 web 项目中，往往目录结构非常深。如果一个文件需要引用另一个不相邻的文件，很可能需要写非常多的 `../` 来完成相对引用。这样的引用并不雅观，也很难从直观上看出来具体引用的位置在哪里。同时，一旦当前的文件位置发生了变化，很可能会破坏原来的相对引用路径。

相较于相对路径，绝对路径可以很好的解决上述问题。一方面文件目录的改动不会破坏引用（因为被引用的目录位置不变），另一方面代码也更加的直观，一看就知道被引用的文件在什么位置。

当然，真正意义上的绝对路径也是没有必要的。毕竟项目创建的位置多种多样，程序不应该关心项目本身的路径。这里的“绝对路径”只需要从项目的根目录，或者从项目源文件 src 的路径为止开始算起就可以了。

这就轮到 `alias` 出场了。项目中可以为项目的根目录定义 `alias`，这样在引用的时候就可以直接写绝对路径，而不需要再写各种 `../` 的代码了。举例来说，可以定义 src 目录的 `alias` 就是 `src/`，这样只需要写 `src/xxx/yyy/zzz` 就可以直接引用 `src` 目录下 `xxx/yyy/zzz` 的文件了。当然，`alias` 的定义多种多样，比如也可以用 `@/` 来作为 `src` 文件夹的 `alias`。

## 如何配置

`alias` 是需要配置的，不同的工具需要的配置位置与方式各不相同。下面简单总结了 JavaScript 与 TypeScript 项目可能用到的各种 `alias` 配置。

### Webpack

在 Webpack 的配置文件中，可以写：

```javascript
{
  // ...
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'), // path of src folder
    },
  },
  // ...
}
```

### TypeScript

在 `tsconfig.json` 中，可以写

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "src/*": ["./src/*"]
    }
  }
}
```

这里 `baseUrl` 设置了一个基准的起始位置。在 TypeScript 的项目中，如果一个引用不是相对路径，那么 TypeScript 就会以这个 `baseUrl` 为起始位置来计算路径。`paths` 定义了一些路径的映射关系。上面这个例子里的 `paths` 定义其实是多余的。因为根据 TypeScript 的行为定义，`src/xxx` 的引用路径本来就会从项目根目录开始查找文件。一个更有意义的例子可能是：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Jest

在 `jest.config.js` 中，可以写

```javascript
{
  // ...
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  // ...
}
```

### Eslint

在 `.eslintrc` 中，可以写

```json
{
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "path-to-webpack-config-file"
      }
    }
  }
}
```

这里需要用到一个库，[`eslint-import-resolver-webpack`](https://www.npmjs.com/package/eslint-import-resolver-webpack)。该库会读取指定的 Webpack config 文件，根据其中的配置来同步 Webpack 和 ESLint 中对 alias 的设置。

对于没有使用 Webpack 的工程，也可以使用 [`eslint-import-resolver-custom-alias`](https://www.npmjs.com/package/eslint-import-resolver-custom-alias) 来达到类似的效果：

```json
{
  "import/resolver": {
    "eslint-import-resolver-custom-alias": {
      "alias": {
        "@": "./src",
        "css": "./css"
      }
    }
  }
}
```
