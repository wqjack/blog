---
title: 深入理解 JavaScript 异步编程
date: 2023-11-15
description: 从回调地狱到 Promise，再到 Async/Await，彻底搞懂 JS 异步进化史。
tag: JavaScript
---

# 深入理解 JavaScript 异步编程

JavaScript 是单线程语言，这意味着它同一时间只能做一件事。为了处理 IO 操作而不阻塞主线程，异步编程至关重要。

## 回调地狱 (Callback Hell)

早期我们使用回调函数：

```javascript
getData(function(a) {
  getMoreData(a, function(b) {
    getMoreData(b, function(c) {
      // ... 嵌套噩梦
    });
  });
});
```

## Promise 的出现

Promise 提供了一种更优雅的状态管理机制：

- Pending
- Fulfilled
- Rejected

## Async/Await：终极解决方案

ES2017 引入的 `async/await` 让我们能以同步的方式写异步代码。

```javascript
async function fetchData() {
  try {
    const data = await api.get('/users');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

这不仅提高了可读性，也让错误处理 (`try-catch`) 变得符合直觉。
