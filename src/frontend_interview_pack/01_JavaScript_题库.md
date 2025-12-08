# JavaScript 高频面试题（题 + 答案 + 扩展）

## 1 原型 & 原型链
**题目**：什么是原型链？它是如何实现继承的？  
**答案**：每个对象都有 `__proto__` 指向其原型对象。查找属性时沿原型链向上查找，直到 `Object.prototype`。JS 通过原型链实现基于对象的继承。  
**扩展（加分）**：class 的继承最终通过原型链实现。避免共享引用可在构造函数内初始化实例属性。

## 2 事件循环
**题目**：介绍 JS 的事件循环机制。  
**答案**：JS 是单线程。任务分为同步和异步（宏任务/微任务）。执行顺序：同步 -> 清空微任务 -> 执行一个宏任务 -> 清空微任务 -> ...。  
**扩展**：微任务包括 Promise.then、queueMicrotask、MutationObserver；宏任务包括 setTimeout、setInterval、I/O。

## 3 Promise 微任务执行顺序（示例）
**题目**：下面代码输出什么？
```js
console.log(1)
setTimeout(()=>console.log(2))
Promise.resolve().then(()=>console.log(3))
console.log(4)
```
**答案**：1 4 3 2  
**扩展**：Promise.then 属于微任务，优先于宏任务 setTimeout。

## 4 深拷贝与浅拷贝
**题目**：如何实现深拷贝？有哪些坑？  
**答案**：常用方法：JSON.parse(JSON.stringify(obj))（会丢失 function、undefined，无法处理循环引用）；手写递归（需处理循环引用、Map/Set、Date）；structuredClone（现代浏览器提供）。  
**扩展**：使用 WeakMap 记录已克隆对象以处理循环引用。

## 5 闭包
**题目**：闭包是什么？为什么会出现内存泄漏？  
**答案**：闭包 = 函数 + 其词法环境的引用。闭包会保留外部变量引用，若不释放可能造成内存泄漏。  
**扩展**：常见问题是循环中创建闭包，或长期持有 DOM 引用。

## 6 this 指向
**题目**：this 的指向规则？  
**答案**：默认绑定、隐式绑定、显式绑定（call/apply/bind）、new 绑定。箭头函数使用词法 this。优先级：new > 显式 > 隐式 > 默认。  
**扩展**：面试官可能要求写示例说明 bind 的实现或箭头函数与普通函数的区别。

## 7 模块化
**题目**：ESM 与 CommonJS 区别？  
**答案**：ESM 静态编译，支持 tree-shaking，导出为只读引用；CommonJS 运行时加载，导出为值拷贝。浏览器原生支持 ESM。  
**扩展**：Node 中混用注意 .mjs/.cjs，Tree-shaking 要求静态分析。

## 8 垃圾回收
**题目**：JS 的垃圾回收机制是什么？  
**答案**：标记清除（Mark-and-Sweep）为主；V8 使用新生代/老生代分代收集，新生代常用复制算法，老生代用标记清除+整理。  
**扩展**：引用计数会导致循环引用问题（旧方案）。

## 9 async/await 原理
**题目**：async/await 本质是什么？  
**答案**：async 返回 Promise，await 是 Promise.then 的语法糖。await 会暂停当前 async 的执行并将后续作为微任务继续。  
**扩展**：避免在循环中使用 await 顺序阻塞，使用 Promise.all 并行。

## 10 手写题：实现 debounce
**题目**：实现 debounce。  
**答案**：
```js
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    const ctx = this;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(ctx, args), delay);
  }
}
```
**扩展**：可支持 immediate 参数，返回 cancel 方法，和 throttle 区别讲清楚。
