import { Link } from "react-router-dom"
import { useLibrary } from "../context/LibraryContext"

function LoansPage() {
  const { loans, returnBook, getTitle } = useLibrary()

  return (
    <div>
      <h2>Mis prestamos</h2>
      {loans.length === 0 && <p>No tienes libros prestados actualmente.</p>}

      <ul className="loans-list" aria-label="Libros prestados">
        {loans.map((loan) => {
          const isOverdue = new Date(loan.dueDate) < new Date()
          return (
            <li key={loan.bookKey} className="loan-item">
              <Link to={`/catalogo/${loan.bookKey.replace("/works/", "")}`}>{getTitle(loan.bookKey)}</Link>
              <span className={isOverdue ? "overdue" : ""}>
                Vence: {new Date(loan.dueDate).toLocaleDateString()}
                {isOverdue && " (vencido)"}
              </span>
              <button type="button" onClick={() => returnBook(loan.bookKey)}>
                Devolver
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default LoansPage