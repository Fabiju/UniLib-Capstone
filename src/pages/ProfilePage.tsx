import { useLibrary } from "../context/LibraryContext"
import { useAuth } from "../context/AuthContext"

function ProfilePage() {
  const { user } = useAuth()
  const { loans, statuses } = useLibrary()

  const values = Object.values(statuses)
  const count = (s: string) => values.filter((v) => v === s).length

  return (
    <div>
      <h2>Mi perfil</h2>
      <p>Nombre: {user?.name}</p>
      <p>Correo: {user?.email}</p>
      <p>Libros prestados: {loans.length}</p>
      <p>Libros en lista de deseos: {count("wishlist")}</p>
      <p>Leyendo: {count("reading")}</p>
      <p>Completados: {count("completed")}</p>
    </div>
  )
}

export default ProfilePage
