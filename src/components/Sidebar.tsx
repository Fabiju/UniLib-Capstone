import { NavLink, useNavigate } from "react-router-dom"
import {
  Home,
  BookOpen,
  BookMarked,
  Heart,
  UserRound,
  LogIn,
  LogOut,
  Sun,
  Moon,
} from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

interface SidebarProps {
  open: boolean
  onNavigate: () => void
}

function Sidebar({ open, onNavigate }: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onNavigate()
    navigate("/")
  }

  return (
    <aside id="sidebar" className={`sidebar ${open ? "open" : ""}`} aria-label="Menú lateral">
      <div className="sidebar-logo">
        <BookOpen size={28} />
        <span className="sidebar-title">UniLib</span>
      </div>

      <nav className="sidebar-nav" aria-label="Navegación principal">
        <NavLink to="/" end onClick={onNavigate}>
          <Home size={20} />
          Inicio
        </NavLink>

        <NavLink to="/catalogo" onClick={onNavigate}>
          <BookOpen size={20} />
          Catalogo
        </NavLink>

        <NavLink to="/prestamos" onClick={onNavigate}>
          <BookMarked size={20} />
          Mis préstamos
        </NavLink>

        <NavLink to="/lista-deseos" onClick={onNavigate}>
          <Heart size={20} />
          Lista de deseos
        </NavLink>

        <NavLink to="/perfil" onClick={onNavigate}>
          <UserRound size={20} />
          Perfil
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <>
            <p className="sidebar-user">Sesión: {user.name}</p>
            <button type="button" className="sidebar-button" onClick={handleLogout}>
              <LogOut size={20} />
              Cerrar sesión
            </button>
          </>
        ) : (
          <NavLink to="/login" className="sidebar-button" onClick={onNavigate}>
            <LogIn size={20} />
            Iniciar sesión
          </NavLink>
        )}

        <button type="button" className="sidebar-button" onClick={toggleTheme}>
          {theme === "light" ? (
            <>
              <Moon size={20} />
              Modo oscuro
            </>
          ) : (
            <>
              <Sun size={20} />
              Modo claro
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
