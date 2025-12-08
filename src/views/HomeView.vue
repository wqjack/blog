<template>
  <div class="home">
    <div class="hero-section">
      <h1>Code with <span class="highlight">Passion</span></h1>
      <p class="subtitle">Daily wisdom for the modern developer.</p>
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
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Simplicity is the soul of efficiency.",
    author: "Austin Freeman"
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck"
  },
  {
    text: "Clean code always looks like it was written by someone who cares.",
    author: "Robert C. Martin"
  },
  {
    text: "It’s not a bug; it’s an undocumented feature.",
    author: "Anonymous"
  },
  {
    text: "Programming is the art of algorithm design and the craft of debugging errant code.",
    author: "Ellen Ullman"
  }
])
</script>

<style scoped>
.home {
  padding: 40px 0;
  max-width: 900px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 60px;
}

.hero-section h1 {
  font-size: 3.5rem;
  margin-bottom: 15px;
  color: var(--text-main);
  letter-spacing: -1px;
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
  height: 10px;
  background: var(--accent-color);
  opacity: 0.2;
  z-index: -1;
  transform: skewX(-15deg);
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
}

.quotes-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
}

.quote-card {
  padding: 30px 40px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  background: var(--glass-bg);
}

.quote-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
}

.quote-icon {
  font-size: 4rem;
  position: absolute;
  top: -10px;
  left: 10px;
  color: var(--accent-color);
  opacity: 0.2;
  font-family: serif;
}

.quote-text {
  font-size: 1.25rem;
  line-height: 1.6;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
}

.quote-author {
  text-align: right;
  font-size: 0.95rem;
  color: var(--text-muted);
  font-weight: 600;
}

.dash {
  color: var(--accent-color);
  margin-right: 5px;
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
    padding: 25px;
  }
}
</style>
