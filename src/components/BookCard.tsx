import { Link } from "react-router-dom"
import { memo } from "react"
import { BookOpen, CheckCircle, ArrowRight } from "lucide-react"
import type { Book } from "../types/book"
import { getCoverUrl } from "../services/books"

interface BookCardProps {
  book: Book
  isBorrowed: boolean
  onBorrow: (bookKey: string, title: string) => void
}

function BookCard({ book, isBorrowed, onBorrow }: BookCardProps) {
  const shortId = book.key.replace("/works/", "")

  return (
    <article className="book-card" aria-label={book.title}>
      {book.cover_i ? (
        <img
          className="book-cover"
          src={getCoverUrl(book.cover_i)}
          alt={`Portada de ${book.title}`}
          loading="lazy"
        />
      ) : (
        <div className="book-cover-placeholder" role="img" aria-label={`Sin portada: ${book.title}`}>
          <BookOpen size={32} />
        </div>
      )}

      <h3>{book.title}</h3>

      <p>
        {book.author_name?.join(", ") ?? "Autor desconocido"}
      </p>

      <button
        type="button"
        disabled={isBorrowed}
        onClick={() => onBorrow(book.key, book.title)}
        aria-label={isBorrowed ? `${book.title}: ya prestado` : `Prestar ${book.title}`}
      >
        {isBorrowed ? (
          <>
            <CheckCircle size={16} />
            Prestado
          </>
        ) : (
          "Prestar"
        )}
      </button>

      <Link to={`/catalogo/${shortId}`} aria-label={`Ver detalles de ${book.title}`}>
        Ver detalles <ArrowRight size={16} />
      </Link>
    </article>
  )
}

export default memo(BookCard)