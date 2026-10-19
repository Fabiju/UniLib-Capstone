import { Link } from "react-router-dom"
import {
  Home,
  BookOpen,
  BookMarked,
  Heart,
  UserRound,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"

function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <h1>UniLib</h1>

      <nav>
        <Link to="/">
          <Home size={18} />
          Inicio
        </Link>

        <Link to="/catalogo">
          <BookOpen size={18} />
          Catalogo
        </Link>

        <Link to="/prestamos">
          <BookMarked size={18} />
          Mis préstamos
        </Link>

        <Link to="/lista-deseos">
          <Heart size={18} />
          Lista de deseos
        </Link>

        <Link to="/perfil">
          <UserRound size={18} />
          Perfil
        </Link>
      </nav>

      <button onClick={toggleTheme}>
        {theme === "light" ? (
          <>
            <Moon size={18} />
            Cambiar a oscuro
          </>
        ) : (
          <>
            <Sun size={18} />
            Cambiar a claro
          </>
        )}
      </button>
    </header>
  )
}

export default Header