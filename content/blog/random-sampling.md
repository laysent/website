---
title: Random Sampling
date: '2019-02-19'
modified: '2019-02-19'
tags: Algorithm
category: Algorithm
description: >-
  介绍了等概率与不等概率情况下如何对集合进行随机抽样，涵盖了已知大小与未知大小集合（数据流）的情况，涉及到 Fisher-Yates Shuffle
  算法，Reservoir Sampling 算法以及 Weighted Random Sampling 算法
---

研究这个问题的初衷，是为了解决中饭吃什么的问题。显然，需要这样的一款算法，可以根据已知的喜爱程度，随机给定一款中饭的选择。在这里，等概率的选取显然是不合适的。更喜欢/便宜的午餐应该有更高的概率出现，但偶尔吃顿大餐也是惊喜所在。为此，就需要一款基于权重的随机抽样算法。

当然，既然都研究随机抽样算法了，干脆就把各种情况都整理了一遍。遂有此文。

## 已知大小集合的等概率随机抽样

已知集合 $S$ 的总大小是 $N$，在只遍历一次的情况下，随机选取出 $n$ 个元素，这里 $n \leq N$。

### 方案

以随机不放回的方式，从集合 $S$ 中依次抽取出 $n$ 个元素，每次抽取中，每个元素被抽到都是等概率事件。

### 证明

1. 第一次被选中的元素，选中的概率是 $\frac{1}{N}$，因为是等概率抽取
2. 第二个被选中的元素，选中的概率是 $\frac{1}{N}$，因为第一次没有被选中的概率是 $1-\frac{1}{N}$，第二次选中的概率是 $\frac{1}{N-1}$，故概率等于 $(1-\frac{1}{N})(\frac{1}{N-1})=\frac{1}{N}$
3. 第 $n$ 个元素，被选中的概率是 $\frac{1}{N}$，因为前 $n-1$ 次没有被选中的概率是 $1-\frac{1}{N}\frac{1}{N-1}...\frac{1}{N-(n-1)+1}$，第 $n$ 次被选中的概率是 $\frac{1}{N-n+1}$，故概率等于 $(1-\frac{1}{N})(1-\frac{1}{N-1})...(1-\frac{1}{N-(n-1)+1})(\frac{1}{N-n+1})=\frac{1}{N}$

### 代码

本质上，这是 Fisher–Yates shuffle 算法。

在实际编码的过程中，不需要真的有两个集合，一个存放还未抽取的元素，一个存放已经抽取的元素。在同一个数组中，只需要记录已经抽取的数量，就可以将数组根据这个数量分成前后两个部分，前面存放已经抽取的部分，后面存放未被抽取的部分（反之亦可）。

具体代码如下：

```typescript
function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * ((max + 1) - min)) + min;
}

function swap<T>(array: Array<T>, i: number, j: number) {
  if (i === j) return;
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

function shuffle<T>(array: Array<T>, num: number = array.length): Array<T> {
  /**
   * 复制一份，避免对参数做修改
   */
  const ret = array.slice();
  /**
   * 数组被分为两个部分，前面 0 ~ i - 1 的部分是第 i 轮前，已经被选择了的部分。
   * 从 i 开始的部分，是还未选择的剩余数据。
   * 
   * 这里的循环，进行到 ret.length - 1 就可以了，
   * 因为最后一次，剩余的最后一个未被选择的元素直接被使用，不需要抽取。
   */
  for (let i = 0; i < ret.length - 1; i += 1) {
    /**
     * 这里 j 表示，随机选中的元素下标。
     * j 的取值范围是：i <= j < ret.length
     * 注：这里 i 也是 j 可以选取到的值，否则 j 的取值范围就不是等概率的了。
     * Fisher–Yates shuffle 算法也就变成了 Sattolo 算法。
     */
    let j = getRandomNumber(i, ret.length - 1);
    /**
     * 对 i 和 j 位置的数据进行交换（如果有必要的话）。
     * 交换后，i 位置的值就是被选中的值，未选中的值是从 i+1 ~ length 的部分。
     * 这里，j 位置的元素被交换到了 i 位置，表示该元素被选中了，
     * 原来 i 位置元素放到任何新位置都是可以的，只要在未选中的范围内就可以了，
     * 因为随机选取的时候，位置信息并没有被使用到。
     * 这里选择 i 和 j 的互换，主要也是计算量上的方便。
     */
    swap(ret, i, j);
  }
  /**
   * 如果最终选取的数量不是全部数组，那么需要将选取的部分返回。
   */
  if (num !== array.length) {
    return ret.slice(0, num);
  }
  /**
   * 如果选取的就是全部数组，那么这本质上就是 Fisher–Yates shuffle 算法。
   */
  return ret;
}
```

## 未知大小集合的等概率随机抽样

给定集合 $S$，且集合大小未知，在只遍历一次的情况下，随机选取出 $n$ 个元素。

### 方案及证明

可以从简单的情况开始考虑。

假设，最终 $S$ 遍历下来，总长度 $N<=n$，那么显然只需要选取所有的数据就可以了。

现在假设集合 $S$ 的大小是 $N=n+1$。那么，前 $n$ 个元素都被放入到选中集合中了。现在要考虑第 $n+1$ 个元素要怎么处理。因为最终需要选中的元素都是等概率的，所以这种情况下，选中的概率应该是 $\frac{n}{n+1}$。换句话说，未被选中的概率是 $\frac{1}{n+1}$。也即是说，用第 $n+1$ 个随机替换掉一个元素就可以了，这将会有 $\frac{1}{n+1}$ 的概率替换掉自己（也就是对原结果保持不变），也会有 $\frac{n}{n+1}$ 的概率替换掉一个原结果中的元素（即，被选中）。此时，对这个新元素来说，概率是符合要求的。而对于已经被选中的元素来说，有 $\frac{1}{n+1}$ 的概率被替换掉，即有 $\frac{n}{n+1}$ 的概率被保留下来。

那么，现在假设集合 $S$ 的大小是 $N=n+2$。按上面的方案，前 $n+1$ 个元素已经处理完成了。第 $n+2$ 个元素，要决定是否选取，且保证决定完之后，每个元素被选中的概率是 $\frac{1}{n+2}$。在上一步中，元素被选中的概率是 $\frac{1}{n+1}$，那么在这一步中，如果元素继续被选中的概率是 $x$，应该有 $\frac{1}{n+1}x=\frac{1}{n+2}$，因此可以得出 $x=\frac{n+1}{n+2}=1-\frac{1}{n+2}$。也就是说，以等概率的方案替换掉一个已知元素（可以包括自己），最终被选中的概率每个元素都是 $\frac{n}{n+2}$。

最终，总结下来，方案如下：

1. 前 $n$ 个数据，直接存放到结果中。
2. 对于第 $n+m$ 个数据，生成一个随机 $[0, n+m)$ 的随机数 $r$，如果随机数满足 $0\leq r < n $，那么，用最新的数据替换掉结果中下标为 $r$ 的结果；否则，结果保持不变。

### 代码

这就是蓄水池算法（Reservoir Sampling），示例代码如下：

```typescript
function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * ((max + 1) - min)) + min;
}

class Reservoir<T> {
  size: number = 0;      // 需要选取的总量
  total: number = 0;     // 目前为止处理过的总量
  result: Array<T> = []; // 当前结果
  constructor(size: number) {
    this.size = size;
  }
  add(element: T) {
    if (this.total < this.size) {
      this.result.push(element);
    } else {
      const rand = getRandomNumber(0, this.total);
      if (rand < this.size) {
        this.result[rand] = element;
      }
    }
    this.total += 1;
  }
  get() {
    return this.result;
  }
}
```

### 并行解决方案

如果数据量异常大，加入并行处理后，蓄水池算法可以做进一步的改良。

将集合 $S$ 拆分成 $k$ 个不同的蓄水池。每一个新加入的元素，依次被第 $1, 2, ..., k$ 个蓄水池处理。每个蓄水池选取 $n$ 个数据。这里，令每个蓄水池一共处理了 $N_{i}$ 个数据，其中 $i$ 是第 $i$ 个蓄水池，且 $\sum_{1}^{k}N_{i}=N$。

接下来，需要从每个蓄水池生成的数据中，生成最终的抽样数据。方法如下：

1. 生成 $[0, N)$ 的一个随机数 $r$
2. 如果 $r \in [\sum_{1}^{i-1}N_{k}, \sum_{1}^{i}N_{k})$，从第 $i$ 个蓄水池的最终抽样数据中等概率选取一个数据，放入最终的结果中
3. 从第 $i$ 个蓄水池中选取抽样数据是不放回的等概率选取

这里，对每个蓄水池 $k$ 来说，最终生成的 $n$ 个数据，每个数据被选中的概率都是 $\frac{1}{N_{k}}$。

而上面的第一和第二步，是为了使用等概率随机数来模拟不等概率的抽取。每生成一个随机数 $r$，第 $k$ 个蓄水池最终选入一个结果的概率是 $\frac{N_k}{N}$。

因为是不放回选取，该蓄水池生成的结果中，任意一个被最终选定的概率是 $\frac{1}{n}$。

故，在每一次抽取中，一个元素被选为最终结果的概率是 $\frac{1}{N_{k}}\frac{N_k}{N}\frac{1}{n}=\frac{1}{Nn}$。

因此，选 $n$ 个结果，最终一个元素被选中的概率是 $\frac{1}{Nn}n=\frac{1}{N}$。

## 已知大小集合的不等概率随机抽样

已知集合 $S$ 的总大小是 $N$，在只遍历一次的情况下，随机选取出 $n$ 个元素（$n \leq N$），且每个元素被选中的概率是 $p_{i}$。更进一步，可以假设每一个元素带有一个对应的权重值 $w_{i}$，而其选中的概率由权重值计算得出 $p_{i}=\frac{w_{i}}{\sum_{j=1}^{N}w_{j}}$。

### 方案

算法来自 [Weighted Random Sampling (2005; Efraimidis, Spirakis)](http://utopia.duth.gr/~pefraimi/research/data/2007EncOfAlg.pdf)。具体如下：

1. 对于集合 $S$ 中的元素 $v_{i} \in V$，生成 $[0, N)$ 的一个随机数 $r$，计算元素的特征 $k_{i}=u^{\frac{1}{w_{i}}}$
2. 将集合按 $k_{i}$ 排序，选取前 $n$ 大的元素。

### 证明

上面的论文并没有给出证明的过程，这里试图进行一下推演。需要证明的是：**根据算法，在 $n$ 个元素中选中任意一个元素的概率，和上面定义的概率是一致的**。

首先考虑两个元素的情况，$k_1=r_1^{1/w_1}, k_2=r_2^{1/w_2}$。如果只选取一个元素，且选中的元素是第一个，那么概率应该是 $p=\frac{w_1}{w_1+w_2}$。而实际上，根据算法，选中第一个元素的条件是 $k_1 \geq k_2$。也就是说，概率的应该是：

$$
\begin{aligned}
p&=P(k_2 \leq k_1)\\
&=P(r_2^{1/w_2} \leq r_1^{1/w_1}) \\
&=P(r_2 \leq r_1^{w_2/w_1}) \\
&=\int_0^1 x^{w_2/w_1} dx\\
&=\frac{1}{\frac{w_2}{w_1}+1}(x^{\frac{w_2}{w_1}+1})|_0^1\\
&=\frac{w_1}{w_1+w_2}
\end{aligned}
$$

选中一个元素且选中的是第二个元素的概率，同理可得是 $p=\frac{w_2}{w_1+w_2}$。符合要求。

接下来考虑三个元素的情况，$k_1=r_1^{1/w_1}, k_2=r_2^{1/w_2}, k_3=r_3^{1/w_3}$。为了说明的方便起见，这里先假设第一次选取一个元素，且选中的元素是第一个。

那么，根据加权取样时的概率定义，应该有

$$
p_1=\frac{w_1}{w_1+w_2+w_3}
$$

而根据论文给出的算法，选中第一个元素的条件是 $k_1 \geq k_2$ 且 $k_1 \geq k_3$。也就是说，概率应该是：

$$
\begin{aligned}
p&=P(k_3 \leq k_1)P(k_2 \leq k_1) \\
&=P(r_3^{1/w_3} \leq r_1^{1/w_1})P(r_2^{1/w_2} \leq r_1^{1/w_1}) \\
&=\int_0^1 x^{w_3/w_1} dx\int_0^1 x^{w_2/w_1} dx \\
&=\int_0^1 x^{w_3/w_1}x^{w2/w_1} dx \\
&=\int_0^1 x^{\frac{w_3+w_2}{w_1}} dx \\
&=\frac{1}{\frac{w_3+w_2}{w_1}+1}(x^{\frac{w_3+w_2}{w_1}})|_0^1 \\
&=\frac{w_1}{w_1+w_2+w_3}
\end{aligned}
$$

结果相同，说明算法符合定义要求。

且，在此基础上，第二次选中第二个元素的概率应该为

$$
p=\frac{w_2}{w_2+w_3}
$$

这是因为，第二次从第二个元素和第三个元素中选中第二个元素的概率，和最开始计算两个元素时候选中任意一个的情况是一样的。

现在来考虑将上述情况推广到 $n$ 个元素的时候，第一次选中第一个元素的概率，根据定义应该是

$$
p_1=\frac{w_1}{\sum_{i=1}^nw_i}
$$

而根据算法，选中第一个元素的充要条件是 $\forall i \in [2, n], k_1 \geq k_i$ 成立。也就是说，概率应该是：

$$
\begin{aligned}
p&=\prod_{i=2}^{n}P(k_i \leq k_1) \\
&=\prod_{i=2}^{n}P(r_i \leq r_1) \\
&=\prod_{i=2}^{n}\int_0^1x^{w_i/w_1}dx \\
&=\int_0^1\prod_{i=2}^{n}x^{w_i/w_1}dx \\
&=\int_0^1x^{(\sum_{i=2}^{n}w_i)/w_1}dx \\
&=\frac{1}{(\sum_{i=2}^{n}w_i)/w_1 + 1}(x^{(\sum_{i=2}^{n}w_i)/w_1})|_0^1 \\
&=\frac{w_1}{\sum_{i=1}^{n}w_i}
\end{aligned}
$$

结果相同，说明算法在 $n$ 个元素的时候，符合定义要求。

当然，上面的证明只是说明了，在第 $i$ 次选中第 $j$ 个元素，定义的概率和实际算法得到概率是相同的。这里给出的 $p_i=\frac{w_i}{\sum_{j=1}^{n}w_j}$ 并不是 $i$ 元素实际被抽中的概率。实际 $i$ 元素被抽中的情况，概率计算要复杂的多。本质上，这是一个不等概率、不放回抽取抽签的问题。以三个元素的情况为例，假设最终要从三个元素中选取两个元素，那么第一个元素被选中的概率应该等于

$$
p=\frac{w_1}{w_1+w_2+w_3} + (\frac{w_2}{w_1+w_2+w_3}\frac{w_1}{w_1+w_3}) + (\frac{w_3}{w_1+w_2+w_3}\frac{w_1}{w_1+w_2})
$$

等式从左到右分别表示：第一次选中第一个元素的概率，第一次选中第二个元素且第二次选中第一个元素的概率，第一次选中第三个元素且第二次选中第一个元素的概率。

### 代码

```typescript
interface component<T> {
  element: T;
  weight: number;
}

function shuffle<T>(array: Array<component<T>>, num: number = array.length): Array<T> {
  return array
    /**
     * 根据公式计算每一个元素的 key 值
     */
    .map(({ element, weight }) => {
      const rand = Math.random();
      return {
        element,
        key: rand ** (1 / weight),
      };
    })
    /**
     * 根据 key 值进行排序，大的在前面
     */
    .sort((a, b) => {
      if (a.key < b.key) return 1;
      if (a.key > b.key) return -1;
      return 0;
    })
    /**
     * 选取需要的数量
     */
    .slice(0, num)
    /**
     * 保留需要的数据
     */
    .map(({ element }) => element);
}
```

该算法有两个问题：

1. 算法需要计算的 $k$ 假设了计算精度，但实际操作中可能会存在误差导致比较不正确
2. 这里代码在计算完所有元素对应的 $k$ 之后，通过排序的方法找到最大的 $n$ 个值。当集合 $S$ 比较大的时候，这里的排序和计算会比较耗费时间。且除了最大的 $n$ 个之外，剩余部分的排序其实是没有必要的。针对这一点改进的算法，可以参考下面未知集合大小的不等概率随机抽样问题。

## 未知大小集合的不等概率随机抽样

给定集合 $S$，且集合大小未知，在只遍历一次的情况下，随机选取出 $n$ 个元素（$n \leq N$），且每个元素被选中的概率是 $p_{i}$。更进一步，可以假设每一个元素带有一个对应的权重值 $w_{i}$，而其选中的概率由权重值计算得出 $p_{i}=\frac{w_{i}}{\sum_{1}^{N}w_{j}}$。

### 方案

有了前面的工作，这里的方案就是水到渠成了。首先，仍然选用蓄水池算法（Reservoir Sampling）的框架，但是在具体取舍的时候，使用 [Weighted Random Sampling (2005; Efraimidis, Spirakis)](http://utopia.duth.gr/~pefraimi/research/data/2007EncOfAlg.pdf) 给出的算法。总的来说，步骤如下：

1. 前面的 $n$ 个元素，计算每个元素对应的 $k_i$ 值，并直接放入蓄水池中
2. 对之后的每一个元素，计算其 $k_i$ 值，如果这个结果，比蓄水池中最小的 $k$ 值要大，则将最小的元素剔除，将该元素放入；否则不做修改

这个方案不需要一直记录所有元素的 $k$ 值，即使在已知集合大小的情况下，仍然是值得优先考虑的方案。

### 证明

证明的过程其实和已知集合大小的情况一样。这里采用蓄水池的方案，只是在集合总长度未知的情况下，始终保持 $k$ 值最大的前 $n$ 个。

### 代码

```typescript
/**
 * 鉴于需要比较的只有当前存储结果里的最小值，
 * 使用 Heap 数据结构是比较理想的。
 */
import Heap from 'heap';

interface component<T> {
  element: T;
  key: number;
}

class Reservoir<T> {
  size: number = 0;  // 需要选取的总量
  heap: Heap = new Heap((a: component<T>, b: component<T>) => {
    return a.key - b.key;
  });
  constructor(size: number) {
    this.size = size;
  }
  add(element: T, weight: number) {
    if (this.heap.size() < this.size) {
      this.heap.push(element);
    } else {
      const rand = Math.random();
      const key = rand ** (1 / weight);
      /**
       * 如果当前的 key 值比 heap 中的最小值要大，
       * 那么就舍弃当前 heap 的最小值，并加入这个元素
       */
      if (this.heap.top().key < key) {
        this.heap.replace({ key, element });
      }
    }
  }
  get() {
    return this.heap.toArray().map((a: component<T>) => a.element);
  }
}
```

[Weighted Random Sampling (2005; Efraimidis, Spirakis)](http://utopia.duth.gr/~pefraimi/research/data/2007EncOfAlg.pdf) 另外提供了减少随机数生成的算法 A-ExpJ，可以在原文查到相应算法。
