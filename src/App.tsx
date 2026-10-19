import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import ProtectedRoute from "./components/ProtectedRoute"

const HomePage = lazy(() => import("./pages/HomePage"))
const CatalogPage = lazy(() => import("./pages/CatalogPage"))
const BookDetailPage = lazy(() => import("./pages/BookDetailPage"))
const LoansPage = lazy(() => import("./pages/LoansPage"))
const WishlistPage = lazy(() => import("./pages/WishlistPage"))
const ProfilePage = lazy(() => import("./pages/ProfilePage"))
const AuthPage = lazy(() => import("./pages/AuthPage"))

function App() {
  return (
    <Suspense fallback={<p role="status">Cargando UniLib...</p>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalogo" element={<CatalogPage />} />
          <Route path="catalogo/:bookId" element={<BookDetailPage />} />
          <Route path="login" element={<AuthPage mode="login" />} />
          <Route path="registro" element={<AuthPage mode="register" />} />

          <Route element={<ProtectedRoute />}>
            <Route path="prestamos" element={<LoansPage />} />
            <Route path="lista-deseos" element={<WishlistPage />} />
            <Route path="perfil" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
