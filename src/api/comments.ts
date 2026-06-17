import client from './client'
import type { Comment } from '../types'

export async function getComments(articleId: number): Promise<Comment[]> {
  const { data } = await client.get('/api/comments', {
    params: { article_id: articleId },
  })
  return data
}

export async function createComment(
  articleId: number,
  body: { author: string; content: string }
): Promise<Comment> {
  const { data } = await client.post('/api/comments', body, {
    params: { article_id: articleId },
  })
  return data
}

export async function likeComment(id: number): Promise<{ likes: number }> {
  const { data } = await client.put(`/api/comments/${id}/like`)
  return data
}
