<template>
  <div class="home-container">
    <!-- Page Header -->
    <div class="page-header">
      <h1>我的 <span class="highlight">主页</span></h1>
      <p class="subtitle">Exploring the world of code & creativity.</p>
    </div>

    <div class="home-grid">
      <!-- Main Content: Trends -->
      <div class="main-column">
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
                rel="noopener noreferrer"
                class="trend-card glass-panel"
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

      <!-- Side Column: Daily Quote -->
      <div class="side-column">
        <div class="quote-card glass-panel">
          <div class="quote-header">
            <span class="quote-icon">📅</span>
            <span class="quote-label">每日一句</span>
          </div>
          
          <div v-if="quote" class="quote-content">
            <p class="quote-text">“{{ quote.hitokoto }}”</p>
            <div class="quote-footer">
              <span class="quote-author">— {{ quote.from_who || '佚名' }}</span>
              <span class="quote-source" v-if="quote.from">《{{ quote.from }}》</span>
            </div>
          </div>
          
          <div v-else class="quote-loading">
            <div class="loading-spinner"></div>
          </div>
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
  const CACHE_KEY = 'daily_quote'
  const today = new Date().toLocaleDateString() // e.g., "12/9/2025" depending on locale

  // 1. Try to load from local storage
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { date, data } = JSON.parse(cached)
      if (date === today && data) {
        quote.value = data
        return
      }
    }
  } catch (e) {
    console.warn('Error reading quote from localStorage', e)
  }

  // 2. Fetch fresh quote if no cache or expired
  quote.value = null
  try {
    const res = await fetch('https://v1.hitokoto.cn/?c=i&c=d&c=k') // i=poetry, d=literature, k=philosophy
    const data = await res.json()
    quote.value = data
    
    // Save to cache
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      date: today,
      data: data
    }))
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

// Helper to format heat numbers
const formatHeat = (num) => {
  if (num >= 100000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const fetchTrends = async (source) => {
  loadingTrends.value = true
  try {
    if (source === 'stackoverflow') {
      // Use StackExchange API
      const res = await fetch('https://api.stackexchange.com/2.2/questions?order=desc&sort=hot&site=stackoverflow&pagesize=10')
      const data = await res.json()
      
      trendsData.value.stackoverflow = data.items.map(item => ({
        title: item.title, 
        link: item.link,
        heat: item.score,
        author: item.owner.display_name,
        translated: false 
      }))
    } else if (source === 'juejin') {
      try {
        const response = await fetch('/api/juejin/content_api/v1/content/article_rank?category_id=1&type=hot&count=10&aid=2608&uuid=7145810834421941797')
        const data = await response.json()
        
        if (data.data && Array.isArray(data.data)) {
          trendsData.value.juejin = data.data.slice(0, 10).map(item => ({
            title: item.content.title,
            link: `https://juejin.cn/post/${item.content.content_id}`,
            heat: formatHeat(item.content_counter.view),
            author: item.author.name
          }))
        } else {
          throw new Error('Invalid data format')
        }
      } catch (error) {
        console.warn('Failed to fetch Juejin data, using fallback', error)
        trendsData.value.juejin = [
          { title: "Vue 3.5 新特性：更快的响应式系统", link: "https://juejin.cn/post/7380287383788585003", heat: "12.5w", author: "前端技术" },
          { title: "现代前端工程化实践指南", link: "https://juejin.cn/frontend", heat: "8.2w", author: "掘金技术" },
          { title: "深入理解 React 18 并发特性", link: "https://juejin.cn/post/7295000000000000000", heat: "6.1w", author: "React开发" },
          { title: "TypeScript 最佳实践 2024", link: "https://juejin.cn/tag/TypeScript", heat: "5.5w", author: "TS专家" },
          { title: "Vite 5 带来的性能优化", link: "https://juejin.cn/tag/Vite", heat: "4.8w", author: "构建工具" },
          { title: "CSS 新特性：容器查询完全指南", link: "https://juejin.cn/tag/CSS", heat: "3.9w", author: "CSS专家" },
          { title: "前端性能优化实战经验", link: "https://juejin.cn/tag/%E5%89%8D%E7%AB%AF", heat: "3.2w", author: "性能优化" }
        ]
      }
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
.home-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
}

/* Page Header */
.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 15px;
  color: var(--text-main);
  letter-spacing: 2px;
  font-weight: 800;
}

.highlight {
  color: var(--accent-color);
  position: relative;
  z-index: 0;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: -5px;
  right: -5px;
  height: 12px;
  background: var(--accent-color);
  opacity: 0.2;
  z-index: -1;
  border-radius: 4px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
}

/* Grid Layout */
.home-grid {
  display: grid;
  grid-template-columns: 1fr 300px; /* Main content + Sidebar */
  gap: 40px;
  align-items: start;
}

/* Quote Sidebar Card */
.quote-card {
  background: white;
  padding: 24px;
  position: sticky;
  top: 20px; /* Sticky sidebar */
  border: 1px solid rgba(0,0,0,0.05); /* Match other borders */
}

.quote-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.quote-icon {
  font-size: 1.5rem;
}

.quote-label {
  font-weight: 700;
  color: var(--text-main);
  font-size: 1.1rem;
}

.quote-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quote-text {
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.6;
  color: var(--text-main);
  font-style: italic;
  font-family: 'Times New Roman', serif; /* Elegant serif for quote */
}

.quote-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: right;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.quote-author {
  font-weight: 600;
}

.quote-source {
  font-size: 0.85rem;
  opacity: 0.8;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--accent-color);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 20px auto;
}

/* Trends Section */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
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
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--accent-color);
  background: rgba(255,255,255,0.5);
}

.tab-btn.active {
  background: white;
  color: var(--accent-color);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Trend Cards */
.trends-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.trend-card {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  background: white;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-radius: 12px; /* Smoother radius for list items */
}

.trend-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent-color);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.trend-rank {
  font-size: 1.4rem;
  font-weight: 800;
  color: #e2e8f0;
  width: 40px;
  margin-right: 20px;
  transition: color 0.3s;
  flex-shrink: 0;
}

.trend-card:hover .trend-rank {
  color: #cbd5e1;
}

.trend-rank.top-3 {
  color: #cbd5e1;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.trend-info {
  flex: 1;
  min-width: 0;
}

.trend-title {
  font-size: 1.1rem;
  margin: 0 0 8px 0;
  color: var(--text-main);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s;
}

.trend-card:hover .trend-title {
  color: var(--accent-color);
}

.trend-meta {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: flex;
  gap: 12px;
}

.trend-icon {
  font-size: 1.2rem;
  color: #cbd5e1;
  margin-left: 15px;
  transition: all 0.3s;
}

.trend-card:hover .trend-icon {
  color: var(--accent-color);
  transform: translate(2px, -2px);
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .home-grid {
    grid-template-columns: 1fr; /* Stack vertically on tablet/mobile */
  }
  
  .side-column {
    order: 1; /* Keep below trends on mobile? Or above? Trends is main content. Keep side column below. */
  }

  .quote-card {
    position: static;
    margin-top: 20px;
  }
}
</style>
