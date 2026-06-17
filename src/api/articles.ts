import client from './client'
import type { Article, ArticleListResponse } from '../types'

export async function getArticles(page = 1, pageSize = 10): Promise<ArticleListResponse> {
  const { data } = await client.get('/api/articles', {
    params: { page, page_size: pageSize },
  })
  return data
}

export async function getArticle(id: number): Promise<Article> {
  const { data } = await client.get(`/api/articles/${id}`)
  return data
}

export async function createArticle(body: {
  title: string
  content: string
  summary?: string
}): Promise<Article> {
  const { data } = await client.post('/api/articles', body)
  return data
}

export async function updateArticle(
  id: number,
  body: { title?: string; content?: string; summary?: string }
): Promise<Article> {
  const { data } = await client.put(`/api/articles/${id}`, body)
  return data
}

export async function deleteArticle(id: number): Promise<void> {
  await client.delete(`/api/articles/${id}`)
}

export async function getTopArticles(
  limit = 10
): Promise<{ id: number; title: string; views: number }[]> {
  const { data } = await client.get('/api/stats/top', {
    params: { limit },
  })
  return data
}
