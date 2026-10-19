import { beforeEach, describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import AuthPage from "../pages/AuthPage"
import { AuthProvider } from "../context/AuthContext"

function renderLogin() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AuthPage mode="login" />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe("AuthPage (formulario de login)", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("muestra los campos de correo y contraseña y el botón para entrar", () => {
    renderLogin()

    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^contraseña$/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument()
  })

  it("muestra errores si el usuario envía el formulario vacío", () => {
    renderLogin()

    fireEvent.click(screen.getByRole("button", { name: /entrar/i }))

    expect(screen.getByText(/el correo es obligatorio/i)).toBeInTheDocument()
    expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument()
  })

  it("avisa cuando el correo no tiene un formato válido", () => {
    renderLogin()

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "correo-sin-arroba" },
    })
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: "clave1234" },
    })
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }))

    expect(screen.getByText(/ingresa un correo válido/i)).toBeInTheDocument()
  })

  it("permite mostrar y ocultar la contraseña con el botón del ojo", () => {
    renderLogin()

    const passwordInput = screen.getByLabelText(/^contraseña$/i)
    expect(passwordInput).toHaveAttribute("type", "password")

    fireEvent.click(screen.getByRole("button", { name: /mostrar contrase(ñ|n)a/i }))
    expect(passwordInput).toHaveAttribute("type", "text")

    fireEvent.click(screen.getByRole("button", { name: /ocultar contrase(ñ|n)a/i }))
    expect(passwordInput).toHaveAttribute("type", "password")
  })

  it("muestra un mensaje de error si las credenciales son incorrectas", async () => {
    renderLogin()

    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: "nadie@correo.com" },
    })
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), {
      target: { value: "clave1234" },
    })
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }))

    expect(await screen.findByText(/correo o contraseña incorrectos/i)).toBeInTheDocument()
  })
})
