import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  BookOpen,
  BookMarked,
  Heart,
  RotateCcw,
} from "lucide-react"
import { useFetch } from "../hooks/useFetch"
import { useRequireAuth } from "../hooks/useRequireAuth"
import { getBookDetails, getCoverUrl } from "../services/books"
import { useLibrary } from "../context/LibraryContext"
import { isReadingStatus, READING_STATUS_LABELS } from "../types/book"
import { isValidWorkId } from "../utils/validation"

function BookDetailPage() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const requireAuth = useRequireAuth()

  const {
    borrowBook,
    returnBook,
    addToWishlist,
    setReadingStatus,
    getStatus,
    isBorrowed,
  } = useLibrary()

  const validId = isValidWorkId(bookId)
  const fullKey = `/works/${bookId}`

  const {
    data: book,
    loading,
    error,
  } = useFetch(
    () => (validId ? getBookDetails(fullKey) : Promise.reject(new Error("Libro no encontrado"))),
    [fullKey, validId]
  )

  if (!validId) {
    return (
      <div>
        <h2>Libro no encontrado</h2>
        <button type="button" onClick={() => navigate("/catalogo")}>
          Ir al catalogo
        </button>
      </div>
    )
  }

  const borrowed = isBorrowed(fullKey)
  const status = getStatus(fullKey)

  const description =
    typeof book?.description === "string"
      ? book.description
      : book?.description?.value

  const handleStatusChange = requireAuth((value: string) => {
    setReadingStatus(fullKey, isReadingStatus(value) ? value : null, book?.title)
  })

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        Volver
      </button>

      <div aria-live="polite">
        {loading && <p role="status">Cargando libro...</p>}
        {error && <p role="alert">Ocurrio un error al cargar el libro.</p>}
      </div>

      {book && (
        <div className="book-detail">
          {book.covers?.[0] ? (
            <img
              className="book-detail-cover"
              src={getCoverUrl(book.covers[0])}
              alt={`Portada de ${book.title}`}
            />
          ) : (
            <div
              className="book-cover-placeholder book-detail-cover"
              role="img"
              aria-label={`Sin portada: ${book.title}`}
            >
              <BookOpen size={48} />
            </div>
          )}

          <div className="book-detail-info">
            <h2>{book.title}</h2>

            {description && <p>{description}</p>}

            {book.subjects && book.subjects.length > 0 && (
              <p className="book-subjects">
                {book.subjects.slice(0, 5).join(" · ")}
              </p>
            )}

            <div className="status-field">
              <label htmlFor="reading-status">Estado de lectura</label>
              <select
                id="reading-status"
                value={status ?? ""}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="">Sin estado</option>
                {(Object.keys(READING_STATUS_LABELS) as Array<keyof typeof READING_STATUS_LABELS>).map(
                  (key) => (
                    <option key={key} value={key}>
                      {READING_STATUS_LABELS[key]}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="book-detail-actions">
              {borrowed ? (
                <button type="button" onClick={() => returnBook(fullKey)}>
                  <RotateCcw size={18} />
                  Devolver libro
                </button>
              ) : (
                <button type="button" onClick={requireAuth(() => borrowBook(fullKey, book?.title ?? fullKey))}>
                  <BookMarked size={18} />
                  Prestar libro
                </button>
              )}

              {!status && (
                <button type="button" onClick={requireAuth(() => addToWishlist(fullKey, book?.title ?? fullKey))}>
                  <Heart size={18} />
                  Agregar a lista de deseos
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookDetailPage