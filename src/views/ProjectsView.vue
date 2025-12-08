<template>
  <div class="projects-container">
    <div class="page-header">
      <h1>我的 <span class="highlight">项目</span></h1>
      <p class="subtitle">Idea to Reality. 从想法到现实。</p>
    </div>

    <div class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card glass-panel">
        <!-- Preview Section -->
        <div class="project-preview" :style="{ background: project.gradient }">
          <div class="project-emoji">{{ project.icon }}</div>
          <div class="project-overlay">
            <a v-if="project.github" :href="project.github" target="_blank" class="overlay-btn">
              查看源码
            </a>
          </div>
        </div>
        
        <!-- Content Section -->
        <div class="project-content">
          <div class="content-header">
            <h3>{{ project.title }}</h3>
            <span class="status-badge">{{ project.status }}</span>
          </div>
          
          <p class="description">{{ project.description }}</p>
          
          <div class="features-list" v-if="project.features">
            <h4>核心特性:</h4>
            <ul>
              <li v-for="feat in project.features" :key="feat">✓ {{ feat }}</li>
            </ul>
          </div>

          <div class="tech-stack">
            <span v-for="tech in project.tags" :key="tech" class="tech-tag">{{ tech }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const projects = ref([
  {
    id: 'ibook',
    title: 'iBook Reader',
    status: 'V1.0',
    description: '一款专为 iOS 设计的现代化电子书阅读器应用。旨在提供流畅、无干扰的沉浸式阅读体验，同时支持音频听书功能，满足多场景阅读需求。',
    icon: '📖',
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    tags: ['React Native', 'Expo', 'TypeScript', 'Epub.js'],
    features: [
      'Epub 格式原生解析与流式渲染',
      'TTS (Text-to-Speech) 听书功能与进度同步',
      '精确的分页计算与平滑翻页动画',
      '自定义字体、字号与日夜间模式'
    ],
    github: 'https://github.com/wqjack/ibook.git'
  },
  {
    id: 'blog',
    title: 'Jey.Dev Blog',
    status: 'Live',
    description: '极简风格的个人技术博客与作品集网站。集成了动态 Markdown 渲染引擎，用于展示技术文章与面试题库。',
    icon: '🌐',
    gradient: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
    tags: ['Vue 3', 'Vite', 'Glassmorphism', 'GitHub Pages'],
    github: 'https://github.com/wqjack/blog'
  },
  {
    id: 'proxy',
    title: 'Clash Mate (Mac)',
    status: 'In Dev',
    description: 'macOS 平台的网络代理工具客户端，基于 Electron 与 Clash 内核。支持规则订阅、节点测速与策略组切换。',
    icon: '⚡️',
    gradient: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    tags: ['Electron', 'React', 'Node.js', 'Clash Core'],
    github: '#'
  }
])
</script>

<style scoped>
.projects-container {
  max-width: 1200px; /* Wider for grid */
  margin: 0 auto;
  padding: 40px 20px 80px 20px;
}

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
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.project-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 30px rgba(0,0,0,0.08);
  border-color: var(--accent-color);
}

/* Preview Section */
.project-preview {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.project-emoji {
  font-size: 5rem;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
  transition: transform 0.4s ease;
}

.project-card:hover .project-emoji {
  transform: scale(1.1) rotate(5deg);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  backdrop-filter: blur(4px);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.overlay-btn {
  background: white;
  color: #333;
  padding: 8px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.9rem;
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.project-card:hover .overlay-btn {
  transform: translateY(0);
}

/* Content Section */
.project-content {
  padding: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.content-header h3 {
  font-size: 1.4rem;
  margin: 0;
  color: var(--text-main);
}

.status-badge {
  font-size: 0.75rem;
  background: rgba(0,0,0,0.05);
  padding: 4px 8px;
  border-radius: 6px;
  color: var(--text-muted);
  font-weight: 600;
}

.description {
  color: var(--text-muted);
  line-height: 1.5;
  font-size: 0.95rem;
  margin-bottom: 20px;
  flex: 1; /* Push tags to bottom */
}

.features-list {
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.features-list h4 {
  font-size: 0.85rem;
  color: var(--text-main);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.features-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
}

.tech-tag {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(59, 130, 246, 0.08); /* Light blue */
  color: var(--accent-color);
  font-weight: 600;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
