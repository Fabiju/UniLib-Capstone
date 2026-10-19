import type { BookSearchResponse, BookDetails } from "../types/book"

export async function searchBooks(query: string): Promise<BookSearchResponse> {
  if (query.trim().length < 3) {
    return { docs: [], numFound: 0 }
  }

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`
    )
    if (!response.ok) {
      throw new Error("Error del servidor")
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error("No se pudieron obtener los libros")
  }
}

export async function getBookDetails(workId: string): Promise<BookDetails> {
  try {
    const response = await fetch(`https://openlibrary.org${workId}.json`)
    if (!response.ok) {
      throw new Error("Error del servidor")
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error("No se pudieron obtener los detalles del libro")
  }
}

export function getCoverUrl(coverId: number): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
}