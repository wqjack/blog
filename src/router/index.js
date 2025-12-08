import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InterviewView from '../views/InterviewView.vue'
import ArticlesView from '../views/ArticlesView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/interview',
            name: 'interview',
            component: InterviewView
        },
        {
            path: '/articles',
            name: 'articles',
            component: ArticlesView
        },
        {
            path: '/articles/:slug',
            name: 'article-detail',
            component: ArticleDetailView
        }
    ]
})

export default router
