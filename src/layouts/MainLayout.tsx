import { useEffect, useRef, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { useTheme } from "../context/ThemeContext"

function MainLayout() {
  const { theme } = useTheme()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const previousPath = useRef(location.pathname)

  useEffect(() => {
    if (previousPath.current === location.pathname) return
    previousPath.current = location.pathname
    mainRef.current?.focus()
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [menuOpen])

  return (
    <div className={`app-container ${theme}`}>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      <header className="mobile-bar">
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="sidebar"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <span className="mobile-bar-title">UniLib</span>
      </header>

      {menuOpen && <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />

      <main id="contenido" ref={mainRef} tabIndex={-1} className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
