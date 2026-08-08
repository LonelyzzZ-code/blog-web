<template>
  <div class="editor-page">
    <h2>✍️ 写文章</h2>

    <form @submit.prevent="handleSubmit">
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
          {{ submitting ? '发布中...' : '发布文章' }}
        </button>
        <router-link to="/" class="cancel">取消</router-link>
      </div>

      <div v-if="success" class="success">✅ 文章发布成功！</div>
      <div v-if="error" class="err">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createArticle } from '../api/articles'

const router = useRouter()
const submitting = ref(false)
const success = ref(false)
const error = ref('')
const form = ref({
  title: '',
  summary: '',
  content: '',
})

async function handleSubmit() {
  if (!form.value.title.trim() || !form.value.content.trim()) return

  submitting.value = true
  error.value = ''
  success.value = false

  try {
    const article = await createArticle({
      title: form.value.title.trim(),
      summary: form.value.summary.trim() || undefined,
      content: form.value.content.trim(),
    })
    success.value = true
    setTimeout(() => {
      router.push(`/article/${article.id}`)
    }, 1500)
  } catch (e: any) {
    error.value = '发布失败：' + (e.response?.data?.detail || e.message || '未知错误')
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
</style>
