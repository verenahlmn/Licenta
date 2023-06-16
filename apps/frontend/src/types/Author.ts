import { Book } from '@/types/Book'

export type Author = {
  id: number
  name: string
  books: Book[] // Reference to the books
  // Add more properties as needed, such as dateOfBirth, nationality, etc.
}
