<template>
  <header class="navbar glass-panel" :class="{ 'mobile-menu-open': isMenuOpen }">
    <div class="navbar-top">
      <div class="logo">
        <img src="/logo.svg" alt="Logo" class="logo-img" />
        <span class="logo-text">Jey<span class="highlight">.Dev</span></span>
      </div>
      
      <!-- Mobile Toggle Button -->
      <button class="hamburger md:hidden" @click="toggleMenu" aria-label="Toggle Menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>

    <!-- Navigation Links Container -->
    <div class="nav-container" :class="{ 'show': isMenuOpen }">
      <nav>
        <router-link to="/" @click="closeMenu">首页</router-link>
        <router-link to="/interview" @click="closeMenu">面试题库</router-link>
        <router-link to="/articles" @click="closeMenu">文章</router-link>
        <router-link to="/projects" @click="closeMenu">项目</router-link>
        <a href="#" @click="closeMenu">关于</a>
      </nav>
      <a href="mailto:jeyzed999@gmail.com" class="btn-sm contact-btn">联系我</a>
    </div>
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
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  position: sticky;
  top: 20px;
  z-index: 1000;
  margin-bottom: 40px;
  transition: all 0.3s ease;
}

.navbar-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 40px;
  height: 40px;
  transition: transform 0.3s ease;
}

.logo:hover .logo-img {
  transform: rotate(-10deg);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-heading);
  color: var(--text-main);
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
  color: var(--text-main);
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
  text-decoration: none;
  font-size: 0.9rem;
  display: inline-block;
}

.btn-sm:hover {
  background: var(--accent-color);
  color: white;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.bar {
  width: 100%;
  height: 3px;
  background-color: var(--text-main);
  border-radius: 3px;
  transition: all 0.3s ease;
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
    padding: 15px 20px;
  }

  .navbar-top {
    width: 100%;
  }

  .hamburger {
    display: flex;
  }

  .nav-container {
    display: none; /* Hidden by default */
    flex-direction: column;
    width: 100%;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(0,0,0,0.05);
    gap: 20px;
  }

  .nav-container.show {
    display: flex;
    animation: slideDown 0.3s ease-out;
  }

  nav {
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 20px;
  }
  
  nav a {
    font-size: 1.1rem;
    padding: 10px;
    display: block;
    width: 100%;
    text-align: center;
  }

  .contact-btn {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
