import { Link } from "react-router-dom"

function HomePage() {
  return (
    <div>
      <h2>Bienvenido a UniLib</h2>
      <p>Explora el catalogo de la biblioteca universitaria y encuentra tu proxima lectura.</p>
      <Link to="/catalogo">
        <button>Ir al catalogo</button>
      </Link>
    </div>
  )
}

export default HomePage
