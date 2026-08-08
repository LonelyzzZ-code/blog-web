import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import ArticleDetail from '../views/ArticleDetail.vue';
import ArticleCreate from '../views/ArticleCreate.vue';
import ArticleEdit from '../views/ArticleEdit.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/article/create',
      name: 'ArticleCreate',
      component: ArticleCreate
    },
    {
      path: '/article/:id/edit',
      name: 'ArticleEdit',
      component: ArticleEdit
    },
    {
      path: '/article/:id',
      name: 'ArticleDetail',
      component: ArticleDetail
    }
  ]
});

export default router;
