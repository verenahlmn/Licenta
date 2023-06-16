import { Book } from '@/types/Book'
import { Role } from '@/types/Role'

export type User = {
  id: number
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  role: Role
  borrowedBooks: Book[] // Represents the books a user has borrowed
}
