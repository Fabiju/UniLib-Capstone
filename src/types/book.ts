export interface Book {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  subject?: string[]
}

export interface BookSearchResponse {
  docs: Book[]
  numFound: number
}

export interface BookDetails {
  title: string
  description?: string | { value: string }
  covers?: number[]
  subjects?: string[]
}

export type ReadingStatus = "wishlist" | "reading" | "completed"

export const READING_STATUS_LABELS: Record<ReadingStatus, string> = {
  wishlist: "Lista de deseos",
  reading: "Leyendo",
  completed: "Completado",
}

export function isReadingStatus(value: unknown): value is ReadingStatus {
  return value === "wishlist" || value === "reading" || value === "completed"
}
