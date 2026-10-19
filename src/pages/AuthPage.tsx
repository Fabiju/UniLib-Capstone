import { useRef, useState, type FormEvent } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import FormField from "../components/FormField"
import { useAuth } from "../context/AuthContext"
import {
  safeRedirectPath,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validation"

interface AuthPageProps {
  mode: "login" | "register"
}

type FieldName = "name" | "email" | "password" | "confirm"
type FieldErrors = Partial<Record<FieldName, string>>

function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === "register"
  const { user, login, register } = useAuth()
  const location = useLocation()
  const from = safeRedirectPath((location.state as { from?: string } | null)?.from)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const refs: Record<FieldName, React.RefObject<HTMLInputElement | null>> = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirm: useRef<HTMLInputElement>(null),
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  const clearError = (field: FieldName) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setFormError(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors: FieldErrors = {}
    if (isRegister) {
      const nameError = validateName(name)
      if (nameError) nextErrors.name = nameError
    }
    const emailError = validateEmail(email)
    if (emailError) nextErrors.email = emailError

    const passwordError = isRegister
      ? validatePassword(password)
      : password
        ? null
        : "La contraseña es obligatoria."
    if (passwordError) nextErrors.password = passwordError

    if (isRegister) {
      const confirmError = validateConfirmPassword(password, confirm)
      if (confirmError) nextErrors.confirm = confirmError
    }

    setErrors(nextErrors)
    setFormError(null)

    const order: FieldName[] = ["name", "email", "password", "confirm"]
    const firstInvalid = order.find((field) => nextErrors[field])
    if (firstInvalid) {
      refs[firstInvalid].current?.focus()
      return
    }

    setSubmitting(true)
    const result = isRegister ? await register(name, email, password) : await login(email, password)
    setSubmitting(false)

    if (!result.ok) {
      setFormError("error" in result ? result.error : "Ocurrió un error. Intenta de nuevo.")
      setPassword("")
    }
  }

  return (
    <div className="auth-page">
      <h2>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h2>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {formError && (
          <p className="form-error form-error-banner" role="alert">
            {formError}
          </p>
        )}

        {isRegister && (
          <FormField
            id="name"
            ref={refs.name}
            label="Nombre"
            value={name}
            onChange={(v) => {
              setName(v)
              clearError("name")
            }}
            error={errors.name}
            autoComplete="name"
            maxLength={60}
          />
        )}

        <FormField
          id="email"
          ref={refs.email}
          type="email"
          label="Correo electrónico"
          value={email}
          onChange={(v) => {
            setEmail(v)
            clearError("email")
          }}
          error={errors.email}
          autoComplete="email"
          maxLength={254}
        />

        <FormField
          id="password"
          ref={refs.password}
          type="password"
          label="Contraseña"
          value={password}
          onChange={(v) => {
            setPassword(v)
            clearError("password")
          }}
          error={errors.password}
          hint={isRegister ? "Mínimo 8 caracteres, con al menos una letra y un número." : undefined}
          autoComplete={isRegister ? "new-password" : "current-password"}
          maxLength={64}
        />

        {isRegister && (
          <FormField
            id="confirm"
            ref={refs.confirm}
            type="password"
            label="Confirmar contraseña"
            value={confirm}
            onChange={(v) => {
              setConfirm(v)
              clearError("confirm")
            }}
            error={errors.confirm}
            autoComplete="new-password"
            maxLength={64}
          />
        )}

        <button type="submit" disabled={submitting}>
          {submitting ? "Procesando..." : isRegister ? "Crear cuenta" : "Entrar"}
        </button>
      </form>

      <p className="auth-switch">
        {isRegister ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
        <Link to={isRegister ? "/login" : "/registro"} state={location.state}>
          {isRegister ? "Inicia sesión" : "Regístrate"}
        </Link>
      </p>
    </div>
  )
}

export default AuthPage