<template>
  <div v-if="loading" class="loading">文章加载中...</div>

  <div v-else-if="error" class="error">{{ error }}</div>

  <div class="article-detail" v-else-if="article">
    <article>
      <h1>{{ article.title }}</h1>
      <div class="meta">
        {{ formatDate(article.created_at) }} · {{ article.views }} 次阅读 · {{ article.comment_count }} 条评论
      </div>
      <div class="actions">
        <router-link :to="`/article/${article.id}/edit`" class="edit-btn">✏️ 编辑</router-link>
        <button class="delete-btn" @click="handleDelete" :disabled="deleting">
          {{ deleting ? '删除中...' : '🗑️ 删除' }}
        </button>
      </div>
      <div class="content" v-html="article.content"></div>
    </article>

    <hr />

    <section class="comments">
      <h3>评论({{ comments.length }})</h3>

      <form class="comment-form" @submit.prevent="handleComment">
          <input v-model="form.author" placeholder="你的名字" />
          <textarea v-model="form.content" placeholder="写评论..." rows="3"></textarea>
          <button type="submit" :disabled="submitting">
            {{ submitting ? '提交中...' : '发表评论' }}
          </button>
        </form>

        <div v-if="loadingComments" class="loading">评论加载中...</div>

        <div
          v-for="item in comments"
          :key="item.id"
          class="comment-item"
        >
          <div class="comment-header">
            <strong>{{ item.author }}</strong>
            <span>{{ formatDate(item.created_at) }}</span>
          </div>
          <p>{{ item.content }}</p>
          <button class="like-btn" @click="handleLike(item.id)">
            👍 {{ item.likes }}
          </button>
        </div>

        <div v-if="!loadingComments && comments.length === 0" class="empty">
          暂无评论，来写第一条吧
        </div>
      </section>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticle, deleteArticle } from '../api/articles'
import { getComments, createComment, likeComment } from '../api/comments'
import type { Article, Comment } from '../types'
import { formatDate } from '../utils/format'

const route = useRoute()
const router = useRouter()
const articleId = Number(route.params.id)
const loading = ref(true)
const error = ref('')
const article = ref<Article | null>(null)
const comments = ref<Comment[]>([])
const loadingComments = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const form = ref({ author: '', content: '' })

//1.加载文章
async function loadArticle() {
  loading.value = true
  error.value = ''
  try {
    article.value = await getArticle(articleId)
    //将前端获得的数据传递回后端
  } catch (e: any) {
    error.value = e.response?.status === 404 ? '文章不存在' : '加载文章失败'
  } finally {
    loading.value = false
  }
}

//2.加载评论
async function loadComments() {
  loadingComments.value = true
  try {
    comments.value = await getComments(articleId)
  } catch {
  } finally {
    loadingComments.value = false
  }
}

//3.发表评论
async function handleComment() {
  if (!form.value.author || !form.value.content) return
  submitting.value = true
  try {
    const newComment = await createComment(articleId, {
      author: form.value.author.trim(),
      content: form.value.content.trim(),
    })
    comments.value.unshift(newComment) //unshift() 方法将一个或多个元素添加到数组的开头，并返回新数组的长度
    form.value = { author: '', content: '' } //重置表单
  } catch (e: any) {
    alert('发表失败：' + (e.message || '请重试'))
  } finally {
    submitting.value = false
  }
}

//4.点赞
async function handleLike(commentId: number) {
  try {
    const result = await likeComment(commentId)
    const comment = comments.value.find((c) => c.id === commentId)
    if (comment) {
      comment.likes = result.likes
    }
  } catch {
    alert('点赞失败，请重试')
  }
}

//5.删除文章
async function handleDelete() {
  if (!confirm('确定要删除这篇文章吗？此操作不可恢复。')) return

  deleting.value = true
  try {
    await deleteArticle(articleId)
    router.push('/')
  } catch (e: any) {
    alert('删除失败：' + (e.message || '请重试'))
    deleting.value = false
  }
}

//6.生命周期
onMounted(() => {
  loadArticle()
  loadComments()
})
</script>
<style scoped>
.article-detail {
  max-width: 800px;
}

article h1 {
  font-size: 28px;
  margin-bottom: 12px;
}
.meta {
  color: #999;
  font-size: 14px;
  margin-bottom: 24px;
}
.content {
  line-height: 1.8;
  font-size: 16px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
.edit-btn {
  padding: 4px 14px;
  background: #f0f0f0;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  font-size: 13px;
}
.edit-btn:hover {
  background: #e0e0e0;
}
.delete-btn {
  padding: 4px 14px;
  background: none;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}
.delete-btn:hover {
  background: #e74c3c;
  color: white;
}
.delete-btn:disabled {
  opacity: 0.5;
}

.comments {
  margin-top: 32px;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}
.comment-form input,
.comment-form textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}
.comment-form button {
  align-self: flex-end;
  padding: 6px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.comment-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comment-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.comment-header span {
  color: #999;
  font-size: 12px;
}
.comment-item p {
  margin: 4px 0;
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 0;
  color: #666;
}
.like-btn:hover {
  color: #e74c3c;
}

.empty {
  color: #999;
  text-align: center;
  padding: 24px;
}
.loading {
  text-align: center;
  padding: 48px;
  color: #999;
}
.error {
  text-align: center;
  padding: 48px;
  color: red;
}
</style>
