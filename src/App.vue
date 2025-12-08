<template>
  <header class="navbar glass-panel">
    <div class="logo">
      <span class="logo-text">Jey<span class="highlight">.Dev</span></span>
    </div>
    <nav>
      <router-link to="/">首页</router-link>
      <router-link to="/interview">面试题库</router-link>
      <router-link to="/articles">文章</router-link>
      <router-link to="/projects">项目</router-link>
      <a href="#">关于</a>
    </nav>
    <button class="btn-sm">联系我</button>
  </header>

  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>

  <footer>
    <p>&copy; 2025 Jey. Built with Vue 3 & Vite.</p>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  position: sticky;
  top: 20px;
  z-index: 100;
  margin-bottom: 40px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
}

.highlight {
  color: var(--accent-color);
}

nav {
  display: flex;
  gap: 30px;
}

nav a {
  font-weight: 500;
  position: relative;
}

nav a.router-link-active {
  color: var(--accent-color);
}

nav a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--accent-color);
  transition: width 0.3s;
}

nav a:hover::after {
  width: 100%;
}

.btn-sm {
  padding: 8px 18px;
  border-radius: 20px;
  background: transparent;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-sm:hover {
  background: var(--accent-color);
  color: white;
}

footer {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 60px;
  border-top: 1px solid var(--glass-border);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 20px;
  }
  
  nav {
    gap: 15px;
  }
}
</style>
