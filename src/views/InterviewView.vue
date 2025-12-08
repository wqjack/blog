<template>
  <div class="interview-container">
    <div class="header">
      <h1>Frontend <span class="highlight">Interview</span></h1>
      <p class="subtitle">精选前端高频面试题库</p>
    </div>

    <div class="search-bar glass-panel">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="搜索题目 (例如: 'Vue', 'CSS', '闭包')..."
      >
      <span class="search-icon">🔍</span>
    </div>

    <div class="questions-list">
      <div 
        v-for="(item, index) in filteredQuestions" 
        :key="index" 
        class="question-card glass-panel"
        :class="{ 'is-open': item.isOpen }"
      >
        <div class="question-header" @click="toggleQuestion(index)">
          <h3>{{ item.question }}</h3>
          <span class="toggle-icon">{{ item.isOpen ? '−' : '+' }}</span>
        </div>
        <transition name="expand">
          <div v-if="item.isOpen" class="answer-wrapper">
            <div class="answer-body">
              <div class="tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <div class="answer-content" v-html="item.answer"></div>
            </div>
          </div>
        </transition>
      </div>
      
      <div v-if="filteredQuestions.length === 0" class="no-results">
        <p>未找到相关题目</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const questions = ref([
  {
    question: 'Vue 3 生命周期有哪些变化？',
    answer: `<p>在 Vue 3 Composition API 中，生命周期钩子函数发生了变化，通常以 <code>on</code> 开头，且需要按需导入：</p>
    <ul>
      <li><code>beforeCreate</code> / <code>created</code> ➔ <strong>setup()</strong> (直接使用)</li>
      <li><code>beforeMount</code> ➔ <strong>onBeforeMount</strong></li>
      <li><code>mounted</code> ➔ <strong>onMounted</strong></li>
      <li><code>beforeUpdate</code> ➔ <strong>onBeforeUpdate</strong></li>
      <li><code>updated</code> ➔ <strong>onUpdated</strong></li>
      <li><code>beforeUnmount</code> ➔ <strong>onBeforeUnmount</strong></li>
      <li><code>unmounted</code> ➔ <strong>onUnmounted</strong></li>
    </ul>`,
    tags: ['Vue', 'Basic'],
    isOpen: true
  },
  {
    question: 'GET 和 POST 请求的区别？',
    answer: `<p>主要区别如下：</p>
    <ul>
      <li><strong>参数位置：</strong> GET 参数拼接在 URL 后；POST 放在 Request Body 中。</li>
      <li><strong>安全性：</strong> POST 相对比 GET 安全（数据URL不可见），但都不防抓包。</li>
      <li><strong>长度限制：</strong> GET 受限于浏览器 URL 长度；POST 理论上无限制。</li>
      <li><strong>缓存：</strong> GET 请求通常会被浏览器主动缓存；POST 不会。</li>
      <li><strong>幂等性：</strong> GET 是幂等的（多次请求结果一致）；POST 不是。</li>
    </ul>`,
    tags: ['Network', 'HTTP'],
    isOpen: false
  },
  {
    question: 'CSS 实现水平垂直居中的几种方式？',
    answer: `<p>常见的核心方案：</p>
    <ol>
      <li><strong>Flexbox (推荐):</strong> <br><code>display: flex; justify-content: center; align-items: center;</code></li>
      <li><strong>Grid (极简):</strong> <br><code>display: grid; place-items: center;</code></li>
      <li><strong>Absolute + Transform:</strong> <br><code>position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);</code></li>
      <li><strong>Line-height (单行文本):</strong> <br><code>height: 100px; line-height: 100px; text-align: center;</code></li>
    </ol>`,
    tags: ['CSS', 'Layout'],
    isOpen: false
  },
  {
    question: '什么是闭包 (Closure)？有哪些应用场景？',
    answer: `<p><strong>定义：</strong> 闭包是指有权访问另一个函数作用域中变量的函数。简单说就是函数嵌套函数，内部函数引用了外部函数的变量。</p>
    <p><strong>用途：</strong></p>
    <ul>
      <li><strong>数据私有化：</strong> 模拟私有变量，避免全局污染。</li>
      <li><strong>保持状态：</strong> 如计数器、节流防抖函数。</li>
    </ul>
    <p><strong>注意：</strong> 不当使用可能导致内存泄漏（变量无法被垃圾回收）。</p>`,
    tags: ['JavaScript', 'Core'],
    isOpen: false
  },
  {
    question: 'Promise 的状态有哪些？解决了什么问题？',
    answer: `<p><strong>状态：</strong> Promise 有三种状态：<code>Pending</code> (进行中)、<code>Fulfilled</code> (已成功)、<code>Rejected</code> (已失败)。状态一旦改变不可逆。</p>
    <p><strong>解决的问题：</strong></p>
    <ul>
      <li>解决了回调地狱 (Callback Hell)，使代码更扁平可读。</li>
      <li>提供统一的异步处理机制 (then/catch)。</li>
    </ul>`,
    tags: ['JavaScript', 'Async'],
    isOpen: false
  },
  {
    question: 'Vue 3 中 ref 和 reactive 的区别？',
    answer: `<p>两者都用于定义响应式数据：</p>
    <ul>
      <li><strong>ref:</strong> 主要用于定义基本数据类型 (String, Number)，访问值需要 <code>.value</code>。也能定义对象，内部会自动转为 reactive。</li>
      <li><strong>reactive:</strong> 用于定义引用数据类型 (Object, Array)，不需要 <code>.value</code>，但解构会丢失响应性（需配合 <code>toRefs</code>）。</li>
    </ul>
    <p><strong>最佳实践：</strong> 推荐优先使用 <code>ref</code>，因为更显式且更灵活。</p>`,
    tags: ['Vue', 'Composition API'],
    isOpen: false
  }
])

// 可以在这里切换所有问题的展开状态
const toggleQuestion = (index) => {
  // 查找在 filtered 列表中的 items
  const item = filteredQuestions.value[index]
  if (item) {
    item.isOpen = !item.isOpen
  }
}

const filteredQuestions = computed(() => {
  if (!searchQuery.value) return questions.value
  const query = searchQuery.value.toLowerCase()
  return questions.value.filter(q => 
    q.question.toLowerCase().includes(query) || 
    q.tags.some(tag => tag.toLowerCase().includes(query))
  )
})
</script>

<style scoped>
.interview-container {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 20px;
}

.header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  background: linear-gradient(to right, #fff, #aaa);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 15px 25px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.08);
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.1rem;
  font-family: var(--font-main);
  outline: none;
}

.search-bar input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.search-icon {
  font-size: 1.2rem;
  opacity: 0.7;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.question-card {
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.question-card:hover {
  border-color: rgba(0, 210, 255, 0.3);
  transform: translateY(-2px);
}

.question-card.is-open {
  border-color: var(--accent-color);
  background: rgba(255, 255, 255, 0.08); /* Slightly lighter */
}

.question-header {
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.question-header h3 {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: var(--text-main);
}

.toggle-icon {
  font-size: 1.5rem;
  color: var(--accent-color);
  font-weight: 300;
  margin-left: 15px;
}

.answer-wrapper {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.answer-body {
  padding: 0 25px 25px 25px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}

.tags {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(0, 210, 255, 0.1);
  color: var(--accent-color);
  border: 1px solid rgba(0, 210, 255, 0.2);
}

.answer-content :deep(strong) {
  color: var(--accent-color);
}

.answer-content :deep(code) {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  color: #ff9e64;
}

.answer-content :deep(ul), .answer-content :deep(ol) {
  padding-left: 20px;
}

.answer-content :deep(li) {
  margin-bottom: 8px;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px; /* Approximate max height */
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
