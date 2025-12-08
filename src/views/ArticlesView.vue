<template>
  <div class="articles-container">
    <div class="page-header">
      <h1>文章 <span class="highlight">列表</span></h1>
      <p class="subtitle">技术沉淀 / 随笔 / 思考</p>
    </div>

    <div class="articles-list">
      <div 
        v-for="article in sortedArticles" 
        :key="article.fileName" 
        class="article-card glass-panel"
        @click="goToArticle(article.slug)"
      >
        <div class="card-content">
          <div class="meta">
            <span class="date">{{ formatDate(article.date) }}</span>
            <span v-if="article.tag" class="tag">{{ article.tag }}</span>
          </div>
          <h2>{{ article.title }}</h2>
          <p class="desc">{{ article.description }}</p>
          <span class="read-more">阅读全文 &rarr;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const articles = ref([])

// Simple Frontmatter Parser
const parseFrontmatter = (content) => {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/
  const match = content.match(frontmatterRegex)
  
  const metadata = {}
  let body = content
  
  if (match) {
    const frontmatterBlock = match[1]
    body = content.replace(match[0], '').trim()
    
    // Parse key-value pairs
    frontmatterBlock.split('\n').forEach(line => {
      const parts = line.split(':')
      if (parts.length >= 2) {
        const key = parts[0].trim()
        const value = parts.slice(1).join(':').trim()
        metadata[key] = value
      }
    })
  }

  return { metadata, body }
}

onMounted(() => {
  const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true })
  
  const loadedArticles = []
  
  for (const path in modules) {
    const rawContent = modules[path]
    const fileName = path.split('/').pop()
    const slug = fileName.replace(/\.md$/, '')
    
    // Parse
    const { metadata } = parseFrontmatter(rawContent)
    
    loadedArticles.push({
      fileName,
      slug,
      title: metadata.title || slug,
      date: metadata.date || '1970-01-01',
      description: metadata.description || '暂无描述',
      tag: metadata.tag || null
    })
  }
  
  articles.value = loadedArticles
})

const sortedArticles = computed(() => {
  return [...articles.value].sort((a, b) => {
    return new Date(b.date) - new Date(a.date)
  })
})

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

const goToArticle = (slug) => {
  router.push(`/articles/${slug}`)
}
</script>

<style scoped>
.articles-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  color: var(--text-main);
  letter-spacing: 1px;
}

.highlight {
  color: var(--accent-color);
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 8px;
  background: var(--accent-color);
  opacity: 0.2;
  border-radius: 4px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.article-card {
  padding: 30px 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); /* Light shadow */
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  border-left: 4px solid var(--accent-color);
}

.meta {
  display: flex;
  gap: 15px;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 15px;
  align-items: center;
}

.tag {
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent-color);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.article-card h2 {
  font-size: 1.6rem;
  margin: 0 0 15px 0;
  color: var(--text-main);
  line-height: 1.3;
}

.desc {
  color: var(--text-muted);
  margin-bottom: 20px;
  line-height: 1.6;
}

.read-more {
  color: var(--accent-color);
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
}

@media (max-width: 600px) {
  .article-card {
    padding: 25px;
  }
}
</style>
