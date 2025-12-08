import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InterviewView from '../views/InterviewView.vue'
import ArticlesView from '../views/ArticlesView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import ProjectsView from '../views/ProjectsView.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
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
        },
        {
            path: '/projects',
            name: 'projects',
            component: ProjectsView
        }
    ]
})

export default router
