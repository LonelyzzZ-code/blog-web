export interface Article {
  id: number
  title: string
  content: string
  summary: string | null
  views: number
  created_at: string
  updated_at: string
  comment_count: number
}

export interface ArticleListResponse {
  items: Article[]
  total: number
  page: number
  page_size: number
}

export interface Comment {
  id: number
  article_id: number
  author: string
  content: string
  likes: number
  created_at: string
}
