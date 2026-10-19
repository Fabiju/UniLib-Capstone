import { Link } from "react-router-dom"
import { useLibrary } from "../context/LibraryContext"

function WishlistPage() {
  const { wishlist, removeFromWishlist, getTitle } = useLibrary()

  return (
    <div>
      <h2>Lista de deseos</h2>
      {wishlist.length === 0 && <p>Aun no agregaste libros a tu lista de deseos.</p>}
      <ul aria-label="Libros en tu lista de deseos">
        {wishlist.map((bookKey) => (
          <li key={bookKey}>
            <Link to={`/catalogo/${bookKey.replace("/works/", "")}`}>{getTitle(bookKey)}</Link>
            <button type="button" onClick={() => removeFromWishlist(bookKey)}>
              Quitar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WishlistPage