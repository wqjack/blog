<template>
  <div class="interview-page">
    <div class="page-container" :class="{ 'sidebar-open': showSidebar }">
      <!-- Mobile Toggle -->
      <div class="mobile-header md:hidden">
        <button class="menu-btn" @click="showSidebar = !showSidebar">
          ☰ 目录
        </button>
        <span class="mobile-title">{{ currentCategory?.name || 'Interview' }}</span>
      </div>

      <!-- Sidebar -->
      <aside class="sidebar glass-panel" :class="{ 'mobile-hidden': !showSidebar }">
        <div class="sidebar-header">
          <h2>题库目录</h2>
        </div>
        <ul class="category-list">
          <li 
            v-for="cat in categories" 
            :key="cat.fileName"
            :class="{ active: currentCategory?.fileName === cat.fileName }"
            @click="selectCategory(cat)"
          >
            <span class="cat-icon">📁</span>
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-count">{{ cat.items.length }}</span>
          </li>
        </ul>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <div v-if="currentCategory" class="category-header">
          <h1>{{ currentCategory.title }}</h1>
          <p class="subtitle">{{ currentCategory.id }}</p>
        </div>

        <!-- Search (Global or Local? Local is easier context) -->
        <div class="search-bar glass-panel-sm">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索当前分类下的题目..."
          >
          <span class="search-icon">🔍</span>
        </div>

        <div class="questions-list">
          <div 
            v-for="(item, index) in filteredItems" 
            :key="index" 
            class="question-card glass-panel"
            :class="{ 'is-open': item.isOpen }"
          >
            <div class="question-header" @click="toggleItem(item)">
              <div class="header-content">
                <span class="index-badge">{{ index + 1 }}</span>
                <h3>{{ item.title }}</h3>
              </div>
              <span class="toggle-icon">{{ item.isOpen ? '−' : '+' }}</span>
            </div>
            
            <transition name="expand">
              <div v-if="item.isOpen" class="answer-wrapper">
                <div class="answer-body markdown-body" v-html="renderMarkdown(item.content)"></div>
              </div>
            </transition>
          </div>

          <div v-if="filteredItems.length === 0" class="no-results">
            <p>这里好像什么都没有...</p>
          </div>
        </div>
      </main>

      <!-- Overlay for mobile -->
      <div 
        v-if="showSidebar" 
        class="sidebar-overlay md:hidden"
        @click="showSidebar = false"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { marked } from 'marked'

// Configure marked
marked.setOptions({
  breaks: true, // Enable line breaks
  gfm: true // Enable GitHub Flavored Markdown
})

// === Data Loading & Parsing ===
const categories = ref([])
const currentCategory = ref(null)
const showSidebar = ref(false)
const searchQuery = ref('')

// Import all markdown files from the pack
const modules = import.meta.glob('../frontend_interview_pack/*.md', { query: '?raw', import: 'default', eager: true })

const parseModules = () => {
  const result = []

  for (const path in modules) {
    const rawContent = modules[path]
    const fileName = path.split('/').pop()
    
    // Extract logical name from filename (e.g., "01_JavaScript_题库.md" -> "JavaScript")
    // Remove "01_" prefix and "_题库.md" suffix
    let name = fileName.replace(/^\d+_/, '').replace(/_题库\.md$/, '').replace(/\.md$/, '')
    // Replace underscores with spaces
    name = name.replace(/_/g, ' ')

    // Parse Sections (Split by "## ")
    const lines = rawContent.split('\n')
    let fileTitle = name
    const items = []

    // Simple line-based parser
    let currentItem = null
    let buffer = []
    
    // Extract File Title (H1)
    const h1Match = rawContent.match(/^# (.*)/)
    if (h1Match) {
      fileTitle = h1Match[1]
    }

    // Split content by "## " to get sections
    // We use a regex split that keeps the delimiter or we just manual split
    const sections = rawContent.split(/\n## /)
    
    // The first section is usually the file intro/header, skip or keep as desc
    // If the file starts with H1, the first split element contains the H1 and maybe intro text.
    // The subsequent elements start with the H2 title.

    sections.forEach((section, idx) => {
      if (idx === 0) return // Skip header part for item list (or handle intro)

      // First line is title
      const sectionLines = section.split('\n')
      const title = sectionLines[0].trim()
      const content = sectionLines.slice(1).join('\n').trim()

      if (title) {
        items.push({
          title, // "1 原型 & 原型链"
          content, // The rest of the markdown
          isOpen: false
        })
      }
    })

    result.push({
      fileName,
      id: fileName, // unique key
      name, // Short display name
      title: fileTitle, // Full title
      items
    })
  }

  // Sort by filename to keep 01, 02 order
  result.sort((a, b) => a.fileName.localeCompare(b.fileName))
  
  categories.value = result
  if (result.length > 0) {
    currentCategory.value = result[0]
  }
}

onMounted(() => {
  parseModules()
})

// === Interaction ===
const selectCategory = (cat) => {
  currentCategory.value = cat
  showSidebar.value = false // Close on mobile selection
  searchQuery.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleItem = (item) => {
  item.isOpen = !item.isOpen
}

// === Rendering ===
const renderMarkdown = (text) => {
  if (!text) return ''
  // Convert custom bold labels like "**题目**：" to styled HTML if we want, 
  // currently marked handles **text** as bold. 
  // We can treat it as standard markdown.
  return marked.parse(text)
}

const filteredItems = computed(() => {
  if (!currentCategory.value) return []
  const items = currentCategory.value.items
  if (!searchQuery.value) return items

  const lowerQuery = searchQuery.value.toLowerCase()
  return items.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) || 
    item.content.toLowerCase().includes(lowerQuery)
  )
})
</script>

<style scoped>
.interview-page {
  max-width: 1400px; 
  margin: 0 auto;
  min-height: 80vh;
}

.page-container {
  display: flex;
  gap: 30px;
  position: relative;
  align-items: flex-start;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 20px;
  background: var(--glass-bg); /* Use var */
}

.sidebar-header h2 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: var(--text-main);
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1); /* Darker border */
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-list li {
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
  font-weight: 500;
}

.category-list li:hover {
  background: rgba(0, 0, 0, 0.05); /* Darker hover */
  color: var(--text-main);
}

.category-list li.active {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 4px 15px rgba(37, 117, 252, 0.3); /* Match accent */
}

.cat-icon {
  margin-right: 10px;
}

.cat-count {
  font-size: 0.8rem;
  opacity: 0.7;
  background: rgba(255,255,255,0.3);
  padding: 2px 8px;
  border-radius: 10px;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  min-width: 0;
}

.category-header {
  margin-bottom: 30px;
}

.category-header h1 {
  font-size: 2.5rem;
  background: linear-gradient(to right, #2d3436, #636e72); /* Dark gradient text */
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.subtitle {
  color: var(--text-muted);
}

/* Search */
.search-bar {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.5); /* Lighter bg */
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 1rem;
  outline: none;
}
.search-bar input::placeholder {
  color: var(--text-muted);
  opacity: 0.7;
}

/* Questions */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.6);
}

.question-card:hover {
  border-color: var(--accent-color);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.question-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
}

.header-content {
  display: flex;
  align-items: baseline;
  gap: 15px;
}

.index-badge {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--accent-color);
  opacity: 0.6;
  font-family: monospace;
  min-width: 20px;
}

.question-header h3 {
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.5;
  color: var(--text-main);
}

.toggle-icon {
  font-size: 1.5rem;
  color: var(--accent-color);
  margin-left: 15px;
  line-height: 1;
}

.answer-wrapper {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.4);
}

.answer-body {
  padding: 25px;
  color: var(--text-main);
  line-height: 1.7;
  font-size: 1rem;
}

/* Markdown Styles inside answer */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-size: 1.1em;
  color: var(--text-main);
  font-weight: 700;
}

.markdown-body :deep(p) {
  margin-bottom: 1em;
}

.markdown-body :deep(ul), 
.markdown-body :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 1em;
}

.markdown-body :deep(li) {
  margin-bottom: 0.5em;
}

.markdown-body :deep(code) {
  background: rgba(0, 0, 0, 0.05); /* Dark code bg */
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  color: #d63384; /* Pinkish code color */
}

.markdown-body :deep(pre) {
  background: #2d3436; /* Dark block for code */
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 15px 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
  color: #dfe6e9; /* Light text in code block */
  white-space: pre;
}

.markdown-body :deep(strong) {
  color: var(--accent-color);
  font-weight: 600;
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--accent-color);
  padding-left: 15px;
  color: var(--text-muted);
  margin: 15px 0;
  font-style: italic;
}

/* Mobile Responsive */
.mobile-header {
  display: none;
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }
  
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    background: #ffffff; /* Solid white */
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    max-height: 100vh;
    border-radius: 0;
    border-right: 1px solid rgba(0,0,0,0.1);
  }

  .page-container.sidebar-open .sidebar {
    transform: translateX(0);
  }

  .mobile-hidden {
    /* Handled by transform */
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.2);
    z-index: 150;
    backdrop-filter: blur(2px);
  }

  .mobile-header {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    gap: 15px;
  }

  .menu-btn {
    background: white;
    border: 1px solid rgba(0,0,0,0.1);
    color: var(--text-main);
    padding: 8px 12px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  }

  .mobile-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--accent-color);
  }
}
</style>
