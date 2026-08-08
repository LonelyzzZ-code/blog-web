<template>
  <div class="editor-page">
    <h2>✏️ 编辑文章</h2>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="loadError" class="err">{{ loadError }}</div>

    <form v-else @submit.prevent="handleSubmit">
      <input
        v-model="form.title"
        placeholder="文章标题"
        class="title-input"
        required
      />

      <input
        v-model="form.summary"
        placeholder="摘要（可选）"
        class="summary-input"
      />

      <textarea
        v-model="form.content"
        placeholder="文章内容（支持 HTML）"
        rows="16"
        class="content-input"
        required
      ></textarea>

      <div class="actions">
        <button type="submit" :disabled="submitting">
          {{ submitting ? '保存中...' : '保存修改' }}
        </button>
        <router-link :to="`/article/${articleId}`" class="cancel">取消</router-link>
      </div>

      <div v-if="success" class="success">✅ 修改已保存！</div>
      <div v-if="error" class="err">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getArticle, updateArticle } from '../api/articles'

const route = useRoute()
const router = useRouter()
const articleId = Number(route.params.id)

const loading = ref(true)
const loadError = ref('')
const submitting = ref(false)
const success = ref(false)
const error = ref('')
const form = ref({
  title: '',
  summary: '',
  content: '',
})

onMounted(async () => {
  try {
    const article = await getArticle(articleId)
    form.value = {
      title: article.title,
      summary: article.summary || '',
      content: article.content,
    }
  } catch (e: any) {
    loadError.value = e.response?.status === 404 ? '文章不存在' : '加载失败'
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!form.value.title.trim() || !form.value.content.trim()) return

  submitting.value = true
  error.value = ''
  success.value = false

  try {
    await updateArticle(articleId, {
      title: form.value.title.trim(),
      summary: form.value.summary.trim() || undefined,
      content: form.value.content.trim(),
    })
    success.value = true
    setTimeout(() => {
      router.push(`/article/${articleId}`)
    }, 1000)
  } catch (e: any) {
    error.value = '保存失败：' + (e.response?.data?.detail || e.message || '未知错误')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.editor-page {
  max-width: 800px;
  margin: 0 auto;
}
h2 {
  margin-bottom: 24px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.title-input,
.summary-input,
.content-input {
  padding: 10px 14px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 15px;
  font-family: inherit;
}
.content-input {
  resize: vertical;
}
.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.actions button {
  padding: 8px 24px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
}
.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.cancel {
  color: #999;
  text-decoration: none;
  font-size: 14px;
}
.success {
  color: #42b883;
}
.err {
  color: red;
}
.loading {
  text-align: center;
  color: #999;
  padding: 48px;
}
</style>
