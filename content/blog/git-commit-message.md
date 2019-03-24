---
title: Git Commit Message
date: '2019-03-24'
modified: '2019-03-24'
tags: Tools
category: Tools
description: 介绍 Git Commit Message 规范与实践
---

一份好的 Git Commit，可以极大的帮助他人（包括几个月后的自己）理解代码改动。如果是团队工作，好的 Git Message 格式更可以统一形式，提高团队协作的效率。本文将从写好 Git Commit 的目的出发，探讨两个问题：什么样的 Git Message 才能被称作是好的？如何统一团队的 Git Message 形式？

## 什么样的 Git Commit 是合适的

简单来说，Git Commit Message 应该是解释性的。通过阅读 Git Commit Message，应该可以了解到以下信息：

1. 这是一个什么样的修改？例如，这是一个 Bug 修复，新功能还是文档修改？
2. 这个修改大概影响的范围是哪些？
3. 这个修改的目的是什么？

当一份解释性 Git Commit Message 包含足够的信息，那么就可以用于快速地搜索、定位改动。例如下面地命令可以查找出所有和聊天相关地新功能改动：

```sh
git log HEAD --grep feat(chat)
```

同时，规范的 Git Commit Message 也让 Changelog 自动生成成为了可能。

一份[约定式提交](https://www.conventionalcommits.org/zh/v1.0.0-beta.3/)大概结构如下：

```plain
<类型>[可选的作用域]: <描述>
<空行>
[可选的正文]
<空行>
[可选的脚注]
```

其中，`类型`包含以下类别：

+ `build`：针对编译系统或外部依赖的修改，例如修改了 `webpack` 或 `babel` 的配置，或是升级了某个 `npm` 库
+ `chore`：一些琐碎的改动，例如修改版本号或是修改 `.gitignore` 文件之类的
+ `ci`：针对 CI 系统配置的修改，例如修改了 `Travis` 或 `Circle` 的配置文件
+ `docs`：只针对文档的修改
+ `feat`：添加新的功能
+ `fix`：修复 Bug
+ `perf`：针对性能提升的优化
+ `refactor`：代码重构的改动，既没有修复 Bug 也没有添加新功能
+ `revert`：回滚之前的改动
+ `style`：仅仅是针对代码格式的改动，如修复一些 `ESLint` 的报错
+ `test`：针对测试的改动，如添加新的测试或是修复已有测试的问题

**可选作用域**用于说明当前修改的影响范围。这里的描述一般根据项目不同，会有差异。选填，可以没有。

**描述**用于简短的描述当前修改的主要内容，长度不超过 50 个字符。（见 [50/72 Formatting](https://stackoverflow.com/questions/2290016/git-commit-messages-50-72-formatting)）

**正文**作为描述的补充，可以提供额外的信息。如果内容比较多，需要注意换行的问题。一般不建议 Commit Message 过长。例如，在 VSCode 中，一行 Commit Message 最长为 72 个字符。另外，从规范语言的角度来说，如果是英文 Commit Message，建议使用第一人称现在时，动词用原型即可。举例来说，写 `fix` 而不是 `fixes` 或者 `fixed`。

**脚注**是描述的一些补充说明。主要有两种：

1. 不兼容改动：如果内容包含了不兼容的改动，需要用 `BREAKING CHANGE` 开头，后面可以补充说明当前不兼容变更的细节、理由以及升级的方案。
2. Issues：如果修改有对应的 Issue，那么可以带上相应的 ID，方便后续查找。以 `ISSUE` 开头，后面跟随一个或多个 Issue ID，如 `ISSUE #123 #456`。

## 团队如何规范

Git 提供了 Commit Template 配置，可以在每次写 Git Commit Message 的时候显示，提醒 Git message 的书写格式规范。

为了配置 Git Commit Temlate，首先在个人目录下生成 `.gitmessage` 文件，参考内容如下：

```plain

# <type>[optional scope]: <description>
# build/chore/ci/docs/feat/fix/perf/refactor/revert/style/test
# |<----  Using a Maximum Of 50 Characters  ---->|

# Optional body, explains why this change has been made
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|


# Optional footer
# List related issue here and/or inform breaking change if any
# Example:
# ISSUE #xxx
# BREAKING CHANGE: xxxx (what changed, why, how to upgrade)
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|

# --- COMMIT END ---
# Type can be 
#    build    (change of build system or dependencies)
#    chore    (other changes, such as version upgrade, etc.)
#    ci       (change of CI system configuration)
#    docs     (changes to documentation)
#    feat     (new feature)
#    fix      (bug fix)
#    perf     (improve performance of code)
#    refactor (refactoring production code)
#    revert   (revert specific changes made before)
#    style    (formatting, missing semi colons, etc; no code change)
#    test     (adding or refactoring tests; no production code change)
# --------------------
```

接下来，配置个人目录下的 `.gitconfig` 文件，增加：

```plain
[commit]
  template = ~/.gitmessage
```

这样，在新编写一个 Git Commit Message 的时候，就会看到相应的模版提示了。

然而，使用模版文件，有两个问题：一方面，处于安全方面的考虑，Git 的配置并不是共享的。在团队工作的过程中，上述模版文件并不能非常容易的传播给每一个潜在的代码贡献人。另一方面，模版文件并不是一个强制性的检查，只是一个建议。不满足要求的 Commit Message 依然有可能被签入。

为此，可以结合 Lint 工具来检查每一次签入的 Message；同时，使用 Hook 配置来保证团队成员在签入代码前，都可以得到相同配置的 Lint 检查。

对于 Lint 来说，可以使用 [commitlint](https://github.com/conventional-changelog/commitlint) 和 [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)。

安装

```sh
yarn add --dev @commitlint/config-conventional @commitlint/cli
```

增加 `commitlint.config.js`，内容如下：

```javascript
module.exports = {
  extends: [
    '@commitlint/config-conventional'
  ],
};
```

同时，对于团队来说，可以使用 Husky 来共享 Git Hook 的配置，从而达到共享 Lint 检查的目的。

安装

```sh
yarn add --dev husky
```

配置 `package.json`

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }  
  }
}
```

至此，Git Hook 就配置完成了。其他人在拿到代码并 `npm install` 之后，便会有 Husky 安装好必要的 Hook。之后，每一次的提交，commitlint 都会在本地做文本检测。

当然，最好可以在 CI 系统中也做一次配置，在真正意义上保证最终签入文字是符合规范的，杜绝前端绕过检测的可能性。
