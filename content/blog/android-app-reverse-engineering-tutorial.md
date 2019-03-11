---
title: Android App 逆向工程初探
date: 2019-01-20
modified: 2019-03-11
tags: Android, Reverse Engineering
category: Android
description: 这篇文章主要讲关于如何逆向某 Android 程序，并找到网络请求中 querstring 里 signature 计算方法的过程
---

## 背景

这次研究的出发点，是希望可以了解某服务提供商 API 的调用规则，从而可以写一个定制化的服务为个人所用。

通过前期的研究，发现这里的网络请求主要是通过一个 signature 参数对请求的有效性进行验证。如果参数重的 signature 的值不正确，服务器将拒绝返回任何数据。由于网络请求本身对外是透明的，服务提供方为了防止 API 被第三方滥用，往往需要使用各种方法来校验有效性。这个 App 可以在免注册的情况下直接使用，故而一般的账户校验无法进行。这里 signature 是如何计算出来的，服务器又是如何通过校验确认合法性的，是本次研究主要好奇的地方。

本文主要是一些技术尝试的记录，下文中将不提及具体的 App 名称，以免造成不必要的麻烦。

## 前期准备

Android 逆向主要需要用到以下一些工具

+ apktool: [GitHub](https://github.com/iBotPeaches/Apktool)，[下载地址](https://bitbucket.org/iBotPeaches/apktool/downloads/)，可以将 .apk 文件解码
+ smali: [GitHub](https://github.com/JesusFreke/smali)，[下载地址](https://bitbucket.org/JesusFreke/smali/downloads/)，可以将 .smali 文件打包成 .dex 文件
+ ByteCode-Viewer: [GitHub](https://github.com/Konloch/bytecode-viewer/)，[下载地址](https://github.com/Konloch/bytecode-viewer/releases)，可以直接阅读 .dex 文件中的 Java 代码

当然，还需要 Android App 的 .apk 安装文件。这个可以从各大 Android App 平台下载到，或者也可以从各 App 的官网找到对应 .apk 的下载地址。

## 分析步骤

### apk => smali

首先，需要使用 apktool 对拿到的 .apk 文件进行解码：

```bash
./apktool d xxx.apk -o xxx
```

上述命令，将 xxx.apk 文件反编译到 xxx 文件夹内。通过观察解码的结果可以发现，资源文件、配置文件以及代码都被解码出来了。其中，代码部分并不是 java 源码，而是 smali 格式的文件。

> 在执行 Android Java 层的代码时，其实就是 Dalvik(ART) 虚拟机（使用 C 或 C++ 代码实现）在解析 Dalvik 字节码，从而模拟程序的执行过程。
>
> 自然，Dalvik 字节码晦涩难懂，研究人员们给出了 Dalvik 字节码的一种助记方式：smali 语法。通过一些工具（如 apktool），我们可以把已有的 dex 文件转化为若干个 smali 文件（一般而言，一个 smali 文件对应着一个类），然后进行阅读。对于不同的工具来说，其转换后的 smali 代码一般都不一样，毕竟这个语法不是官方的标准。这里我们介绍比较通用的语法。值得注意的是，在 smali 语法中，使用的都是寄存器，但是其在解释执行的时候，很多都会映射到栈中。
>
> [来源](https://ctf-wiki.github.io/ctf-wiki/android/basic_operating_mechanism/java_layer/smali/smali/)

有了 smali 文件之后，其实已经可以开始初步的代码阅读了。

### smali => dex

在 smali 语言不熟悉的情况下，可以借助 smali 工具将文件转化为 dex 文件，并通过 ByteCode-Viewer 来阅读 Java 的代码。具体操作如下：

```bash
java -jar ./smali-2.2.5.jar a xxx.smali yyy.smali zzz.smali
```

这里，可以一次性将一批 smali 文件打包为一个 out.dex 文件。编译出这个结果之后，可以通过 ByteCode-Viewer 打开直接阅读 Java 源码。如果 Android App 的打包包含了混淆，那么最终这里生成的代码结果，函数/变量名很可能是难以读懂的 a、b、c，编译的结果可能有一些错误。总体而言，可以将这个结果和 smali 本身的结果配合使用，方便了解代码的本意。

## 具体分析

逆向的分析，可以从非代码层面开始着手。

以这个 App 为例，通过使用 anyproxy 代理网络请求，可以抓取到具体使用的网络请求 API 地址。通过观察发现，不管是什么样的 API 请求，在 URL 的查询参数中，都有几个固定的参数，一个是 timestamp，一个是 signature。通过修改 URL 查询参数的数据不难发现，无论修改参数中的哪个值，都会导致请求直接失败。由此，不难得出初步的结论，signature 的值是通过 URL 查询参数中的其他值计算出来的，并且由于存在 timestamp 这个参数，导致这个计算结果无法缓存。如果不能找到 signature 的具体计算方法，就无法成功模拟调用 API 成功。

同时，下面列出了几个抓取到的 signature 的值：

+ QeVgI1CAbvkwCR9jdrioSz6BGbZg1tcaXWvokGk6OkU%3D
+ 45k4t1vIzqf%2F5MiERLO4M3WKzl27pT2iXRfgpwohUiA%3D

不难看出，这里的 %2F 以及 %3D 是 URL 编码后的结果。而编码前的值，很可能是 sha256 加密后的结果（因为和 Subresource Integrity 的结果形似，SRI 相关的介绍可以看[这里](https://laysent.github.io/blog/subresource-integrity/)）。

有了以上的初步分析结果，就可以开始正式的代码分析了。一般来说，Android App 由于 apk 很容易获取到，所以发布之前都会经过代码的混淆操作。这里分析的 App 也不例外。如果直接查看 smali 的解码结果，不难发现很多 a、b、c 之类的函数/变量名，很难直观的了解具体到底函数/类是在进行什么样的操作。然而，从前端的经验来说，虽然函数名/变量名很容易进行混淆，但是字符串本身却很少会进行混淆的操作。有了上面关于 URL 参数的分析，可以很容易想到，先通过搜索对应的 URL 参数字符串，找到相关的代码，然后再对具体的内容进行分析。

在抓取到的 URL 参数中，可以发现不少固定的参数，比如上文提到的 signature，timestamp，还有 uuid、appSource 等值。既然猜测 signature 的计算需要用到其他的 URL 参数，那么不妨试着在 smali 代码中搜索 signature 字符串，并找到同时使用到 uuid 或者 appSource 或者 timestamp 的位置。

很快，通过交叉对比，就有两个文件脱颖而出，分别是：

+ smali_classes2/com/xxx/yyy/net/a.smali
+ smali_classes2/com/xxx/yyy/net/retrofit/b/a.smali

其中，这里的 retrofit 是 Java 中使用到的一个 HTTP 请求库。同时，从文件路径的 net 不难猜测，这两个文件都是和网络请求相关的，很可能和具体计算 signature 的逻辑相关。

来看其中的第一个文件。

由于 smali 的代码比较冗长，这里给出经过 smali 工具解析后的 Java 代码：

```java{38}
public static void a(Map<String, String> paramMap)
{
  if (!paramMap.containsKey("uuid")) {
    paramMap.put("uuid", i.a());
  }
  if (!paramMap.containsKey("access_id")) {
    paramMap.put("access_id", "ptapp");
  }
  if (!paramMap.containsKey("timestamp"))
  {
    /**
     * 这里的 timestamp 就是一个 ms 计算的时间，和 JavaScript 中的 Date.now() 值相同
     */
    StringBuilder localStringBuilder = new StringBuilder();
    localStringBuilder.append(System.currentTimeMillis());
    localStringBuilder.append("");
    paramMap.put("timestamp", localStringBuilder.toString());
  }
  if (!paramMap.containsKey("city")) {
    paramMap.put("city", c.a().c());
  }
  if (!paramMap.containsKey("token")) {
    /**
     * 从实际的使用上来看，URL 中的 token 并没有提供具体的值，可以猜测这个函数会提供一个 token 值，
     * 而第二个参数的空字符串就是当 token 未找到情况下（即未登录）的默认值
     */
    paramMap.put("token", ac.b("user_token", ""));
  }
  if (!paramMap.containsKey("appSource")) {
    paramMap.put("appSource", BaseApplication.a());
  }
  if (!paramMap.containsKey("platform")) {
    paramMap.put("platform", "Android");
  }
  /**
   * 不难发现，这里的 k.b(k.a("POST", paramMap)) 就是计算 signature 的具体过程，
   */
  String str = k.b(k.a("POST", paramMap));
  if (!paramMap.containsKey("signature")) {
    paramMap.put("signature", str);
  }
}
```

通过查找 smali 对应的代码，不难发现，这里的 `String str = k.b(k.a("POST", paramMap));` 对应的代码为：

```smali
:cond_6
const-string v0, "POST"

.line 48
invoke-static {v0, p0}, Lcom/xxx/yyy/utils/k;->a(Ljava/lang/String;Ljava/util/Map;)Ljava/lang/String;

move-result-object v0

.line 49
invoke-static {v0}, Lcom/xxx/yyy/utils/k;->b(Ljava/lang/String;)Ljava/lang/String;

move-result-object v0
```

也即使说，分别对应的是 xxx/yyy/utils/k.smali 类中定义的 a 和 b 两个静态方法。

现在来查看 xxx/yyy/utils/k.smali 中的文件，同样出于长度的考虑，这里给出经过工具解析的 Java 代码：

```java{72}
/**
 * 这个函数的工作非常明显，就是讲字符串进行 URL 编码
 * 编码的效果基本等同于 encodeURLComponent，不同在于后面的那几个字符的替换
 */
public static String a(String paramString)
{
  if (paramString != null) {
    try
    {
      String str = URLEncoder
        .encode(paramString, "UTF-8")
        .replace("+", "%20")
        .replace("*", "%2A")
        .replace("%7E", "~");
      return str;
    }
    catch (UnsupportedEncodingException localUnsupportedEncodingException)
    {
      localUnsupportedEncodingException.printStackTrace();
      return paramString;
    }
  }
  return null;
}
/**
 * 这个函数的作用，就是将 paramMap 这个函数中的值，拼接成一个字符串
 * 拼接的结果是 `${paramString}&%2F&${key1}%3D${value1}%26${key2}%3D${value2}`
 * 当然，这里的 key 和 value 都是经过了上面函数进行 URL 编码的
 * 具体的代码如下
 */
public static String a(String paramString, Map<String, String> paramMap)
{
  Set keySet = paramMap.keySet();
  int i = 0;
  // 按 key 进行排序
  String[] keys = (String[])keySet.toArray(new String[0]);
  Arrays.sort(keys);
  // 拼接字符串
  StringBuilder result = new StringBuilder();
  result.append(paramString);
  result.append("&"); // 不编码的 &
  // 这里的 a 函数，就是上面的那个静态方法，是同一个函数的不同重载
  result.append(a("/"));
  result.append("&"); // 不编码的 &
  StringBuilder params = new StringBuilder();
  int j = keys.length;
  while (i < j)
  {
    String key = keys[i];
    params.append("&");
    params.append(a(key));
    params.append("=");
    params.append(a((String)paramMap.get(key)));
    i++;
  }
  /**
   * 这里的 subString(1) 主要是去掉了开头的 &
   * 也就是说，这里的前两个 & 是部编码的
   * 但是之后的每一 key/value 对连接处用到的 & 都是编码成 %2F 了，同样 = 也编码成了 %3D
   */
  result.append(a(params.toString().substring(1)));
  return result.toString();
}
/**
 * 这里是加密的函数，使用 HmacSHA256 进行加密
 * 用到了一个密钥，密钥的主体部分通过 a.b().s() 获取
 */
public static String b(String paramString)
{
  // 这里获取到了加密使用的密钥
  StringBuilder keyBuilder = new StringBuilder();
  keyBuilder.append(a.b().s());
  keyBuilder.append("&");
  String key = keyBuilder.toString();
  try
  {
    Mac localMac = Mac.getInstance("HmacSHA256");
    localMac.init(new SecretKeySpec(key.getBytes("UTF-8"), "HmacSHA256"));
    return new String(
      Base64.encodeBase64(localMac.doFinal(paramString.getBytes("UTF-8")))
    );
  }
  catch (Exception localException)
  {
    localException.printStackTrace();
  }
  return paramString;
}
```

这里，主要需要知道的，就是静态方法 b 中的 `a.b().s()` 函数究竟是返回了什么样的密钥。有了这个密钥之后，就可以根据 URL 来计算出正确的 signature 了。这里，`a.b()` 对应的 smali 代码为：

```smali
.method public static b()Lcom/xxx/yyy/manager/a;
    .locals 1

    .line 91
    invoke-static {}, Lcom/xxx/yyy/manager/a$a;->a()Lcom/xxx/yyy/manager/a;

    move-result-object v0

    return-object v0
.end method
```

而 `a$a.a()` 对应的 smali 代码为：

```smali
.field private static final a:Lcom/xxx/yyy/manager/a;
.method static synthetic a()Lcom/xxx/yyy/manager/a;
    .locals 1

    .line 94
    sget-object v0, Lcom/xxx/yyy/manager/a$a;->a:Lcom/xxx/yyy/manager/a;

    return-object v0
.end method
```

不难看出，最开始 `a.b()` 的代码，其实就是一个 Singleton 返回了一个 `a` 类型的对象而已。那么 `a.b().s()` 代码，就只需要找到 `a` 类型的 `s` 方法就可以了，在 `a.smali` 中，可以找到代码如下：

```smali{4}
.method public s()Ljava/lang/String;
    .locals 1

    .line 219
    iget-object v0, p0, Lcom/xxx/yyy/manager/a;->b:Lcom/xxx/yyy/b/i;

    invoke-interface {v0}, Lcom/xxx/yyy/b/i;->k()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method
```

可以等价写成 Java 代码：

```java
public String s() {
  return this.b.k();
}
```

这里，可以去 `a` 的构造函数中去寻找 `this.b` 的具体定义方式。同时，从 smali 中也不难知道，这里的 `this.b` 是一个定义在 `com/xxx/yyy/b/i.smali` 中的类对象。直接去该文件中看，不难发现这个 `i` 定义为 `.class public interface abstract Lcom/xxx/yyy/b/i;`。那么，既然是一个 interface，接下来只要搜索哪些类实现了这个 interface 就可以了。搜索 `.implements Lcom/xxx/yyy/b/i;` 不难发现，实现的类，主要就是同目录下的 `a.smali`，`e.smali` 和 `j.smali`。在任意一个具体实现的类中，都可以找到这个 `k` 方法的实现。

```smali
.method public k()Ljava/lang/String;
    .locals 1

    const-string v0, "xxx"

    return-object v0
.end method
```

这里的 xxx 就是具体的密钥值。

当然，上面如果直接从 `a` 的构造函数中去寻找 `this.b`，也同样指向到了同目录下的 `g.smali`，`c.smali` 等文件，这些分别是上面 `a.smali`，`e.smali` 和 `j.smali` 的子类。具体 `k` 方法的定义，依然在这三个父类中。

至此，整个 signature 的计算过程基本明朗了。

然而，这只是第一个文件的解析结果。对于第二个出现 signature 字符串的文件，也可以用类似的思路进行分析。最后发现，真正加密的部分，依然落到了上面提到的那个加密函数中，连拼接字符串的部分也是一样的。唯一不同的是，提供的第一个参数不再是 POST，而是一个函数调用后的结果。这里猜测具体的函数返回结果，就是当前 HTTP 请求的类型，不是 GET 就是 POST。经过测试，也确实如此。故，这部分分析就省略了。

## 结果

根据以上的分析结果，可以把这部分对应的 Java 代码用 JavaScript 再写一遍：

```javascript
const crypto = require('crypto');

const key = 'xxx';
function encode(input) {
  return encodeURIComponent(input)
    .replace(/\+/g, '%20')
    .replace(/\*/g, '%2A')
    .replace(/%7E/g, '~');
}

function getStringForEncrypt(method, url) {
  const parsed = new URL(url);
  parsed.searchParams.sort();

  const ending = Array.from(parsed.searchParams.keys()).reduce((acc, key) => {
    // 去掉抓取 URL 中自带的 signature 值
    if (key === 'signature') return acc;
    let value = parsed.searchParams.get(key);
    acc += `&${encode(key)}=${encode(value)}`;
    return acc;
  }, '');

  return `${method}&${encode('/')}&${encode(ending.substr(1))}`;
}

function encrypt(input) {
  const hmac = crypto.createHmac('sha256', `${key}&`);
  return hmac.update(input).digest('base64');
}

const url = '代理抓取到的 URL 请求地址';
// 这里将输出计算后的 signature 值，可以和抓取到的值比较验证
console.log('signature: ', encrypt(getStringForEncrypt('GET', url)));
```

## 总结

总体来说，带着具体的目的去逆向 Android App 并不会特别的困难。中间考虑的太复杂，反而饶了一些弯路。实践下来，从字符串进行切入之后，广度优先遍历搜索会比深度优先遍历搜索来得更有效果一些。深度优先的阅读顺序，容易陷入到代码的细节中，考虑太多调用/被调用方的具体逻辑。广度优先的阅读策略，更容易把握全局的思路，找到真正的突破口。

最后，逆向是一个非常考验耐心的工程。随时记录已经阅读过/思考过的部分，有助于提高效率。
