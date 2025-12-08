# React & Next.js 高频面试题（题 + 答案 + 扩展）

## 1 React Fiber
**题目**：React Fiber 的设计目标和基本原理？  
**答案**：Fiber 为了解决大渲染任务导致 UI 卡顿的问题，采用增量渲染和时间切片，将更新拆分成可中断的任务（work loop），以提高响应性。  
**扩展**：绘制 Fiber 树数据结构、调度优先级、yield 与恢复。

## 2 虚拟 DOM 与 diff 算法
**题目**：React diff 的核心策略是什么？如何优化？  
**答案**：通过同级比较、key 辅助、避免深度 diff。核心策略：同层级比较，遇到不同类型直接替换。优化：使用 key、拆分组件、PureComponent/React.memo、避免创建新引用。  
**扩展**：如何在列表中设计稳定 key。

## 3 Hooks 原理
**题目**：useState/useEffect 的实现原理？  
**答案**：Hooks 通过调用顺序和内部链表保存 Hook 状态；useEffect 的回调在 commit 后执行，依赖数组用于判断是否更新。  
**扩展**：自定义 Hook 的设计原则，如何避免闭包陷阱。

## 4 React 18 Concurrency & Suspense
**题目**：什么是并发特性（concurrent mode）？Suspense 如何配合数据加载？  
**答案**：并发特性允许 React 中断、恢复渲染以提高响应性。Suspense 用于等待异步资源，配合 data fetching 可以提高 UX。  
**扩展**：如何在服务器端应用 Suspense（RSC 场景）。

## 5 RSC（React Server Components）
**题目**：RSC 的优点与局限？  
**答案**：优点：减少前端 bundle，直接在服务器渲染组件并发送序列化结果；局限：不能包含浏览器侧交互逻辑，需要和 client component 组合。  
**扩展**：Server Actions 的使用场景。

## 6 Next.js SSR/SSG/ISR
**题目**：SSR、SSG、ISR 有何区别？适用场景？  
**答案**：SSR 每次请求渲染（实时性高）；SSG 构建时生成（性能最好）；ISR 是增量静态生成（折中）。选择依据：内容更新频率、SEO 要求、性能成本。  
**扩展**：如何在 Next.js 里使用缓存与中间件优化。

## 7 性能优化
**题目**：列出 React 项目的性能优化点。  
**答案**：代码分割、懒加载、避免不必要 rerender、使用 memo、useMemo/useCallback、虚拟化长列表、图片优化、SSR 缓存。  
**扩展**：如何用 profiler 定位性能瓶颈。

## 8 前端路由与数据获取策略
**题目**：前端路由（客户端导航）如何做到快速与无闪烁？  
**答案**：使用预取（prefetch）、保持布局、Skeleton、缓存数据、 optimistic update。  
**扩展**：Next.js 的 fetch 缓存策略与 revalidation。

## 9 可组合性与组件库设计
**题目**：如何设计一个可复用的组件库？  
**答案**：清晰的 API、类型定义（TypeScript）、样式隔离、文档（MDX）、测试、Storybook。版本管理使用 changesets + semver + monorepo。  
**扩展**：如何处理主题与样式定制。

## 10 面试示例题（简答）
**题目**：实现一个自定义 useDebounce Hook（简述要点）。  
**答案要点**：保存 timer 用 ref，清理计时器，依赖变化触发重新计时，返回防抖后的值或函数。
