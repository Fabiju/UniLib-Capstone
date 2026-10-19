import { useState, useMemo } from "react"
import { useFetch } from "../hooks/useFetch"
import { useRequireAuth } from "../hooks/useRequireAuth"
import { searchBooks } from "../services/books"
import BookCard from "../components/BookCard"
import { useLibrary } from "../context/LibraryContext"
import { sanitizeText } from "../utils/validation"

const GENRES = [
  { value: "all", label: "Todos los generos" },
  { value: "fiction", label: "Ficcion" },
  { value: "science", label: "Ciencia" },
  { value: "history", label: "Historia" },
]

function CatalogPage() {
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("all")

  const cleanSearch = sanitizeText(search)
  const { data, loading, error } = useFetch(() => searchBooks(cleanSearch), [cleanSearch])
  const { borrowBook, isBorrowed } = useLibrary()
  const requireAuth = useRequireAuth()

  const handleBorrow = useMemo(() => requireAuth(borrowBook), [requireAuth, borrowBook])

  const filteredBooks = useMemo(() => {
    if (!data?.docs) return []
    if (genre === "all") return data.docs
    return data.docs.filter((book) =>
      book.subject?.some((s) => s.toLowerCase().includes(genre))
    )
  }, [data, genre])

  const tooShort = cleanSearch.length < 3

  return (
    <div>
      <h2>Catalogo</h2>

      <div className="catalog-controls" role="search">
        <div className="control-group">
          <label htmlFor="catalog-search" className="sr-only">
            Buscar por título, autor o palabra clave
          </label>
          <input
            id="catalog-search"
            className="search-input"
            type="search"
            placeholder="Buscar por titulo, autor o palabra clave..."
            value={search}
            maxLength={100}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="catalog-genre" className="sr-only">
            Filtrar por género
          </label>
          <select
            id="catalog-genre"
            className="genre-select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          >
            {GENRES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div aria-live="polite">
        {loading && !tooShort && <p role="status">Cargando libros...</p>}
        {error && <p role="alert">Ocurrio un error: {error}</p>}
        {tooShort && <p>Escribe al menos 3 letras para buscar.</p>}
        {!loading && !error && filteredBooks.length === 0 && !tooShort && (
          <p>No se encontraron libros con ese filtro.</p>
        )}
        {!loading && !error && filteredBooks.length > 0 && (
          <p className="sr-only">{filteredBooks.length} libros encontrados.</p>
        )}
      </div>

      <div className="book-grid">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.key}
            book={book}
            isBorrowed={isBorrowed(book.key)}
            onBorrow={handleBorrow}
          />
        ))}
      </div>
    </div>
  )
}

export default CatalogPage
