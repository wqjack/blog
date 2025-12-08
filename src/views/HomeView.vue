<template>
  <div class="home">
    <!-- Hero Quote Section -->
    <div class="hero-section glass-panel">
      <div v-if="quote" class="quote-content">
        <div class="quote-symbol">“</div>
        <h1 class="quote-text">{{ quote.hitokoto }}</h1>
        <p class="quote-author">
          <span class="dash">—</span> {{ quote.from_who || '佚名' }} · 《{{ quote.from }}》
        </p>
      </div>
      <div v-else class="quote-loading">
        加载每日一言...
      </div>
      <button class="refresh-btn" @click="fetchQuote" title="换一句">
        ↻
      </button>
    </div>

    <!-- Tech Trends Section -->
    <div class="trends-section">
      <div class="section-header">
        <h2>🔥 技术热榜</h2>
        <div class="tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-btn', { active: currentTab === tab.id }]"
            @click="switchTab(tab.id)"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <div class="trends-list">
        <div v-if="loadingTrends" class="loading-state">
          <div class="spinner"></div> 加载中...
        </div>

        <div v-else-if="currentTrends.length > 0" class="list-content">
          <a 
            v-for="(item, index) in currentTrends" 
            :key="index"
            :href="item.link"
            target="_blank"
            class="trend-card glass-panel-sm"
          >
            <div class="trend-rank" :class="{ 'top-3': index < 3 }">{{ index + 1 }}</div>
            <div class="trend-info">
              <h3 class="trend-title">
                {{ item.title }}
                <span v-if="item.translated" class="trans-badge">译</span>
              </h3>
              <div class="trend-meta">
                <span class="meta-tag hot">🔥 {{ item.heat }} 热度</span>
                <span v-if="item.author" class="meta-tag author">@{{ item.author }}</span>
              </div>
            </div>
            <div class="trend-icon">↗</div>
          </a>
        </div>
        
        <div v-else class="empty-state">
          获取数据失败，请重试
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// === Quote Logic (Hitokoto) ===
const quote = ref(null)

const fetchQuote = async () => {
  quote.value = null
  try {
    const res = await fetch('https://v1.hitokoto.cn/?c=i&c=d&c=k') // i=poetry, d=literature, k=philosophy
    const data = await res.json()
    quote.value = data
  } catch (e) {
    quote.value = {
      hitokoto: "代码是写给人看的，附带能在机器上运行。",
      from_who: "Knuth",
      from: "编程珠玑"
    }
  }
}

// === Trends Logic ===
const currentTab = ref('juejin')
const tabs = [
  { id: 'juejin', name: '稀土掘金' },
  { id: 'stackoverflow', name: 'Stack Overflow' }
]
const trendsData = ref({
  juejin: [],
  stackoverflow: []
})
const loadingTrends = ref(false)

const currentTrends = computed(() => trendsData.value[currentTab.value])

const switchTab = (tabId) => {
  currentTab.value = tabId
  if (trendsData.value[tabId].length === 0) {
    fetchTrends(tabId)
  }
}

// Google Translate Proxy (Experimental)
// Since we are on static site, we try to use a public translate endpoint via proxy or simple heuristic
// For demo reliability, we will use a "Mock Translation" for SO titles if real API fails, or just display English.
const translateText = async (text) => {
  // Demo: In a real static app, we can't easily hide API keys.
  // We will return the text as is, but mark it. 
  // If you REALLY want translation, we need a backend. 
  // Here we just simulate "Processing" distinct non-Chinese chars? No.
  return text 
}

const fetchTrends = async (source) => {
  loadingTrends.value = true
  try {
    if (source === 'stackoverflow') {
      // Use StackExchange API
      const res = await fetch('https://api.stackexchange.com/2.2/questions?order=desc&sort=hot&site=stackoverflow&pagesize=10')
      const data = await res.json()
      
      trendsData.value.stackoverflow = data.items.map(item => ({
        title: item.title, // In real app, we would await translateText(item.title)
        link: item.link,
        heat: item.score,
        author: item.owner.display_name,
        translated: false // 标记为未翻译，因为没有后端翻译服务
      }))
    } else if (source === 'juejin') {
      // Juejin API has strict CORS. We use Mock Data for reliability on GitHub Pages.
      // In a real env, you'd use a proxy server.
      await new Promise(r => setTimeout(r, 600)) // Fake delay
      trendsData.value.juejin = [
        { title: "Vue 3.5 正式发布：响应式系统重构，性能提升 50%", link: "#", heat: "12.5w", author: "尤雨溪" },
        { title: "前端已死？2024 年前端现状调查报告", link: "#", heat: "8.2w", author: "TechDaily" },
        { title: "深入理解 React Server Components", link: "#", heat: "6.1w", author: "Dan" },
        { title: "CSS 终于支持嵌套了！原生 CSS Nesting 全解析", link: "#", heat: "5.5w", author: "CSS魔法" },
        { title: "为什么我现在更推荐使用 Rust 写前端工具链", link: "#", heat: "4.8w", author: "Rustacean" },
        { title: "TypeScript 5.4 新特性一览", link: "#", heat: "3.9w", author: "TS高手" },
        { title: "记录一次生产环境 Next.js 内存泄漏排查过程", link: "#", heat: "3.2w", author: "DebugKing" }
      ]
    }
  } catch (e) {
    console.error("Fetch failed", e)
  } finally {
    loadingTrends.value = false
  }
}

onMounted(() => {
  fetchQuote()
  fetchTrends('juejin')
})
</script>

<style scoped>
.home {
  padding: 40px 0;
  max-width: 900px;
  margin: 0 auto;
}

/* Quote Section */
.hero-section {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px;
  position: relative;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-gradient); /* Use gradient for hero */
}

/* Make quote white since background is gradient */
.quote-content {
  color: white;
  position: relative;
  z-index: 2;
}

.quote-symbol {
  font-size: 4rem;
  opacity: 0.3;
  line-height: 1;
  margin-bottom: -20px;
  font-family: serif;
}

.quote-text {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.quote-author {
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
}

.refresh-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.refresh-btn:hover {
  background: rgba(255,255,255,0.4);
  transform: rotate(180deg);
}

.quote-loading {
  color: rgba(255,255,255,0.7);
}

/* Trends Section */
.trends-section {
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.5rem;
  color: var(--text-main);
}

.tabs {
  background: rgba(0,0,0,0.05);
  padding: 4px;
  border-radius: 12px;
  display: flex;
  gap: 4px;
}

.tab-btn {
  border: none;
  background: transparent;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-muted);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.tab-btn.active {
  background: white;
  color: var(--accent-color);
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

/* Trends List */
.trends-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 300px;
}

.trend-card {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: white;
  border: 1px solid rgba(0,0,0,0.03);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  border-radius: 12px;
}

.trend-card:hover {
  transform: translateX(4px);
  border-color: var(--accent-color);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.trend-rank {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-muted);
  opacity: 0.4;
  width: 30px;
  margin-right: 15px;
  font-family: 'Outfit', sans-serif;
}

.trend-rank.top-3 {
  color: #fbbf24; /* Gold-ish */
  opacity: 1;
}

.trend-info {
  flex: 1;
  min-width: 0;
}

.trend-title {
  font-size: 1rem;
  margin: 0 0 6px 0;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 8px;
}

.trend-meta {
  font-size: 0.8rem;
  color: var(--text-muted);
  display: flex;
  gap: 12px;
}

.trend-icon {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-left: 15px;
  opacity: 0.5;
}

.trans-badge {
  font-size: 0.7rem;
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent-color);
  padding: 0 4px;
  border-radius: 4px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.loading-state, .empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-muted);
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--accent-color);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 30px 20px;
  }
  .quote-text {
    font-size: 1.4rem;
  }
}
</style>
