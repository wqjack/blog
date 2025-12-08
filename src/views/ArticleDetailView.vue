<template>
  <div class="article-detail-container">
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="article" class="article-content glass-panel">
      <!-- Header -->
      <header class="article-header">
        <button class="back-btn" @click="router.back()">← 返回列表</button>
        <h1>{{ article.title }}</h1>
        <div class="meta">
          <span>{{ formatDate(article.date) }}</span>
          <span v-if="article.tag" class="separator">•</span>
          <span v-if="article.tag">{{ article.tag }}</span>
        </div>
      </header>

      <!-- Content -->
      <article class="markdown-body" v-html="renderedContent"></article>
    </div>

    <div v-else class="error">
      文章未找到
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const slug = route.params.slug

const article = ref(null)
const renderedContent = ref('')
const loading = ref(true)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Reuse parsing logic (can be extracted to composable later)
const parseFrontmatter = (content) => {
  const frontmatterRegex = /^---\n([\s\S]+?)\n---/
  const match = content.match(frontmatterRegex)
  
  const metadata = {}
  let body = content
  
  if (match) {
    const frontmatterBlock = match[1]
    body = content.replace(match[0], '').trim()
    
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

onMounted(async () => {
  const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default' })
  
  // Find matching file
  const matchedPath = Object.keys(modules).find(path => path.includes(`${slug}.md`))
  
  if (matchedPath) {
    try {
      const rawContent = await modules[matchedPath]()
      const { metadata, body } = parseFrontmatter(rawContent)
      
      article.value = {
        ...metadata,
        date: metadata.date || 'Unknown Date'
      }
      
      renderedContent.value = marked.parse(body)
    } catch (e) {
      console.error(e)
    }
  }
  
  loading.value = false
})
</script>

<style scoped>
.article-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
}

.article-content {
  padding: 50px;
  background: white; /* 纯色背景适合阅读 */
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
}

.back-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-size: 0.95rem;
  margin-bottom: 20px;
  display: inline-block;
  padding: 0;
}

.back-btn:hover {
  text-decoration: underline;
}

.article-header {
  margin-bottom: 40px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  padding-bottom: 30px;
}

.article-header h1 {
  font-size: 2.5rem;
  color: var(--text-main);
  margin-bottom: 15px;
  line-height: 1.2;
}

.meta {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.separator {
  margin: 0 10px;
}

/* Reuse markdown styles from before or define global? */
/* We should ensure global styles cover this, but scoped works too if we copy */
/* Copied and adjusted for light theme reading experience */
:deep(.markdown-body) {
  color: #374151; /* Gray 700 */
  line-height: 1.8;
  font-size: 1.05rem;
}

:deep(h2) {
  font-size: 1.8rem;
  margin-top: 2em;
  margin-bottom: 0.8em;
  color: #111827;
  font-weight: 700;
}

:deep(h3) {
  font-size: 1.4rem;
  margin-top: 1.5em;
  margin-bottom: 0.6em;
  color: #1f2937;
  font-weight: 600;
}

:deep(p) {
  margin-bottom: 1.5em;
}

:deep(ul), :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1.5em;
}

:deep(li) {
  margin-bottom: 0.5em;
}

:deep(blockquote) {
  border-left: 4px solid var(--accent-color);
  padding-left: 20px;
  color: #6b7280;
  font-style: italic;
  margin: 2em 0;
  background: #f9fafb;
  padding: 20px;
  border-radius: 0 8px 8px 0;
}

:deep(code) {
  background: #f3f4f6;
  color: #ec4899;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

:deep(pre) {
  background: #1f2937;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 2em 0;
}

:deep(pre code) {
  background: transparent;
  color: #e5e7eb;
  padding: 0;
}

@media (max-width: 600px) {
  .article-content {
    padding: 25px;
  }
  
  .article-header h1 {
    font-size: 2rem;
  }
}
</style>
