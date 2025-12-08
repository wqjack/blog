<template>
  <div class="home">
    <section class="hero glass-panel">
      <div class="hero-content">
        <h1>Welcome to My Universe</h1>
        <p class="subtitle">Exploring code, design, and everything in between.</p>
        <button class="btn">Read Latest</button>
      </div>
    </section>

    <section class="posts-section">
      <h2>Latest Stories</h2>
      <div class="posts-grid">
        <div v-for="post in posts" :key="post.id" class="post-card glass-panel">
          <div class="post-image" :style="{ backgroundImage: `url(${post.image})` }"></div>
          <div class="post-content">
            <span class="category">{{ post.category }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <a href="#" class="read-more">Read Article &rarr;</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const posts = ref([
  {
    id: 1,
    title: 'The Future of Vue.js',
    excerpt: 'Exploring the new features in Vue 3.3 and what they mean for developers.',
    category: 'Development',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Design Systems 101',
    excerpt: 'How to build a scalable and consistent design system for your web apps.',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Mastering CSS Grid',
    excerpt: 'A comprehensive guide to creating complex layouts with CSS Grid.',
    category: 'Tutorial',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
]);
</script>

<style scoped>
.hero {
  margin: 40px 0;
  padding: 80px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero h1 {
  font-size: 4rem;
  margin-bottom: 20px;
  background: linear-gradient(to right, #fff, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-muted);
  margin-bottom: 40px;
}

.posts-section {
  padding: 40px 0;
}

.posts-section h2 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.post-card {
  overflow: hidden;
  transition: transform 0.3s ease;
}

.post-card:hover {
  transform: translateY(-5px);
}

.post-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.post-content {
  padding: 25px;
}

.category {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--accent-color);
  font-weight: 700;
  margin-bottom: 10px;
  display: block;
}

.post-content h3 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.post-content p {
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.read-more {
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
}
</style>
