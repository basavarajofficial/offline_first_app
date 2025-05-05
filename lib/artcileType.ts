// types/article.ts
import { RxDocument } from 'rxdb'

export interface Article {
  id: string
  name: string
  qty: number
  selling_price: number
  business_id: string
}

export type ArticleDocument = RxDocument<Article>
