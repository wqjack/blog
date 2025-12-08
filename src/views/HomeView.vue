<template>
  <div class="home">
    <div class="hero-section">
      <h1>代码 <span class="highlight">不止</span></h1>
      <p class="subtitle">写给开发者的每日灵感与思考。</p>
    </div>

    <div class="quotes-container">
      <div v-for="(quote, index) in quotes" :key="index" class="quote-card glass-panel" :style="{ animationDelay: `${index * 0.1}s` }">
        <div class="quote-icon">“</div>
        <p class="quote-text">{{ quote.text }}</p>
        <div class="quote-author">
          <span class="dash">—</span> {{ quote.author }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const quotes = ref([
  {
    text: "成就伟业的唯一途径，是热爱你所做的事。",
    author: "Steve Jobs / 乔布斯"
  },
  {
    text: "先解决问题，再写代码。",
    author: "John Johnson"
  },
  {
    text: "简洁是效率的灵魂。",
    author: "Austin Freeman"
  },
  {
    text: "让它跑通，让它正确，让它变快。",
    author: "Kent Beck"
  },
  {
    text: "整洁的代码看起来就像是由在乎它的人写的。",
    author: "Robert C. Martin (Uncle Bob)"
  },
  {
    text: "这不是 bug，这是一个未文档化的特性。",
    author: "匿名 / Anonymous"
  },
  {
    text: "编程是算法设计的艺术，也是调试代码的工艺。",
    author: "Ellen Ullman"
  }
])
</script>

<style scoped>
.home {
  padding: 60px 0;
  max-width: 900px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 70px;
}

.hero-section h1 {
  font-size: 3.5rem;
  margin-bottom: 15px;
  color: var(--text-main);
  letter-spacing: 2px;
  font-weight: 800;
}

.highlight {
  color: var(--accent-color);
  position: relative;
  display: inline-block;
  padding: 0 5px;
}

/* 简约下划线风格 */
.highlight::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 12px;
  background: var(--accent-color);
  opacity: 0.15;
  z-index: -1;
  border-radius: 4px;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.quotes-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

.quote-card {
  padding: 35px 50px;
  position: relative;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  background: white; /* 纯色卡片更高级 */
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.quote-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
}

.quote-icon {
  font-size: 5rem;
  position: absolute;
  top: 10px;
  left: 15px;
  color: #e5e7eb; /* 极淡的灰色 */
  font-family: serif;
  z-index: 0;
  pointer-events: none;
}

.quote-text {
  font-size: 1.3rem;
  line-height: 1.7;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  font-family: 'PingFang SC', system-ui, sans-serif;
}

.quote-author {
  text-align: right;
  font-size: 0.95rem;
  color: var(--text-muted);
  font-weight: 600;
  position: relative;
  z-index: 1;
}

.dash {
  color: var(--accent-color);
  margin-right: 8px;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2.5rem;
  }
  
  .quote-card {
    padding: 25px 30px;
  }
}
</style>
