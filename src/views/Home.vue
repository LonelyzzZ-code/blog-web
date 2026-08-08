<template>
  <div class="home">
    <!-- 左侧：文章列表 -->
    <div class="main">
      <h2>文章列表</h2>

      <div v-if="loading">加载中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else>
        <router-link
          v-for="article in articles"
          :key="article.id"
          :to="`/article/${article.id}`"
          class="card"
        >
          <h3>{{ article.title }}</h3>
          <p class="summary">{{ article.summary || article.content.slice(0, 100) }}</p>
          <span class="meta">{{ article.views }} 阅读 · {{ article.comment_count }} 评论</span>
        </router-link>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1">
          <button :disabled="page <= 1" @click="page--">上一页</button>
          <span>第 {{ page }} 页 / 共 {{ totalPages }} 页</span>
          <button :disabled="page >= totalPages" @click="page++">下一页</button>
        </div>
      </div>
    </div>

    <!-- 右侧：排行榜 -->
    <aside>
      <h3>🏆 访问量排行榜</h3>
      <ol>
        <li v-for="item in topArticles" :key="item.id">
          <router-link :to="`/article/${item.id}`">{{ item.title }}</router-link>
          <span>{{ item.views }} 阅读</span>
        </li>
      </ol>
    </aside>
  </div>
</template>

<script setup lang="ts">
    import { ref, computed, watch } from 'vue'
    import { getArticles, getTopArticles } from '../api/articles'
    import type { Article } from '../types'

    const loading = ref(false)
    const error = ref('')
    const articles = ref<Article[]>([])
    const total = ref(0)
    const page = ref(1)
    const pageSize = 10
    const topArticles = ref<{ id: number; title: string; views: number }[]>([])
    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

    async function fetchArticles() {
        loading.value = true
        error.value = ''
        try{
            const res = await getArticles(page.value, pageSize)
            articles.value = res.items
            total.value = res.total
        }
        catch(e: any){
            error.value = '加载失败：' + (e.message || '未知错误')
        }
        finally{
            loading.value = false
        }
    }

    async function fetchTop() {
        try{
            topArticles.value = await getTopArticles(10)
        }
        catch{
        }
    }

    fetchArticles()
    fetchTop()

</script>
<style scoped>
.home {
  display: flex;
  gap: 32px;
}
.main {
  flex: 1;
}
aside {
  width: 280px;
  flex-shrink: 0;
}

.card {
  display: block;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.card h3 {
  margin: 0 0 8px;
  color: #333;
}
.summary {
  color: #666;
  font-size: 14px;
  margin: 0 0 8px;
}
.meta {
  color: #999;
  font-size: 13px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}
.pagination button {
  padding: 6px 16px;
  cursor: pointer;
}
.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

aside ol {
  padding-left: 20px;
}
aside li {
  margin-bottom: 8px;
}
aside li span {
  color: #999;
  font-size: 13px;
  margin-left: 8px;
}

.error {
  color: red;
}
</style>
