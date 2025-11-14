import type { BasePerson } from './personnel'

type PostPerson = Pick<BasePerson, 'id' | 'name' | 'avatar'>

interface Post {
  id: number
  title: string
  author?: PostPerson
  content: string
  created_at?: string
  updated_at?: string
}

export type { Post, PostPerson }
