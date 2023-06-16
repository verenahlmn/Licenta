import { Author } from '@/types/Author'
import { Genre } from '@/types/Genre'

export type Book = {
  id: number
  title: string
  author: Omit<Author, 'books'> // Reference to the author without the 'books' property
  genre: Genre
  publicationDate: Date
  isbn: string
  cover: string // Assuming cover is a URL to the cover image
}
